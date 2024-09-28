class Frame {
    constructor() {
        this.fragments = new Map();
    }

    fragment(packetId, payload, maxSize) {
        const fragments = [];
        for (let i = 0; i < payload.length; i += maxSize) {
            const fragment = payload.slice(i, i + maxSize);
            fragments.push({ packetId, fragment, index: i / maxSize });
        }
        return fragments;
    }

    reassemble(packetId, fragments) {
        const sortedFragments = fragments.sort((a, b) => a.index - b.index);
        return Buffer.concat(sortedFragments.map(f => f.fragment));
    }

    handleFragment(packetId, fragment, index) {
        if (!this.fragments.has(packetId)) {
            this.fragments.set(packetId, []);
        }
        this.fragments.get(packetId).push({ fragment, index });

        const allFragments = this.fragments.get(packetId);
        if (allFragments.length === Math.ceil(fragment.length / fragment[0].length)) {
            const completePayload = this.reassemble(packetId, allFragments);
            this.fragments.delete(packetId);
            return completePayload;
        }
        return null;
    }
}

module.exports = Frame;
