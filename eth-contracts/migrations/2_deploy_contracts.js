// migrating the appropriate contracts
var ERC721Mintable = artifacts.require("ERC721Mintable");
var Verifier = artifacts.require("Verifier");
var SolnSquareVerifier = artifacts.require("SolnSquareVerifier");

module.exports = function(deployer, accounts) {
    deployer.deploy(ERC721Mintable);
    deployer.deploy(Verifier)
    .then(() => {
        return deployer.deploy(SolnSquareVerifier, Verifier.address);
    })
};
