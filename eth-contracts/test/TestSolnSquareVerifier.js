let SolnSquareVerifier = artifacts.require("SolnSquareVerifier");
let proof = require('../../zokrates/code/square/proof');

contract('TestSolnSquareVerifier', accounts => {
    const account_one = accounts[0];
    beforeEach( async function() {
        this.contract = await SolnSquareVerifier.new({from: account_one});
    })

    it('Test if a new solution can be added for contract - SolnSquareVerifier', async function () {
        let output = await this.contract.addSolution(account_one, 1, proof.proof.a, proof.proof.b, proof.proof.c, proof.inputs, {from: account_one});
        assert.equal(output.logs[0].event, 'SolutionAdded', 'Solution not added');
    })

    it('Test if an ERC721 token can be minted for contract - SolnSquareVerifier', async function( ) {
        let minted;
        try {
            await this.contract.addSolution(account_one, 1, proof.proof.a, proof.proof.b, proof.proof.c, proof.inputs, {from: account_one});
            await this.contract.mint(account_one, 1, {from: account_one});
            minted = true;
        } catch (error) {
            console.log(error);
            minted = false;
        }
        assert.equal(minted, true, "Could not mint token");
    })
})