import React, {Component} from 'react';
import Identicon from "identicon.js";
import Web3 from "web3";
import {BrowserRouter as Router, Link, Route, Switch} from "react-router-dom";
//Import Component
import TaskManagement from "./Task-Management";
import Info from "./Info"
import UserList from "./User-List";
import GroupManagement from "./Group-Management";
//Import Abis
import Main from "../../abis/Main"

class index extends Component {

    constructor(props) {
        super(props)
        this.state = {
            networkData: null,
            //current account
            account: '',
            accountsLength: 0,
            userName: '',
            userAddress: '',
            //Todo List
            todoList: null,
            tasks: [],
            taskCount: 0,
            //All user
            users: [],
            loading: true,
            //Group
            groupCount: 0,
            groups: [],
            main:null,
        }

        this.createTask = this.createTask.bind(this)
        this.createGroup = this.createGroup.bind(this)
    }


    async componentWillMount() {
        await this.loadWeb3()
        await this.checkLoggedIn()
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

    async checkLoggedIn() {
        const web3 = window.web3

        if (this.state.networkData) {
            //fetch contract
            const main = web3.eth.Contract(Main.abi, this.state.networkData.address)
            this.setState({main})
            /////////////////-----User-----/////////////////
            const accountsLength = await main.methods.userCount().call()
            this.setState({accountsLength})

            const accountDetail = await main.methods.getByAddress(this.state.account).call()

            if(accountDetail.userRole === "Manager"){
                this.setState({userName: accountDetail.userName})
                this.setState({userAddress: this.state.account})
            }
            //load all account
            for (let i = 1; i <= accountsLength; i++) {
                //get registered user list
                const userInfo = await main.methods.getUserById(i).call()
                let user = {
                    userName : userInfo.userName,
                    userAddress: userInfo.userAddress
                }
                this.setState({
                    users: [...this.state.users, user]
                })

            }

            /////////////////-----Group-----/////////////////

            const groupCount = await main.methods.groupCount().call()
            this.setState({groupCount})

            for (let i = 1; i <= groupCount; i++) {
                //const task = await groupCrud.methods.tasks(i).call()
                const groupInfo = await main.methods.getGroupById(i).call()
                console.log(groupInfo)
                let numMem = groupInfo.numberOfMember.toNumber()
                let gId = groupInfo.gId.toNumber()
                let numTask = groupInfo.numberOfTask.toNumber()
                //num = num.toNumber()
                let group = {
                    groupName : groupInfo.groupName,
                    numberOfMember: numMem,
                    gId: gId,
                    numberOfTask: numTask,
                }
                this.setState({
                    groups: [...this.state.groups, group]
                })
            }

            /////////////////-----Task-----/////////////////

            const taskCount = await main.methods.taskCount().call()
            this.setState({taskCount})

            //load tasks
            for (let i = 1; i <= taskCount; i++) {
                const taskDetail = await main.methods.getTaskById(i).call()
                let task ={
                    content : taskDetail.content,
                    createdBy : taskDetail.createdBy,
                    completed: taskDetail.completed,
                    completedBy: taskDetail.completedBy
                }

                this.setState({
                          tasks: [...this.state.tasks, task]
                })

            }

        }else {
            window.alert('Network error!')
        }
    }



    //////////////////////-------Function-------//////////////////////

    createTask(content) {
        this.setState({loading: true})
        this.state.main.methods.createTask(content).send({from: this.state.account})
            .once('receipt', (receipt) => {
                this.setState({loading: false})
            })
    }

    createGroup(groupName) {
        this.setState({loading: true})
        this.state.main.methods.createGroup(groupName).send({from: this.state.account})
            .once('receipt', (receipt) => {
                this.setState({loading: false})
            })
    }



    render() {
        return <div>
            <Router>
            <nav className="navbar navbar-expand-sm navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
                <a className="text-white" style={{height: "50px", padding: "10px 0 10px 10px"}}>
                    Todo List Decentralized Application
                </a>
                    <ul className="navbar-nav px-3">

                        <li className="nav-item" style={{paddingRight:"20px"}}>
                            <Link to="/info">Info</Link>
                        </li>&nbsp;

                        <li className="nav-item" style={{paddingRight:"20px"}}>
                            <Link to="/user-list">User List</Link>
                        </li>&nbsp;

                        <li className="nav-item" style={{paddingRight:"20px"}}>
                            <Link to="/task-management">Task Management</Link>
                        </li>&nbsp;

                        <li className="nav-item">
                            <Link to="/group-management">Group Management</Link>
                        </li>
                    </ul>


                <ul className="navbar-nav ml-auto">
                    <li className="nav-item">
                        <p className="text-white" style={{marginBottom : 0, marginRight : "10px"}}>
                            Welcome,&nbsp;
                            <small id="account">{this.state.userName}</small>
                            {this.state.userAddress
                                ? <img
                                    className='ml-2'
                                    width='30'
                                    height='30'
                                    src={`data:image/png;base64,${new Identicon(this.state.userAddress, 30).toString()}`}
                                />
                                : <span></span>
                            }
                        </p>
                    </li>
                </ul>
            </nav>
                <Switch>
                    <Route path="/info">
                        <Info
                            userAddress={this.state.userAddress}
                            userName={this.state.userName}/>
                    </Route>
                    <Route path="/user-list">
                        <UserList
                            users = {this.state.users}
                        />
                    </Route>

                    <Route path="/group-management">
                        <GroupManagement
                            groups = {this.state.groups}
                            createGroup = {this.createGroup}
                        />
                    </Route>

                    <Route path="/task-management">
                        <TaskManagement
                            tasks={this.state.tasks}
                            createTask={this.createTask}/>
                    </Route>
                </Switch>
            </Router>
        </div>
    }

}

export default index;
