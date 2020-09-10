pragma solidity ^0.5.0;
pragma experimental ABIEncoderV2;

import "./User.sol";
import "./Group.sol";
import "./Task.sol";

contract Main{

    uint public groupCount;
    mapping(uint => Group) public groups;
    //one group - many users
    mapping(uint => User[]) public groupMembers;

    uint public userCount;
    mapping(uint => User) public users;
    //one user - one group
    mapping(uint => Group) public userGroup;

    uint public taskCount;
    mapping(uint => Task) public tasks;

    constructor() public {
        groupCount = 0;
        createGroup("Group Default");

        userCount = 0;
        createUser("Manager0123", msg.sender, "Manager");

        taskCount = 0;
        createTask("Finish your thesis before 2nd Oct.");
    }

    event groupCreated(uint gId, string groupName, uint numberOfMember);
    event UserCreated(uint id, string userName, address payable userAddress, string role);
    event TaskCreated(uint id, string content, bool completed, address payable createdBy, address payable completedBy);


    function createGroup(string memory _groupName) public {
        // Require valid content
        require(bytes(_groupName).length > 0);
        groups[groupCount] = new Group(groupCount, _groupName,0);
        groupCount ++;
        emit groupCreated(groupCount, _groupName, 0);
    }

    function getGroups() view public returns(uint[] memory, string[] memory){

        uint[] memory gids = new uint[](groupCount);
        string[] memory groupNames = new string[](groupCount);

        for(uint i = 0; i < groupCount; i++){
            Group group = groups[i];
            gids[i] = group.getId();
            groupNames[i] = group.getGroupName();
        }

        return(gids, groupNames);
    }

    function getGroupById(uint _id) view public returns(string memory groupName, uint numberOfMember){

        Group group = groups[_id];

        return (group.getGroupName(), group.getNumberOfMember());
    }

    function addMember(uint _gID, uint _userID) public{
        // Group ID and User ID must be existed
        require(_gID < groupCount && _userID < userCount);

        string memory _userName;
        address payable _userAddress;
        (_userName, _userAddress) = getUserById(_userID);

        User user = new User(_userID, _userName, _userAddress, "User");

        groupMembers[_gID].push(user);

        Group group = groups[_gID];

        uint numOfMember = group.getNumberOfMember();
        group.setNumberOfMember(++numOfMember);

        groups[_gID] = group;
    }

    function getMembers(uint _gID) view public returns(uint[] memory){

        uint totalMember = groups[_gID].getNumberOfMember();

        uint[] memory ids = new uint[](totalMember);

        for (uint i = 0; i < totalMember; i++) {

            User user = groupMembers[_gID][i];
            ids[i] = user.getId();

        }
        return (ids);

    }

    //////////////////////////////------User-------//////////////////////////////////////////

    function createUser(string memory _userName, address payable _userAddress, string memory _role) public {
        users[userCount] = new User(userCount, _userName, _userAddress, _role);

        userCount++;

        emit UserCreated(userCount, _userName, _userAddress, "User");
    }

    function getUserById(uint _id) public view returns (string memory userName, address payable userAddress) {

        User user = users[_id];

        return (user.getUserName(), user.getUserAddress());

    }

    function getByAddress(address payable _userAddress) public view returns(string memory userName, string memory userRole){

        string memory uName;
        string memory uRole;

        for(uint i = 0; i < userCount; i++){
            User user = users[i];
            if(user.getUserAddress() == _userAddress){
                uName = user.getUserName();
                uRole = user.getUserRole();
            }
        }

        return (uName, uRole);
    }

    function update(uint _id, string memory _userName) public {
        User user = users[_id];
        //update the clone
        user.setUserName(_userName);
        users[_id] = user;
    }

    //////////////////////////////------Task-------//////////////////////////////////////////

    function createTask(string memory _content) public {
        // Require valid content
        require(bytes(_content).length > 0);
        //increase the number of Task
        tasks[taskCount] = new Task(taskCount, _content, false, msg.sender, address(0));
        taskCount++;
        emit TaskCreated(taskCount, _content, false, msg.sender, address(0));
    }

    function getTaskById(uint _tId) public view returns(string memory content, address payable createdBy, bool completed, address payable completedBy){
        Task task = tasks[_tId];
        return (task.getTaskContent(), task.getCreatedBy(), task.getCompleted(), task.getCompletedBy());
    }


}
