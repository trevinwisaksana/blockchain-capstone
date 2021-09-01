pragma solidity >=0.4.21 <0.6.0;

// TODO define a contract call to the zokrates generated solidity contract <Verifier> or <renamedVerifier>
import "./ERC721Mintable.sol";
import "./Verifier.sol";

// TODO define another contract named SolnSquareVerifier that inherits from your ERC721Mintable class
contract SolnSquareVerifier is ERC721Mintable {

    Verifier verifier;

    constructor(address verifierAddress) ERC721Mintable() public {
        verifier = Verifier(verifierAddress);
    }

    // TODO define a solutions struct that can hold an index & an address
    struct Solution {
        address submitter;
        bool isUsed;
    }

    // TODO define a mapping to store unique solutions submitted
    mapping(bytes32 => Solution) solutions;

    // TODO Create an event to emit when a solution is added
    event SolutionAdded();

    // TODO Create a function to add the solutions to the array and emit the event
    function addSolution(address submitter, uint[2] memory a, uint[2][2] memory b, uint[2] memory c, uint[2] memory input) public {
        bytes32 key = getSolutionKey(a, b, c, input);
        require(solutions[key].submitter == address(0), "Solution has already been added");

        solutions[key] = Solution(submitter, false);
        emit SolutionAdded();
    }

    // TODO Create a function to mint new NFT only after the solution has been verified
    //  - make sure the solution is unique (has not been used before)
    //  - make sure you handle metadata as well as tokenSuplly
    function mint(address to, uint256 tokenId, uint[2] memory a, uint[2][2] memory b, uint[2] memory c, uint[2] memory input) public {
        bytes32 key = getSolutionKey(a, b, c, input);
        require(solutions[key].isUsed == false, "Solution has already been used");
        require(verifier.verifyTx(a, b, c, input), "Solution is incorrect");

        solutions[key].isUsed = true;
        super.mint(to, tokenId);
    }

    function isSolutionUsed(uint[2] memory a, uint[2][2] memory b, uint[2] memory c, uint[2] memory input) public returns(bool) {
        bytes32 key = getSolutionKey(a, b, c, input);
        return solutions[key].isUsed;
    }

    function getSolutionKey(uint[2] memory a, uint[2][2] memory b, uint[2] memory c, uint[2] memory input) internal returns(bytes32) {
        return keccak256(abi.encodePacked(a, b, c, input));
    }

    function _getSolutionKey(uint[2] memory a, uint[2][2] memory b, uint[2] memory c, uint[2] memory input) public returns(bytes32) {
        return keccak256(abi.encodePacked(a, b, c, input));
    }

}
