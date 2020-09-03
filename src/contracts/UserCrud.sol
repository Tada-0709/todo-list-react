pragma solidity ^0.5.0;
import "./User.sol";

contract UserCrud{

    uint private totalUser;
    User[] private users;

    constructor() public{
        totalUser = 0;
    }

    //////////////////////////-----------Function-------------//////////////////////////

    function create(string memory _userName, address payable _userAddress) public {
        //increase number of users in storage
        totalUser++;
        //create new user by calling constructor of User
        User user = new User(totalUser, _userName,  _userAddress, "User");
        //push it to users list
        users.push(user);
        //emit event
        emit UserCreated(totalUser, _userName, _userAddress, "User");
    }

    function getById(uint _id) public view returns (string memory) {

        User user = users[_id];

        return (user.getUserName());

    }
    //view keyword
    function getTotalUser() public view returns (uint256 length){
        return users.length;
    }

    function update(uint _id, string memory _userName) public {
        User user = users[_id];
        //update the clone
        user.setUserName(_userName);

        users[_id] = user;
    }

    function sayHello(uint _id) public returns(string memory) {
        return "hello";
    }

    //////////////////////////-----------Event-------------//////////////////////////

    event UserCreated(uint id, string userName, address payable userAddress, string role);


}
