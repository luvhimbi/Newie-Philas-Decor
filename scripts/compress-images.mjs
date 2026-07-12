import sharp from 'sharp';
import { readdir, readFile, writeFile, unlink, stat } from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PUBLIC_DIR = path.join(__dirname, '..', 'public');
const SOURCE_EXT = new Set(['.jpg', '.jpeg', '.png']);
const SKIP_NAMES = /(- Copy|icons\.svg|favicon\.svg)/i;
const WEBP_QUALITY = 80;

async function getSourceImages(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    if (!entry.isFile()) continue;
    const ext = path.extname(entry.name).toLowerCase();
    if (!SOURCE_EXT.has(ext) || SKIP_NAMES.test(entry.name)) continue;
    files.push(path.join(dir, entry.name));
  }

  return files;
}

async function convertToWebp(sourcePath) {
  const baseName = path.basename(sourcePath);
  const webpName = `${path.parse(baseName).name}.webp`;
  const webpPath = path.join(PUBLIC_DIR, webpName);

  try {
    const [srcStat, webpStat] = await Promise.all([stat(sourcePath), stat(webpPath)]);
    if (webpStat.mtimeMs >= srcStat.mtimeMs) {
      await unlink(sourcePath);
      return { skipped: true, webpName, webpSize: webpStat.size };
    }
  } catch {
    // Create or refresh webp.
  }

  const before = (await readFile(sourcePath)).length;
  const webp = await sharp(sourcePath)
    .rotate()
    .webp({ quality: WEBP_QUALITY, effort: 6 })
    .toBuffer();

  await writeFile(webpPath, webp);
  await unlink(sourcePath);

  return {
    skipped: false,
    sourceName: baseName,
    webpName,
    before,
    webpSize: webp.length,
  };
}

async function main() {
  const files = await getSourceImages(PUBLIC_DIR);

  if (files.length === 0) {
    console.log('All images are already WebP.');
    return;
  }

  console.log(`Converting ${files.length} images to compressed WebP...\n`);

  let totalBefore = 0;
  let totalWebp = 0;

  for (const file of files) {
    const result = await convertToWebp(file);

    if (result.skipped) {
      console.log(`${result.webpName}: kept (${(result.webpSize / 1024).toFixed(1)}KB)`);
      totalWebp += result.webpSize;
      continue;
    }

    totalBefore += result.before;
    totalWebp += result.webpSize;

    const saved = Math.max(0, result.before - result.webpSize);
    console.log(
      `${result.sourceName} -> ${result.webpName}: ${(result.before / 1024).toFixed(1)}KB -> ${(result.webpSize / 1024).toFixed(1)}KB` +
        (saved > 0 ? ` (-${(saved / 1024).toFixed(1)}KB)` : ''),
    );
  }

  console.log(
    `\nDone. Sources converted: ${(totalBefore / 1024).toFixed(1)}KB -> WebP output: ${(totalWebp / 1024).toFixed(1)}KB`,
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
