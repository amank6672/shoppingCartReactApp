import React, {
    Component
} from 'react';
import '../order/order.css';
import {connect} from 'react-redux'
import {getOrders} from './orderServices';


class Order extends Component {
    constructor(props) {
        super(props);
        let userID = this.props.user.length > 0 ? JSON.parse(this.props.user)['objectId'] : null;
        this.state = {
            orders: [],
            userId : userID
        }
    }
    componentWillMount() {
        getOrders(this.state.userId)
        .then((response) => {
            let data = response.data;
            if (response.status === 200) {
                this.setState({
                    orders: data.results,
                });
            }
        })
        .catch(function (error) {
            if (error.response) {
                console.log(error.response.data.error);
            }
        });
    }

    renderListOfProducts = (products) =>{
        const list = products.map((product, key) =>{
            return <><span key = {key}>{product.productName} * {product.quantity}</span><br/></>
        });
        return list;
    }
    renderOrder = () => {
        const ordersUi = this.state.orders.map((order,key) => {
            const products = JSON.parse(order.Products);
            const url = '/orderReview/'+order.objectId;
            return (
                <tr key = {key}>
                    <th scope="row">{key + 1}</th>
                    <td>{order.objectId}</td>
                    <td>{this.renderListOfProducts(products)}</td>
                    <td>{Date(order.createdAt)}</td>
                    {order.Delivered ? <td>Your Order has been delivered</td> : <td>Your order is on the way.</td>}
                    <td><a href={url} className="btn btn-primary">Review Order</a></td>
                </tr>
            );
        });
        return ordersUi
    }

    render(){
        return (
            this.state.orders.length > 0 ?
            <div className="container mt-3">
                <h2 className="mb-4">Your Orders</h2>
                <table className="table">
                    <thead>
                        <tr>
                            <th scope="col" width="20px">#</th>
                            <th scope="col">Order Id</th>
                            <th scope="col">Products</th>
                            <th scope="col">Order Date</th>
                            <th scope="col">Delivered</th>
                            <th scope="col" width="100px"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.renderOrder()}
                    </tbody>
                </table>
            </div>
            :
            <div className="Jumbotron text-center">
                <h2>You don't have any orders yet.</h2>
            </div>
            );
    }
}
function mapStateToProps(state) {
    return({user: state.user, isLoggedIn: state.isLogggedIn})
}
export default connect(
    mapStateToProps)(
    Order
);