const dgram = require('dgram');
const { createPacket, parsePacket, fragmentPacket } = require('./utils/packetUtils');
const Serializer = require('./utils/serializer');
const Compression = require('./utils/compression');
const ReliabilityTool = require('./reliabilityTool');

class RakNet {
    constructor(port) {
        this.port = port;
        this.server = dgram.createSocket('udp4');
        this.clients = new Map();
        this.reliabilityTool = new ReliabilityTool();

        this.server.on('message', this.onMessage.bind(this));
        this.server.on('listening', () => {
            const address = this.server.address();
            console.log(`RakNet server listening on ${address.address}:${address.port}`);
        });

        this.server.bind(this.port);
        this.startKeepAlive();
    }

    onMessage(message, rinfo) {
        const { packetId, payload } = parsePacket(message);
        this.handlePacket(packetId, payload, rinfo);
    }

    handlePacket(packetId, payload, rinfo) {
        switch (packetId) {
            case 0x00:
                this.setConnectionTimeout(rinfo);
                require('./packetHandlers/connectPacket')(payload, rinfo, this);
                break;
            case 0x01: 
                require('./packetHandlers/disconnectPacket')(payload, rinfo, this);
                break;
            case 0x02: 
                require('./packetHandlers/messagePacket')(payload, rinfo, this);
                break;
            case 0x03:
                this.reliabilityTool.acknowledge(payload.readUInt16BE(0)); 
                require('./packetHandlers/acknowledgmentPacket')(payload, rinfo, this);
                break;
            case 0x04: 
                require('./packetHandlers/pingPacket')(payload, rinfo, this);
                break;
            default:
                console.log(`Unknown packet ID: ${packetId}`);
        }
    }

    sendPacket(packetId, data, address, port) {
        const serializedData = Serializer.serialize(data);
        const compressedData = Compression.compress(serializedData);
        const fragments = fragmentPacket(compressedData, 512); 

        fragments.forEach((fragment, index) => {
            const packet = createPacket(packetId, Buffer.concat([Buffer.from([index]), fragment])); 
            this.reliabilityTool.setTimeout(packetId); 
            this.server.send(packet, port, address, (error) => {
                if (error) {
                    console.error('Error sending packet:', error);
                }
            });
        });
    }

    setConnectionTimeout(rinfo) {
        const timeout = setTimeout(() => {
            console.log(`Client ${rinfo.address}:${rinfo.port} has timed out.`);
            this.clients.delete(rinfo.address + ':' + rinfo.port);
        }, 30000); 

        this.clients.set(rinfo.address + ':' + rinfo.port, { rinfo, timeout });
    }

    startKeepAlive() {
        setInterval(() => {
            this.clients.forEach((client, key) => {
                const pingPacket = createPacket(0x04, Buffer.from([])); 
                this.server.send(pingPacket, client.rinfo.port, client.rinfo.address);
            });
        }, 10000); 
    }
}

module.exports = RakNet;
