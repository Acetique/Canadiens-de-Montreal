
const OWNER = "Acetique";
const REPO = "Canadiens-de-Montreal";
const WORKFLOW = "actualiser-ch-live.yml";

export default async function handler(req, res) {
  // Autorisations CORS pour CH LIVE
  res.setHeader(
    "Access-Control-Allow-Origin",
    "https://acetique.github.io"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "POST, OPTIONS"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, X-CH-LIVE-ADMIN"
  );
  res.setHeader("Vary", "Origin");
  res.setHeader("Cache-Control", "no-store");

  // Réponse à la vérification CORS
  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Méthode non autorisée"
    });
  }

  // Vérification des variables Vercel
  const githubToken = process.env.GITHUB_TOKEN;
  const adminCode = process.env.ADMIN_CODE;

  if (!githubToken || !adminCode) {
    return res.status(503).json({
      error: "Configuration serveur incomplète",
      missing: [
        ...(!githubToken ? ["GITHUB_TOKEN"] : []),
        ...(!adminCode ? ["ADMIN_CODE"] : [])
      ]
    });
  }

  // Vérification du code administrateur
  const submitted = req.headers["x-ch-live-admin"];

  if (
    typeof submitted !== "string" ||
    submitted !== adminCode
  ) {
    return res.status(401).json({
      error: "Code administrateur incorrect"
    });
  }

  // Déclenchement GitHub Actions
  try {
    const response = await fetch(
      `https://api.github.com/repos/${OWNER}/${REPO}/actions/workflows/${WORKFLOW}/dispatches`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${githubToken}`,
          Accept: "application/vnd.github+json",
          "X-GitHub-Api-Version": "2022-11-28",
          "User-Agent": "CH-LIVE",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          ref: process.env.GITHUB_REF || "main"
        })
      }
    );

    if (response.status === 204) {
      return res.status(202).json({
        ok: true,
        message: "Collecte LNH déclenchée avec succès"
      });
    }

    const details = await response.text();

    return res.status(502).json({
      error: `GitHub a répondu HTTP ${response.status}`,
      details: details.slice(0, 200)
    });

  } catch (error) {
    console.error("Erreur GitHub Actions:", error.message);

    return res.status(502).json({
      error: "Impossible de joindre GitHub"
    });
  }
}
