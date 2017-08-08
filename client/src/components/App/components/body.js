
import React, { Component } from 'react';
import '../style.css';
import {FormGroup, Button, Glyphicon} from 'react-bootstrap';


class Body extends Component {

    constructor(props) {
        super(props);
        this.state = {
            domain: ''
            , name: ''
            , limit: null
            , value: ''
        };
        this.storeValues = this.storeValues.bind(this);
        this.submitToServer = this.submitToServer.bind(this);
        this.changeMainClass = this.changeMainClass.bind(this);
    }

    changeMainClass(e) {
        console.log('wqeqweqweqw@@@');
        console.log('e.target: ' + e.target);
        e.target.className = "main-active";
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
        .then((responseJSON) => this.setState({value: JSON.stringify(responseJSON.result)}));
    }

    render() {

        const background = {
            "borderBottom": "1px solid #ddd"
            , "height": "600px"
        }


        var result = {
            "position": "relative"
            , "top": "40%"
            , "transform": "translateY(-50%)"
            , "transition": "top 0.5s linear"
        }

        const not_in_screen = {
            "position": "absolute"
            , "left": "-9999px"
        }

        return (
            <div style={background}>
                <div className="main-not-active">
                    <p className="title-not-active">LogDNA Oracle</p>
                    <form onSubmit={this.submitToServer}>
                        <FormGroup>
                          <input id="domain" className="search-bar" type="text" placeholder="Company Domain" onChange={this.storeValues}/>
                          <input id="name" className="search-bar" type="text" placeholder="Employee Name (Optional)" onChange={this.storeValues}/>
                          <input id="limit" className="search-bar limit" type="text" placeholder="Limit" onChange={this.storeValues}/>
                          <Button type="submit" style={not_in_screen}><Glyphicon glyph="search"></Glyphicon></Button>
                        </FormGroup>
                    </form>
                </div>
                <div style={result}>
                    <p ref="display_result" onChange={this.changeMainClass}>{this.state.value}</p>
                </div>
            </div>

        )
    }
}

export default Body;
