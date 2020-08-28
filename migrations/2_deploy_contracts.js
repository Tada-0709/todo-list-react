let TodoList = artifacts.require("./TodoList.sol");
let UserModel = artifacts.require("./UserModel.sol");

module.exports = function(deployer) {
  deployer.deploy(TodoList);
  deployer.deploy(UserModel);
};
