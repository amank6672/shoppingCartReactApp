import React, { Component } from 'react';
import {connect} from 'react-redux'
class Header extends Component {
    logout = () => {
        window.localStorage.removeItem('user');
        window.localStorage.removeItem('isLoggedIn');
    }
   
    render() {
        return (
            <div id="header">
                <nav className="navbar navbar-expand-lg navbar-dark bg-dark ">
                    <a className="navbar-brand" href="/">E-commerce</a>
                    <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>

                    <div className="collapse navbar-collapse" id="navbarSupportedContent">
                        <ul className="navbar-nav mr-auto">
                            <li className="nav-item">
                                <a className="nav-link" href="/cart">Cart</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="/order">Orders</a>
                            </li>
                            
                            <li className="nav-item">
                                <a className="nav-link disabled" href="/">Disabled</a>
                            </li>
                        </ul>
                        <ul className="navbar-nav">
                        {this.props.isLoggedIn ?
                            <li className="nav-item dropdown">
                                <a className="nav-link dropdown-toggle" href="/" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                Profile
                                </a>
                                <div className="dropdown-menu" aria-labelledby="navbarDropdown">
                                    <a className="dropdown-item" href="/profile">Edit Profile</a>
                                    <div className="dropdown-divider"></div>
                                    <a className="dropdown-item" href="/" onClick={this.logout}>LogOut</a>
                                </div>
                            </li>
                        :
                            <li className="nav-item">
                                <a className="nav-link" href="/login">Login</a>
                            </li>}
                        </ul>
                        <form className="form-inline my-2 my-lg-0">
                            <input className="form-control mr-sm-2" type="search" placeholder="Search" aria-label="Search" />
                            <button className="btn btn-outline-success my-2 my-sm-0" type="submit">Search</button>
                        </form>
                        
                    </div>
                </nav>
            </div>
        )
    }
}
function mapStateToProps(state) {
    return({user: state.user,isLoggedIn: state.isLogggedIn})
}
export default connect(
    mapStateToProps)(
        Header
);