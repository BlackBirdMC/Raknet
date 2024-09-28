module.exports = (payload, rinfo, raknet) => {
    const message = Compression.decompress(payload).toString();
    console.log(`Received message from ${rinfo.address}:${rinfo.port}: ${message}`);

    const ackResponse = { message: 'Message received' };
    raknet.sendPacket(0x03, ackResponse, rinfo.address, rinfo.port);
};