
import React, { Component } from 'react';
import '../style.css';
import {FormGroup, Button, Glyphicon} from 'react-bootstrap';
import ReactTable from 'react-table';
import {CSVLink, CSVDownload} from 'react-csv';
import axios from 'axios';
import Table from './table.js';

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
            , emailcache: ['default']
            , searchbar: "searchbar-wrapper"
            , searching: ""
            , fixed: ""
            , smallLogo: "smallLogo"
            , hide: "hide"
            , waitAMinute: false
        };
        this.storeValues = this.storeValues.bind(this);
        this.submitToServer = this.submitToServer.bind(this);
        this.slideMain = this.slideMain.bind(this);
        this.originalMain = this.originalMain.bind(this);
        this.resetJSOBNState = this.notSearchedYet.bind(this);
        this.grayoutWhenSearching = this.grayoutWhenSearching.bind(this);
        this.tableHandler = this.tableHandler.bind(this);
        this.sorryMessage = this.sorryMessage.bind(this);
        this.reset = this.reset.bind(this);
    }

    inputFile() {
        document.getElementById('fileInput').click();
    }

    downloadCSV() {
        document.getElementById('csv').click();
    }

    uploadFile(callback) {
        this.setState({
            waitAMinute: false
        })
        var files = document.getElementById('fileInput').files;
        if (files) {
            var file = files[0] ? files[0] : false;
            console.log(file);
            if (file) {
                var reader = new FileReader();
                reader.readAsText(file);
                reader.onload = () => {
                    console.log(reader.result);
                    this.grayoutWhenSearching(true);
                    axios.post('/csv', {
                        csvString: reader.result
                    })
                    .then(response => {
                        if (response.toString().indexOf('Too Many Clearbit API Calls:') != -1) {
                            this.setState({
                                waitAMinute: true
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
                this.state.keys.push(key);
            }
            newTables.push(<Table data={data} key={key} index={index} tableHandler={this.tableHandler}/>);
        }
        this.setState({
            tables: newTables
        }, function() {
            console.log(this.state.tables);
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
            , emailcache: ['default']
            , searchbar: "searchbar-wrapper"
            , searching: ""
            , fixed: ""
            , smallLogo: "smallLogo"
            , hide: "hide"
            , waitAMinute: false
        });
        console.log('RESETTED');
    }

    submitToServer(e) {
        var clientBody = this;

        this.grayoutWhenSearching(true);
        this.setState({
            waitAMinute: false
        })
        var payload = {};
        payload.domain = this.state.domain;
        payload.name = this.state.name;
        payload.limit = this.state.limit;
        axios.post('/', {
            data: payload
        })
        .then(response => {
            console.log(response.data);
            for(var i=0; i<response.data.length; i++) {
                var leadEmail = response.data[i].email;
                if(this.notSearchedYet(leadEmail)){
                    this.setState({
                        emailcache: [...this.state.emailcache, leadEmail]
                    })
                }
            }
            // delete this.state.json[key[0]]
            // var anotherOne = this.state.json
            // this.setState({
            //     json: anotherOne
            // })
            // var anotherOne = Object.assign(this.state.json, response.data);
            // this.setState({
            //     json: anotherOne
            // })
            // console.log('json: %j', this.state.json);
            if (response.data.length) {
                var companyKey = response.data[0].keyURL || response.data[0].keyurl;
                if (!this.state.keys.includes(companyKey)) {
                    this.state.data.push(response.data);
                }
            }
            this.setState({
                data: this.state.data
            }, () => {
                console.log(this.state.data);
                this.createTables();
            });
            this.grayoutWhenSearching(false);
        })
        .catch(error => {
            console.log('Error occured while getting reponse back from the server: ' + error);
            this.grayoutWhenSearching(false);
        })

    }

    tableHandler(index) {
        console.log(index);
        var companyKey = this.state.data[index][0].keyURL || this.state.data[index][0].keyurl;
        var indexOfKey = this.state.keys.indexOf(companyKey);
        this.state.keys.splice(indexOfKey, 1);
        this.state.data.splice(index, 1);
        this.setState({
            data: this.state.data
        }, function() {
            console.log(this.state.data);
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
                            <input id="name" autoComplete="off" action="" className="search-bar" type="text" placeholder="Employee Name (Optional)" onChange={this.storeValues}/>
                            <input id="limit" autoComplete="off" action="" className="search-bar limit" type="number" placeholder="Limit" onChange={this.storeValues}/>
                            <input id="fileInput" style={{display: 'none'}} type="file"
                                onChange={ () => {
                                    this.uploadFile(response => {
                                        this.slideMain();
                                        console.log(response);
                                         // for (var key in response) {
                                        //     var company = response[key];
                                        //     for (var i = 0; i < company.length; i++) {
                                        //         var lead = company[i];
                                        //         this.setState({
                                        //             emailcache: [...this.state.emailcache, lead.email]
                                        //         });
                                        //     }
                                        // }
                                        for (var i = 0; i < response.length; i++) {
                                            var company = response[i];

                                            for (var j = 0; j < company.length; j++) {
                                                var lead = company[j];
                                                this.setState({
                                                    emailcache: [...this.state.emailcache, lead.email]
                                                })
                                            }
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
                                            console.log(this.state.data);
                                            this.createTables();
                                        });
                                        // this.setState({
                                        //     json: Object.assign(this.state.json, response)
                                        // });
                                        console.log(this.state.emailcache);
                                        // console.log(this.state.json);
                                    });
                                }}
                            />
                            <a id="csv" href="/download" style={{display: 'none'}}>CSV</a>
                            <Button type="submit" style={{"position": "absolute", "left": "-9999px"}}><Glyphicon glyph="search"></Glyphicon></Button>
                            <Button style={{marginLeft: '20px'}} onClick={this.inputFile}> Import CSV </Button>
                            <Button style={{marginLeft: '20px'}} onClick={() => {
                                var jsonData = this.state.data;
                                axios.post('/export', {
                                    data: jsonData
                                })
                                .then(response => {
                                    document.getElementById('csv').click();
                                })
                            }}> Export CSV </Button>
                            <Button onClick={this.reset}> Refresh </Button>
                        </FormGroup>
                    </form>
                </div>
                <div>
                    {this.sorryMessage(this.state.waitAMinute)}
                </div>
                <div className={this.state.table + ' ' + this.state.searching}>
                    {this.state.tables}
                </div>

            </div>

        )
    }
}

export default Body;
