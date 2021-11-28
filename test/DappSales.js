const DappSales = artifacts.require("DappSales");
contract('DappSales', (accounts) => {
    it('sets Dapp token price', async () => {
        let token = await DappSales.deployed()
        let price = await token.tokenPrice()
        let tokenPrice = 1000000000000000;
        assert.equal(price, tokenPrice,'Token price is set to 0.01 ether')
    })
});