pragma solidity ^0.5.0;
pragma experimental ABIEncoderV2;

import "./User.sol";
import "./Group.sol";
import "./Task.sol";

contract Main{

    uint public groupCount;
    mapping(uint => Group) public groups;
    //one group - has many users
    mapping(uint => uint[]) public oneGroupManyMembers;
    //one group - has many tasks
    mapping(uint => uint[]) public oneGroupManyTasks;

    uint public userCount;
    mapping(uint => User) public users;
    //one user - one group
    mapping(uint => uint) public oneUserOneGroup;
    //one user - has many tasks
    mapping(uint => uint[]) public oneUserManyTasks;

    uint public taskCount;
    mapping(uint => Task) public tasks;
    //one task - belong to one group
    mapping(uint => uint) public oneTaskOneGroup;
    //one task - belong to one user
    mapping(uint => uint) public oneTaskOneUser;

    constructor() public {
        groupCount = 0;
        createGroup("Group Default");

        userCount = 0;
        createUser("Manager0123", msg.sender, "Manager");

        taskCount = 0;
        createTask("Finish your thesis before 2nd Oct.");
    }

    event groupCreated(uint gId, string groupName, uint numberOfMember, uint numberOfTask);
    event UserCreated(uint id, string userName, address payable userAddress, string role);
    event TaskCreated(uint id, string content, bool completed, address payable createdBy, address payable completedBy);


    function createGroup(string memory _groupName) public {
        // Require valid content
        require(bytes(_groupName).length > 0);
        groupCount ++;
        groups[groupCount] = new Group(groupCount, _groupName,0,0);
        emit groupCreated(groupCount, _groupName, 0, 0);
    }

    function getGroups() view public returns(uint[] memory, string[] memory){

        uint[] memory gids = new uint[](groupCount);
        string[] memory groupNames = new string[](groupCount);

        for(uint i = 1; i <= groupCount; i++){
            Group group = groups[i];
            gids[i] = group.getId();
            groupNames[i] = group.getGroupName();
        }

        return(gids, groupNames);
    }

    function getGroupById(uint _id) view public returns(string memory groupName, uint gId, uint numberOfMember, uint numberOfTask){

        Group group = groups[_id];

        uint numOfMember = oneGroupManyMembers[_id].length;
        uint numOfTask =  oneGroupManyTasks[_id].length;

        return (group.getGroupName(), _id, numOfMember, numOfTask);
    }

    function addMember(uint _gID, uint _userID) public{
        // Group ID and User ID must be existed
        require(_gID <= groupCount && _userID <= userCount);

        oneGroupManyMembers[_gID].push(_userID);

        oneUserOneGroup[_userID] = _gID;
    }

    function addTask(uint _gID, uint _tID) public{

        require(_gID <= groupCount && _tID <= taskCount);

        oneGroupManyTasks[_gID].push(_tID);

        oneTaskOneGroup[_tID] = _gID;
    }

    function getMembers(uint _gID) view public returns(uint[] memory){

        //uint totalMember = groups[_gID].getNumberOfMember();

        uint totalMember = oneGroupManyMembers[_gID].length;

        uint[] memory ids = new uint[](totalMember);

        for (uint i = 0; i < totalMember; i++) {

            ids[i] = oneGroupManyMembers[_gID][i];

        }
        return (ids);

    }

    function getGroupByUserId(uint _uId) public view returns(uint gId){

        return oneUserOneGroup[_uId];

    }

    //////////////////////////////------User-------//////////////////////////////////////////

    function createUser(string memory _userName, address payable _userAddress, string memory _role) public {
        userCount++;
        users[userCount] = new User(userCount, _userName, _userAddress, _role);
        oneUserOneGroup[userCount] = 0;
        emit UserCreated(userCount, _userName, _userAddress, "User");
    }

    function getUserById(uint _id) public view returns (string memory userName, address payable userAddress, uint uid) {

        User user = users[_id];

        return (user.getUserName(), user.getUserAddress(), _id);

    }

    function getAvailableUser() public view returns(uint[] memory uIds){
        uint indexCount = 0;

        for(uint i = 1; i <= userCount; i++){
            if(oneUserOneGroup[i] == 0){
                indexCount++;
            }
        }

        uint[] memory _uIds = new uint[](indexCount);

        uint j = 0;
        for(uint i = 1; i <= userCount; i++){
            if(oneUserOneGroup[i] == 0){
                _uIds[j] = i;
                j++;
            }
        }

        return _uIds;
    }

    function getTest() public view returns(bool right){
        return oneUserOneGroup[1]==0;
    }

    function getByAddress(address payable _userAddress) public view returns(string memory userName, string memory userRole, uint uId){

        string memory uName;
        string memory uRole;
        uint uID;

        for(uint i = 1; i <= userCount; i++){
            User user = users[i];
            if(user.getUserAddress() == _userAddress){
                uName = user.getUserName();
                uRole = user.getUserRole();
                uID = user.getId();
            }
        }

        return (uName, uRole, uID);
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
        taskCount++;
        tasks[taskCount] = new Task(taskCount, _content, false, msg.sender, address(0));
        emit TaskCreated(taskCount, _content, false, msg.sender, address(0));
    }

    function getTaskById(uint _tId) public view returns(string memory content, uint tId, address payable createdBy, bool completed, address payable completedBy){
        Task task = tasks[_tId];
        return (task.getTaskContent(), _tId, task.getCreatedBy(), task.getCompleted(), task.getCompletedBy());
    }

    function getTasksByGroupId(uint _gId) public view returns(uint[] memory tIds){

        uint totalTask= oneGroupManyTasks[_gId].length;

        uint[] memory ids = new uint[](totalTask);

        for (uint i = 0; i < totalTask; i++) {

            ids[i] = oneGroupManyTasks[_gId][i];

        }
        return (ids);

    }

    function getAvailableTask() public view returns(uint[] memory tIds){

        uint indexCount = 0;

        for(uint i = 1; i <= taskCount; i++){
            if(oneTaskOneGroup[i] == 0){
                indexCount++;
            }
        }

        uint[] memory _tIds = new uint[](indexCount);

        uint j = 0;
        for(uint i = 1; i <= taskCount; i++){
            if(oneTaskOneGroup[i] == 0){
                _tIds[j] = i;
                j++;
            }
        }

        return _tIds;

    }

    function assignTask(uint _tId, uint _uId) public{

        require(_tId <= taskCount && _uId <= userCount);

        oneUserManyTasks[_uId].push(_tId);

        oneTaskOneUser[_tId] = _uId;
    }




}
