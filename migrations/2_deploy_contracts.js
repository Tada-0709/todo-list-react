let TodoList = artifacts.require("./TodoList.sol");
let UserModel = artifacts.require("./UserModel.sol");
let UserCrud = artifacts.require("./UserCrud.sol");
let GroupCrud = artifacts.require("./GroupCrud.sol");


module.exports = function(deployer) {
  deployer.deploy(TodoList);
  deployer.deploy(UserModel);
  deployer.deploy(UserCrud);
  deployer.deploy(GroupCrud);
};
