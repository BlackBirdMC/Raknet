const zlib = require('zlib');

class Compression {
    static compress(data) {
        return zlib.deflateSync(data);
    }

    static decompress(data) {
        return zlib.inflateSync(data);
    }
}

module.exports = Compression;