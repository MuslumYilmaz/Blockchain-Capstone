let ERC721Mintable = artifacts.require('ERC721Mintable');

contract('TestERC721Mintable', accounts => {

    const account_one = accounts[0];
    const account_two = accounts[1];

    describe('match erc721 spec', function () {
        beforeEach(async function () { 
            this.contract = await ERC721Mintable.new({from: account_one});

            // TODO: mint multiple tokens
            this.contract.mint(account_one, 1, {from: account_one});
            this.contract.mint(account_one, 2, {from: account_one});
            this.contract.mint(account_one, 3, {from: account_one});
            this.contract.mint(account_two, 4, {from: account_one});
            this.contract.mint(account_two, 5, {from: account_one});
            this.contract.mint(account_two, 6, {from: account_one});
            this.contract.mint(account_two, 7, {from: account_one});
        })

        it('should return total supply', async function () { 
            let number_of_tokens = await this.contract.totalSupply.call();
            assert.equal(number_of_tokens, 7, "Wrong number of expected tokens returned");
        })

        it('should get token balance', async function () {
            let account_balance = await this.contract.balanceOf.call(account_one, {from: account_one});
            assert.equal(account_balance, 3);
            account_balance = await this.contract.balanceOf.call(account_two, {from: account_one});
            assert.equal(account_balance, 4);
        })

        // token uri should be complete i.e: https://s3-us-west-2.amazonaws.com/udacity-blockchain/capstone/1
        it('should return token uri', async function () {
            for(let index = 1; index < 8; index++) {
                const tokenURI = await this.contract.tokenURI.call(index, {from: account_one});
                assert.equal(tokenURI, `https://s3-us-west-2.amazonaws.com/udacity-blockchain/capstone/${index}`);
            }
        })

        it('should transfer token from one owner to another', async function () {
            const token_to_trade = 1;
            await this.contract.transferFrom(account_one, account_two, token_to_trade, {from: account_one});
            let owner = await this.contract.ownerOf.call(token_to_trade, {from: account_two});
            assert.equal(owner, account_two, "Transfer failed to new owner");

            await this.contract.transferFrom(account_two, account_one, token_to_trade, {from: account_two});
            owner = await this.contract.ownerOf.call(token_to_trade, {from: account_one});
            assert.equal(owner, account_one, "Transfer failed back to original owner");
        })
    });

    describe('have ownership properties', function () {
        beforeEach(async function () {
            this.contract = await ERC721Mintable.new({from: account_one});
        })

        it('should fail when minting when address is not contract owner', async function () {
            let minting_failed = false;
            try {
                await this.contract.mint(account_two, 1, {from: account_two});
            } catch (error) {
                minting_failed = true;
            }
            assert.equal(minting_failed, true, "Was able to mint a coin as non contract owner");
        })

        it('should return contract owner', async function () {
            assert.equal(await this.contract.owner.call(), account_one, "Contract owner not returned properly")
        })

    });
})