pragma solidity ^0.5.0;

contract UserModel {
    uint public userID=0; //state variable will be store on the blockchain
    //string public userAddress;

    struct User{
        uint id;
        string userName;
        address payable userAddress;
        string role;
    }

    mapping(uint => User) public users;

    event UserCreated(uint id, string userName, address payable userAddress, string role);

    constructor() public {
        createUser("Manager-Account", msg.sender, "Manger");
    }

    function createUser(string memory _userName, address payable _userAddress, string memory _role) public{
        userID++;
        users[userID] = User(userID, _userName, _userAddress, _role);
        emit UserCreated(userID, _userName, _userAddress, _role);
    }

}
