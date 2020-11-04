const chai = require("chai");
const { expect } = chai;

const { error } = require("../../server/utils");

describe("Test des fonctions utils", function () {
    it('Fonction "error"', (done) => {
        const message = "message";
        const messages = ["message", "message"];
        const data = { error: "something" };

        expect(error(message)).to.deep.equal({ messages: [message], data: null });
        expect(error(message, data)).to.deep.equal({ messages: [message], data: data });
        expect(error(messages)).to.deep.equal({ messages: messages, data: null });
        expect(error(messages, data)).to.deep.equal({ messages: messages, data: data });

        done();
    });
});
