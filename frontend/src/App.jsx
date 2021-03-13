// eslint-disable
import React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import jwtDecode from 'jwt-decode';
import store from './redux/store';
import { clearErrors, setCurrentUser } from './redux/actions/authActions';
import setAuthToken from './utils/setAuthToken';
import Welcome from './components/layout/Welcome';
import Home from './components/layout/Home';
import Navigation from './components/layout/Navigation';
import Register from './components/auth/Register';
import Login from './components/auth/Login';
import PrivateRoute from './components/auth/PrivateRoute';
import './styles/app.css';

function App() {

  if (localStorage.jwtToken) {
    let token = localStorage.jwtToken;
    setAuthToken(token);
    let decoded = jwtDecode(token);
    store.dispatch(clearErrors());
    store.dispatch(setCurrentUser(decoded));
  }

  return (
    <Provider store={ store }>
      <Router>
        <Navigation />
          <Switch>
            <Route path='/' exact component={ Welcome } />
            <PrivateRoute path='/notes' exact component={ Home } />
            <PrivateRoute path='/notes/:id' exact component={ Home } />
            <Route path='/register' exact component={ Register } />
            <Route path='/login' exact component={ Login } />
          </Switch>
      </Router>
    </Provider>
  );
}

export default App;