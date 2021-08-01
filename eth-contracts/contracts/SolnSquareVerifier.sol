pragma solidity >=0.4.21 <0.6.0;

import "./ERC721Mintable.sol";
import "./Verifier.sol";
import "./Oraclize.sol";

//// TODO define a contract call to the zokrates generated solidity contract <Verifier> or <renamedVerifier>
//contract SquareVerifier is Verifier {
//
//}

// TODO define another contract named SolnSquareVerifier that inherits from your ERC721Mintable class
contract SolnSquareVerifier is Verifier, ERC721Mintable {

    constructor() public {
        solutions.push(Solution(0, address(0), false));
    }

    // TODO define a solutions struct that can hold an index & an address
    struct Solution {
        uint256 _index;
        address _address;
        bool _minted;
    }

    // TODO define an array of the above struct
    Solution[] solutions;

    // TODO define a mapping to store unique solutions submitted
    mapping(bytes32 => bool) private uniqueSolutions;

    // TODO Create an event to emit when a solution is added
    event SolutionAdded(uint256 index, address _address);

    // TODO Create a function to add the solutions to the array and emit the event
    function addSolution(address _address, uint256 _index, uint[2] memory a, uint[2][2] memory b, uint[2] memory c, uint[2] memory input) public {
        bytes32 key = keccak256(abi.encodePacked(a, b, c, input));
        require(uniqueSolutions[key] == false, "This solution has already been used");

        bool isVerified = verifyTx(a, b, c, input);

        require(isVerified, "Could not verify solutions");
        Solution memory solution = Solution(_index, _address, false);
        solutions.push(solution);
        uniqueSolutions[key] = true;
        emit SolutionAdded(_index, _address);
    }

    // TODO Create a function to mint new NFT only after the solution has been verified
    //  - make sure the solution is unique (has not been used before)
    //  - make sure you handle metadata as well as tokenSupply
    function mint( address _address, uint256 tokenId ) public onlyOwner returns(bool) {
        require(solutions[tokenId]._address == _address, "Address does not match solution");
        require(solutions[tokenId]._minted == false, "Token has already been minted");
        solutions[tokenId]._minted = true;
        super.mint(_address, tokenId);
        return true;
    }

}

  


























