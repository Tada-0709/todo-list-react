import React, {Component} from 'react';
import Main from "../../abis/Main";
import Web3 from "web3";

class GroupManagement extends Component {

    componentWillMount() {
        this.loadWeb3()
    }

    constructor(props) {
        super(props);
        this.state = {
            showGroupDetail: false,
            selectedGroupId: null,
            main: null,
            availableUsers: [],
            availableTasks: [],
            selectedUser: null,
            selectedTask: null,
            pickedTask: null,
            pickedUser:null,
            groupMembers: [],
            groupTasks: [],
        };
        this._onViewButtonClick = this._onViewButtonClick.bind(this);
        this.handleSelectChange = this.handleSelectChange.bind(this);
        this.handleSelectTaskChange = this.handleSelectTaskChange.bind(this);
        this.handleSelectChangeForTask =  this.handleSelectChangeForTask.bind(this);
        this.handleSelectChangeForUser = this.handleSelectChangeForUser.bind(this);
        this.handleAddMember = this.handleAddMember.bind(this);
        this.handleAddTask = this.handleAddTask.bind(this);
    }

    async loadWeb3() {
        if (window.ethereum) {
            window.web3 = new Web3(window.ethereum)
            await window.ethereum.enable()
        } else if (window.web3) {
            window.web3 = new Web3(window.web3.currentProvider)
        } else {
            window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
        }

        const accounts = await window.web3.eth.getAccounts()
        this.setState({account: accounts[0]})

        const networkId = await window.web3.eth.net.getId()
        const networkData = Main.networks[networkId]
        this.setState({networkData})
    }

    async _onViewButtonClick(groupId) {
        this.setState({
            selectedGroupId: groupId,
            groupMembers: [],
            availableUsers: [],
            availableTasks: [],
            groupTasks: [],
        });

        await this.loadData()

        this.setState({
            showGroupDetail: true
        });

    }

    handleSelectChange(event) {
        this.setState({selectedUser: event.target.value});
    }

    handleSelectTaskChange(event) {
        this.setState({selectedTask: event.target.value});
    }

    handleSelectChangeForTask(event){
        this.setState({pickedTask: event.target.value})
    }

    handleSelectChangeForUser(event){
        this.setState({pickedUser: event.target.value})
    }

    handleAddMember() {
        this.state.main.methods.addMember(this.state.selectedGroupId, this.state.selectedUser).send({from: this.state.account})
    }

    handleAddTask(){
        this.state.main.methods.addTask(this.state.selectedGroupId, this.state.selectedTask).send({from: this.state.account})
    }

    handleAssignTask(){
        this.state.main.methods.assignTask(this.state.pickedTask, this.state.pickedUser).send({from: this.state.account})
    }

    async loadData() {

        const web3 = window.web3
        if (this.state.networkData) {
            //fetch contract
            const main = web3.eth.Contract(Main.abi, this.state.networkData.address)
            this.setState({main})
            //Get available users
            const availableUserIds = await main.methods.getAvailableUser().call()
            for (let i = 0; i < availableUserIds.length; i++) {
                let user = await main.methods.getUserById(availableUserIds[i]).call()
                this.setState({
                    availableUsers: [...this.state.availableUsers, user]
                })
            }
            //Get group members
            const groupMembers = await main.methods.getMembers(this.state.selectedGroupId).call()
            for (let i = 0; i < groupMembers.length; i++) {
                let member = await main.methods.getUserById(groupMembers[i].toNumber()).call()
                this.setState({
                    groupMembers: [...this.state.groupMembers, member]
                })
            }
            console.log(this.state.groupMembers)
            //Get available Tasks
            const availableTaskIds = await main.methods.getAvailableTask().call()
            for (let i = 0; i < availableTaskIds.length; i++) {
                let task = await main.methods.getTaskById(availableTaskIds[i]).call()
                this.setState({
                    availableTasks: [...this.state.availableTasks, task]
                })
            }
            //Get Group Task
            const groupTasks = await main.methods.getTasksByGroupId(this.state.selectedGroupId).call()
            for (let i = 0; i < groupTasks.length; i++) {
                let task = await main.methods.getTaskById(groupTasks[i].toNumber()).call()
                this.setState({
                    groupTasks: [...this.state.groupTasks, task]
                })
            }

        }

    }

