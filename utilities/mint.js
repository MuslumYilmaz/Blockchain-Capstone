require('dotenv').config({path: './utilities/.env'})
const HDWalletProvider = require('truffle-hdwallet-provider');
const {myProofs} = require('./myProofs.js');
const Web3 = require('web3');

const number_of_tokens_to_mint = myProofs.length;
console.log(number_of_tokens_to_mint);

const contractJson = require('../eth-contracts/build/contracts/SolnSquareVerifier.json');
const ABI = contractJson.abi;

const gasLimit = 4_000_000;

(async () => {
    let web3;
    if(process.env.NETWORK === 'development') {
        web3 = new Web3(new HDWalletProvider(process.env.MNEMONIC, "http://localhost:8545"));
    } else {
        web3 = new Web3(new HDWalletProvider(process.env.MNEMONIC, `https://${process.env.NETWORK}.infura.io/v3/${process.env.INFURA_KEY}`));
    }
    const accounts = await web3.eth.getAccounts();
    const ownerAccount = accounts[0];

    const contract = new web3.eth.Contract(ABI, process.env.CONTRACT_ADDRESS, {gasLimit: gasLimit});

    for(let tokenId = 1; tokenId < number_of_tokens_to_mint; tokenId++) {
        try {
            const currentProof = myProofs[tokenId];
            let transaction = await contract.methods.addSolution(ownerAccount, tokenId,
                currentProof.proof.a, currentProof.proof.b, currentProof.proof.c, currentProof.inputs).send({from: ownerAccount, gasLimit: gasLimit});
            console.log(`Added solution for tokenId ${tokenId} with transaction hash: ${transaction.transactionHash}`);

            transaction = await contract.methods.mint(ownerAccount, tokenId).send({from: ownerAccount, gasLimit: gasLimit});
            console.log(`Token ${tokenId} has been minted with transaction hash: ${transaction.transactionHash}`)

        } catch (error) {
            console.log(`Could not mint token: ${error}`);
        }
    }
    process.exit(0);
})();