import React, {Component} from 'react';
import Identicon from "identicon.js";

class Info extends Component{

    render() {
        return (
            <div className="container-fluid mt-5">
                <div className="row">
                    <main role="main" className="col-lg-12 ml-auto mr-auto"
                          style={{maxWidth: '500px', paddingTop: '20px'}}>
                        <p>User Name: {this.props.userName}</p>
                        <p>Address: {this.props.userAddress}</p>
                        {/*<p>Avatar: <img*/}
                        {/*    className='ml-2'*/}
                        {/*    width='30'*/}
                        {/*    height='30'*/}
                        {/*    src={`data:image/png;base64,${new Identicon(this.props.userAddress, 30).toString()}`}*/}
                        {/*/></p>*/}
                    </main>
                </div>
            </div>
        )
    }

}

export default Info;
