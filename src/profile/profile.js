import React, { Component } from 'react';
import {connect} from 'react-redux';
import {getAddress, editAddress, updateUser} from './profileServices';
import '../profile/profile.css';
class Profile extends Component{
    constructor(props)
    {
        super(props)
        let userId = this.props.user.length > 0 ? JSON.parse(this.props.user)['objectId'] : null;
        this.state = {
            userId: userId,
            user : {},
            address : [],
            editAddress: false,
            AddressObject : {},
            isHovering : false,
            showUserEditForm : false
        };
    }
    updateComponentWithAPICall = () => {
        getAddress(this.state.userId).then((response) =>{
            if(response.status === 200){
                let result = response.data.results;
                if(result.length > 0)
                {
                    this.setState({
                        address : result,
                        user : result[0].User,
                    });
                }
            }
        });
    }
    componentWillMount(){
        this.updateComponentWithAPICall();
    }

    handleChange = (event, formName) => {
        let name = event.target.name;
        let value = event.target.value;
        if(formName === 'userForm')
        {
            this.setState({
                user:{
                    ...this.state.user,
                    [name] : value
                }
            });
        }
        else if(formName === 'addressForm')
        {
            this.setState({
                AddressObject : {
                    ...this.state.AddressObject,
                    [name] : value,
                }
            });
        }
    }

    handleSubmit = (event, formName) => {
        event.preventDefault();
        if(formName === 'userForm')
        {
            let userId = this.state.userId;
            let userObject = {
                Name: this.state.user.Name,
            }
            let sessionToken = this.props.user.length > 0 ? JSON.parse(this.props.user)['sessionToken'] : null;
            updateUser(userId,userObject,sessionToken)
            .then((response) =>{
                console.log(response)
                if(response.status === 200)
                {
                    console.log(this.state)
                    this.updateComponentWithAPICall();
                    this.setState({
                            showUserEditForm : false
                    });
                    
                }
            }).catch(function (error) {
                if (error.response) {
                    console.log(error.response.data.error);
                }
            });
        }
        else if(formName === 'addressForm'){
            editAddress(this.state.AddressObject).then((response)=>{
                if(response.status === 200)
                {
                    this.updateComponentWithAPICall();
                    this.setState({
                        editAddress : false
                    });
                }
            }).catch(function (error) {
                if (error.response) {
                    console.log(error.response.data.error);
                }
            });
        }
    }

    handleMouseHover = () => {
        this.setState(this.toggleHoverState);
    }

    toggleHoverState = (state) => {
        return {
            isHovering: !state.isHovering,
        };
    }

    editAddress = (id) => {
        if(id !== null)
        {
            let currentEditingObject;
            let address = this.state.address;
            for(let i = 0; i < address.length; i++)
            {
                if(address[i].objectId === id)
                {
                    currentEditingObject = address[i]
                    break;
                }
            }
            this.setState({
                ...this.state,
                editAddress: id,
                AddressObject : currentEditingObject
            });
        }
        else
        {
            this.setState({
                editAddress: false,
                AddressObject: {}
            })
        }
    }

