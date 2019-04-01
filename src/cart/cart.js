import React, {
    Component
} from 'react';
import {connect} from 'react-redux'
import '../cart/cart.css';
import {getCartItems} from './cartServices';

class Cart extends Component{
    constructor(props)
    {
        super(props);
        this.state = {
            isAuthenticated: false,
            cartItmes: [],
        };
    }
    componentDidMount() {
        let userId = this.props.user.length > 0 ? JSON.parse(this.props.user)['objectId'] : null;
        if(userId === null)
        {
            this.setState({
                ...this.state,
                isAuthenticated : false
            });
            return;
        }
        else
        {
            this.setState({
                ...this.state,
                isAuthenticated : true
            });
        }
        getCartItems(userId)
        .then((response) => {
            let data = response.data.results;
            if (data) {
                this.setState({
                    cartItmes : data,
                });
            }
        })
        .catch(function (error) {
            if (error.response) {
                console.log(error.response.data);
                console.log(error.response.status);
                alert(error.response.data.error);
                console.log(error.response.headers);
            }
        });
    }
    calTotalItems = () =>{
        let items = 0;
        this.state.cartItmes.map((CartItem) => {
            items = items + CartItem.Quantity;
            return items;
        });
        return items;
    }
    calTotalPrice = () =>{
        let total = 0;
        this.state.cartItmes.map((CartItem) => {
            total = total + (CartItem.Quantity * CartItem.ProductId.Price);
            total = total + (CartItem.Quantity );
            return total;
        });
        return total;
    }
    calDeliveryCharges = () =>
    {
        let total = this.calTotalPrice();
        if(total > 1000)
        {
            return 0;
        }
        else
        {
            return ( 100 + total * 0.2);
        }
    }
    renderProduct = () =>{
        const productUI = this.state.cartItmes.map((CartItem,key)=>{
            let product = CartItem.ProductId;
            console.log(CartItem,"prod")
            return <tr key = {key}>
                        <td>
                            <img className="card-img-top" src={product.ProductImage.url} alt="Card cap" />
                        </td>
                        <td>{product.ProductName}</td>
                        <td width="100px"><b>&#x20B9; {product.Price}</b></td>
                        <td>{CartItem.Quantity}</td>
                    </tr>
        });
        return productUI;
    }
    render(){
        return(
            this.state.isAuthenticated ? (
                this.state.cartItmes.length > 0 ?
                    <div id="cart-layout" className="container d-flex">
                        <div className="left-conatiner">
                            <h4>My Cart</h4>
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th scope="col"></th>
                                        <th scope="col">Product Name</th>
                                        <th scope="col">Price</th>
                                        <th scope="col">Quanity</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {this.renderProduct()}
                                </tbody>
                            </table>
                        </div>
                        <div className="right-container">
                            <h4>Price Details</h4>
                            <hr/>
                            <table className="table">
                                <tbody>
                                    <tr>
                                        <td>Price ({this.calTotalItems() > 1 ? <span>{this.calTotalItems()} Itmes</span> : <span>{this.calTotalItems()} Item</span> })</td>
                                        <td><b>&#x20B9; {this.calTotalPrice()}</b></td>
                                    </tr>
                                    <tr>
                                        <td>Delivery Charges</td>
                                        <td><b>{this.calDeliveryCharges() > 0 ? <span>&#x20B9; {this.calDeliveryCharges()}</span> : <span>Free</span>}</b></td>
                                    </tr>
                                    <tr>
                                        <td>Amount Payable</td>
                                        <td><b>&#x20B9; {this.calTotalPrice() + this.calDeliveryCharges()}</b></td>
                                    </tr>
                                    <tr>
                                        <td colSpan="2">
                                            <a href="/checkout" className="btn btn-primary">Checkout</a>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                    :
                    <div className="jumbotron text-center"><h3>Your cart is empty! <br/><br/> Please <a href="/">shop</a> and come back here.</h3></div>
                )
            :
            <div className="jumbotron text-center">
                <h3>Please <a href="/login" >login</a> to view your cart.</h3>
            </div>
        );
    }
}
function mapStateToProps(state) {
    return({user: state.user,isLoggedIn: state.isLogggedIn})
}
export default connect(
    mapStateToProps)(
    Cart
);