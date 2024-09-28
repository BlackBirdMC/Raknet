module.exports = (payload, rinfo, server) => {
    const acknowledgedPacketId = payload.readUInt16BE(0);
    console.log(`Acknowledgment received for packet ID ${acknowledgedPacketId} from ${rinfo.address}:${rinfo.port}`);

    server.reliabilityTool.acknowledge(acknowledgedPacketId);

    server.reliabilityTool.resendLostPackets((packetId) => {
        const client = server.clients.get(`${rinfo.address}:${rinfo.port}`);
        if (client) {
            const packetData = server.reliabilityTool.getPacketData(packetId);
            if (packetData) {
                server.sendPacket(packetId, packetData, rinfo.address, rinfo.port);
                console.log(`Resending packet ID ${packetId} to ${rinfo.address}:${rinfo.port}`);
            } else {
                console.log(`No data found for packet ID ${packetId} to resend.`);
            }
        }
    });
};