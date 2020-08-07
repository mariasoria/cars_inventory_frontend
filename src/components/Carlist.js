import React, {Component} from 'react';
import {SERVER_URL} from './../constants.js';
import ReactTable from "react-table-6";
import 'react-table-6/react-table.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AddCar from './AddCar';
import EditCar from './EditCar';
import { CSVLink } from 'react-csv';

class Carlist extends Component {
    constructor (props) {
        super(props);
        this.state = { cars : [] };
    }
 
    componentDidMount() {
        this.fetchCars();
    }
    
    // we put the fetch method into a separate function because 
    // we also want to call the fetchCars function after the car has 
    // been deleted in order to show an updated list of cars to the user.
    fetchCars = () => {
        fetch(SERVER_URL + 'api/cars')
        .then(response => response.json())
        .then(data => {
            this.setState({
                cars: data._embedded.cars,
            });
        })
        .catch(err => console.error (err));
    }

    // Delete a car
    onDelClick = (link) => {
        if(window.confirm('Are you sure you want to delete?')) {
            fetch(link, {method: 'DELETE'})
            .then(res => {
                toast.success("Car deleted", {
                    position: toast.POSITION.BOTTOM_LEFT
                });
            this.fetchCars();
            })
            .catch(err => {
                toast.error("Error when deleting", {
                    position: toast.POSITION.BOTTOM_LEFT
                });
                console.error(err)
           })    
        }
    }

    // Update a car
    updateCar = (car, link) => {
        fetch (link, 
        {
            method: 'PUT',
            headers: {
                'Content-type': 'application/json',
            },
            body: JSON.stringify(car)
        })
        .then(response => {
            toast.success("Changed saved", {
                position: toast.POSITION.BOTTOM_LEFT
            });
            this.fetchCars();
        })
        .catch(err => 
            toast.error ("Error when saving", {
                position: toast.POSITION.BOTTOM_LEFT
            })
        )
    }

    addCar (car) {
        fetch(SERVER_URL + 'api/cars',
        { method: 'POST',
          headers: {
            'Content-Type': 'application/json',
        },
          body: JSON.stringify(car)
        })
        .then(res => this.fetchCars())
        .catch(err => console.error(err))
    }

    render(){
        const columns = [{
            Header: 'Brand',
            accessor: 'brand'
        }, {
            Header: 'Model',
            accessor: 'model'
        }, {
            Header: 'Color',
            accessor: 'color'
        }, {
            Header: 'Year',
            accessor: 'year'
        }, {
            Header: 'Price',
            accessor: 'price'
        }, {
            id: 'updatebutton',
            sortable: false,
            filterable: false,
            width: 100,
            accessor: '_links.self.href',
            Cell: ({value, row}) => (
                <EditCar car={row} link={value} updateCar={this.updateCar} fetchCars={this.fetchCars}/>),
        }, {
            id: 'delbutton',
            sortable: false,
            filterable: false,
            width: 100,
            accessor: '_links.self.href',
            Cell: ({value}) => (<button 
                onClick={()=> {this.onDelClick(value)}}>Delete</button>)
        }]


        return (
            <div className="App">
                <AddCar addCar={this.addCar} fetchCars={this.fetchCars}/>
                <CSVLink data={this.state.cars} separator=";">Export CSV</CSVLink>
                <ReactTable data={this.state.cars} columns={columns} filterable={true}/>
                <ToastContainer autoClose={1500}/>
            </div>
        );
    }
}

export default Carlist;