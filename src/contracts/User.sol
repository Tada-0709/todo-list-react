pragma solidity ^0.5.0;

contract User{

    uint id;
    string private userName;
    address payable private userAddress;
    string role;

    constructor(uint _id, string memory _userName, address payable _userAddress, string memory _role) public payable {
        id = _id;
        userName = _userName;
        userAddress = _userAddress;
        role = _role;
    }

    function setId(uint _id) public {
        id = _id;
    }

    function getId() public view returns(uint) {
        return id;
    }

    function setUserName(string memory _userName) public {
        userName = _userName;
    }

    function getUserName() public view returns(string memory) {
        return userName;
    }

    function setUserAddress(address payable _userAddress) public {
        userAddress = _userAddress;
    }

    function getUserAddress() public view returns(address payable) {
        return userAddress;
    }

    function setUserRole(string memory _role) public{
        role = _role;
    }

    function getUserRole() public view returns(string memory){
        return role;
    }

}
