
import React, { Component } from 'react';
import '../style.css';
import {FormGroup, Button, Glyphicon} from 'react-bootstrap';
import ReactTable from 'react-table';
import {BootstrapTable, TableHeaderColumn, ExportCSVButton} from 'react-bootstrap-table';
import {CSVLink, CSVDownload} from 'react-csv';
import axios from 'axios';

class Body extends Component {

    constructor(props) {
        super(props);
        this.state = {
            domain: ''
            , name: ''
            , limit: ''
            , backgroundActive: "background"
            , main: "main"
            , titleShow: "title"
            , table: "result-hidden"
            , json: {}
            , emailcache: ['default']
            , searchbar: "searchbar-wrapper"
            , searching: ""
            , fixed: ""
            , smallLogo: "smallLogo"
            , hide: "hide"
        };
        this.storeValues = this.storeValues.bind(this);
        this.submitToServer = this.submitToServer.bind(this);
        this.slideMain = this.slideMain.bind(this);
        this.originalMain = this.originalMain.bind(this);
        this.resetJSOBNState = this.notSearchedYet.bind(this);
        this.grayoutWhenSearching = this.grayoutWhenSearching.bind(this);
    }

    inputFile() {
        document.getElementById('fileInput').click();
    }

    uploadFile(callback) {
        var files = document.getElementById('fileInput').files;
        if (files) {
            var file = files[0] ? files[0] : false;
            console.log(file);
            if (file) {
                var reader = new FileReader();
                reader.readAsText(file);
                reader.onload = () => {
                    console.log(reader.result);
                    axios.post('http://localhost:4000/csv', {
                        csvString: reader.result
                    })
                    .then(response => {
                        callback(response.data);
                    })
                }
            }
        }
    }

    slideMain() {
        this.setState({main: "main-active", table:"result", titleShow:"title-hidden", fixed:"fixed", hide:""});
    }

    originalMain() {
        this.setState({main: "main", titleShow:"title"})
    }

    createTables(callback) {
        const columns = [
            {Header: 'Company', accessor: 'company'},
            {Header: 'First Name', accessor: 'firstname'},
            {Header: 'Last Name', accessor: 'lastname'},
            {Header: 'Title', accessor: 'title'},
            {Header: 'Email', accessor: 'email'},
            {Header: 'Website', accessor: 'url'},
            {Header: 'Verified', accessor: 'verified'},
            {Header: 'Location', accessor: 'address'},
            {Header: 'Size', accessor: 'size'},
            {Header: 'Status', accessor: 'status'}
        ];
        var companies = {};
        Object.assign(companies, this.state.json);
        var result = [];
        for (var key in companies) {
            var data = companies[key];
            result.push(
                <div>
                    <button key={key + 'Button'} className="close" onClick={() => {
                        var object = {};
                        Object.assign(object, this.state.json);
                        console.log(key);
                        object[key] = undefined;
                        this.setState({
                            json: object
                        }, function() {
                            console.log(this.state.json);
                        })
                    }}
                    style={{position: 'absolute', right: '2.5%'}}>
                        <span aria-hidden="true">&times;</span>
                    </button>
                    <ReactTable key={key} data={data} columns={columns} defaultPageSize={data.length || 0} showPagination={false} style={{top: '12.5px', width: '90%', margin: 'auto', marginTop: '20px'}}/>
                </div>
            );
        }
        callback(result);
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
        if (this.state.emailcache.indexOf(email) === -1) {
            return true;
        }
        return false;
    }

    grayoutWhenSearching(searching) {
        console.log('Searching: ' + searching);
        if (searching) {
            this.setState({
                searching: "transparent"
            });
        } else {
            this.setState({
                searching: ""
            });
        }
    }

    submitToServer(e) {
        var clientBody = this;

        this.grayoutWhenSearching(true);

        var payload = {};
        payload.domain = this.state.domain;
        payload.name = this.state.name;
        payload.limit = this.state.limit;

        axios.post('http://localhost:4000/', {
            data: payload
        })
        .then(response => {

            var key = Object.keys(response.data);
            for(var i=0; i<response.data[key].length; i++) {
                var leadEmail = response.data[key][i].email;
                if(this.notSearchedYet(leadEmail)){
                    this.setState({
                        emailcache: [...this.state.emailcache, leadEmail]
                    })
                }
            }
            delete this.state.json[key[0]]
            var anotherOne = this.state.json
            this.setState({
                json: anotherOne
            })
            var anotherOne = Object.assign(this.state.json, response.data);
            this.setState({
                json: anotherOne
            })
            console.log('json: %j', this.state.json);
            this.grayoutWhenSearching(false);
        })
        .catch(error => {
            console.log('Error occured while getting reponse back from the server: ' + error);
        })

    }



