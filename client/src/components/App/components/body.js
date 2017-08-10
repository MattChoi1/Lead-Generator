
import React, { Component } from 'react';
import '../style.css';
import {FormGroup, Button, Glyphicon} from 'react-bootstrap';
import {BootstrapTable, TableHeaderColumn, ExportCSVButton} from 'react-bootstrap-table';
import {CSVLink, CSVDownload} from 'react-csv';

class Body extends Component {

    constructor(props) {
        super(props);
        this.state = {
            domain: ''
            , name: ''
            , limit: ''
            , value: ''
            , backgroundActive: "background"
            , mainClassActive: "main-not-active"
            , titleShow: "title"
            , resultOnOff: "result-hidden"
            , json: []
            , emailcache: ['default']
        };
        this.storeValues = this.storeValues.bind(this);
        this.submitToServer = this.submitToServer.bind(this);
        this.slideMain = this.slideMain.bind(this);
        this.originalMain = this.originalMain.bind(this);
        this.resetJSOBNState = this.notSearchedYet.bind(this);
        this.handleExportCSVButtonClick = this.handleExportCSVButtonClick.bind(this);
        this.createCustomExportCSVButton = this.createCustomExportCSVButton.bind(this);
    }



    slideMain() {
        this.setState({mainClassActive: "main-active", titleShow:"title-hidden", resultOnOff:"result", backgroundActive:"background-active"});

    }

    originalMain() {
        this.setState({mainClassActive: "main-not-active", titleShow:"title"})
    }

    reactCSVFormatter(listOfJSONObj) {
        var whole = []
        var headers = Object.keys(this.state.json[0]);
        whole = whole.push(headers);
        var data = listOfJSONObj.map((person) => {
                var numOfHeaders = headers.length
                for (var i = 0; i<numOfHeaders; i++) {
                    person.headers[i] = person.headers[i]
                }
        }
    )}

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

    notSearchedYet(email) {
        console.log('wat: ' + this.state.emailcache.indexOf(email));
        if (this.state.emailcache.indexOf(email) === -1) {
            return true;
        }
        return false;
    }

    submitToServer(e) {
        console.log('row height: %j', e.target);
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

                var numberOfPeople = responseJSON.length;
                for (var i=0; i<numberOfPeople; i++) {
                    if (this.notSearchedYet(responseJSON[i].email)) {
                        console.log('not searched bro');
                        var jsonObj = {
                            priority: i
                            , companyname: responseJSON[i].company
                            , firstname: responseJSON[i].firstname
                            , lastname: responseJSON[i].lastname
                            , title: responseJSON[i].title
                            , email: responseJSON[i].email
                            , website: responseJSON[i].url
                            , verified: responseJSON[i].verified
                            , linkedin: responseJSON[i].linkedin || ' '
                            , twitter: responseJSON[i].twitter || ' '
                            , facebook: responseJSON[i].facebook || ' '
                            , address: responseJSON[i].location || ' '
                            , size: responseJSON[i].companySize
                            , status: responseJSON[i].status || ' '
                        }
                        this.setState({
                            emailcache: [...this.state.emailcache, responseJSON[i].email],
                            json: [ ...this.state.json, jsonObj],
                            value: JSON.stringify(responseJSON)
                        });
                    }
                }
            }
        );
    }

    handleExportCSVButtonClick = (onClick) => {
          // Custom your onClick event here,
          // it's not necessary to implement this function if you have no any process before onClick
          console.log('This is my custom function for ExportCSVButton click event');
          onClick();
    }

    createCustomExportCSVButton = (onClick) => {
      return (
        <ExportCSVButton className="exportbutton"
          btnText='CSV'
          onClick={ () => this.handleExportCSVButtonClick(onClick) }/>
      );
    }

    render() {



        const not_in_screen = {
            "position": "absolute"
            , "left": "-9999px"
        }

        const long_data = {
            "priority": "12321321"
        }
        const cellEditProp = {
          mode: 'click'
        };


        return (
            <div className={this.state.backgroundActive}>
                <div className={this.state.mainClassActive}>
                    <p className={this.state.titleShow}>LogDNA Oracle</p>
                    <form onSubmit={ (e) => {
                        e.preventDefault()
                        if (this.state.domain !== '') {
                            this.submitToServer(e);
                            this.slideMain();

                        }
                    }}>
                        <FormGroup autoComplete="off">
                          <input id="domain" autoComplete="off" action="" className="search-bar" type="text" placeholder="Company Domain" onChange={this.storeValues}/>
                          <input id="name" autoComplete="off" action="" className="search-bar" type="text" placeholder="Employee Name (Optional)" onChange={this.storeValues}/>
                          <input id="limit" autoComplete="off" action="" className="search-bar limit" type="number" placeholder="Limit" onChange={this.storeValues}/>
                          <Button type="submit" style={not_in_screen}><Glyphicon glyph="search"></Glyphicon></Button>
                        </FormGroup>
                    </form>
                </div>
                <div className={this.state.resultOnOff} >
                    <BootstrapTable className="table_wrapper" data={this.state.json} striped={true} hover={true} cellEdit={ cellEditProp }>
                      <TableHeaderColumn width="40px" editable={ false } isKey={true} dataAlign="center" dataField="companyname" dataSort={true}>Company</TableHeaderColumn>
                      <TableHeaderColumn width="40px" editable={ false } dataAlign="center" dataField="firstname" dataSort={true}>First Name</TableHeaderColumn>
                      <TableHeaderColumn width="40px" editable={ false } dataAlign="center" dataField="lastname" dataSort={true} >Last Name</TableHeaderColumn>
                      <TableHeaderColumn width="80px" editable={ false } dataAlign="center" dataField="title" dataSort={true}>Title</TableHeaderColumn>
                      <TableHeaderColumn width="80px" editable={ false } dataAlign="center" dataField="email" >Email</TableHeaderColumn>
                      <TableHeaderColumn width="50px" editable={ false } dataAlign="center" dataField="website" >Website</TableHeaderColumn>
                      <TableHeaderColumn width="30px" editable={ false } dataAlign="center" dataField="verified" >O/X</TableHeaderColumn>
                      <TableHeaderColumn width="40px" editable={ false } dataAlign="center" dataField="linkedin" >Linkedin</TableHeaderColumn>
                      <TableHeaderColumn width="100px"editable={ false }  dataAlign="center" dataField="address" thstyle={{overflow: 'scroll'}} >Address</TableHeaderColumn>
                      <TableHeaderColumn width="30px" editable={ false } dataAlign="center" dataField="size" dataSort={true}>Size</TableHeaderColumn>
                      <TableHeaderColumn width="30px" editable={{type: 'select', options: {values: ['', 'S', 'X']}}}dataAlign="center" dataField="status" dataSort={true}>Status</TableHeaderColumn>
                    </BootstrapTable>
                </div>
            </div>

        )
    }
}

export default Body;
