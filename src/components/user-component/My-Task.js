import React, {Component} from 'react';
import Identicon from "identicon.js";

class MyTask extends Component{

    render() {
        return (
            <div className="container-fluid mt-5">
                &nbsp;
                <h2>My Task List</h2>
                &nbsp;
                <div className="row">
                    <table style={{maxWidth: "500px"}}>
                        <thead>
                        <tr>
                            <th>No.</th>
                            <th>Content</th>
                            <th>Task ID</th>
                            <th>Completed</th>
                            <th>Action</th>
                        </tr>
                        </thead>
                        <tbody>
                        {this.props.myTasks.map((task, key) => {
                                return (
                                    <tr key={"Row-" + key}>
                                        <td key={key + "-1"}>{key + 1}</td>
                                        <td key={key + "-2"}>{task.content}</td>
                                        <td key={key + "-3"}>{task.tId.toNumber()}</td>
                                        <td key={key + "-4"}>{task.completed?"Done":"Not Done"}</td>
                                        <td key={key + "-5"}>{
                                            task.completed?null:
                                            <button className="btn btn-primary" onClick={() => this.props.completeTask(task.tId.toNumber())}>Complete</button>
                                        }
                                        </td>
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

export default MyTask;
