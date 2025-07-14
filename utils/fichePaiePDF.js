// utils/fichePaiePDF.js
const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

function safe(val) {
  return (parseFloat(val ?? 0)).toFixed(2);
}

async function generateFichePaiePDF(fichePaie, employe) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  const html = `
  <html>
  <head>
    <style>
      body { font-family: Arial, sans-serif; padding: 20px; }
      table { width: 100%; border-collapse: collapse; margin-top: 20px; }
      th, td { border: 1px solid #333; padding: 6px; }
    </style>
  </head>
  <body>
    <h1 style="text-align:center">Fiche de paie ${fichePaie.mois}/${fichePaie.annee}</h1>
    <p><strong>Employé :</strong> ${employe.nom} ${employe.prenom}</p>

    <table>
      <tr><th>Détail</th><th>Montant (FDJ)</th></tr>
      <tr><td>Salaire brut</td><td>${safe(fichePaie.salaire_brut)}</td></tr>
      <tr><td>Heures sup.</td><td>${safe(fichePaie.heures_sup)}</td></tr>
      <tr><td>Prime</td><td>${safe(fichePaie.prime)}</td></tr>
      <tr><td>Retenue</td><td>${safe(fichePaie.retenue)}</td></tr>
      <tr><td><strong>Salaire net</strong></td><td><strong>${safe(fichePaie.salaire_net)}</strong></td></tr>
    </table>
  </body>
  </html>`;

  await page.setContent(html, { waitUntil: 'networkidle0' });

  const folder = path.resolve(__dirname, '..', 'public', 'pdf');
  if (!fs.existsSync(folder)) fs.mkdirSync(folder, { recursive: true });

  const filePath = path.join(folder, `fiche_paie_${fichePaie.id}.pdf`);
  await page.pdf({ path: filePath, format: 'A4' });

  await browser.close();
  return `/pdf/fiche_paie_${fichePaie.id}.pdf`;
}

module.exports = { generateFichePaiePDF };
