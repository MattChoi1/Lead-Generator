
import React, { Component } from 'react';
import {Navbar} from 'react-bootstrap';

class Head extends Component {
    constructor(props){
      super(props);
    }
    render() {
        return (
            <div className="LogoSearch" >
                <div style={{background: "#333"}}>
                    <div style={{paddingTop:"2px"}}><a href="/"><img src="https://logdna.com/assets/images/ld-logo-square-480.png" width="35px"></img></a></div>
                </div>
            </div>
        );
    }
}

export default Head;
