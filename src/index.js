import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { Route, Link, BrowserRouter as Router } from 'react-router-dom' //import routing

const routing = (
  <Router>
    <div>
      <Route path="/:id/:tag" component={App} />
    </div>
  </Router>
)

ReactDOM.render(
  routing,
  document.getElementById('root')
);