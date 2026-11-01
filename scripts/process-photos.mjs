import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const inputDirectory = path.resolve(process.argv[2] || "public/photos/raw");
const outputDirectory = path.resolve(process.argv[3] || "public/photos/gallery");
const generatedFile = path.resolve("src/data/gallery.generated.js");
const widths = [640, 1280, 2000];
const supported = new Set([".jpg", ".jpeg", ".png", ".tif", ".tiff", ".webp"]);

await fs.mkdir(outputDirectory, { recursive: true });
const files = (await fs.readdir(inputDirectory, { withFileTypes: true }))
  .filter((entry) => entry.isFile() && supported.has(path.extname(entry.name).toLowerCase()))
  .map((entry) => entry.name)
  .sort();

const gallery = [];
for (const filename of files) {
  const source = path.join(inputDirectory, filename);
  const slug = path.basename(filename, path.extname(filename)).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") || `photo-${gallery.length + 1}`;
  const variants = {};
  for (const width of widths) {
    const outputName = `${slug}-${width}.webp`;
    await sharp(source)
      .rotate()
      .resize({ width, withoutEnlargement: true })
      .webp({ quality: width === 2000 ? 86 : 82 })
      .toFile(path.join(outputDirectory, outputName));
    variants[width] = `/photos/gallery/${outputName}`;
  }
  gallery.push({ id: slug, altKh: "[ពិពណ៌នារូបថត]", altEn: "[Photo description]", variants });
}

await fs.writeFile(generatedFile, `export const generatedGallery = ${JSON.stringify(gallery, null, 2)};\n`);
console.log(`Processed ${gallery.length} photo(s). EXIF/GPS metadata was omitted from every output.`);
