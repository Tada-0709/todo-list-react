import React, {Component} from 'react';
import Identicon from 'identicon.js';


class index extends Component {

    render() {
        return (
            <div className="container-fluid mt-5">
                <div className="row">
                    <main role="main" className="col-lg-12 ml-auto mr-auto"
                          style={{maxWidth: '500px', paddingTop: '20px'}}>
                        <h2>Welcome Back, {this.props.userName}</h2>
                    </main>
                </div>
            </div>
        )
    }

}

export default index;