    render() {
        const cellEditProp = {
          mode: 'click'
        };

        const columns = [
            {Header: 'Company', accessor: 'company'},
            {Header: 'First Name', accessor: 'firstname'},
            {Header: 'Last Name', accessor: 'lastname'},
            {Header: 'Title', accessor: 'title'},
            {Header: 'Email', accessor: 'email'},
            {Header: 'Website', accessor: 'url'},
            {Header: 'Verified', accessor: 'verified'},
            {Header: 'Location', accessor: 'address'},
            {Header: 'Size', accessor: 'size'},
            {Header: 'Status', accessor: 'status'}
        ];

        return (
            <div>
                <div className={this.state.main}>
                    <p className={this.state.titleShow}>LogDNA Oracle</p>
                    <form className={this.state.searchbar + ' ' + this.state.fixed} onSubmit={ (e) => {
                        e.preventDefault();
                       if (this.state.domain !== '') {
                            this.submitToServer(e);
                            this.slideMain();

                        }
                    }
                    }>
                        <FormGroup autoComplete="off">
                            <a className={this.state.smallLogo + ' ' + this.state.hide} href="/"><img src="https://logdna.com/assets/images/ld-logo-square-480.png" width="35px"></img></a>
                            <input id="domain" autoComplete="off" action="" className="search-bar" type="text" placeholder="Company Domain" onChange={this.storeValues}/>
                            <input id="name" autoComplete="off" action="" className="search-bar" type="text" placeholder="Employee Name (Optional)" onChange={this.storeValues}/>
                            <input id="limit" autoComplete="off" action="" className="search-bar limit" type="number" placeholder="Limit" onChange={this.storeValues}/>
                            <input id="fileInput" style={{display: 'none'}} type="file" onChange={ () => {
                                this.uploadFile(response => {
                                    this.slideMain();
                                    for (var key in response) {
                                        var company = response[key];
                                        for (var i = 0; i < company.length; i++) {
                                            var lead = company[i];
                                            this.setState({
                                                emailcache: [...this.state.emailcache, lead.email]
                                            });
                                        }
                                    }
                                    this.setState({
                                        json: Object.assign(this.state.json, response)
                                    });
                                    console.log(this.state.emailcache);
                                    console.log(this.state.json);
                                });
                            }}/>
                            <Button type="submit" style={{"position": "absolute", "left": "-9999px"}}><Glyphicon glyph="search"></Glyphicon></Button>
                            <Button style={{marginLeft: '20px'}} onClick={this.inputFile}> Import CSV </Button>
                            <Button style={{marginLeft: '20px'}} onClick={() => {
                                var jsonData = this.state.json;
                                axios.post('http://localhost:4000/export', {
                                    data: jsonData
                                })
                                .then(response => {
                                    console.log('Returned back from server');
                                })
                            }}> Export CSV </Button>
                        </FormGroup>
                    </form>
                </div>

                <div className={this.state.table + ' ' + this.state.searching}>
                    {Object.keys(this.state.json).map(key => {
                        var data = this.state.json[key];
                        if (data) {
                            return (
                                <div>
                                    <button key={key + 'Button'} className="close" onClick={() => {
                                        var object = {};
                                        Object.assign(object, this.state.json);
                                        delete object[key];
                                        this.setState({
                                            json: object
                                        }, () => {
                                            console.log(this.state.json);
                                        })
                                    }}
                                    style={{position: 'absolute', right: '4.75%'}}>
                                        <span aria-hidden="true">&times;</span>
                                    </button>
                                    <ReactTable key={key} data={data} columns={columns} defaultPageSize={data.length || 0} showPagination={false} style={{top: '12.5px', width: '90%', margin: 'auto', marginTop: '20px', marginBottom: '20px'}}/>
                                </div>
                            )
                        }
                    })}
                </div>
            </div>

        )
    }
}

export default Body;
