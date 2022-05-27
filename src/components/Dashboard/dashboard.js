import {Row, Col} from "react-bootstrap"
import {Schedule} from "../Schedule"
import {LearningTasks} from "../LearningTasks"
const Dashboard = (props) => {
    return (                      
        <>
            <Row>
              <Col xs={4} className="text-center">
                <h1>Today's Schedule</h1>
                <Schedule onlyDayView="true" ws={props.ws}/>
              </Col>
              <Col xs={5} className="text-center">
                <h1>Overdue learning tasks</h1> 
                <LearningTasks renderType="overdue" ws={props.ws}/>
              </Col>
              <Col className="text-center">
                <h1>Disclaimer:</h1>
                  <p>
                    This is a prototype for a learning management system.
                    It is not intended to be a full-featured learning management system.
                    This is still in development and may be subject to change. 
                    Any data submitted is not collected or stored. 
                    The source code is linked below:
                    <br/>
                    <a href="https://github.com/nslebruh/clompass-project-frontend" target="_blank" rel="noreferrer" aria-hidden="true">Frontend Website <i className="fa fa-external-link" style={{"font-size": "70%"}} aria-hidden="true"></i></a>
                    <br/>
                    <a href="https://github.com/nslebruh/clompass-project-backend/" target="_blank" rel="noreferrer" aria-hidden="true">Backend Server <i className="fa fa-external-link" style={{"font-size": "70%"}} aria-hidden="true"></i></a>
                    <br/>
                  </p>
              </Col>
            </Row>
    </>
    )
}
export default Dashboard