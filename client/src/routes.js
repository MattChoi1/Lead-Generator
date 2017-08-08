
// src/routes.js
import React from 'react';
import { Switch, Route } from 'react-router-dom'

import App from './components/App';

const Routes = () => (
    <main>
        <Switch>
            <Route exact path="/" component={App} />
        </Switch>
    </main>
);

export default Routes;
