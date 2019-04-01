import React, {
    Component
} from 'react';
import {connect} from 'react-redux'
import { Link } from "react-router-dom";
import '../home/home.css';
import {getProducts} from './homeService';

class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            products: [],
            waiting: true
        };
    }
    componentDidMount() {
        getProducts().then((response) => {
            let data = response.data.results;
            if (data) {
                this.setState({
                    products : data,
                    waiting: false
                });
            }
        })
        .catch(function (error) {
                alert(error.response.data.error);
        });
    }
    
    checkProductToRender = (product,filters) =>
    {
        if(filters.length < 1)
        {
            return true;
        }
        // let toRender = false;
        for(let i = 0; i < filters.length; i++)
        {
            if(filters[i].filterType === "Category")
            {
                if(product.Category === filters[i].name && filters[i].value)
                    return true;
            }
        }
        return false;
    }

    renderProduct = () =>{
        const productUi = this.state.products.map((product,key) => {
        if(this.checkProductToRender(product,this.props.filters)){
            let productName = product.ProductName.substring(0,23)+"...";
            let url =  "/product/"+ product.objectId;
            return  <Link to={url} key= {key}>
                        <div className="card mt-2">
                            <div className="card-image">
                                <img className="card-img-top" src={product.ProductImage.url} alt="Card cap" />
                            </div>
                            <div className="card-body">
                                <p className="card-title">{productName}</p>
                                <p className="card-text"><b>&#x20B9; {product.Price}</b></p>
                                {/* <button type="button" className="btn btn-primary" onClick={ () => this.addToCart(product.objectId) }>Add to cart</button> */}
                            </div>
                        </div>
                    </Link>
        }
        return null;
        });
        return productUi;
    }
    render() {
        console.log('home',this.props.filters)
        return (
            <>
                <div id="products" className="d-flex flex-wrap justify-content-between">
                    {this.renderProduct()}
                </div>
                <div><h1>Test</h1></div>
            </>);
        }

    }

    function mapStateToProps(state) {
        return({user: state.user,isLoggedIn: state.isLogggedIn, filters: state.filters})
    }
    export default connect(
        mapStateToProps)(
        Home
    );