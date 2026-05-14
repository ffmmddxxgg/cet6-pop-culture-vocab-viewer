import { mkdir, readdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";

const dataDir = join(process.cwd(), "public", "data");
const manifestName = "card-files.json";

function titleFromFilename(filename) {
  return filename
    .replace(/\.json$/i, "")
    .replace(/[_-]+/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

async function isCardsFile(filename) {
  if (!filename.endsWith(".json")) return false;
  if (filename === manifestName) return false;
  try {
    const raw = await readFile(join(dataDir, filename), "utf8");
    const data = JSON.parse(raw);
    return Array.isArray(data) || Array.isArray(data?.cards);
  } catch {
    return false;
  }
}

await mkdir(dataDir, { recursive: true });
const files = (await readdir(dataDir)).sort();
const cardFiles = [];

for (const filename of files) {
  if (await isCardsFile(filename)) {
    cardFiles.push({
      file: filename,
      category: titleFromFilename(filename),
    });
  }
}

await writeFile(join(dataDir, manifestName), `${JSON.stringify(cardFiles, null, 2)}\n`, "utf8");
console.log(`Generated public/data/${manifestName} with ${cardFiles.length} card file(s).`);
