import React, {Component} from 'react';
import Identicon from "identicon.js";

import {BrowserRouter as Router, Link, Route, Switch} from "react-router-dom";
import TaskManagement from "./Task-Management";
import Info from "./Info"
import UserList from "./User-List";

import Web3 from "web3";
import UserModel from "../../abis/UserModel";
import TodoList from "../../abis/TodoList";

class index extends Component {

    // render() {
    //     return (
    //         <div className="container-fluid mt-5">
    //             <Navbar account={this.props.userName} address={this.props.accountAddress}/>
    //             <div className="row">
    //                 <main role="main" className="col-lg-12 ml-auto mr-auto"
    //                       style={{maxWidth: '500px', paddingTop: '20px'}}>
    //                     <h2>Welcome Back, Manager!</h2>
    //                     <p>User Name: {this.props.userName}</p>
    //                     <p>Address: {this.props.accountAddress}</p>
    //                     <p>Avatar: <img
    //                         className='ml-2'
    //                         width='30'
    //                         height='30'
    //                         src={`data:image/png;base64,${new Identicon(this.props.accountAddress, 30).toString()}`}
    //                     /></p>
    //                 </main>
    //             </div>
    //         </div>
    //     )
    // }


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
    }

    async checkLoggedIn() {
        const web3 = window.web3
        // Load account
        const accounts = await web3.eth.getAccounts()
        this.setState({account: accounts[0]})
        // Network ID
        const networkId = await web3.eth.net.getId()
        const networkData = UserModel.networks[networkId]
        if (networkData) {
            const userModel = web3.eth.Contract(UserModel.abi, networkData.address)
            this.setState({userModel})
            const accountsLength = await userModel.methods.totalUser().call()
            this.setState({accountsLength})
            // Load Accounts
            for (let i = 1; i <= accountsLength; i++) {
                const user = await userModel.methods.users(i).call()
                if (user.userAddress === this.state.account && user.role === "Manager") {
                    this.setState({userName: user.userName})
                    this.setState({userAddress: user.userAddress})
                    console.log(this.state.userAddress)
                    //console.log(this.state.isManager+" "+this.state.userName)
                }
            }

        }
    }

    async loadTaskListData() {
        const web3 = window.web3
        // Load account
        const accounts = await web3.eth.getAccounts()
        this.setState({account: accounts[0]})
        console.log(accounts[0])
        // Network ID
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


    constructor(props) {
        super(props)
        this.state = {
            account: '',
            userModel: null,
            accountsLength: 0,
            userName: '',
            userAddress: '',
            loading: true,
            //Todo List
            todoList: null,
            tasks: [],
            taskCount: 0,
        }

        this.createTask = this.createTask.bind(this)
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
                        <UserList />
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
