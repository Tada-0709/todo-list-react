import React, {Component} from 'react';
import './User-List.css'
class UserList extends Component{

    render() {
        return (
            <div className="container-fluid mt-5">
                <div className="row">
                    <main role="main" className="col-lg-12 ml-auto mr-auto"
                          style={{maxWidth: '500px', paddingTop: '20px'}}>
                       <h2>Registered User List</h2>
                        <table>
                            <tr>
                                <th>ID</th>
                                <th>Username</th>
                                <th>Address</th>
                                <th>Group</th>
                            </tr>
                            <tbody>
                            {this.props.users.map((user, key) => {
                                    return(
                                        <tr key={"row-"+key}>
                                            <td key={key+"-1"}>{key+1}</td>
                                            <td key={key+"-2"}>{user.userName}</td>
                                            <td key={key+"-3"}>{user.userAddress}</td>
                                            <td key={key+"-4"}>Not Assigned</td>
                                        </tr>
                                    )
                                }
                            )
                            }
                            </tbody>
                        </table>
                    </main>
                </div>
            </div>
        )

    }
}

export default UserList
