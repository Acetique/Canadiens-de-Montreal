/ Fonction Vercel : le token GitHub reste uniquement dans les variables serveur.
const OWNER='Acetique', REPO='Canadiens-de-Montreal', WORKFLOW='actualiser-ch-live.yml';
export default async function handler(req,res){
 res.setHeader('Access-Control-Allow-Origin',process.env.SITE_ORIGIN||'https://acetique.github.io');
 res.setHeader('Access-Control-Allow-Methods','POST, OPTIONS');
 res.setHeader('Access-Control-Allow-Headers','Content-Type, X-CH-LIVE-ADMIN');
 res.setHeader('Cache-Control','no-store');
 if(req.method==='OPTIONS')return res.status(204).end();
 if(req.method!=='POST')return res.status(405).json({error:'Méthode non autorisée'});
 if(!process.env.GITHUB_TOKEN||!process.env.ADMIN_SECRET)return res.status(503).json({error:'Configuration serveur incomplète'});
 const submitted=req.headers['x-ch-live-admin'];
 if(typeof submitted!=='string'||submitted!==process.env.ADMIN_SECRET)return res.status(401).json({error:'Code administrateur incorrect'});
 try{
  const r=await fetch(`https://api.github.com/repos/${OWNER}/${REPO}/actions/workflows/${WORKFLOW}/dispatches`,{
   method:'POST',headers:{'Authorization':`Bearer ${process.env.GITHUB_TOKEN}`,'Accept':'application/vnd.github+json','X-GitHub-Api-Version':'2022-11-28','User-Agent':'CH-LIVE'},
   body:JSON.stringify({ref:process.env.GITHUB_REF||'main'})
  });
  if(r.status===204)return res.status(202).json({ok:true,message:'Workflow déclenché'});
  const body=await r.text();return res.status(502).json({error:`GitHub a répondu HTTP ${r.status}`,details:body.slice(0,200)});
 }catch(e){return res.status(502).json({error:'Impossible de joindre GitHub'});}
}
