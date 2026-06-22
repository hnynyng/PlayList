const fs = require('fs');

// MP3 file signatures (magic bytes)
const MP3_SIGNATURES = [
  Buffer.from([0xff, 0xfb]), // MPEG Audio Frame (sync)
  Buffer.from([0xff, 0xfa]), // MPEG Audio Frame (sync)
  Buffer.from([0xff, 0xf2]), // MPEG Audio Frame (sync)
  Buffer.from([0xff, 0xf3]), // MPEG Audio Frame (sync)
  Buffer.from([0x49, 0x44, 0x33]), // ID3 tag
];

const validateMp3File = async (filePath) => {
  return new Promise((resolve, reject) => {
    const stream = fs.createReadStream(filePath, { end: 10 });
    const chunks = [];

    stream.on('data', chunk => chunks.push(chunk));

    stream.on('end', () => {
      const buffer = Buffer.concat(chunks);
      const isValid = MP3_SIGNATURES.some(sig => buffer.slice(0, sig.length).equals(sig));
      resolve(isValid);
    });

    stream.on('error', reject);
  });
};

const fileValidationMiddleware = async (req, res, next) => {
  if (!req.file) {
    return next();
  }

  try {
    const isValidMp3 = await validateMp3File(req.file.path);

    if (!isValidMp3) {
      fs.unlinkSync(req.file.path);
      return res.status(400).json({ error: 'File is not a valid MP3' });
    }

    next();
  } catch (err) {
    console.error('File validation error:', err);
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
    res.status(500).json({ error: 'File validation failed' });
  }
};

module.exports = {
  validateMp3File,
  fileValidationMiddleware,
};
