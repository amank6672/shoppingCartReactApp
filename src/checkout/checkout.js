import React, {
    Component
  } from 'react';
import '../checkout/checkout.css';
import {connect} from 'react-redux'
import {getProducts, createOrderAPICall, deleteCartItemsAPICall} from './checkoutServices';

class Checkout extends Component{
    constructor(props)
    {
        super(props);
        this.state = {
            orderPlaced : false,
        };
    }
    placeOrder = () =>{

        // Procedure
        // 1 Get the list of product for the user which are in his coresponding cartItems
        // 2 create a order 
        // 3 delete the cart items

        let userId = this.props.user.length > 0 ? JSON.parse(this.props.user)['objectId'] : null;
        getProducts(userId)
        .then((response) => {
            let data = response.data.results;
            if (data) {
                // console.log('break',data);
                this.createOrders(data);
            }
        })
        .catch(function (error) {
            if (error.response) {
                console.log(error.response.data.error);
            }
        });
    }
    createOrders = (products) =>{
        let productQuery = products.map((item) => {
            return {"productId" : item.ProductId.objectId,"productName" : item.ProductId.ProductName,"quantity" : item.Quantity};
        });
        productQuery = JSON.stringify(productQuery);
        let userId = this.props.user.length > 0 ? JSON.parse(this.props.user)['objectId'] : null;
        const orderObject = {
            "UserId": {
                "__type": "Pointer",
                "className": "_User",
                "objectId": userId
            },
            "Products": productQuery,
            "Delivered": false
        }
        createOrderAPICall(orderObject).then((response) => {
            if (response.status === 201) {
                let cartItems = products;
                for(let i = 0; i  < cartItems.length; i++)
                {
                    this.deleteCartItems(cartItems[i].objectId);
                }
                this.setState({
                    ...this.state,
                    orderPlaced: true
                });
            }
        })
        .catch(function (error) {
            if (error.response) {
                console.log(error.response.data.error);
            }
        });
    }

    deleteCartItems = (id) => {
        deleteCartItemsAPICall(id).catch(function (error) {
            if (error.response) {
              console.log(error.response.data.error);
            }
        });
    }
    render(){
        return (
        <>
            {this.state.orderPlaced ?
                <div className="exsisting-user">
                <div className="jumbotron text-center"><h1>Thank You! <br/><br/> Your order has been placed.</h1></div>
                </div>
            :
                this.placeOrder()
            }
        </>
        );
    }
  }
function mapStateToProps(state) {
    return({user: state.user, isLoggedIn: state.isLogggedIn})
}
export default connect(
    mapStateToProps)(
    Checkout
);