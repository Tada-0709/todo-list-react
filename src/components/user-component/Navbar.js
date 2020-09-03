import React, {Component} from 'react';
import Identicon from '../../../node_modules/identicon.js/identicon';

class Navbar extends Component {

    render() {
        return (
            <nav className="navbar navbar-expand-sm navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
                <a className="text-white" style={{height: "50px", padding: "10px 0 10px 10px"}}>
                    Todo List Decentralized Application
                </a>
                {
                    (this.props.account !== this.props.address)?
                        <ul className="navbar-nav px-3">
                            <li className="nav-item">
                                <a className="nav-link" href="#">Account</a>
                            </li>

                            <li className="nav-item">
                                <a className="nav-link" href="#">My Task</a>
                            </li>

                            <li className="nav-item">
                                <a className="nav-link" href="#">My Group Task</a>
                            </li>
                        </ul>:null
                }
                <ul className="navbar-nav ml-auto">
                    <li className="nav-item">
                        <p className="text-white" style={{marginBottom : 0, marginRight : "10px"}}>
                            Welcome,&nbsp;
                            <small id="account">{this.props.account}</small>
                            {this.props.account
                                ? <img
                                    className='ml-2'
                                    width='30'
                                    height='30'
                                    src={`data:image/png;base64,${new Identicon(this.props.address, 30).toString()}`}
                                />
                                : <span></span>
                            }
                        </p>
                    </li>
                </ul>
            </nav>
        );
    }
}

export default Navbar;
