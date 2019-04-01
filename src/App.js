import React, {
  Component
} from 'react';
import './App.css';
import Login from './login/login';
import Home from './home/home';
import Header from './header/header';
import Filters from './filters/filters';
import Cart from './cart/cart';
import Product from './product/product';
import Checkout from './checkout/checkout';
import Order from './order/order';
import OrderReview from './order/orderReview';
import Profile from './profile/profile';
import {Route,Switch} from 'react-router'
import {BrowserRouter as Router} from 'react-router-dom';

class App extends Component {
  render() {
    return (
      <>
        <Header/>
        <div id="page" className="d-flex">
          <div id="main" className="order-2">
            <Router>
              <Switch>   
                <Route path='/' component={Home} exact />
                <Route path='/login' component={Login} exact />
                <Route path='/product/:id' component={Product} exact />
                <Route path='/cart' component={() => <Cart/>} exact />
                <Route path='/checkout' component={() => <Checkout/>} exact />
                <Route path='/order' component={() => <Order/>} exact />
                <Route path='/profile' component={() => <Profile/>} exact />
                <Route path='/OrderReview/:id' component={OrderReview} exact />
                <Route path='/*' component={Home} exact />
              </Switch>
            </Router>
          </div>
          <div id="left-side-bar" className="order-1">
            <Filters/>
          </div>
          <div id="right-side-bar" className="order-3"></div>
        </div>
      </>
    )
  }
}
export default App;
//private route concepts