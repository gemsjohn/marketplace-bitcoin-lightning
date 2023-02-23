import React, { useState } from 'react';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import { ApolloProvider, ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Auth from './utils/auth';

// Various Page and Component imports used by React Router
import Login from './pages/Login/LoginPage';
import SignUp from './pages/Signup/SignupPage';
import Navbar from './components/Navbar';
import Main from './pages/Home/Main/MainPage';
import Admin from './pages/Admin/AdminPage';
import ForSaleQuery from './pages/Home/ForSale/ForSale';
import WantedQuery from './pages/Home/Wanted/Wanted';
import SellingForm from './pages/Listing/sellingpage';
import WantedForm from './pages/Listing/wantedpage';
import ListingComplete from './pages/Listing/ListingComplete';
import ViewableListing from './pages/ViewableListing/ViewableListing';
import SelectStyle from './Stylizer';
import ProfilePage from './pages/Profile/ProfilePage';
import Creator from './pages/ViewableListing/Creator';
import Reset from './pages/Home/Main/Reset'
import Video from './pages/Home/Main/Video';

const httpLink = createHttpLink({
  uri: '/graphql',
});

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('id_token');
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});


const loggedin = Auth.loggedIn() ? true : false;
let userrole;
if (loggedin) {
  userrole = Auth.getProfile().data.role?.[0] === 'Admin' ? true : false;
} else {
  userrole = false;
}

// Primary App function used by index.js. This contains ApolloProvider and React Router.
function App() {
  const [navigateHomeHover, setNavigateHomeHover] = useState(false);

  return (
    <>
      <ApolloProvider client={client}>
        <Router>
          <>
            <div style={{ ...SelectStyle[4].navbarAppJS }}>
              <Navbar />
            </div>
            <Switch>
              <Route exact path='/' component={Main} />
              <Route exact path='/admin' render={() => (userrole ? <Admin /> : <Redirect to='/' />)} />
              <Route exact path='/login' component={Login} />
              <Route exact path='/signup' component={SignUp} />
              <Route exact path='/sellingform' render={() => (loggedin ? <SellingForm /> : <Redirect to='/login' />)} />
              <Route exact path='/wantedform' render={() => (loggedin ? <WantedForm /> : <Redirect to='/login' />)} />
              <Route exact path='/complete' render={() => (loggedin ? <ListingComplete /> : <Redirect to='/' />)} />
              <Route exact path='/listing' component={ViewableListing} />
              <Route exact path='/forsale' component={ForSaleQuery} />
              <Route exact path='/wanted' component={WantedQuery} />
              <Route exact path='/profile' render={() => (loggedin ? <ProfilePage /> : <Redirect to='/' />)} />
              <Route exact path='/listing/creator' component={Creator} />
              <Route exact path='/reset' component={Reset} />
              <Route exact path='/video' component={Video} />
              <Route render={() =>
                <h1 className='display-2'>
                  <div
                    style={{
                      textAlign: 'center',
                      position: 'relative'
                    }}>
                    <div style={{ ...SelectStyle[0].page, }}>
                      <div style={{marginTop: '10rem'}}>
                        <p>This page does not exist.</p>
                      {navigateHomeHover ?
                      <Button
                        as={Link} 
                        to='/' 
                        style={{
                          width: '100%',
                          fontSize: '4vh',
                          background: 'rgba(148, 210, 189, 0.2)',
                          border: 'solid',
                          borderWidth: 'thin',
                          borderColor: 'rgba(148, 210, 189, 0.2)'
                        }}
                            onMouseEnter={() => setNavigateHomeHover(true)}
                            onMouseLeave={() => setNavigateHomeHover(false)}
                      >Navigate Home</Button>
                      :
                      <Button
                        as={Link} 
                        to='/' 
                        style={{
                          width: '100%',
                          fontSize: '4vh',
                          background: 'transparent',
                          border: 'solid',
                          borderWidth: 'thin',
                          borderColor: 'rgba(148, 210, 189, 0.2)'
                        }}
                            onMouseEnter={() => setNavigateHomeHover(true)}
                            onMouseLeave={() => setNavigateHomeHover(false)}
                      >Navigate Home</Button>
                      }
                      </div>
                     
                    </div>
                  </div>
                </h1>}
              />
            </Switch>
          </>
        </Router>
      </ApolloProvider>
    </>
  );
}

export default App;
