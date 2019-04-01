import React, {
    Component
} from 'react';
import '../order/orderReview.css';
import {getOrderDetail} from './orderServices';
import axios from 'axios';
class OrderReview extends Component {
    constructor(props) {
        super(props);
        this.state = {
            orderId: this.props.match.params.id,
            order: [],
            requestSent: false,
            products:[]
        }
    }
    componentDidMount() {
        getOrderDetail(this.state.orderId)
        .then((response) => {
            let data = response.data;
            if (response.status === 200) {
                this.setState({
                    ...this.state,
                    order: data.results,
                });
                if(!this.state.requestSent)
                {
                    this.setState({
                        ...this.state,
                        order: data.results,
                        requestSent: true
                    });
                    this.getProducts();
                }
                
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

    getProducts = () =>{
        let products = this.state.order[0] ? this.state.order[0].Products : null;
        products = products ? JSON.parse(products) : null;
        let headers = {
            'X-Parse-Application-Id': 'XADTzXn1g79n67P2bH0MF6LWWWOBqK6AcOf7eHxs',
            'X-Parse-REST-API-Key': 'A60ByIz8ViD41K7fE7wJ2Kan745ZhNDf96iDUwzk'
        }
        if(products)
        {
            for(let i = 0; i < products.length; i++)
            {
                let url = 'https://parseapi.back4app.com/classes/Product?where={"objectId": "'+ products[i].productId +'"}&include=SellerId';
                axios.get(url, {headers})
                .then((response) => {
                    if(response.status === 200)
                    {
                        let product = this.state.products;
                        let temp = response.data.results[0];
                        temp['quantity'] = products[i].quantity;
                        product.push(temp);
                        this.setState({
                            products: product
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
        }
    }

    renderProduct = () =>{
        const productListUi = this.state.products.map((product,key) => {
            return <tr height="40px" key = {key}>
                        <td>{key + 1}</td>
                        <td>
                            <img className="" src={product.ProductImage.url} alt="Card cap" height="100px"/>
                        </td>
                        <td>{product.ProductName}</td>
                        <td><b>&#x20B9; {product.Price}</b></td>
                        <td>{product.quantity}</td>
                    </tr>
        });
        return productListUi;
    }

    render() {
        return ( 
            <>
                <div className="container">
                    <h4>Order No: {this.state.orderId} </h4>
                    <table className="table">
                        <thead>
                            <tr>
                                <th scope="col">#</th>
                                <th scope="col">ProductImage</th>
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
            </>
        );
    }
}
export default OrderReview;