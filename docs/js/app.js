App = {
    contracts: {},
    web3Provider: null,
    account: null,
    loading: false,
    tokenPrice: null,
    tokensSold: 0,
    tokenAvailable: 75000,
    init: function () {
        console.log("init....");
        return App.initWeb3();
    },
    initWeb3: function () {
        // if (typeof web3 === undefined) {
        console.log(typeof web3);
        App.web3Provider = window.ethereum;
        // let web3 = new Web3(App.web3Provider);
        // } else {
        //     App.web3Provider = new Web3().providers.HttpProvider("http://localhost:7545");
        //     let web = new Web3(App.web3Provider);
        // }
        console.log(App.web3Provider);
        App.initContracts();
    },
    initContracts: function () {
        $.getJSON("DappSales.json", function (dappSalesContract) {
            App.contracts.dappSales = TruffleContract(dappSalesContract);
            App.contracts.dappSales.setProvider(App.web3Provider);
            App.contracts.dappSales.deployed().then(function (dappSales) {
                console.log("Dappsales address", dappSales.address);
            })
        })
            .done(function () {
                $.getJSON("DappToken.json", function (dappTokenContract) {
                    App.contracts.dappToken = TruffleContract(dappTokenContract);
                    App.contracts.dappToken.setProvider(App.web3Provider);
                    App.contracts.dappToken.deployed().then(function (dappToken) {
                        console.log("DappToken address", dappToken.address);
                    })
                }).done(function () {
                    App.render();
                    App.listenForEvents();
                })
            })
    },
    listenForEvents: function () {
        console.log("testing.....");
        App.contracts.dappSales.deployed().then(function (instance) {
            let dappSalesInstance = instance;
            // dappSalesInstance.Sell({},{fromBlock:0,toBlock:'latest'}).watch(function (error ,event) {
            //     console.log("Got sell event", event, "err", error);
            //     App.render()
            // })
            dappSalesInstance.Sell().on('data', event => {
                console.log(event)
                App.render();
            });
        })
    },
    render: function () {
        if (App.loading) {
            return
        }
        App.loading = true;
        var loader = $("#loader")
        var content = $("#content")
        loader.show();
        content.hide();
        window.ethereum.request({ method: 'eth_requestAccounts' })
            .then(function (accounts) {
                App.account = accounts[0];
                console.log(App.account);
                $("#accountAddress").html("Your account: " + App.account)
            })
        App.contracts.dappSales.deployed().then(function (instance) {
            let dappSalesInstance = instance;
            dappSalesInstance.tokenPrice().then(function (tokenPrice) {
                App.tokenPrice = tokenPrice.toNumber();
                $(".token-price").html(App.tokenPrice / (10 ** 18));
            })
            dappSalesInstance.tokenSold().then(function (tokenSold) {
                App.tokensSold = tokenSold.toNumber()
                $(".token-sold").html(App.tokensSold);
                $(".token-available").html(App.tokenAvailable)
                let progressPercentage = (App.tokensSold / App.tokenAvailable) * 100
                $("#progress").css("width", progressPercentage + '%')
            })
            App.contracts.dappToken.deployed().then(function (instance) {
                let dappTokenInstance = instance;
                dappTokenInstance.balanceOf(App.account).then(function (balance) {
                    console.log("balance", balance);
                    $(".token-balance").html(balance.toNumber())
                })
            })
        })

        App.loading = false;
        loader.hide();
        content.show();
    },
    buyTokens: function () {
        var loader = $("#loader")
        var content = $("#content")
        loader.show();
        content.hide();
        var numberOfTokens = $("#numberOfTokens").val();
        App.contracts.dappSales.deployed().then(function (instance) {
            let dappSalesInstance = instance;
            dappSalesInstance.buyTokens(numberOfTokens, { from: App.account, value: numberOfTokens * App.tokenPrice, gas: 500000 })
                .then(function (result) {
                    console.log("tokens bought...");
                    $('form').trigger('reset')
                })
        })
    }
}

$(function () {
    $(window).load(function () {
        App.init();
    })
});