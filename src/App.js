import logo from "./logo.svg";
import "./App.css";
import React from "react";
import web3 from './web3.js'
import lottery from './lottery'
 
class App extends React.Component {
  state = {
    manager:'',
    players:[],
    balance:'',
    value:'',
    message:''
  }
  async componentDidMount(){
    const manager = await lottery.methods.manager().call()
    const players = await lottery.methods.getPlayers().call()
    const balance = await web3.eth.getBalance(lottery.options.address)

    this.setState({manager,players,balance})
  }

  onSubmit = async (event) => {
    event.preventDefault()

    const accounts = await web3.eth.getAccounts()

    this.setState({message: 'Please wait your transaction being process...'})

    await lottery.methods.enter().send({
      from: accounts[0],
      value: web3.utils.toWei(this.state.value,'ether')
    })

    this.setState({message: 'You have been entered sucessfully.'})
  }

  onClick = async ()=>{
    const accounts = await web3.eth.getAccounts()

    this.setState({message: 'Please wait your transaction being process...'})

    await lottery.methods.pickWinner().send({
      from: accounts[0]
    })

    this.setState({message: 'You have been entered sucessfully.'})
  }

  render() {
    console.log(web3.version)
    return (
      <div >
        <h2> Lottery Contract</h2>
        <p> This contract is manage by: {this.state.manager}</p>
        <p>There are currently {this.state.players.length} people entered, 
        compating to win {web3.utils.fromWei(this.state.balance,'ether')} ether! </p>
        <hr/>
        <form onSubmit={this.onSubmit}>
          <h4> Wan to try Luck ?</h4>
          <label>Amount of ether to enter </label>
          <input 
          value={this.state.value}
          onChange = {event => this.setState({ value: event.target.value})}
          />
          <button>Enter</button>
        </form>
        <hr/>
        <h4>Ready to Pick Winner ?</h4>
        <button onClick={this.onClick}>Pick a winner !</button>
        <hr/>
        <h4>{this.state.message}</h4>
      </div>
    );
  }
}
export default App;