import React, {Component} from 'react';
import Identicon from 'identicon.js';
import Navbar from "./Navbar";


class welcomeUser extends Component {

    render() {
        return (
            <div className="container-fluid mt-5">
                <Navbar address={this.props.accountAddress} account={this.props.accountAddress}/>
                <div className="row">
                    <main role="main" className="col-lg-12 ml-auto mr-auto"
                          style={{maxWidth: '500px', paddingTop: '20px'}}>
                        <h2>Welcome New User!</h2>
                        <p>Your Address:&nbsp; {this.props.accountAddress} </p>
                        <p>Create an Account:</p>
                        <form onSubmit={(event) => {
                            event.preventDefault()
                            const userName = this.userName.value
                            this.props.createUser(userName, this.props.accountAddress)
                            }}>
                            <div className="form-group mr-sm-2">
                                <input
                                    id="userName"
                                    type="text"
                                    className="form-control"
                                    ref={(input) => {
                                        this.userName = input
                                    }}
                                    placeholder="Enter User Name..."
                                    required/>
                            </div>
                            <button type="submit" className="btn btn-primary btn-block">Create Account</button>
                        </form>
                    </main>
                </div>
            </div>
        )
    }

}

export default welcomeUser;
