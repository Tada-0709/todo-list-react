import React, {Component} from 'react';
import Identicon from "identicon.js";

import {BrowserRouter as Router, Link, Route, Switch} from "react-router-dom";
import TaskManagement from "./Task-Management";
import Info from "./Info"
import UserList from "./User-List";

import Web3 from "web3";
import UserCrud from "../../abis/UserCrud";
import TodoList from "../../abis/TodoList";

class index extends Component {


    constructor(props) {
        super(props)
        this.state = {
            networkData: null,
            //current account
            account: '',
            userCrud: null,
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

        }

        this.createTask = this.createTask.bind(this)
    }


    async componentWillMount() {
        await this.loadWeb3()
        await this.checkLoggedIn()
        await this.loadTaskListData()
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
        const networkData = UserCrud.networks[networkId]
        this.setState({networkData})
    }

    async checkLoggedIn() {
        const web3 = window.web3

        if (this.state.networkData) {
            //fetch contract
            const userCrud = web3.eth.Contract(UserCrud.abi, this.state.networkData.address)
            this.setState({userCrud})

            const accountsLength = await userCrud.methods.totalUser().call()
            this.setState({accountsLength})

            const accountDetail = await userCrud.methods.getByAddress(this.state.account).call()

            if(accountDetail.userRole === "Manager"){
                this.setState({userName: accountDetail.userName})
                this.setState({userAddress: this.state.account})
            }

            for (let i = 0; i < accountsLength; i++) {
                //get registered user list
                const userInfo = await userCrud.methods.getUserById(i).call()
                let user = {
                    userName : userInfo.userName,
                    userAddress: userInfo.userAddress
                }
                this.setState({
                    users: [...this.state.users, user]
                })

            }
        }else {
            window.alert('Network error!')
        }
    }

    async loadTaskListData() {
        const web3 = window.web3

        const networkId = await web3.eth.net.getId()
        const networkData = TodoList.networks[networkId]
        if (networkData) {
            const todoList = web3.eth.Contract(TodoList.abi, networkData.address)
            this.setState({todoList})
            const taskCount = await todoList.methods.taskCount().call()

            this.setState({taskCount})

            // Load Tasks
            for (var i = 1; i <= taskCount; i++) {
                const task = await todoList.methods.tasks(i).call()
                this.setState({
                    tasks: [...this.state.tasks, task]
                })
            }
            this.setState({loading: false})
        } else {
            window.alert('TodoList contract not deployed to detected network.')
        }
    }

    createTask(content) {
        this.setState({loading: true})
        this.state.todoList.methods.createTask(content).send({from: this.state.account})
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
