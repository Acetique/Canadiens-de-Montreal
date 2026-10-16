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

# Archive complète des dates de la saison et rafraîchissement des matchs récents.
from zoneinfo import ZoneInfo
local_day=datetime.datetime.now(ZoneInfo('America/Toronto')).date()
start_year=int(str(season)[:4]);start=datetime.date(start_year,9,1);end=datetime.date(start_year+1,7,1)
# Toutes les dates : les fichiers existants sont conservés. Les journées à venir
# et les 3 derniers jours sont renouvelés à chaque exécution.
days=[start+datetime.timedelta(days=i) for i in range((end-start).days+1)]
paths_to_fetch=[]
for day in days:
    file=DEST/'league'/'score'/f'{day.isoformat()}.json'
    if not file.exists() or abs((day-local_day).days)<=3:
        paths_to_fetch.append(day)

def fetch_score(day):
    value=download('/score/'+day.isoformat())
    value['cached_at']=datetime.datetime.now(datetime.timezone.utc).isoformat()
    save('/league/score/'+day.isoformat(),value)
    return day

score_errors=[]
with ThreadPoolExecutor(max_workers=6) as pool:
    futures={pool.submit(fetch_score,d):d for d in paths_to_fetch}
    for future in as_completed(futures):
        try:future.result()
        except Exception as exc:
            day=futures[future]
            score_errors.append(day.isoformat())
            print('AVERTISSEMENT pointages LNH',day,exc,flush=True)
save('/league/dates',{'start':start.isoformat(),'end':end.isoformat(),
    'dates':[d.isoformat() for d in days],
    'updated_at':datetime.datetime.now(datetime.timezone.utc).isoformat(),
    'errors':score_errors})
print(f'Pointages : {len(paths_to_fetch)-len(score_errors)}/{len(paths_to_fetch)} journées téléchargées.')

# Classement des meilleurs pointeurs de toute la LNH.
try:
    leaders=download('/skater-stats-leaders/current?categories=points&limit=30')
    save('/skater-stats-leaders/current',leaders)
    print('Meilleurs pointeurs LNH : collecte réussie.',flush=True)
except Exception as exc:
    print('AVERTISSEMENT meilleurs pointeurs :',exc,flush=True)


# Fiches des derniers matchs de tous les joueurs, y compris B/A/PTS.
last_games={}
for p in players:
    pid=p.get('playerId')
    if not pid: continue
    f=DEST/'player'/str(pid)/'game-log'/str(season)/'2.json'
    if not f.exists(): continue
    try:
        entries=json.loads(f.read_text(encoding='utf-8')).get('gameLog',[])
        entries=sorted((x for x in entries if x.get('gameDate')),key=lambda x:x['gameDate'])
        if entries:
            g=entries[-1]
            last_games[str(pid)]=f"{g.get('goals',0)}-{g.get('assists',0)}-{g.get('points',0)}"
    except (ValueError,OSError) as exc: print('AVERTISSEMENT fiche joueur',pid,exc)
save('/players-last-games',{'season':season,'players':last_games})

# Détails des matchs : tous les matchs terminés du CH et les rencontres
# de toute la LNH des 14 derniers jours, en plus des matchs en cours.
all_score_files=list((DEST/'league'/'score').glob('*.json')) if (DEST/'league'/'score').exists() else []
match_ids=set()
for g in results['schedule'].get('games',[]):
    if g.get('id') and g.get('gameState') in ('FINAL','OFF','LIVE','CRIT'):
        match_ids.add(int(g['id']))
for file in all_score_files:
    try:
        day=datetime.date.fromisoformat(file.stem)
        if not (local_day-datetime.timedelta(days=14)<=day<=local_day): continue
        for g in json.loads(file.read_text(encoding='utf-8')).get('games',[]):
            if g.get('id') and g.get('gameState') in ('FINAL','OFF','LIVE','CRIT'):
                match_ids.add(int(g['id']))
    except (ValueError,OSError): continue
match_paths=[]
for gid in sorted(match_ids):
    for kind in ('landing','boxscore'):
        rel=f'/gamecenter/{gid}/{kind}'
        target=DEST/(rel.lstrip('/')+'.json')
        if not target.exists() or gid in [int(g['id']) for g in results['schedule'].get('games',[]) if g.get('id') and g.get('gameState') in ('LIVE','CRIT')]:
            match_paths.append(rel)
match_errors=[]
with ThreadPoolExecutor(max_workers=6) as pool:
    futures={pool.submit(fetch_and_save,path):path for path in match_paths}
    for future in as_completed(futures):
        try:future.result()
        except Exception as exc:
            match_errors.append(str(exc))
            print('AVERTISSEMENT détail match',exc,flush=True)
# Horodatage de la collecte terminé, après toutes les sections.
metadata={'updated_at':datetime.datetime.now(datetime.timezone.utc).isoformat(),
          'season':season,'players':len(players),'last_game_players':len(last_games),
          'match_details_requested':len(match_paths),'match_details_failed':len(match_errors),
          'score_dates_failed':len(score_errors)}
save('/metadata',metadata)
print('Collecte terminée',metadata,flush=True)
