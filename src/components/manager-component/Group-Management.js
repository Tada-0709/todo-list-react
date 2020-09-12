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
            selectedUser: null,
            groupMembers: [],
        };
        this._onViewButtonClick = this._onViewButtonClick.bind(this);
        this.handleSelectChange = this.handleSelectChange.bind(this);
        this.handleAddMember = this.handleAddMember.bind(this);
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
        this.setState({selectedGroupId:groupId});

        await this.loadData()

        this.setState({
            showGroupDetail: true
        });

    }

    handleSelectChange(event) {
        this.setState({selectedUser: event.target.value});

    }

    async handleAddMember(){
        await this.state.main.methods.addMember(this.state.selectedGroupId,this.state.selectedUser).send({from: this.state.account})
    }

    async loadData(){

        const web3 = window.web3
        if (this.state.networkData) {
            //fetch contract
            const main = web3.eth.Contract(Main.abi, this.state.networkData.address)
            this.setState({main})
            //Get available users
            const availableUserIds = await main.methods.getAvailableUser().call()
            for(let i = 0; i < availableUserIds.length; i++){
                let user = await main.methods.getUserById(availableUserIds[i]).call()
                this.setState({
                    availableUsers: [...this.state.availableUsers, user]
                })
            }
            //Get group members
            const groupMembers =  await main.methods.getMembers(this.state.selectedGroupId).call()
            for(let i = 0; i < groupMembers.length; i++){
                let member = await main.methods.getUserById(groupMembers[i].toNumber()).call()
                this.setState({
                    groupMembers: [...this.state.groupMembers, member]
                })
            }
            console.log(this.state.groupMembers)

        }

    }

    GroupDetail() {

        let optionList = this.state.availableUsers.length > 0
            && this.state.availableUsers.map((user, i) => {
                return (
                    <option key={i} value={user.uid.toNumber()}>{user.userName}</option>
                )
            }, this);

        return (
            <div className="container-fluid mt-5 col-md-6">
                <h4>Group: {this.state.selectedGroupId}</h4>
                <h4>Member List</h4>
                <div className="row" style={{marginLeft:0}}>
                    <form>
                        <label >Add Member:</label>
                        &nbsp;
                        <select onChange={this.handleSelectChange}>
                            {optionList}
                        </select>
                        &nbsp;
                        <button className="btn btn-primary" onClick={ async () => {await this.handleAddMember}}>Add</button>
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
                <table>
                    <thead>
                    <tr>
                        <th>No.</th>
                        <th>Task Content</th>
                        <th>Task ID</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr>
                        <td>0</td>
                        <td>dasd</td>
                        <td>2</td>
                    </tr>

                    </tbody>

                </table>
            </div>

        )
    }


    render() {
        return (
            <div>
                <div className="container-fluid mt-5">
                    &nbsp;
                    <h2>Group Management</h2>
                    <div className="row" style={{marginLeft:"10px"}}>
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
                                            <td key={"gCol-" + key + "-4"}>{group.gId}</td>
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
