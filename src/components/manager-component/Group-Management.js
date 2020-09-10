import React, {Component} from 'react';


class GroupManagement extends Component {

    render() {
        return (
            <div>
                <div className="container-fluid mt-5">
                    <div className="row">
                        <main role="main" className="col-lg-12 ml-auto mr-auto" style={{maxWidth: '500px'}}>
                            <div className="content mr-auto ml-auto">
                                <p>&nbsp;</p>
                                <form onSubmit={(event) => {
                                    event.preventDefault()
                                    const groupName = this.groupName.value
                                    this.props.createGroup(groupName)
                                }}>
                                    <div className="form-group mr-sm-2">
                                        <input
                                            id="postContent"
                                            type="text"
                                            ref={(input) => {
                                                this.groupName = input
                                            }}
                                            className="form-control"
                                            placeholder="Enter Group Name..."
                                            required/>
                                    </div>
                                    <button type="submit" className="btn btn-primary btn-block">Create Group</button>
                                </form>
                            </div>
                        </main>
                    </div>
                </div>

                <div className="container-fluid mt-5" style={{maxWidth: '700px', marginLeft: '50px'}}>
                    <h2>Group List</h2>
                    <table>
                        <tr>
                            <th>ID</th>
                            <th>GroupName</th>
                            <th>NumberOfMember</th>
                            <th>Action</th>
                        </tr>
                        <tbody>
                        {this.props.groups.map((group, key) => {
                                return(
                                    <tr key={"gRow-"+key}>
                                        <td key={"gCol-"+key+"-1"}>{key+1}</td>
                                        <td key={"gCol-"+key+"-2"}>{group.groupName}</td>
                                        <td key={"gCol-"+key+"-3"}>{group.numberOfMember}</td>
                                        <td key={"gCol-"+key+"-4"}>No Action</td>
                                    </tr>
                                )
                            }
                        )
                        }
                        </tbody>
                    </table>
                </div>

            </div>
        )
    }
}

export default GroupManagement;
