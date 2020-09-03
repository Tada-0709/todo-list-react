import React, {Component} from 'react';
import Identicon from '../../../node_modules/identicon.js/identicon';
import TodoList from "../../abis/TodoList";

class TaskManagement extends Component {


    render() {
        return (
            <div className="container-fluid mt-5">
                <div className="row">
                    <main role="main" className="col-lg-12 ml-auto mr-auto" style={{maxWidth: '500px'}}>
                        <div className="content mr-auto ml-auto">
                            <p>&nbsp;</p>
                            <form onSubmit={(event) => {
                                event.preventDefault()
                                const content = this.taskContent.value
                                this.props.createTask(content)
                            }}>
                                <div className="form-group mr-sm-2">
                                    <input
                                        id="postContent"
                                        type="text"
                                        ref={(input) => {
                                            this.taskContent = input
                                        }}
                                        className="form-control"
                                        placeholder="Enter task content..."
                                        required/>
                                </div>
                                <button type="submit" className="btn btn-primary btn-block">Create Task</button>
                            </form>
                            <p>&nbsp;</p>
                            {this.props.tasks.map((task, key) => {
                                return (
                                    <div className="card mb-4" key={key}>
                                        <div className="card-header" >
                                            <p style={{marginBottom : 0}}>{task.content}</p>
                                        </div>
                                        <ul id="taskList" className="list-group list-group-flush">
                                            <li className="list-group-item">
                                                <small style={{fontWeight : "bold"}}>
                                                    Created By:
                                                    &nbsp;
                                                </small>
                                                <img
                                                    className='mr-2'
                                                    width='30'
                                                    height='30'
                                                    src={`data:image/png;base64,${new Identicon(task.createdBy, 30).toString()}`}
                                                />
                                                <small className="text-muted">{task.createdBy}</small>
                                            </li>
                                            {
                                                task.completed ?
                                                    <li className="list-group-item">
                                                    <small numberOfLines={1} style={{fontWeight : "bold"}}>
                                                        Checked By:
                                                        &nbsp;
                                                    </small>
                                                    <img
                                                        className='mr-2'
                                                        width='30'
                                                        height='30'
                                                        src={`data:image/png;base64,${new Identicon(task.completedBy, 30).toString()}`}
                                                    />
                                                    <small className="text-muted">{task.completedBy}</small>
                                                    </li>
                                                    :<li style={{display: 'none'}}>Nothing to Show !!!</li>
                                            }

                                        </ul>
                                    </div>
                                )
                            })}
                        </div>
                    </main>
                </div>
            </div>
        );
    }


}

export default TaskManagement;
