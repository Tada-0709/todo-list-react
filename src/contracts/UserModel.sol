pragma solidity ^0.5.0;


contract UserModel {

    constructor() public {
        //by default create the deployer as the managerus
        createUser("Manager-Account", msg.sender, "Manager");
    }

    struct User{
        uint id;
        string userName;
        address payable userAddress;
        string role;
    }

    mapping(uint => User) public users;
    uint public totalUser = 0;

    event UserCreated(uint id, string userName, address payable userAddress, string role);

    function createUser(string memory _userName, address payable _userAddress, string memory _role) public{
        totalUser++;
        users[totalUser] = User(totalUser, _userName, _userAddress, _role);
        emit UserCreated(totalUser, _userName, _userAddress, _role);
    }

}

