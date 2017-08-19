
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
        this.renderEditable = this.renderEditable.bind(this);
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

    renderEditable(cellInfo) {
       return (
            <div
                style={{backgroundColor: '#fafafa '}}
                contentEditable
                suppressContentEditableWarning
                onBlur={e => {
                    var data = [...this.state.alldata];
                    data[cellInfo.index][cellInfo.column.id] = e.target.innerHTML;
                    this.setState({data}, function() {
                        console.log(data[cellInfo.index]);
                        axios.post('http://localhost:4000/lead', {
                            data: data[cellInfo.index]
                        })
                        .then(response => {
                            console.log('Worked!');
                        })
                        .catch(error => {
                            console.log('Error!');
                        })
                    });
                }}
                dangerouslySetInnerHTML={{
                   __html: this.state.alldata[cellInfo.index][cellInfo.column.id]
                }}
            />
       )
    }

    render() {
        const columns = [
            {Header: 'Company', accessor: 'company'},
            {Header: 'Name', id: 'full', accessor: d => 
                <div
                    dangerouslySetInnerHTML={{
                        __html: (d.firstname || '--') + ' ' + (d.lastname || '')
                    }}
                />
            },
            {Header: 'Title', accessor: 'title'},
            {Header: 'Email', accessor: 'email'},
            {Header: 'Website', accessor: 'url'},
            {Header: 'Verified', accessor: 'verified'},
            {Header: 'Reason', accessor: 'reason', Cell: this.renderEditable},
            {Header: 'Location', accessor: 'location'},
            {Header: 'Size', accessor: 'size'},
            {Header: 'Status', accessor: 'status'}
        ];
        const tableKey = this.props.index;
        const buttonKey = this.props.keyValue + 'button';
        console.log(this.props);
        return (

            <div>
                <button key={buttonKey} className="close" onClick={() => {
                    var object = {};
                    console.log(tableKey);
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
