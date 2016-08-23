'use strict';

const fs = require('fs');
const program = require('commander');
const Canvas = require('canvas');

program
  .version('0.0.1')
  .option('-s, --source [path]', 'source png')
  .option('-b, --background [path]', 'background png')
  .option('-n, --number <n>', 'number of png', parseInt)
  .parse(process.argv);

console.log(`get ${program.source}...`);

fs.readFile(program.source, function(err, sourceImage){
  if (err) throw err;

  const img = new Canvas.Image;
  img.src = sourceImage;

  const canvas = new Canvas(
    img.width * program.number,
    img.height * program.number);
  const ctx = canvas.getContext('2d');

  for (let i = 0; i < program.number; i++) {
    for (let ii = 0; ii < program.number; ii++) {
      ctx.drawImage(
        img,
        i * img.width,
        ii * img.height,
        img.width,
        img.height);
    }
  }

  const stream = canvas.pngStream();
  const pngfile = fs.createWriteStream(program.background);

  stream.on('data', function(chunk){
    pngfile.write(chunk);
  });

  stream.on('end', function(){
    console.log(`saved ${program.background}`);
  });
});
