import React, { Component } from 'react';
import Web3 from 'web3';
import Identicon from 'identicon.js';
import './App.css';
import TodoList from '../abis/TodoList.json'
import Navbar from './Navbar'
import Main from './Main'

class App extends Component {

  async componentWillMount() {
    await this.loadWeb3()
    await this.loadBlockchainData()
  }

  async loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum)
      await window.ethereum.enable()
    }
    else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider)
    }
    else {
      window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
    }
  }

  async loadBlockchainData() {
    const web3 = window.web3
    // Load account
    const accounts = await web3.eth.getAccounts()
    this.setState({ account: accounts[0] })
    console.log(accounts[0])
    // Network ID
    const networkId = await web3.eth.net.getId()
    const networkData = TodoList.networks[networkId]
    if(networkData) {
      const todoList = web3.eth.Contract(TodoList.abi, networkData.address)
      this.setState({ todoList })
      const taskCount = await todoList.methods.taskCount().call()
      this.setState({ taskCount })
      // Load Tasks
      for (var i = 1; i <= taskCount; i++) {
        const task = await todoList.methods.tasks(i).call()
        this.setState({
          tasks: [...this.state.tasks, task]
        })
      }
      this.setState({ loading: false})
    } else {
      window.alert('TodoList contract not deployed to detected network.')
    }
  }

  createTask(content) {
    this.setState({ loading: true })
    this.state.todoList.methods.createTask(content).send({ from: this.state.account })
    .once('receipt', (receipt) => {
      this.setState({ loading: false })
    })
  }

  // tipPost(id, tipAmount) {
  //   this.setState({ loading: true })
  //   this.state.TodoList.methods.tipPost(id).send({ from: this.state.account, value: tipAmount })
  //   .once('receipt', (receipt) => {
  //     this.setState({ loading: false })
  //   })
  // }

  toggleCompleted(id){
    this.setState({ loading: true })
    this.state.todoList.methods.toggleCompleted(id).send({from: this.state.account})
        .once('receipt', (receipt) => {
          this.setState({ loading: false })
        })
  }

  constructor(props) {
    super(props)
    this.state = {
      account: '',
      todoList: null,
      taskCount: 0,
      tasks: [],
      loading: true
    }

    this.createTask = this.createTask.bind(this)
    this.toggleCompleted = this.toggleCompleted.bind(this)

  }

  render() {
    return (
      <div>
        <Navbar account={this.state.account} />
        { this.state.loading
          ? <div id="loader" className="text-center mt-5"><p>Loading...</p></div>
          : <Main
              tasks={this.state.tasks}
              createTask={this.createTask}
              completeTask = {this.toggleCompleted}
            />
        }
      </div>
    );
  }
}

export default App;
