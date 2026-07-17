const Jimp = require('jimp');

async function main() {
    console.log("Reading logo...");
    const image = await Jimp.read('public/LOGO.png');
    console.log(`Original dimensions: ${image.bitmap.width}x${image.bitmap.height}`);
    
    // The logo has text at the bottom. We want to keep the book (top part).
    // Let's crop the bottom 45% of the image.
    const cropWidth = image.bitmap.width;
    const cropHeight = Math.floor(image.bitmap.height * 0.55); // Keep top 55%
    
    console.log(`Cropping to: ${cropWidth}x${cropHeight}`);
    
    image.crop(0, 0, cropWidth, cropHeight);
    
    await image.writeAsync('public/LOGO_cropped.png');
    console.log("Saved cropped logo to public/LOGO_cropped.png");
}

main().catch(console.error);
