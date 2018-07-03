var CashFlowManagement = artifacts.require("./CashFlowManagement.sol");

console.log(CashFlowManagement);
module.exports = function(deployer) {
    deployer.deploy(CashFlowManagement);
};
