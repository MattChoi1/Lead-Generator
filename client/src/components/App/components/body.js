
import React, { Component } from 'react';
import '../style.css';
import {FormGroup, Button, Glyphicon} from 'react-bootstrap';
import ReactTable from 'react-table';
import {CSVLink, CSVDownload} from 'react-csv';
import axios from 'axios';
import Table from './table.js';
var development = (process.env.NODE_ENV === 'development');
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
            , data: []
            , tables: []
            , keys: []
            , searchbar: "searchbar-wrapper"
            , searching: ""
            , fixed: ""
            , smallLogo: "smallLogo"
            , hide: "hide"
            , fileTooBig: false
            , loadingBubbles: false
            , noCompanyFound: false
        };
        this.storeValues = this.storeValues.bind(this);
        this.submitToServer = this.submitToServer.bind(this);
        this.slideMain = this.slideMain.bind(this);
        this.originalMain = this.originalMain.bind(this);
        this.grayoutWhenSearching = this.grayoutWhenSearching.bind(this);
        this.tableHandler = this.tableHandler.bind(this);
        this.sorryMessage = this.sorryMessage.bind(this);
        this.reset = this.reset.bind(this);
        this.noCompanyFoundMessage = this.noCompanyFoundMessage.bind(this);
    }

    inputFile() {
        document.getElementById('fileInput').click();
    }

    downloadCSV() {
        document.getElementById('csv').click();
    }
