#!/usr/bin/env python3
"""Télécharge les données publiques LNH vers data/ pour GitHub Pages, sans dépendances."""
import json, os, pathlib, time, urllib.request, urllib.error, datetime
from concurrent.futures import ThreadPoolExecutor, as_completed

ROOT = pathlib.Path(__file__).resolve().parents[1]
DEST = ROOT / 'data'
BASE = 'https://api-web.nhle.com/v1'
DEST.mkdir(exist_ok=True)
HEADERS = {'User-Agent': 'CH-LIVE/3.0 (GitHub Pages public dashboard)', 'Accept':'application/json'}

def download(path, attempts=3):
    url = BASE + path
    for attempt in range(attempts):
        try:
            with urllib.request.urlopen(urllib.request.Request(url, headers=HEADERS), timeout=25) as response:
                return json.load(response)
        except (urllib.error.HTTPError, urllib.error.URLError, TimeoutError, json.JSONDecodeError) as exc:
            if attempt == attempts-1: raise RuntimeError(f'{path}: {exc}') from exc
            time.sleep(1.5 * (attempt+1))

def save(path, value):
    dest = DEST / (path.lstrip('/')+'.json')
    dest.parent.mkdir(parents=True,exist_ok=True)
    temp = dest.with_suffix('.json.tmp')
    temp.write_text(json.dumps(value,ensure_ascii=False,separators=(',',':')),encoding='utf-8')
    temp.replace(dest)

def fetch_and_save(path):
    value=download(path)
    save(path,value)
    return value

results={}
for key,path in [('schedule','/club-schedule-season/MTL/now'),('stats','/club-stats/MTL/now'),('standings','/standings/now')]:
    try:
        results[key]=fetch_and_save(path)
        print('OK',path,flush=True)
    except Exception as exc:
        print('ERREUR',exc,flush=True)

if 'schedule' not in results or 'stats' not in results:
    raise SystemExit('Impossible de récupérer les données essentielles; anciens fichiers conservés.')

def localized_name(x):
    return x.get('default','') if isinstance(x,dict) else str(x or '')

players = results['stats'].get('skaters',[])
season = next((g.get('season') for g in results['schedule'].get('games',[]) if g.get('season')),None)
if not season:
    now=datetime.datetime.now(datetime.timezone.utc)
    start=now.year if now.month>=7 else now.year-1
    season=int(f'{start}{start+1}')

paths=[]
for p in players:
    pid=p.get('playerId')
    if pid:
        paths.extend([f'/player/{pid}/landing',f'/player/{pid}/game-log/{season}/2'])
for g in results['schedule'].get('games',[]):
    if g.get('gameState') in ('LIVE','CRIT') and g.get('id'):
        paths.extend([f'/gamecenter/{g["id"]}/landing',f'/gamecenter/{g["id"]}/boxscore'])

failed=[]
with ThreadPoolExecutor(max_workers=5) as pool:
    futures={pool.submit(fetch_and_save,p):p for p in paths}
    for future in as_completed(futures):
        try: future.result()
        except Exception as exc:
            failed.append(str(exc))
            print('AVERTISSEMENT',exc,flush=True)

(DEST/'metadata.json').write_text(json.dumps({'updated_at':datetime.datetime.now(datetime.timezone.utc).isoformat(),'season':season,'players':len(players),'failed':len(failed)},ensure_ascii=False),encoding='utf-8')
print(f'Terminé : {len(paths)-len(failed)}/{len(paths)} fiches/détails chargés; {len(players)} joueurs.')

# Pointages de toute la LNH : hier, aujourd'hui et demain (date de Montréal).
from zoneinfo import ZoneInfo
local_day = datetime.datetime.now(ZoneInfo('America/Toronto')).date()
score_errors=[]
for offset in (-1,0,1):
    day=(local_day+datetime.timedelta(days=offset)).isoformat()
    try:
        score=download('/score/'+day)
        save('/league/score/'+day,score)
        print('OK pointages LNH',day,flush=True)
    except Exception as exc:
        score_errors.append(day)
        print('AVERTISSEMENT pointages LNH',day,exc,flush=True)
save('/league/dates',{'dates':[(local_day+datetime.timedelta(days=n)).isoformat() for n in (-1,0,1)],'updated_at':datetime.datetime.now(datetime.timezone.utc).isoformat(),'errors':score_errors})
