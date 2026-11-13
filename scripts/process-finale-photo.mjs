import path from "node:path";
import sharp from "sharp";

const source = path.resolve(process.argv[2] || "public/assets/picture-last-section.jpg");
const output = path.resolve(process.argv[3] || "public/assets/finale-photo-2000.webp");

await sharp(source)
  .rotate()
  .resize({ width: 2000, withoutEnlargement: true })
  .webp({ quality: 84, smartSubsample: true })
  .toFile(output);

console.log(`Optimized final-section photo: ${output}`);
