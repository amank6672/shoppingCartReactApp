import React, { Component } from 'react';
import {loginUser} from './loginService';
import { Redirect } from 'react-router';
import {connect} from 'react-redux'
import '../login/login.css';
// import { BrowserRouter as Router } from 'react-router-dom';
class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: '',
            password: '',
            verified: false,
            invalidUsername: false,
            invalidPassword: false,
        }
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    handleSubmit() {
        if (this.state.name === '') {
            this.setState({
                invalidUsername: true,
            });
            return;
        }
        if (this.state.password === '') {
            this.setState({
                invalidPassword: true,
            });
            return;
        }
        loginUser(this.state.name, this.state.password)
        .then((response) => {
            console.log("response", response);
            let data = response.data;
            if (data.objectId) {
                window.localStorage.setItem('user', JSON.stringify(data));
                window.localStorage.setItem('isLoggedIn', 'true');
                this.props.updateLogin(data);
                this.setState({
                    ...this.state,
                    verified : true
                });
            }
        })
        .catch(function (error) {
            if (error.response) {
              alert(error.response.data.error);
            }
        });
    }
    handleUserNameChange = (e) => {
        this.setState({name: e.target.value});
    }
    handlePasswordChange = (e) => {
        this.setState({password: e.target.value});
    }

    render() {
        return ( this.state.verified ? <Redirect to='/' /> : 
                <div id="login">
                    <div className="form col-md-6 mx-auto mt-5">
                        <h2>Login</h2>
                        <form>
                            <div className="form-group">
                                <label htmlFor="username">User Name:</label>
                                <input type="text" className="form-control" id="username" value={this.state.name} onChange={this.handleUserNameChange}/>
                                {this.state.invalidUsername ? <span className="error-message">Please enter valid Username</span>: ""}
                            </div>
                            <div className="form-group">
                                <label htmlFor="pwd">Password:</label>
                                <input type="password" className="form-control" id="pwd" value={this.state.password} onChange={this.handlePasswordChange} />
                                {this.setState.invalidPassword ? <span className="error-message">Please enter valid Password</span> : ""}
                            </div>
                            <button type="button" className="btn btn-primary" onClick={this.handleSubmit}>Submit</button>
                        </form>
                    </div>
                </div>
        );
    }

}
function mapDispatchToProps(dispatch) {
    return(
        {
        updateLogin: (user) => {dispatch({type:"LOG_IN",user:user})}
    })
}

function mapStateToProps(state) {
    return({user: state.user,isLoggedIn: state.isLogggedIn})
}
export default connect(
    mapStateToProps, mapDispatchToProps)(
    Login
);