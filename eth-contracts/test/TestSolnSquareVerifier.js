var SolnSquareVerifier = artifacts.require('SolnSquareVerifier');
var Verifier = artifacts.require('Verifier');

contract('TestSolnSquareVerifier', accounts => {

    const proof = {
      "proof": {
        "a": [
          "0x01803da56c5583640816db8594f6081ff0e2e363a71cb39b2ea3375a31120b6d",
          "0x0b72a8fb22e39df97193031a1adff0b514292382a2a0f2f010b644bfe6303d07"
        ],
        "b": [
          [
            "0x210b1aa0bdb857da7679013c9c4487bc7f18f1b3930febfc1ce40f1e5c82d707",
            "0x1c218486b2c4267dd7fead92905a386ea41f42de78f41f16f1645c47444f75cb"
          ],
          [
            "0x17b6d936275e49a30b974771ad1a617521ea6c1a0122cee0be174efa85eb1e39",
            "0x2f518d9e2b8f474a438012db43eb8202f859601e266dbb1b844ce3a1c2c223b7"
          ]
        ],
        "c": [
          "0x2b6fd303284b8feb722b65b3f7dda5acfee445c10eb1d2a88736b13f7b313a7b",
          "0x14c1c568e1c8a667ca166d8c3c440a479acd49fde0abb2ddf2e2c0aad9029317"
        ]
      },
      "inputs": [
        "0x0000000000000000000000000000000000000000000000000000000000000009",
        "0x0000000000000000000000000000000000000000000000000000000000000001"
      ]
    }

    let a = proof["proof"]["a"]
    let b = proof["proof"]["b"]
    let c = proof["proof"]["c"]
    let input = proof["inputs"]

    describe('verify adding solution and minting ERC721', function () {
        before(async function () {
            let verifier = await Verifier.new({from: accounts[1]});
            this.contract = await SolnSquareVerifier.new(verifier.address, {from: accounts[0]});
        })

        // Test if a new solution can be added for contract - SolnSquareVerifier
        it('should add new solution', async function () {
            await this.contract.addSolution(accounts[2], a, b, c, input);
        })

        // Test if an ERC721 token can be minted for contract - SolnSquareVerifier
        it('should mint ERC721 token when proof is verified', async function () {
            await this.contract.mint(accounts[0], 1, a, b, c, input)

            let balance = await this.contract.balanceOf(accounts[0]);
            assert.equal(balance, 1, "The balance of the owner must be 1");
        })

        it('should not mint ERC721 token when proof is already used', async function () {
            let isError = false;

            try {
                await this.contract.mint(accounts[0], 1, a, b, c, input);
            } catch {
                isError = true;
            }

            assert.equal(isError, true, "Solution used more than once");
        })
        
    });

})
