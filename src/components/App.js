import React, {Component} from 'react';
import Web3 from 'web3';
import Identicon from 'identicon.js';
import './App.css';

//import abis
import TodoList from '../abis/TodoList.json'
//import UserCrud from '../abis/UserCrud.json'
import UserCrud from '../abis/UserCrud.json'

import ReactDOM from 'react-dom';
import { Router, Route, Link, browserHistory, IndexRoute } from 'react-router'

//Import component
import TaskManagement from './manager-component/Task-Management'
import WelcomeUser from './user-component/welcome-user'
import UserIndex from './user-component/index'
import ManagerIndex from './manager-component/index'

class App extends Component {

    async componentWillMount() {
        await this.loadWeb3()
        await this.loadBlockchainData()
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
    }

    async loadBlockchainData() {
        const web3 = window.web3
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

    async checkLoggedIn() {
        const web3 = window.web3

        // Network ID
        const networkId = await web3.eth.net.getId()
        const networkData = UserCrud.networks[networkId]
        if (networkData) {
            const userCrud = web3.eth.Contract(UserCrud.abi, networkData.address)
            this.setState({userCrud})
            const accountsLength = await userCrud.methods.totalUser().call()

            this.setState({accountsLength})
            // Load Accounts
            // for (let i = 1; i <= accountsLength; i++) {
            //     const user = await userCrud.methods.users(i).call()
            //
            //     if (user.userAddress === this.state.account && user.role !== "Manager") {
            //         this.setState({isNewUser: false})
            //         this.setState({userName: user.userName})
            //     }
            //     if (user.userAddress === this.state.account && user.role === "Manager") {
            //         this.setState({isManager: true})
            //         this.setState({userName: user.userName})
            //         //console.log(this.state.isManager+" "+this.state.userName)
            //     }
            // }

            const currentAccount = await userCrud.methods.getByAddress(this.state.account).call()
            console.log(currentAccount);
            if(currentAccount.userRole === "User" ){
                this.setState({isNewUser: false})
                this.setState({userName: currentAccount.userName})
            }
            if(currentAccount.userRole === "Manager"){
                this.setState({isManager: true})
                this.setState({userName: currentAccount.userName})
            }

        }
    }

    createUser(accountName, accountAddress) {
        this.setState({loading: true})
        this.state.userCrud.methods.createUser(accountName, accountAddress, "User").send({from: this.state.account})
            .once('receipt', (receipt) => {
                this.setState({loading: false})
            })
    }

    createTask(content) {
        this.setState({loading: true})
        this.state.todoList.methods.createTask(content).send({from: this.state.account})
            .once('receipt', (receipt) => {
                this.setState({loading: false})
            })
    }


    toggleCompleted(id) {
        this.setState({loading: true})
        this.state.todoList.methods.toggleCompleted(id).send({from: this.state.account})
            .once('receipt', (receipt) => {
                this.setState({loading: false})
            })
    }



    constructor(props) {
        super(props)
        this.state = {
            account: '',
            todoList: null,
            UserCrud: null,
            taskCount: 0,
            accountsLength: 0,
            tasks: [],
            isNewUser: true,
            userName: '',
            loading: true,
            isManager: false
        }

        this.createTask = this.createTask.bind(this)
        //this.toggleCompleted = this.toggleCompleted.bind(this)
        this.createUser = this.createUser.bind(this)
    }

    render() {

        const loginControl = ()=>{
                if(this.state.isManager)
                    return <ManagerIndex
                        accountAddress={this.state.account}
                        userName={this.state.userName}
                    />
                if(this.state.isNewUser)
                    return <WelcomeUser
                        accountAddress={this.state.account}
                        createUser={this.createUser}
                    />
                if(!this.state.isNewUser && !this.state.isManager)
                    return <UserIndex
                        accountAddress={this.state.account}
                        userName={this.state.userName}
                    />

        }

        return (
                 <div>
                     {loginControl()}
                 </div>
        )


    }
}




export default App;
