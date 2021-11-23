const DappToken = artifacts.require("DappToken");
contract('DappToken', (accounts) => {
    it('sets total supply upon deployment', async () => {
        let token = await DappToken.deployed()
        let supply = await token.totalSupply()
        assert.equal(supply.toNumber(), 10000, 'Sets total supply to 10000')
    })
})
