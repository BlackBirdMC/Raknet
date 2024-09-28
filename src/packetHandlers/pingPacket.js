module.exports = (payload, rinfo, server) => {
    console.log(`Ping received from ${rinfo.address}:${rinfo.port}`);
    const pongPacket = createPacket(0x05, Buffer.from([]));
    server.server.send(pongPacket, rinfo.port, rinfo.address);
};
