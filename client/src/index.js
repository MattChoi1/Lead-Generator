// src/index.js
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';

import Routes from './routes';

import './index.css';
import 'react-table/react-table.css';

ReactDOM.render((
    <BrowserRouter className="container-fluid">
        <Routes />
    </BrowserRouter>
), document.getElementById('root'));
