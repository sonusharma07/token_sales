const DappToken = artifacts.require("DappToken");
contract('DappToken', (accounts) => {
    it('set name and symbol', async () => {
        let token = await DappToken.deployed()
        let name = await token.name()
        assert.equal(name, 'DappToken', 'Token name is DappToken')
        let symbol = await token.symbol()
        assert.equal(symbol, 'DAT', 'Token symbol is DAT')
    })
    it('sets total supply upon deployment', async () => {
        let token = await DappToken.deployed()
        let supply = await token.totalSupply()
        assert.equal(supply.toNumber(), 1000000, 'Sets total supply to 1000000')
        let balanceOfOwner = await token.balanceOf(accounts[0])
        assert.equal(balanceOfOwner.toNumber(),1000000,'Sets balance of owner to 1000000')
    })
    it('change ownership of tokens', async () => {
        let token = await DappToken.deployed();
        let success = await token.transfer.call(accounts[1], 25000, { from: accounts[0] })
        assert.equal(success, true, 'Transfer of 25k successful')
        let receipt = await token.transfer(accounts[1], 25000, { from: accounts[0] });
        assert(receipt.logs.length, 1, 'Log length is 1')
        assert(receipt.logs[0].event,'Transfer','Emit Transfer event')
        assert(receipt.logs[0].args._from, accounts[0], 'From accounts[0]')
        assert(receipt.logs[0].args._to, accounts[1], 'To accounts[1]')
        assert(receipt.logs[0].args._value, 25000, 'value 25k')
    })
})
