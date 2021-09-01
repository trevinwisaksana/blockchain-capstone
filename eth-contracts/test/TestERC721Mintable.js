var ERC721Mintable = artifacts.require('ERC721Mintable');

contract('TestERC721Mintable', accounts => {

    const account_one = accounts[0];
    const account_two = accounts[1];

    describe('match erc721 spec', function () {
        beforeEach(async function () {
            this.contract = await ERC721Mintable.new({from: account_one});

            // TODO: mint multiple tokens
            await this.contract.mint(account_one, 1);
            await this.contract.mint(account_two, 2);
        })

        it('should return total supply', async function () {
            let totalSupply = await this.contract.totalSupply();
            assert.equal(totalSupply, 2, "The total supply must be two");
        })

        it('should get token balance', async function () {
            let balance = await this.contract.balanceOf(account_one);
            assert.equal(balance, 1, "The balance of the owner must be 1");
        })

        // token uri should be complete i.e: https://s3-us-west-2.amazonaws.com/udacity-blockchain/capstone/1
        it('should return token uri', async function () {
            let tokenURI = await this.contract.tokenURI(1);

            let expectation = "https://s3-us-west-2.amazonaws.com/udacity-blockchain/capstone/1"
            assert.equal(tokenURI, expectation, "The token URI is not equal to what is expected");
        })

        it('should transfer token from one owner to another', async function () {
            await this.contract.approve(account_two, 1, {from: account_one})
            await this.contract.transferFrom(account_one, account_two, 1, {from: account_one});

            let accountTwoBalance = await this.contract.balanceOf(account_two);
            assert.equal(accountTwoBalance, 2, "The balance of the second account must be 2");

            let accountOneBalance = await this.contract.balanceOf(account_one);
            assert.equal(accountOneBalance, 0, "The balance of the first account must be 0");
        })
    });

    describe('have ownership properties', function () {
        beforeEach(async function () {
            this.contract = await ERC721Mintable.new({from: account_one});
        })

        it('should fail when minting when address is not contract owner', async function () {
            let accessDenied = false;

            try {
                await this.contract.mint(account_one, 3, {from: account_two});
            } catch(e) {
                accessDenied = true;
            }

            assert.equal(accessDenied, true, "Access not restricted to Contract Owner");
        })

        it('should return contract owner', async function () {
            let contractOwner = await this.contract.owner();
            assert.equal(contractOwner, account_one, "Address is not equal to Contract Owner");
        })

    });
})
