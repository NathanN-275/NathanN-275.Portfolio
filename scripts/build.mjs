import { copyFile, mkdir, rm } from "node:fs/promises";
import { dirname, join } from "node:path";

const root = process.cwd();
const dist = join(root, "dist");
const files = [
  ["index.html", "index.html"],
  ["styles.css", "styles.css"],
  ["script.js", "script.js"]
];

await rm(dist, { recursive: true, force: true });
await mkdir(dist, { recursive: true });

for (const [source, target] of files) {
  const targetPath = join(dist, target);
  await mkdir(dirname(targetPath), { recursive: true });
  await copyFile(join(root, source), targetPath);
}

await copyFile(join(root, ".nojekyll"), join(dist, ".nojekyll"));

console.log("Built static portfolio into dist/");
