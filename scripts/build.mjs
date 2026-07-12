import { copyFile, cp, mkdir, rm } from "node:fs/promises";
import { dirname, join } from "node:path";

const root = process.cwd();
const dist = join(root, "dist");
const files = [
  ["index.html", "index.html"],
  ["styles.css", "styles.css"],
  ["script.js", "script.js"],
  ["favicon.svg", "favicon.svg"]
];

await rm(dist, { recursive: true, force: true });
await mkdir(dist, { recursive: true });

for (const [source, target] of files) {
  const targetPath = join(dist, target);
  await mkdir(dirname(targetPath), { recursive: true });
  await copyFile(join(root, source), targetPath);
}

await copyFile(join(root, ".nojekyll"), join(dist, ".nojekyll"));
await cp(join(root, "images"), join(dist, "images"), { recursive: true });
await cp(join(root, "resume"), join(dist, "resume"), { recursive: true });
await cp(join(root, "certificates"), join(dist, "certificates"), { recursive: true });

console.log("Built static portfolio into dist/");
