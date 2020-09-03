let TodoList = artifacts.require("./TodoList.sol");
let UserModel = artifacts.require("./UserModel.sol");
//let UserCrud = artifacts.require("./UserCrud.sol");
//let User = artifacts.require("./User.sol");

module.exports = function(deployer) {
  deployer.deploy(TodoList);
  deployer.deploy(UserModel);
};
