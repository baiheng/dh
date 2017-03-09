import React from 'react'
import ReactDOM from 'react-dom'
import { Router, hashHistory, Route, IndexRoute, browserHistory } from 'react-router'
import App from './components/App'
import Account from './Pages/System/Account'


const rootRoute = {
    path: '/',
    component: App,
    indexRoute: {
        component: Account,
    },
    childRoutes: [
        require('./Login'),
        require('./Pages'),
    ]
}


ReactDOM.render(
    <Router history={hashHistory} routes={rootRoute}/>, 
    document.getElementById('app')
);