const fs = require('fs');
const path = require('path');
const QRCode = require('qrcode');
const db = require('./config/db'); // adapter selon ton projet

const qrDir = path.join(__dirname, 'public', 'qrcodes');
if (!fs.existsSync(qrDir)) fs.mkdirSync(qrDir, { recursive: true });

const generateQRCodes = async () => {
  const [rows] = await db.query("SELECT code_employe FROM employes WHERE code_employe IS NOT NULL");

  for (const row of rows) {
    const filePath = path.join(qrDir, `${row.code_employe}.png`);
    await QRCode.toFile(filePath, row.code_employe);
    console.log(`QR Code créé pour ${row.code_employe}`);
  }

  console.log('✅ Tous les QR codes ont été générés.');
};

generateQRCodes();
