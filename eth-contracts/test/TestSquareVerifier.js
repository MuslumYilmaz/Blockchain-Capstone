let Verifier = artifacts.require("Verifier");
let proof = require('../../zokrates/code/square/proof');

contract('TestSquareVerifier', accounts => {
    beforeEach('Testing SquareVerifier', async function () {
        this.contract = await Verifier.new({from: accounts[0]});
    })

    // Test verification with correct proof
    // - use the contents from proof.json generated from zokrates steps
    it('Test verification with correct proof', async function () {
        const can_be_verified = await this.contract.verifyTx(proof.proof.a, proof.proof.b, proof.proof.c, proof.inputs);
        assert.equal(can_be_verified, true, "Could not verify with good proof");
    })

    it('Test verification with incorrect proof', async function () {
        const can_be_verified = await this.contract.verifyTx(proof.proof.c, proof.proof.b, proof.proof.a, proof.inputs);
        assert.equal(can_be_verified, false, "Coulc verify with bad proof");
    })
})