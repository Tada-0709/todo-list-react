//contract GroupModel {
//
//    uint groupCount = 0;
//    mapping(uint256 => Group) groups
//
//    struct Group{
//        uint groupID;
//        string groupName;
//
//        uint numberOfTask;
//        mapping(uint => Task) groupTasks
//
//        uint numberOfMember;
//        mapping(uint => User) groupMembers
//    }
//
//    struct User{
//        uint id;
//        string userName;
//        address payable userAddress;
//        string role;
//    }
//
//
//
//    function createGroup(string memory groupName){
//        groupCount++;
//        groups[groupCount] = Group(groupCount, groupName, 0, 0)
//    }
//
//
//    function addUserToGroup(int gID, uint userID){
//
//        Group memory group = groups[gID]
//
//        group.numberOfMember++;
//
//        group.groupMembers[numberOfMember] = getUserByID(userID);
//
//        groups[gID] = group
//
//    }
//
//function addTaskToGroup(int gID, uint userID){
//
//    Group memory group = groups[gID]
//
//    group.numberOfTask++;
//
//    group.groupTasks[numberOfTask] = getUserByID(userID);
//
//    groups[gID] = group
//
//}
//
//}
