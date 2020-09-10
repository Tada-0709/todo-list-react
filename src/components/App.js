import React, {Component} from 'react';
import Web3 from 'web3';
import Identicon from 'identicon.js';
import './App.css';

//import abis
import Main from "../abis/Main"


//Import component
import WelcomeUser from './user-component/welcome-user'
import UserIndex from './user-component/index'
import ManagerIndex from './manager-component/index'

class App extends Component {

    async componentWillMount() {
        await this.loadWeb3()
        //await this.loadBlockchainData()
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

        // Network ID
        const networkId = await window.web3.eth.net.getId()
        const networkData = Main.networks[networkId]
        this.setState({networkData})
    }

    async checkLoggedIn() {
        const web3 = window.web3

        if (this.state.networkData) {
            const main = web3.eth.Contract(Main.abi, this.state.networkData.address)
            this.setState({main})
            const accountsLength = await main.methods.userCount().call()

            this.setState({accountsLength})

            const currentAccount = await main.methods.getByAddress(this.state.account).call()
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
        this.state.main.methods.createUser(accountName, accountAddress, "User").send({from: this.state.account})
            .once('receipt', (receipt) => {
                this.setState({loading: false})
            })
    }


    constructor(props) {
        super(props)
        this.state = {
            account: '',
            taskCount: 0,
            accountsLength: 0,
            isNewUser: true,
            userName: '',
            loading: true,
            isManager: false,
            networkData: null,
            main: null,
        }

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
