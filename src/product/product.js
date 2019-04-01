import React, {
    Component
} from 'react';
import '../product/product.css';
import axios from 'axios';
import {getProduct, placeOrder, checkProductAlreadyInCart, updateOrder} from './productServices';
import {connect} from 'react-redux'
// import ReactDOM from 'react-dom';

class Product extends Component
{
    constructor(props)
    {   super(props);
        this.state = {
            productId : this.props.match.params.id,
            product : {},
            imageToShow : 0
        };
    }
    componentDidMount(){
        if(this.state.productId)
        {
            getProduct(this.state.productId).then((response) => {
                if(response.status === 200)
                {
                    this.setState({
                        ...this.state,
                        product : response.data.results[0],
                    });
                }
            })
            .catch(function (error) {
                if (error.response) {
                    alert(error.response.data.error);
                }
            });
        }
    }

    placeOrder = (id, userId) =>{
        let cartObject = {
            "Quantity": 1,
            "ProductId": {
              "__type": "Pointer",
              "className": "Product",
              "objectId": id
            },
            "UserId": {
              "__type": "Pointer",
              "className": "_User",
              "objectId": userId
            }
        }
        checkProductAlreadyInCart(id,userId).then((response)=>{
            if(response.data.results.length > 0)
            {

                let cartObject = {
                    Quantity : response.data.results[0].Quantity + 1,
                    objectId : response.data.results[0].objectId
                }
                updateOrder(cartObject).then((response) => {
                    if(response.status === 200)
                    {
                        this.setState({
                            ...this.state,
                            showMessage: true
                        });
                    }
                })
                .catch(function (error) {
                    if (error.response) {
                        alert(error.response.data.error);
                    }
                });
            }
            else
            {

                placeOrder(cartObject).then((response) => {
                    if(response.status === 201)
                    {
                        this.setState({
                            ...this.state,
                            showMessage: true
                        });
                    }
                })
                .catch(function (error) {
                    if (error.response) {
                        alert(error.response.data.error);
                    }
                });
            }
        });
    }

    addToCart = (id) =>{
        let headers = {
            'X-Parse-Application-Id': 'XADTzXn1g79n67P2bH0MF6LWWWOBqK6AcOf7eHxs',
            'X-Parse-REST-API-Key': 'A60ByIz8ViD41K7fE7wJ2Kan745ZhNDf96iDUwzk',
            'Content-Type': 'application/json',
        }
        let userId = this.props.user.length > 0 ? JSON.parse(this.props.user)['objectId'] : null;
        if(userId)
        {
            this.placeOrder(id,userId)
        }
        else
        {
            headers['X-Parse-Revocable-Session'] = '1';
            let randomNumber = Math.random()*10000;
            let userObject = {
                "username": "Guest User"+randomNumber,
                "email": ''+randomNumber+'@gmail.com',
                "type": "purchaser",
                "password": "1234"
            }
            let url = 'https://parseapi.back4app.com/users';
            axios.post(url, userObject, {headers})
            .then((response) => {
                if(response.status === 201)
                {
                    window.localStorage.setItem('user', JSON.stringify(response.data));
                    window.localStorage.setItem('isLoggedIn', 'true');
                    userId = response.data.objectId;
                    this.placeOrder(id,userId);
                }
            })
            .catch(function (error) {
                if (error.response) {
                    console.log(error.response.data.error);
                }
            });
        }
    }

    changeImage = (selectedImage) => {
        this.setState({
            ...this.state,
            imageToShow: selectedImage
        });
    }
    renderDescription = (ProductDescription) =>
    {
        ProductDescription  = ProductDescription && ProductDescription.split("|");
        const descriptionUI = ProductDescription.map((description,key) => {
            return <div className="description" key = {key}>{description}</div>
        });
        return descriptionUI;
    }
    renderThumnails = (url) => {
        let thumnailsUI = [];
        for(let i = 0; i < 4; i++)
        {
            thumnailsUI.push(<div className="thumbnail-image text-center m-2" onClick={() => this.changeImage(i)} key = {i}><img src={url} alt="card"/></div>);
        }
        return thumnailsUI;
    }
    renderImages = (url) =>{
        let imagesUI = [];
        for(let i = 0; i < 4; i++)
        {
            if(this.state.imageToShow === i)
            {
                imagesUI.push(<div className="d-show" key = {i}><img src={url} alt="card"/></div>);
            }
            else{
                imagesUI.push(<div className= "d-none" key = {i}><img src={url} alt="card"/></div>);
            }
        }
        return imagesUI;
    }
    render(){
        const product =  this.state.product;
        return (
            <>
                {
                    this.state.showMessage ?
                    <div className="alert alert-success" role="alert">
                        Your product have been sucessfully added to <a href="/cart" >cart</a>.
                    </div>
                    :
                    ''
                }
                <div id="product-full" className="container d-flex mt-3">
                    <div className="left-container">
                        <div className="image-block d-inline-flex">
                            <div className="image-thumbnails mr-4">
                                {this.renderThumnails(product.ProductImage && product.ProductImage.url)}
                            </div>
                            <div className="image" ref = "images">
                                {this.renderImages(product.ProductImage && product.ProductImage.url)}
                            {/* <img src={product.ProductImage && product.ProductImage.url} alt="Card cap" /> */}
                            </div>
                        </div>
                    </div>
                    <div className="right-container">
                        <div className="category d-inline-block mr-3 badge badge-info">{product.Category && product.Category}</div>
                        <div className="sub-category d-inline-block badge badge-info">{product.SubCategory && product.SubCategory}</div>
                        <div className="product-name">{product.ProductName && product.ProductName}</div>
                        <div className="product-price">Price: &nbsp;<b>&#x20B9; {product.Price && product.Price}</b></div>
                        <div className="product-description">
                            Highlights:
                            {product.ProductDescription && this.renderDescription(product.ProductDescription)}
                        </div>
                        <div className="product-SellerId">
                            <span>Seller: </span>
                            <div className="seller-details d-inline-block">{product.SellerId && product.SellerId.username}</div>
                        </div>
                        <div className="add-to-cart">
                            <button type="button" className="btn btn-primary" onClick={ () => this.addToCart(product.objectId)} >Add To Cart</button>
                        </div>
                    </div>
                </div>
            </>
        );
    }
}
function mapStateToProps(state) {
    return({user: state.user, isLoggedIn: state.isLogggedIn})
}
export default connect(
    mapStateToProps)(
    Product
);