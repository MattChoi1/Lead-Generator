
import React, { Component } from 'react';
import '../style.css';
import ReactTable from 'react-table';
import axios from 'axios';
import {Button} from 'react-bootstrap';

class Table extends Component {
    constructor(props) {
        super(props);
        this.state = {
            detail: false,
            noPropellerIntercom: [],
            alldata: props.data,
            keyURL: null,
        };
        this.expand = this.expand.bind(this);
        this.inPropellerIntercom = this.inPropellerIntercom.bind(this);
    }

    componentWillMount(){
        var noPropellerIntercom = [];
        var dataLength = this.state.alldata.length;
        var url = this.state.alldata[0].keyURL || 0;
        for (var i=0; i<dataLength; i++) {
            if(this.state.alldata[i].status !== 'In Propeller' && this.state.alldata[i].status !== 'In Intercom') {
                noPropellerIntercom.push(this.state.alldata[i]);
            }
        }
        this.setState({
            noPropellerIntercom: noPropellerIntercom,
            keyURL: url,
        })
    }

    expand(e) {
        var toggle = e.target.value;
        this.setState(prevState => ({
            detail: !prevState.detail,
        }));
    }

    inPropellerIntercom() {
        if (this.state.noPropellerIntercom.length === this.state.alldata.length) {
            return false;
        }
        return true;
    }

    render() {
        const columns = [
            {Header: 'Company', accessor: 'company'},
            {Header: 'First Name', accessor: 'firstname'},
            {Header: 'Last Name', accessor: 'lastname'},
            {Header: 'Title', accessor: 'title'},
            {Header: 'Email', accessor: 'email'},
            {Header: 'Website', accessor: 'url'},
            {Header: 'Verified', accessor: 'verified'},
            {Header: 'Location', accessor: 'location'},
            {Header: 'Size', accessor: 'size'},
            {Header: 'Status', accessor: 'status'}
        ];
        const tableKey = this.props.keyValue;
        const buttonKey = this.props.keyValue + 'button';
        return (

            <div>
                <button key={buttonKey} className="close" onClick={() => {
                    var object = {};
                    this.props.tableHandler(tableKey);
                }}
                style={{position: 'absolute', right: '4.25%'}}>
                    <span aria-hidden="true">&times;</span>
                </button>
                <ReactTable key={tableKey} data={(this.state.detail) ? this.state.alldata : this.state.noPropellerIntercom} columns={columns} pageSize={((this.state.detail) ? this.state.alldata.length : this.state.noPropellerIntercom.length) || 0} showPagination={false} style={{top: '12.5px', width: '90%', margin: 'auto', marginTop: '20px', marginBottom: '20px'}}/>
                { (this.inPropellerIntercom()) ? <Button onClick={this.expand} value={this.state.detail}>{this.state.keyURL} already in Propeller or Intercom. Show details </Button> : null}
            </div>
        )
    }
}
export default Table;
