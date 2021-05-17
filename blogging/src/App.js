import React from "react";
import {BrowserRouter as  Router,Route,Switc, Switch} from "react-router-dom";  
import Layout from './hocs/layout';
import Home from './components/home';
import Blog from './components/Blog';
import BlogDeatal from './components/blogDeatil';
import category from './components/category';
import './App.css';


function App() {
  return (
  <Router>
    <Switch>
      <Route exact path='/' component={Home} />
      <Route exact path='/blog' component={Blog} />
      <Route exact path='/category/:id' component={category} />
      <Route exact path='/blog/:id' component={BlogDeatal} />

      <Layout />
    </Switch>
  </Router>
  );
}

export default App;
