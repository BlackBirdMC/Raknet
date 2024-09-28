function createPacket(packetId, data) {
    const packet = Buffer.concat([Buffer.from([packetId]), data]);
    return packet;
}

function parsePacket(buffer) {
    const packetId = buffer[0];
    const payload = buffer.slice(1);
    return { packetId, payload };
}


function fragmentPacket(data, maxSize) {
    const fragments = [];
    for (let i = 0; i < data.length; i += maxSize) {
        fragments.push(data.slice(i, i + maxSize));
    }
    return fragments;
}

function reassembleFragments(fragments) {
    return Buffer.concat(fragments);
}

module.exports = { createPacket, parsePacket, fragmentPacket, reassembleFragments };
