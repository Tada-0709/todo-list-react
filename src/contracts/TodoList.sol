pragma solidity ^0.5.0;

contract TodoList {

  uint public taskCount = 0;
  mapping(uint => Task) public tasks;

  struct Task {
    uint id;
    string content;
    bool completed;
    address payable createdBy;
    address payable completedBy;
  }

  constructor() public {
    createTask("Default task");
  }

  event TaskCreated(
    uint id,
    string content,
    bool completed,
    address payable createdBy,
    address payable completedBy
  );

  event TaskCompleted(
    uint id,
    bool completed,
    address payable completedBy
  );


  function createTask(string memory _content) public {
    // Require valid content
    require(bytes(_content).length > 0);
    //increase the number of Task
    taskCount ++;
    tasks[taskCount] = Task(taskCount, _content, false, msg.sender, address(0));
    emit TaskCreated(taskCount, _content, false, msg.sender, address(0));
  }

  function toggleCompleted(uint _id) public {
    //create an instance of the stored task in the smart contract
    Task memory _task = tasks[_id];
    //update the clone
    _task.completed = true;
    _task.completedBy = msg.sender;
    //Assign the clone to stored task
    tasks[_id] = _task;
    emit TaskCompleted(_id, _task.completed, _task.completedBy);
  }

}