/*
    componentDidUpdate() {
        console.log('Current Data: ' + this.state.data);
        console.log('Current Tables: ' + this.state.tables);
        console.log('Current keys: ' + this.state.keys);
    }*/

    uploadFile(callback) {
        this.setState({
            fileTooBig: false
        })
        var files = document.getElementById('fileInput').files;
        if (files) {
            var file = files[0] ? files[0] : false;
            //console.log(file);
            if (file) {
                var reader = new FileReader();
                reader.readAsText(file);
                reader.onload = () => {
                    //console.log(reader.result);
                    this.grayoutWhenSearching(true);
                    axios.post((development)?'https://localhost.logdna.com/csv' : '/csv', {
                        csvString: reader.result
                    })
                    .then(response => {
                        if (response.toString().indexOf('Too Many Clearbit API Calls:') != -1) {
                            this.setState({
                                fileTooBig: true
                            })
                        }
                        this.grayoutWhenSearching(false);
                        callback(response.data);
                    })
                }
            }
        }
    }

    slideMain() {
        this.setState({main: "main-active", table:"result", titleShow:"title-hidden",  fixed:"fixed", hide:""});
    }

    originalMain() {
        this.setState({main: "main", titleShow:"title", hide:"hide", fixed:""})
    }

    createTables() {
        var newTables = [];
        for (var i = this.state.data.length - 1; i >= 0; i--) {
            var data = this.state.data[i];
            var index = i;
            var key = data[0].keyURL || data[0].keyurl;
            if (this.state.keys.indexOf(key) === -1) {
                this.setState({
                    keys: [...this.state.keys, key]
                })
            }
            newTables.push(<Table data={data} key={key} index={index} tableHandler={this.tableHandler}/>);
        }
        this.setState({
            tables: newTables
        }, function() {
            //console.log(this.state.tables);
        });
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


    grayoutWhenSearching(searching) {
        //console.log('Searching: ' + searching);
        if (searching) {
            this.setState({
                searching: "transparent",
                loadingBubbles: true
            });
        } else {
            this.setState({
                searching: "",
                loadingBubbles: false
            });
        }
    }

    reset(e) {
         this.setState({
            domain: ''
            , name: ''
            , limit: ''
            , backgroundActive: "background"
            , main: "main"
            , titleShow: "title"
            , table: "result-hidden"
            , json: {}
            , data: []
            , tables: []
            , keys: []
            , searchbar: "searchbar-wrapper"
            , searching: ""
            , fixed: ""
            , smallLogo: "smallLogo"
            , hide: "hide"
            , fileTooBig: false
        });
    }

    submitToServer(e) {
        var clientBody = this;

        this.grayoutWhenSearching(true);
        this.setState({
            fileTooBig: false
        })
        var payload = {};
        payload.domain = this.state.domain;
        payload.name = this.state.name;
        payload.limit = this.state.limit;
        axios.post((development)? 'https://localhost.logdna.com/' : '/', {
            data: payload
        })
        .then(response => {
            if (response.data.length) {
                var companyKey = response.data[0].keyURL || response.data[0].keyurl;
                if (!this.state.keys.includes(companyKey)) {
                    this.setState({
                        data: [...this.state.data, response.data]
                    }, () => {
                        this.createTables();
                    });
                }
            } else {
                this.setState({
                    noCompanyFound:true
                }, setTimeout(this.state({
                    noCompanyFound:false
                })), 3000);
            }
            this.grayoutWhenSearching(false);
        })
        .catch(error => {
            console.log('Error occured while getting reponse back from the server: ' + error);
            this.grayoutWhenSearching(false);
        })

    }

    tableHandler(index) {
        var companyKey = this.state.data[index][0].keyURL || this.state.data[index][0].keyurl;
        var indexOfKey = this.state.keys.indexOf(companyKey);
        this.state.keys.splice(indexOfKey, 1);
        this.state.data.splice(index, 1);
        this.setState({
            data: this.state.data
        }, function() {
            //console.log(this.state.data);
            this.createTables();
            if (this.state.data.length <= 0) {
                this.originalMain();
            }
        });
    }

    sorryMessage(sorry) {
        if(sorry){
            return <p> Previous file was too big. Please try a smaller file and wait for a minute. Sorry man </p>
        } else {
            return;
        }
    }
    noCompanyFoundMessage() {
        return <span> We could not find any contacts with domain </span> + this.state.domain
    }


    render() {
        const cellEditProp = {
          mode: 'click'
        };

        return (
            <div>
                <div className={this.state.main}>
                    <p className={this.state.titleShow}>LogDNA Mystic</p>
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
                            {/*<input id="name" autoComplete="off" action="" className="search-bar" type="text" placeholder="Employee Name (Optional)" onChange={this.storeValues}/>
                            <input id="limit" autoComplete="off" action="" className="search-bar limit" type="number" placeholder="Limit" onChange={this.storeValues}/>*/}
                            <input id="fileInput" style={{display: 'none'}} type="file"
                                onChange={ () => {
                                    this.uploadFile(response => {
                                        this.slideMain();

                                        for (var i = 0; i < response.length; i++) {
                                            var company = response[i];

                                            if (company[0]) {
                                                if (company[0].keyURL) {
                                                    var companyKey = company[0].keyURL
                                                } else if (response[i][0].keyurl) {
                                                    var companyKey = company[0].keyurl
                                                }
                                                if (!this.state.keys.includes(companyKey)) {
                                                    this.state.data.push(company);
                                                }
                                            }
                                        }
                                        this.setState({
                                            data: this.state.data
                                        }, () => {
                                            this.createTables();
                                        });

                                    });
                                }}
                            />
                            <a id="csv" href="/download" style={{display: 'none'}}>CSV</a>
                            <Button type="submit" style={{"position": "absolute", "left": "-9999px"}}><Glyphicon glyph="search"></Glyphicon></Button>
                            <Button style={{marginLeft: '20px'}} onClick={this.inputFile}> Import CSV </Button>
                            <Button style={{marginLeft: '20px'}} onClick={() => {
                                var jsonData = this.state.data;
                                axios.post((development)?'https://localhost.logdna.com/export' : '/export', {
                                    data: jsonData
                                })
                                .then(response => {
                                    document.getElementById('csv').click();
                                })
                            }}> Export CSV </Button>
                        </FormGroup>

                    </form>
                </div>
                <div>
                    {this.sorryMessage(this.state.fileTooBig)}
                </div>
                <div className={this.state.loadingBubbles ? "spinner" : "hide"}>
                  <div className="bounce1"></div>
                  <div className="bounce2"></div>
                  <div className="bounce3"></div>
                </div>

                <div className={this.state.noCompanyFound ? "noCompanyFoundClass" : "hide"}>
                    {this.noCompanyFoundMessage()}
                </div>

                <div className={this.state.table + ' ' + this.state.searching}>
                    {this.state.tables}
                </div>

            </div>

        )
    }
}

export default Body;
