class ReliabilityTool {
    constructor() {
        this.sequenceNumber = 0;
        this.acknowledgedPackets = new Set();
        this.timeoutMap = new Map();
    }


    nextSequenceNumber() {
        return this.sequenceNumber++;
    }

    acknowledge(packetId) {
        this.acknowledgedPackets.add(packetId);
        this.timeoutMap.delete(packetId);
    }

    resendLostPackets(sendFunction) {
        this.timeoutMap.forEach((timeout, packetId) => {
            if (Date.now() - timeout > 3000) {
                sendFunction(packetId);
                this.timeoutMap.set(packetId, Date.now()); 
            }
        });
    }

    setTimeout(packetId) {
        this.timeoutMap.set(packetId, Date.now());
    }
}

module.exports = ReliabilityTool;