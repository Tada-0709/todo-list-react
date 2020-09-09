pragma solidity ^0.5.0;

import "./User.sol";

contract UserCrud{

    uint public totalUser;
    mapping(uint => User) public users;

    constructor() public{
        totalUser = 0;
        //by default create the deployer as the managers
        createUser("Manager123", msg.sender, "Manager");
    }

    //////////////////////////-----------Function-------------//////////////////////////

    function createUser(string memory _userName, address payable _userAddress, string memory _role) public {
//        //increase number of users in storage
//
//        //create new user by calling constructor of User
//        User user = new User(totalUser, _userName,  _userAddress, "User");
//        //push it to users list
//        users.push(user);
//        //emit event

        users[totalUser] = new User(totalUser, _userName, _userAddress, _role);

        totalUser++;

        emit UserCreated(totalUser, _userName, _userAddress, "User");
    }

    function getUserById(uint _id) public view returns (string memory userName, address payable userAddress) {

        User user = users[_id];

        return (user.getUserName(), user.getUserAddress());

    }

    function getByAddress(address payable _userAddress) public view returns(string memory userName, string memory userRole){

        string memory uName;
        string memory uRole;

        for(uint i = 0; i < totalUser; i++){
                User user = users[i];
                if(user.getUserAddress() == _userAddress){
                    uName = user.getUserName();
                    uRole = user.getUserRole();
                }
        }

        return (uName, uRole);
    }

//    function getTotalUser() public view returns (uint256 numberOfUser){
//        return users.length;
//    }

    function update(uint _id, string memory _userName) public {
        User user = users[_id];
        //update the clone
        user.setUserName(_userName);

        users[_id] = user;
    }

    //////////////////////////-----------Event-------------//////////////////////////

    event UserCreated(uint id, string userName, address payable userAddress, string role);


}