    editName = () => {
        this.setState({
            showUserEditForm : true,
        })
    }
    renderUser = () => {
        let user = this.state.user;
        let userUi;
        user.objectId ?
        userUi =  <>
                    <div className="container">
                        <div className="user-profile-photo"><img src= {user.Photo.url} alt="profile pic" /></div>
                        <div className="user">
                            {
                                this.state.showUserEditForm ? 
                                    <form onSubmit={(e) => this.handleSubmit(e,'userForm')}> 
                                        <div className="form-group d-inline-block mr-2">
                                            <input type="text" className="form-control" id="name" name="Name" onChange={(e) => this.handleChange(e,'userForm')} value={this.state.user.Name} />
                                        </div>
                                        <button type="submit" className="btn btn-info mr-2">Update</button>
                                        <button type="cancel" className="btn btn-danger">X</button>
                                    </form>
                                :
                                <div 
                                    className="name"
                                    onMouseEnter={this.handleMouseHover}
                                    onMouseLeave={this.handleMouseHover}
                                >   
                                    {user.Name}
                                    {this.state.isHovering &&
                                    <i className="fa fa-pencil ml-5" aria-hidden="true" onClick={this.editName}></i>}
                                </div>
                            }
                            <div className="username">@{user.username}</div>
                        </div>
                    </div>
                </>
        :
        userUi = '';
        return userUi;
    }
    renderAddress = () =>{
        let addresss = this.state.address;
        const addressUI = addresss.map((address,key) => {
            return (
                    this.state.editAddress === address.objectId ?
                        <div className="col-md-4" key={key} id={address.objectId}>
                            <form onSubmit={(e) => this.handleSubmit(e,'addressForm')}>
                                <div className="card h-100">
                                    <div className="card-header">Address Type : {address.AddressType}
                                        <button className="btn btn-danger float-right ml-2" type="submit">Save</button>
                                        <button className="btn btn-dark float-right" type="cancel">Cancel</button>
                                    </div>
                                    <div className="card-body">
                                        <div className="form-group">
                                            <label htmlFor="addressLine1">Address Line 1</label>
                                            <input type="text" className="form-control" id="addressLine1" name="AddressLine1" onChange={(e) => this.handleChange(e,'addressForm')} value={this.state.AddressObject.AddressLine1} />
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="addressLine2">Address Line 2</label>
                                            <input type="text" className="form-control" id="addressLine2" name="AddressLine2" onChange={(e) => this.handleChange(e,'addressForm')} value={this.state.AddressObject.AddressLine2} />
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="street">Street </label>
                                            <input type="text" className="form-control" id="street" name="Street" onChange={(e) => this.handleChange(e,'addressForm')} value={this.state.AddressObject.Street} />
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="locality">Locality </label>
                                            <input type="text" className="form-control" id="locality" name="Locality" onChange={(e) => this.handleChange(e,'addressForm')} value={this.state.AddressObject.Locality} />
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="city">City </label>
                                            <input type="text" className="form-control" id="city" name="City" onChange={(e) => this.handleChange(e,'addressForm')} value={this.state.AddressObject.City} />
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="state">State </label>
                                            <input type="text" className="form-control" id="state" name="State" onChange={(e) => this.handleChange(e,'addressForm')} value={this.state.AddressObject.State} />
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="postal-code">City </label>
                                            <input type="number" className="form-control" id="postal-code" name="PostalCode" onChange={(e) => this.handleChange(e,'addressForm')} value={this.state.AddressObject.PostalCode} />
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="country">Country </label>
                                            <input type="text" className="form-control" id="country" name="Country" onChange={(e) => this.handleChange(e,'addressForm')} value={this.state.AddressObject.Country} />
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div> 
                    :
                        <div className="col-md-4" key={key} id={address.objectId}>
                            <div className="card h-100">
                                <div className="card-header"><i className="fa fa-address-book" aria-hidden="true"></i>&nbsp;{address.AddressType}
                                    <button className="btn btn-info float-right" onClick={() =>this.editAddress(address.objectId)}>Edit</button>
                                </div>
                                <div className="card-body">
                                    <div>Address Line 1 : {address.AddressLine1}</div>
                                    {address.AddressLine2 ? <div>Address Line 2 : {address.AddressLine2}</div> : ''}
                                    <div>Street : {address.Street}</div>
                                    <div>Locality : {address.Locality}</div>
                                    <div>City : {address.City}</div>
                                    <div>{address.State}-{address.PostalCode}</div>
                                    <div>{address.Country}</div>
                                </div>
                            </div>
                        </div>
                    )
        });
        return addressUI;
    }


    render(){
        return <div className="profile">
                <div className="overlay">
                    <img src={require('../images/texture.jpg')} alt="overlay" />
                </div>
                <div className="user-detail">{this.renderUser()}</div>
                <div className="address container">
                    <div className = "row">{this.renderAddress()}</div>
                </div>
            </div>
    }
}
function mapStateToProps(state) {
    return({user: state.user,isLoggedIn: state.isLogggedIn})
}
export default connect(
    mapStateToProps)(
        Profile
);