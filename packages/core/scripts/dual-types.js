const fs = require("node:fs");
const path = require("node:path");
const dist = path.join(__dirname, "..", "dist");

function dualTypes(base) {
  const dTs = path.join(dist, `${base}.d.ts`);
  const dMts = path.join(dist, `${base}.d.mts`);
  const dCts = path.join(dist, `${base}.d.cts`);
  if (!fs.existsSync(dCts)) return;
  fs.copyFileSync(dTs, dMts);
  fs.copyFileSync(dCts, dTs);
}

dualTypes("index");
dualTypes("react");
dualTypes("server");
