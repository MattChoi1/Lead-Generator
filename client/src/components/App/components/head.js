
import React, { Component } from 'react';
import {Navbar} from 'react-bootstrap';

class Head extends Component {
    render() {
        return (
            <div className="LogoSearch" >
                <Navbar style={{background: "#fff"}}>
                    <Navbar.Header >
                      <Navbar.Brand >
                        <a href="#">LogDNA</a>
                      </Navbar.Brand>
                      <Navbar.Toggle />
                    </Navbar.Header>
                </Navbar>
            </div>
        );
    }
}

export default Head;
