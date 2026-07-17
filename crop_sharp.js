import sharp from 'sharp';

async function crop() {
  const metadata = await sharp('public/LOGO.png').metadata();
  console.log(`Original: ${metadata.width}x${metadata.height}`);
  
  // Crop the bottom 45% (to remove the baked-in "StoryNest" text)
  const cropWidth = metadata.width;
  const cropHeight = Math.floor(metadata.height * 0.55);
  
  const buffer = await sharp('public/LOGO.png')
    .extract({ left: 0, top: 0, width: cropWidth, height: cropHeight })
    .toBuffer();
    
  // Now trim the transparent borders around the book icon!
  await sharp(buffer)
    .trim()
    .toFile('public/LOGO_cropped.png');
    
  console.log('Successfully cropped and trimmed to public/LOGO_cropped.png');
}

crop().catch(console.error);
