
import React, { Component } from 'react';
import '../style.css';
import ReactTable from 'react-table';
import axios from 'axios';

class Table extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: props.data,
        };
        this.expand = this.expand.bind(this);
    }

    expand() {
        //
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
                style={{position: 'absolute', right: '3.75%'}}>
                    <span aria-hidden="true">&times;</span>
                </button>
                <ReactTable key={tableKey} data={this.state.data} columns={columns} pageSize={this.state.data.length || 0} showPagination={false} style={{top: '12.5px', width: '90%', margin: 'auto', marginTop: '20px', marginBottom: '20px'}}/>
            </div>
        )
    }
}
export default Table;
