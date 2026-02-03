const fs = require('fs');
const path = require('path');
const dist = path.join(__dirname, '..', 'dist');
const dTs = path.join(dist, 'index.d.ts');
const dMts = path.join(dist, 'index.d.mts');
const dCts = path.join(dist, 'index.d.cts');

if (!fs.existsSync(dCts)) process.exit(0);
fs.copyFileSync(dTs, dMts);
fs.copyFileSync(dCts, dTs);
