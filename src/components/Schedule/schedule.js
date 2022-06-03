import React from 'react';
import { 
    validateLocalStorageData, 
    getLocalStorageData,
    saveLocalStorageData,
    fetchSchedule,
    appendData,
} from "../../functions"
import Scheduler, { Resource } from 'devextreme-react/scheduler';
import { Button } from 'react-bootstrap';
import { UpdateDataPage } from '../updateData';
import "./schedule.scss"
const colours = [
    {
        id: "false",
        text: "No",
        color: "#1ca8dd"
    },
    {
        id: "true",
        text: "Yes",
        color: "#d9534f"
    }
];
const RenderAppointment = (model) => {
    return (
        <div>
            <div className="dx-scheduler-appointment-title">
                {model.appointmentData.text}
            </div>
            <div className="dx-scheduler-appointment-content-details">
                {model.appointmentData.room ? model.appointmentData.room : "No room"} - {model.appointmentData.teacher ? model.appointmentData.teacher : "No teacher given"}
                
            </div>
            <div className='dx-scheduler-appointment-content-date'>
                {new Date(model.appointmentData.startDate).toLocaleTimeString("us-en", { hour: 'numeric', minute: 'numeric', hour12: true })} - {new Date(model.appointmentData.endDate).toLocaleTimeString("us-en", { hour: 'numeric', minute: 'numeric', hour12: true })}
            </div>
            
        </div>
    )
}

export default class Schedule extends React.Component {
    constructor(props) {
        super(props);
        validateLocalStorageData()
        this.schedule_data = getLocalStorageData("schedule_data")
        console.log(this.schedule_data)
        this.schedule_url = getLocalStorageData("schedule_url")
        console.log(this.schedule_url)
        this.ws = props.ws
        this.state = {
            data: [],
            data_store: {
                new: {},
                saved: this.schedule_data,
            },
            update_data_page: false,
            schedule_url: this.schedule_url,
        }
        this.views = this.props.onlyDayView === "true" ? ["day"] : ["day", "week", "month"] 
    }
    onAppointmentClick(e) {
        console.log(e)
    }
    onAppointmentFormOpening(e) {
        const { form } = e;
        let items = form.option("items")
        console.log(items)
        let mainGroup = {
            colCountByScreen: {
                "lg": 2,
                "xs": 1
            },
            colSpan: 2,
            itemType: "group",
            items: [{
                "dataField": "text",
                "editorType": "dxTextBox",
                "label": {
                    "text": "Subject"
                }
            },
            {
                label: {
                    text: "Room"
                },
                editorType: "dxTextBox",
                dataField: "room"
            },
            {
                label: {
                    text: "Teacher"
                },
                editorType: "dxTextBox",
                dataField: "teacher"
            },
            {
                label: {
                    text: "Uid"
                },
                editorType: "dxTextBox",
                dataField: "uid"
            },
            {
                label: {
                    text: "Class changed?"
                },
                editorType: "dxSelectBox",
                editorOptions: {
                    items: colours,
                    displayExpr: "text",
                    valueExpr: "id",
                },
                dataField: "classChanged"
            },
            {
                colSpan: 2,
                itemType: "empty"
            },
            items[0].items[1], items[0].items[2]
            ],
            name: "mainGroup"
        }
        if (items[0].items.length < 8 ) {
            form.option("items", [
                mainGroup, items[1]
            ])
        }
        console.log(form.option("items"))
    }
    handleAdd = (e) => {
        let data = e.appointmentData
        let new_data = {...this.state.data_store.saved, [data.uid]: data}
        saveLocalStorageData({schedule_data: new_data})
        this.setState({data_store: {...this.state.data_store.new, saved: new_data}})
    }
    handleUpdate = (e) => {
        let data = e.appointmentData;
        let new_data = {[data.uid]: data, ...this.state.data_store.saved}
        saveLocalStorageData({schedule_data: new_data})
        this.setState({data_store: {...this.state.data_store.new, saved: new_data}})
    }
    handleDelete = (e) => {
        let data2 = this.state.data_store.new;
        let keys2 = Object.keys(data2)
        let data = {...this.state.data_store.saved}
        let keys = Object.keys(data)
        for (let i = 0; i < keys.length; i++) {
            if (e.appointmentData.uid === data[keys[i]].uid) {
                delete data[keys[i]]
            }
        }
        for (let i = 0; i < keys2.length; i++) {
            if (e.appointmentData.uid === data2[keys2[i]].uid) {
                delete data2[i]
            }
        }
        saveLocalStorageData({schedule_data: data})
        this.setState({data_store: {data2, data}})
        
    }
    handleDataPage = (value) => {
        this.setState({update_data_page: value})
    }
    handleOldData = (value) => {
        this.setState({data_store: {
            saved: {...this.state.data_store.saved, ...value}
        }})
    }
    handleUrl = (value) => {
        this.setState({schedule_url: value})
    }
    async componentDidMount () {
        let new_data;
        console.log("schedule component mounted")
        if (this.state.schedule_url !== "") {
            new_data = await fetchSchedule(this.state.schedule_url)
        }
        let x = appendData(new_data, this.state.data_store.saved)
        this.setState({
            data: x,
            data_store: {
                new: {...new_data},
                saved: this.state.data_store.saved
            }
        })

    }
    componentWillUnmount () {
        console.log("schedule component unmounting")
        console.log(this.state.schedule_url)
        saveLocalStorageData({schedule_url: this.state.schedule_url, schedule_data: this.state.data_store.saved}) 
    }
    render() {
        return (
            <React.Fragment>  
                {this.props.onlyDayView !== "true" 
                    ?   <React.Fragment>
                            <UpdateDataPage state={this.state.update_data_page} setOldData={this.handleOldData} setUrl={this.handleUrl} setDataPage={this.handleDataPage} ws={this.ws} type="schedule" />
                            <Button type="button" onClick={() => this.setState({update_data_page: true})}>Update Data</Button>
                            {this.state.schedule_url.length !== 0 ?<span>Add this calender to your own calender: <a href={this.state.schedule_url.replace("https://", "webcal://")} target="_blank" rel="noreferrer">Here <i className="fa fa-external-link" style={{"fontSize": "70%"}} aria-hidden="true"></i></a></span> : null}
                        </React.Fragment>
                    : null
                }
                
                <Scheduler
                    dataSource={this.state.data}
                    appointmentRender={RenderAppointment}
                    timeZone={"Australia/Melbourne"}
                    views={this.views}
                    showAllDayPanel={false}
                    height={this.props.onlyDayView !== "true" ? 635 : 579}
                    cellDuration={45}
                    editing={true}
                    startDayHour={8}
                    endDayHour={15.5}
                    showCurrentTimeIndicator={true}
                    onAppointmentFormOpening={this.onAppointmentFormOpening}
                    onAppointmentAdded={this.handleAdd}
                    onAppointmentDeleted={this.handleDelete}
                    onAppointmentUpdated={this.handleUpdate}
                    onAppointmentClick={this.onAppointmentClick}
                    //adaptivityEnabled={true}
                    defaultCurrentView={this.props.onlyDayView === "true" ? "day" : "week"}
                    defaultCurrentDate={new Date()}
                >
                    <Resource
                        dataSource={colours}
                        fieldExpr={"classChanged"}
                        label={'Class Changed?'}
                        useColorAsDefault={true}
                    />
                </Scheduler>
            </React.Fragment>
        )
    }
}