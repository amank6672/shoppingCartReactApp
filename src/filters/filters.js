import React, { Component } from 'react';
// import { Redirect } from 'react-router';
import {connect} from 'react-redux'
import {getCategories} from '../filters/filtersServices';
import '../filters/filters.css';

class Filters extends Component{
    constructor(props)
    {
        super(props);
        this.state = {
            categories : [],
            appliedFilters : [],
            subCategories : []
        };
    }
    componentWillMount(){
        getCategories().then((result)=>{
            this.setState({
                categories: result,
            });
        });
    }

    handleInputChange = (event, filterType) => {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;
        let temp = this.state.appliedFilters;
        let filterObject = {filterType: filterType, name : name, value : value};
        if(value)
        {
            temp.push(filterObject)
        }
        else
        {
            let index = -1;
            for(let i = 0; i < temp.length; i++)
            {
                delete temp[i].value;
                delete filterObject.value;
                if(JSON.stringify(temp[i]) === JSON.stringify(filterObject))
                {
                    index = i;
                }
            }
            if (index > -1) {
                temp.splice(index, 1);                   
            }
        }
        this.setState({
            appliedFilters : temp
        });
        this.props.updateFilter(this.state.appliedFilters);

    }

    renderCategoryFilters = () =>{
        const UI = this.state.categories.map((category,key)=>{
            let id = category.replace(" ","-").toLowerCase();

            return <div className="form-check p-0" key={key}>
                        <label className="form-check-label" htmlFor={id}>
                            {category}
                        </label>
                        <input className="form-check-input" type="checkbox" name={category} id={id} checked={this.state.isGoing} onChange={(e) => this.handleInputChange(e,'Category')}/>
                    </div>;
        });
        return UI;
    }

    render(){
        console.log(this.state)
        return <>
                {/* <div className="price-filters col-10">
                    <button className="btn btn-transparent w-100 my-2" type="button" data-toggle="collapse" data-target="#price-filter" aria-expanded="false" aria-controls="collapseExample">
                        Price
                    </button>
                    <div className="collapse" id="price-filter">
                        <div className="form-group row m-0 my-2">
                            <label htmlFor="min-price col-5">Min Price</label>
                            <input type="number" className="form-control col-5 offset-2" id="min-price" name="min-price" value="0"/>
                        </div>
                        <div className="form-group row m-0 my-2">
                            <label htmlFor="max-price col-5">Max Price</label>
                            <input type="number" className="form-control col-5 offset-2" id="max-price" name="max-price" value="1000000"/>
                        </div>
                    </div>
                </div> */}
                <div className="category-filters col-10">
                    <button className="btn btn-transparent w-100 my-2" type="button" data-toggle="collapse" data-target="#category-filter" aria-expanded="false" aria-controls="collapseExample">
                        Category
                    </button>
                    <div className="collapse" id="category-filter">
                        {this.renderCategoryFilters()}
                    </div>
                </div>
            </>
    }
}
function mapDispatchToProps(dispatch) {
    return(
        {
        updateFilter: (filters) => {dispatch({type:"FILETR_UPDATE",filters:filters})}
    })
}

function mapStateToProps(state) {
    return({user: state.user,isLoggedIn: state.isLogggedIn, filters: state.filters})
}
export default connect(
    mapStateToProps, mapDispatchToProps)(
    Filters
);