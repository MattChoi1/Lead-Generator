
import React, { Component } from 'react';
import '../style.css';
import {FormGroup, Button, Glyphicon} from 'react-bootstrap';
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table';

class Body extends Component {

    constructor(props) {
        super(props);
        this.state = {
            domain: ''
            , name: ''
            , limit: ''
            , value: ''
            , mainClassActive: "main-not-active"
            , titleShow: "title"
            , resultOnOff: "result-hidden"
            , json: []
        };
        this.storeValues = this.storeValues.bind(this);
        this.submitToServer = this.submitToServer.bind(this);
        this.slideMain = this.slideMain.bind(this);
        this.originalMain = this.originalMain.bind(this);
        this.resetJSOBNState = this.resetJSONState.bind(this);
    }



    slideMain() {
        this.setState({mainClassActive: "main-active", titleShow:"title-hidden", resultOnOff:"result", test:[1,2,3]}, function(){
            console.log('test at index 2: ' + this.state.test);
        });

    }

    originalMain() {
        this.setState({mainClassActive: "main-not-active", titleShow:"title"})
    }


    storeValues(e) {
        var stateID = e.target.id;
        var value = e.target.value;

        if (stateID === "domain") {
            this.setState({domain: value});
        } else if (stateID === "name") {
            this.setState({name: value});
        } else if (stateID === "limit") {
            this.setState({limit: value});
        }

    }

    resetJSONState() {
        this.setState({
            json: []
        })
    }

    submitToServer(e) {
        e.preventDefault();
        fetch('http://localhost:4000/', {
            method: 'POST',
            headers: {
                'Accept': 'application/json'
                , 'Content-Type': 'application/json'
                , "domain": this.state.domain
                , "name": this.state.name
                , "limit": this.state.limit
            }
        })
        .then((response) => response.json())
        .then((responseJSON) =>
            {
                this.resetJSONState();
                var numberOfPeople = responseJSON.result.length;
                for(var i=0; i<numberOfPeople; i++) {
                    var jsonObj = {
                        priority: i
                        , firstname: responseJSON.result[i].firstname
                        , lastname: responseJSON.result[i].lastname
                        , title: responseJSON.result[i].title
                        , email: responseJSON.result[i].email
                        , website: responseJSON.companyDetails.url
                        , verified: responseJSON.result[i].validemail
                        , linkedin: responseJSON.result[i].linkedin || ' '
                        , twitter: responseJSON.result[i].twitter || ' '
                        , facebook: responseJSON.result[i].facebook || ' '
                        , address: responseJSON.companyDetails.address
                        , size: responseJSON.companyDetails.size
                        , status: responseJSON.result[i].status || ' '
                    }
                    this.setState({
                        json: [ ...this.state.json, jsonObj],
                        value: JSON.stringify(responseJSON)
                    });
                }
            }
        );
    }

    render() {

        const background = {
            "borderBottom": "1px solid #ddd"
            , "height": "600px"
        }

        const not_in_screen = {
            "position": "absolute"
            , "left": "-9999px"
        }
        console.log('DAVID: ' + JSON.stringify(this.state.json, null, 2));

        return (
            <div style={background}>
                <div className={this.state.mainClassActive}>
                    <p className={this.state.titleShow}>LogDNA Oracle</p>
                    <form onSubmit={ (e) => {
                        this.submitToServer(e);
                        this.slideMain();
                    }}>
                        <FormGroup>
                          <input id="domain" className="search-bar" type="text" placeholder="Company Domain" onChange={this.storeValues}/>
                          <input id="name" className="search-bar" type="text" placeholder="Employee Name (Optional)" onChange={this.storeValues}/>
                          <input id="limit" className="search-bar limit" type="text" placeholder="Limit" onChange={this.storeValues}/>
                          <Button type="submit" style={not_in_screen}><Glyphicon glyph="search"></Glyphicon></Button>
                        </FormGroup>
                    </form>
                </div>
                <div className={this.state.resultOnOff}>
                    <BootstrapTable data={this.state.json} striped={true} hover={true}>
                      <TableHeaderColumn width="30px" dataField="priority" isKey={true} dataAlign="center" dataSort={true}>Priority</TableHeaderColumn>
                      <TableHeaderColumn width="40px" dataAlign="center" dataField="firstname" dataSort={true}>First Name</TableHeaderColumn>
                      <TableHeaderColumn width="40px" dataAlign="center" dataField="lastname" dataSort={true} >Last Name</TableHeaderColumn>
                      <TableHeaderColumn width="80px" dataAlign="center" dataField="title" dataSort={true}>Title</TableHeaderColumn>
                      <TableHeaderColumn width="80px" dataAlign="center" dataField="email" >Email</TableHeaderColumn>
                      <TableHeaderColumn width="50px" dataAlign="center" dataField="website" >Website</TableHeaderColumn>
                      <TableHeaderColumn width="30px" dataAlign="center" dataField="verified" >O/X</TableHeaderColumn>
                      <TableHeaderColumn width="40px" dataAlign="center" dataField="linkedin" >Linkedin</TableHeaderColumn>
                      <TableHeaderColumn width="100px" dataAlign="center" dataField="address" >Address</TableHeaderColumn>
                      <TableHeaderColumn width="30px" dataAlign="center" dataField="size" dataSort={true}>Size</TableHeaderColumn>
                      <TableHeaderColumn width="30px" dataAlign="center" dataField="status" dataSort={true}>Status</TableHeaderColumn>
                    </BootstrapTable>
                </div>
            </div>

        )
    }
}

export default Body;
