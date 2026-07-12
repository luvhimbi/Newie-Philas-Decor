import { rename, unlink, readdir } from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PUBLIC_DIR = path.join(__dirname, '..', 'public');

const GALLERY_RENAMES = [
  ['469207283_564283862992204_3106401350744891417_n.jpg', 'gallery-01.jpg'],
  ['469231804_564278856326038_1086961304827374702_n.jpg', 'gallery-02.jpg'],
  ['469259440_564285496325374_1182488209133371046_n.jpg', 'gallery-03.jpg'],
  ['469325728_564282722992318_604722613996058945_n.jpg', 'gallery-04.jpg'],
  ['469344896_565512452869345_4233520216232603559_n.jpg', 'gallery-05.jpg'],
  ['469354435_566090226144901_5676921295966620121_n.jpg', 'gallery-06.jpg'],
  ['469357676_564285652992025_206819789307558443_n.jpg', 'gallery-07.jpg'],
  ['469358544_565512252869365_8831836146926286467_n.jpg', 'gallery-08.jpg'],
  ['469399593_566082449479012_2168524733048518792_n.jpg', 'gallery-09.jpg'],
  ['469549257_565512099536047_6408865408968786256_n.jpg', 'gallery-10.jpg'],
  ['469840002_568561872564403_5345761024991478859_n.jpg', 'gallery-11.jpg'],
  ['469845770_568585459228711_4337655302858195448_n.jpg', 'gallery-12.jpg'],
  ['469962135_568562072564383_483692655452309095_n.jpg', 'gallery-13.jpg'],
  ['470555269_574373425316581_9176084575297050817_n.jpg', 'gallery-14.jpg'],
  ['470658687_573584385395485_5341763288042407354_n.jpg', 'gallery-15.jpg'],
  ['470879995_574373465316577_4029426834870299291_n.jpg', 'gallery-16.jpg'],
  ['471139059_574347205319203_5751652373524118764_n.jpg', 'gallery-17.jpg'],
  ['471166450_574347238652533_4221410776714398325_n.jpg', 'gallery-18.jpg'],
  ['471840626_582247354529188_2033451029564125645_n.jpg', 'gallery-19.jpg'],
  ['472022052_582247497862507_5185811782084214503_n.jpg', 'gallery-20.jpg'],
  ['472266135_585147147572542_4390639968109744399_n.jpg', 'gallery-21.jpg'],
  ['472283910_585150127572244_36151267512219310_n.jpg', 'gallery-22.jpg'],
  ['472654430_586310904122833_3772401208126779749_n.jpg', 'gallery-23.jpg'],
  ['472655928_586448724109051_3173433639466498294_n.jpg', 'gallery-24.jpg'],
  ['472684491_585153257571931_6405876209400387559_n.jpg', 'gallery-25.jpg'],
  ['472843362_586310867456170_5846895791838194876_n.jpg', 'gallery-26.jpg'],
  ['473177849_589772287110028_5766100521557004924_n.jpg', 'gallery-27.jpg'],
  ['473349814_590457683708155_6281155300023196748_n.jpg', 'gallery-28.jpg'],
  ['474592189_600453162708607_8757066400316501806_n.jpg', 'gallery-29.jpg'],
  ['474903248_599865946100662_595475587233405175_n.jpg', 'gallery-30.jpg'],
  ['475120112_600446339375956_6747744232227367336_n.jpg', 'gallery-31.jpg'],
  ['475271631_600087446078512_7778708004642364317_n.jpg', 'gallery-32.jpg'],
  ['583111594_756193180772182_7955203168607946303_n.jpg', 'gallery-33.jpg'],
];

const ASSET_RENAMES = [
  ['Logo.jpeg', 'logo.jpeg'],
  ['Founder_Ronewa.png', 'founder-ronewa.png'],
  ['Founder_Phila.png', 'founder-phila.png'],
  ['Founder_Ronewa.webp', 'founder-ronewa.webp'],
  ['Founder_Phila.webp', 'founder-phila.webp'],
];

const KEEP_FILES = new Set([
  ...GALLERY_RENAMES.map(([, name]) => name),
  ...ASSET_RENAMES.map(([, name]) => name),
  'hero.png',
  'hero.webp',
  'manifest.json',
  'robots.txt',
  'sitemap.xml',
  'llms.txt',
  'llms-full.txt',
]);

async function safeRename(from, to) {
  const fromPath = path.join(PUBLIC_DIR, from);
  const toPath = path.join(PUBLIC_DIR, to);
  try {
    await rename(fromPath, toPath);
    console.log(`renamed: ${from} -> ${to}`);
  } catch (error) {
    if (error.code === 'ENOENT') {
      console.log(`skip rename (missing): ${from}`);
      return;
    }
    throw error;
  }
}

async function safeDelete(filename) {
  const filePath = path.join(PUBLIC_DIR, filename);
  try {
    await unlink(filePath);
    console.log(`deleted: ${filename}`);
  } catch (error) {
    if (error.code === 'ENOENT') return;
    throw error;
  }
}

async function main() {
  for (const [from, to] of [...GALLERY_RENAMES, ...ASSET_RENAMES]) {
    await safeRename(from, to);
  }

  const entries = await readdir(PUBLIC_DIR);
  for (const filename of entries) {
    if (KEEP_FILES.has(filename)) continue;

    const lower = filename.toLowerCase();
    const isImage =
      lower.endsWith('.jpg') ||
      lower.endsWith('.jpeg') ||
      lower.endsWith('.png') ||
      lower.endsWith('.webp') ||
      lower.endsWith('.svg') ||
      lower.endsWith('.tmp');

    if (isImage || lower.includes(' copy')) {
      await safeDelete(filename);
    }
  }

  console.log('\nCleanup complete.');
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
