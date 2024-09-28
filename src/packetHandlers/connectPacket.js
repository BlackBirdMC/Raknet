module.exports = (payload, rinfo, raknet) => {
    console.log(`Client connected from ${rinfo.address}:${rinfo.port}`);
    raknet.clients.set(rinfo.address + ':' + rinfo.port, rinfo);

    const response = { message: 'Connection established' };
    raknet.sendPacket(0x01, response, rinfo.address, rinfo.port);
};