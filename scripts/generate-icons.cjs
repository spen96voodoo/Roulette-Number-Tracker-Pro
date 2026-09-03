const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

function createPNG(width, height) {
  // Simple uncompressed or deflate PNG generator
  // PNG signature
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  // IHDR chunk
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr.writeUInt8(8, 8); // 8-bit depth
  ihdr.writeUInt8(6, 9); // RGBA color type
  ihdr.writeUInt8(0, 10); // compression
  ihdr.writeUInt8(0, 11); // filter
  ihdr.writeUInt8(0, 12); // interlace

  const ihdrChunk = makeChunk('IHDR', ihdr);

  // Raw image data: (1 byte filter + width * 4 bytes RGBA) * height
  const rowSize = 1 + width * 4;
  const rawData = Buffer.alloc(rowSize * height);

  const cx = width / 2;
  const cy = height / 2;
  const radius = Math.min(width, height) * 0.44;
  const innerRadius = radius * 0.65;
  const centerRadius = radius * 0.28;

  for (let y = 0; y < height; y++) {
    const rowOffset = y * rowSize;
    rawData[rowOffset] = 0; // Filter: none
    for (let x = 0; x < width; x++) {
      const pxOffset = rowOffset + 1 + x * 4;
      const dx = x - cx;
      const dy = y - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist <= radius) {
        if (dist <= centerRadius) {
          // Gold center
          rawData[pxOffset] = 255;     // R
          rawData[pxOffset + 1] = 215; // G
          rawData[pxOffset + 2] = 0;   // B
          rawData[pxOffset + 3] = 255; // A
        } else if (dist <= innerRadius) {
          // Roulette alternating red and dark
          const angle = (Math.atan2(dy, dx) + Math.PI) / (2 * Math.PI) * 37;
          const isRed = Math.floor(angle) % 2 === 0;
          if (isRed) {
            rawData[pxOffset] = 198;     // R
            rawData[pxOffset + 1] = 40;  // G
            rawData[pxOffset + 2] = 40;  // B
          } else {
            rawData[pxOffset] = 20;      // R
            rawData[pxOffset + 1] = 20;  // G
            rawData[pxOffset + 2] = 20;  // B
          }
          rawData[pxOffset + 3] = 255; // A
        } else {
          // Gold outer rim
          rawData[pxOffset] = 218;     // R
          rawData[pxOffset + 1] = 165; // G
          rawData[pxOffset + 2] = 32;  // B
          rawData[pxOffset + 3] = 255; // A
        }
      } else {
        // Dark background with rounded corners
        const cornerDist = Math.max(Math.abs(dx) - (cx - 24), 0) ** 2 + Math.max(Math.abs(dy) - (cy - 24), 0) ** 2;
        if (cornerDist <= 576) {
          rawData[pxOffset] = 10;
          rawData[pxOffset + 1] = 10;
          rawData[pxOffset + 2] = 10;
          rawData[pxOffset + 3] = 255;
        } else {
          rawData[pxOffset] = 0;
          rawData[pxOffset + 1] = 0;
          rawData[pxOffset + 2] = 0;
          rawData[pxOffset + 3] = 0; // transparent corner
        }
      }
    }
  }

  const compressedData = zlib.deflateSync(rawData);
  const idatChunk = makeChunk('IDAT', compressedData);
  const iendChunk = makeChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
}

function makeChunk(type, data) {
  const length = data.length;
  const chunk = Buffer.alloc(8 + length + 4);
  chunk.writeUInt32BE(length, 0);
  chunk.write(type, 4, 4, 'ascii');
  data.copy(chunk, 8);

  const crc = crc32(chunk.subarray(4, 8 + length));
  chunk.writeUInt32BE(crc, 8 + length);
  return chunk;
}

// CRC32 implementation for PNG
function crc32(buf) {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    c = (c >>> 8) ^ crcTable[(c ^ buf[i]) & 0xff];
  }
  return (c ^ 0xffffffff) >>> 0;
}

const crcTable = new Uint32Array(256);
for (let n = 0; n < 256; n++) {
  let c = n;
  for (let k = 0; k < 8; k++) {
    c = (c & 1) ? (0xedb88320 ^ (c >>> 1)) : (c >>> 1);
  }
  crcTable[n] = c;
}

const publicDir = path.join(__dirname, '..', 'public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

fs.writeFileSync(path.join(publicDir, 'icon-192.png'), createPNG(192, 192));
fs.writeFileSync(path.join(publicDir, 'icon-512.png'), createPNG(512, 512));
fs.writeFileSync(path.join(publicDir, 'icon-maskable-512.png'), createPNG(512, 512));
console.log('Generated PWA PNG icons successfully in public/');
