import React, {Component} from 'react';
import Identicon from "identicon.js";

class GroupTaskList extends Component{

    render() {
        return (
            <div className="container-fluid mt-5">
                &nbsp;
                <h2>My Group Task List</h2>
                &nbsp;
                <div className="row">
                    <table style={{maxWidth: "500px"}}>
                        <thead>
                        <tr>
                            <th>No.</th>
                            <th>Task ID</th>
                            <th>Content</th>
                            <th>Assign</th>
                            <th>Completed</th>
                        </tr>
                        </thead>
                        <tbody>
                        {this.props.groupTasks.map((task, key) => {
                                return (
                                    <tr key={"Row-" + key}>
                                        <td key={key + "-1"}>{key + 1}</td>
                                        <td key={key + "-2"}>{task.tId.toNumber()}</td>
                                        <td key={key + "-3"}>{task.content}</td>
                                        <td key={key + "-4"}>{task.isAssigned?task.assigneeName:"None"}</td>
                                        <td key={key + "-5"}>{task.completed?"Done":"Not Done"}</td>
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

export default GroupTaskList;