    GroupDetail() {

        let optionUserList = this.state.availableUsers.length > 0
            && this.state.availableUsers.map((user, i) => {
                return (
                    <option key={i} value={user.uid.toNumber()}>{user.userName}</option>
                )
            }, this);

        let optionTaskList = this.state.availableTasks.length > 0
            && this.state.availableTasks.map((task, i) => {
                return (
                    <option key={i} value={task.tId.toNumber()}>{task.content}</option>
                )
            }, this);

        let userListForAssign = this.state.groupMembers.length > 0
            && this.state.groupMembers.map((user, i)=>{
                return (
                    <option key={i} value={user.uid.toNumber()}>{user.userName}</option>
                )
            }, this);

        let taskListForAssign = this.state.groupTasks.length > 0
            && this.state.groupTasks.map((task, i)=>{
                return (
                    (task.isAssigned)?null:<option key={i} value={task.tId.toNumber()}>{task.content}</option>
                )
            }, this);

        return (
            <div className="container-fluid mt-5 col-md-6">
                <h4>Group: {this.state.selectedGroupId}</h4>
                <h4>Member List</h4>
                <div className="row" style={{marginLeft: 0}}>
                    <form onSubmit={(event) => {
                        event.preventDefault()
                        this.handleAddMember()
                    }}>
                        <label>Add Member:</label>
                        &nbsp;
                        <select onChange={this.handleSelectChange}>
                            {optionUserList}
                        </select>
                        &nbsp;
                        <button className="btn btn-primary">Add</button>
                    </form>
                </div>
                <table>
                    <thead>
                    <tr>
                        <th>No.</th>
                        <th>Member Name</th>
                        <th>Member ID</th>
                    </tr>
                    </thead>
                    <tbody>
                    {this.state.groupMembers.map((member, key) => {
                            return (
                                <tr key={"gRow-" + key}>
                                    <td key={key + "-1"}>{key + 1}</td>
                                    <td key={key + "-2"}>{member.userName}</td>
                                    <td key={key + "-3"}>{member.uid.toNumber()}</td>
                                </tr>
                            )
                        }
                    )
                    }
                    </tbody>

                </table>
                &nbsp;
                <h4>Task List</h4>
                <div className="row" style={{marginLeft: 0}}>
                    <form onSubmit={(event) => {
                        event.preventDefault()
                        this.handleAddTask()
                    }}>
                        <label>Add Task:</label>
                        &nbsp;
                        <select onChange={this.handleSelectTaskChange}>
                            {optionTaskList}
                        </select>
                        &nbsp;
                        <button className="btn btn-primary">Add</button>
                    </form>
                </div>
                <table>
                    <thead>
                    <tr>
                        <th>No.</th>
                        <th>Task Content</th>
                        <th>Completed</th>
                        <th>Assign</th>
                    </tr>
                    </thead>
                    <tbody>
                    {this.state.groupTasks.map((task, key) => {
                            return (
                                <tr key={"gRow-" + key}>
                                    <td key={key + "-1"}>{key + 1}</td>
                                    <td key={key + "-2"}>{task.content}</td>
                                    <td key={key + "-3"}>{task.completed?"Done":"Not Yet"}</td>
                                    {/*<td key={key + "-4"}>{task.tId.toNumber()}</td>*/}
                                    <td key={key + "-4"}>{task.isAssigned?task.assigneeName:"None"}</td>
                                </tr>
                            )
                        }
                    )
                    }
                    </tbody>
                </table>
                &nbsp;
                <h4>Assign Task</h4>
                <div className="row" style={{marginLeft: 0}}>
                    <form onSubmit={(event) => {
                        event.preventDefault()
                        this.handleAssignTask()
                    }}>
                        <label>Assign Task:</label>
                        &nbsp;
                        <select onChange={this.handleSelectChangeForTask}>
                            {taskListForAssign}
                        </select>
                        &nbsp;
                        <label>to User:</label>
                        &nbsp;
                        <select onChange={this.handleSelectChangeForUser}>
                            {userListForAssign}
                        </select>
                        &nbsp;
                        <button className="btn btn-primary">Add</button>
                    </form>
                </div>
            </div>



        )
    }


    render() {
        return (
            <div>
                <div className="container-fluid mt-5">
                    &nbsp;
                    <h2>Group Management</h2>
                    <div className="row" style={{marginLeft: "10px"}}>
                        <form className="row" onSubmit={(event) => {
                            event.preventDefault()
                            const groupName = this.groupName.value
                            this.props.createGroup(groupName)
                        }}>
                            <input
                                id="postContent"
                                type="text"
                                ref={(input) => {
                                    this.groupName = input
                                }}
                                className="form-control col-md-8"
                                placeholder="Enter Group Name..."
                                required/>
                            <button type="submit" className="btn btn-primary btn-block col-md-4">Create</button>
                        </form>
                    </div>
                </div>
                <div className="row">
                    <div className="container-fluid mt-5 col-md-6" style={{maxWidth: '700px', marginLeft: '10px'}}>
                        <h2>Group List</h2>
                        <table>
                            <thead>
                            <tr>
                                <th>ID</th>
                                <th>Group Name</th>
                                <th>Members</th>
                                <th>Tasks</th>
                                <th>Action</th>
                            </tr>
                            </thead>
                            <tbody>
                            {this.props.groups.map((group, key) => {
                                    return (
                                        <tr key={"gRow-" + key}>
                                            <td key={"gCol-" + key + "-1"}>{key + 1}</td>
                                            <td key={"gCol-" + key + "-2"}>{group.groupName}</td>
                                            <td key={"gCol-" + key + "-3"}>{group.numberOfMember}</td>
                                            <td key={"gCol-" + key + "-4"}>{group.numberOfTask}</td>
                                            <td key={"gCol-" + key + "-5"}>
                                                <button className="btn btn-primary"
                                                        onClick={() => this._onViewButtonClick(group.gId)}>View
                                                </button>
                                                &nbsp;
                                                {/*<button className="btn btn-primary">Add Member</button>&nbsp;*/}
                                                {/*<button className="btn btn-primary">Add Task</button>*/}

                                            </td>
                                        </tr>
                                    )
                                }
                            )
                            }
                            </tbody>
                        </table>
                    </div>
                    {
                        this.state.showGroupDetail ? this.GroupDetail() : null
                    }
                </div>
            </div>
        )
    }
}

export default GroupManagement;
