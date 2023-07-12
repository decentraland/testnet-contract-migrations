import fs from "fs";
import path from "path";
import originalCoords from "./originalCoords.json";

function main() {
  const batches: { xs: string[]; ys: string[] }[] = [];

  for (let i = 0; i < originalCoords.length; i++) {
    if (i % 100 === 0) {
      batches.push({ xs: [], ys: [] });
    }

    const latest = batches[batches.length - 1];
    const [x, y] = originalCoords[i].split(",");
    latest.xs.push(x);
    latest.ys.push(y);
  }

  const str = JSON.stringify(batches, null, 2);

  fs.writeFileSync(path.join(__dirname, "originalCoordsBatches.json"), str);
}

main();
