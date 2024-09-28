class Serializer {
    static serialize(data) {
        return Buffer.from(JSON.stringify(data));
    }

    static deserialize(buffer) {
        return JSON.parse(buffer.toString());
    }
}

module.exports = Serializer;