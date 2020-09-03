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
                            <tr>
                                <td>Peter</td>
                                <td>Griffin</td>
                                <td>$100</td>
                                <td>Not Assigned</td>
                            </tr>
                            <tr>
                                <td>Lois</td>
                                <td>Griffin</td>
                                <td>$150</td>
                                <td>Not Assigned</td>
                            </tr>
                        </table>
                    </main>
                </div>
            </div>
        )

    }
}

export default UserList
