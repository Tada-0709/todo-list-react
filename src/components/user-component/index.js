import React, {Component} from 'react';
import Identicon from 'identicon.js';

import {BrowserRouter as Router, Link, Route, Switch} from "react-router-dom";
import Info from "../user-component/Info";
import GroupTaskList from "./Group-Task-List";
import MyTask from "./My-Task";
// import UserList from "../manager-component/User-List";
// import GroupManagement from "../manager-component/Group-Management";
// import TaskManagement from "../manager-component/Task-Management";
import Web3 from "web3";
import Main from "../../abis/Main";


class index extends Component {

    constructor(props) {
        super(props)
        this.state = {
            networkData: null,
            //current account
            account: '',
            userName: '',
            userAddress: '',
            userGroupName:'',
            userId : 0,
            main:null,
            groupTasks: [],
        }
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

            if (accountDetail.userRole === "User") {
                this.setState({
                    userName: accountDetail.userName,
                    userAddress: this.state.account,
                    userId: accountDetail.uId,
                })
            }
            //Get group
            const groupId = await main.methods.getGroupByUserId(this.state.userId).call()
            if(groupId.toNumber() !== 0){
                const groupDetail = await main.methods.getGroupById(groupId.toNumber()).call()
                this.setState({userGroupName: groupDetail.groupName})
                //fetch data for tasks
                const taskIds = await main.methods.getTasksByGroupId(groupId.toNumber()).call()
                for(let i = 0; i < taskIds.length; i++){
                    const task = await main.methods.getTaskById(taskIds[i].toNumber()).call()
                    this.setState({
                        groupTasks: [...this.state.groupTasks, task]
                    })
                }


            } else this.setState({userGroupName: "None"})

        }
    }


    render() {
        return (

            <Router>
                <nav className="navbar navbar-expand-sm navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
                    <a className="text-white" style={{height: "50px", padding: "10px 0 10px 10px"}}>
                        Todo List Decentralized Application
                    </a>
                    <ul className="navbar-nav px-3">

                        <li className="nav-item" style={{paddingRight:"20px"}}>
                            <Link to="/user/info">Info</Link>
                        </li>&nbsp;

                        <li className="nav-item" style={{paddingRight:"20px"}}>
                            <Link to="/user/my-group-task">My Group Task</Link>
                        </li>&nbsp;

                        <li className="nav-item" style={{paddingRight:"20px"}}>
                            <Link to="/user/my-task">My Task</Link>
                        </li>&nbsp;

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
                    <Route path="/user/info">
                        <Info
                            userAddress={this.state.userAddress}
                            userName={this.state.userName}
                            userGroupName={this.state.userGroupName}
                        />
                    </Route>
                    <Route path="/user/my-group-task">
                        <GroupTaskList
                            groupTasks = {this.state.groupTasks}
                            //users = {this.state.users}
                        />
                    </Route>

                    <Route path="/user/my-task">
                        <MyTask
                            // groups = {this.state.groups}
                            // createGroup = {this.createGroup}
                        />
                    </Route>

                </Switch>
            </Router>
        )
    }

}

export default index;
