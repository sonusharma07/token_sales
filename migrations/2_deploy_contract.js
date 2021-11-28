const DappToken = artifacts.require("DappToken");
const DappSales = artifacts.require("DappSales");
module.exports = function (deployer) {
    deployer.deploy(DappToken, 1000000).then(async (dappToken) => {
        //0.001 ether
        let tokenPrice = 1000000000000000;
        await deployer.deploy(DappSales, dappToken.address, tokenPrice)
    });
};

/**
 * Manual : transfer 75% of total tokens to DappSales address
 */