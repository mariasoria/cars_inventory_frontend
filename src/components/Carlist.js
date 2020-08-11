import React, {Component} from 'react';
import {SERVER_URL} from './../constants.js';
import AddCar from './AddCar';
import EditCar from './EditCar';
import Logout from './Logout';

import ReactTable from "react-table-6";
import 'react-table-6/react-table.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { CSVLink } from 'react-csv';

import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';

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
    // We include de token got from the login process in the session storage.
    fetchCars = () => {
        fetch(SERVER_URL + 'api/cars')
            // Read the token from the session storage
            // and include it to Authorization header
            // getItem("jwt") -> because in Login.js we called it "jwt" when received
            const token = sessionStorage.getItem("jwt");
            fetch(SERVER_URL + 'api/cars',
            {
                headers: {'Authorization': token}
            })
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
            const token = sessionStorage.getItem("jwt");
            fetch(link, 
            {
                method: 'DELETE', 
                headers: {'Authorization': token}
            })
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
        const token = sessionStorage.getItem("jwt");
        fetch (link, 
        {
            method: 'PUT',
            headers: {
                'Content-type': 'application/json',
                'Authorization': token,
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
        const token = sessionStorage.getItem("jwt");
        fetch(SERVER_URL + 'api/cars',
        { method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': token,
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
            Cell: ({value}) => (<Button size="small" color="secondary"
                onClick={()=> {this.onDelClick(value)}}>Delete</Button>)
        }]


        return (
            <div className="App">
                <Grid container>
                    <Grid item>
                        <AddCar addCar={this.addCar} fetchCars={this.fetchCars}/>
                    </Grid>
                    <Grid item style={{padding: 15}}>
                        <CSVLink data={this.state.cars} separator=";">Export CSV</CSVLink>
                    </Grid>
                    <Grid item>
                        <Logout/>
                    </Grid>
                </Grid>
                <ReactTable data={this.state.cars} columns={columns} filterable={true}/>
                <ToastContainer autoClose={1500}/>
            </div>
        );
    }
}

export default Carlist;