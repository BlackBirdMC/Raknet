module.exports = (payload, rinfo, raknet) => {
    console.log(`Client disconnected from ${rinfo.address}:${rinfo.port}`);
    const client = raknet.clients.get(rinfo.address + ':' + rinfo.port);
    if (client) {
        clearTimeout(client.timeout);
        raknet.clients.delete(rinfo.address + ':' + rinfo.port);
    }
};