import React, {useState} from 'react';
import {SERVER_URL} from './../constants';
import Carlist from './Carlist';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const Login = () => {

    // We need three state values for the authentication, two for the credentials (username and password),
    //  and one Boolean value to indicate the status of the authentication
    const [user, setUser] = useState ({username: '', password: ''});
    const [isAuthenticated, setAuth] = useState (false);

    // Implements the change handler for the TextField components, 
    // in order to save typed values to the states
    const handleChange = (event) => {
        setUser({...user, [event.target.name] : event.target.value})
    }

    const login = () => {
        fetch(SERVER_URL + 'login', {
            method: 'POST', 
            body: JSON.stringify(user)
        })
        .then (response => {
            const jwtToken = response.headers.get('Authorization');
            if (jwtToken !== null){
                sessionStorage.setItem("jwt", jwtToken);
                setAuth(true);
            }
            else {
                toast.warn("Check your username and password", {
                    position: toast.POSITION.BOTTOM_LEFT
                })
            }
        })
        .catch(err => console.error (err))
    }

    const logout  = () => {
        //setUser ({username: '', password: ''});
        sessionStorage.removeItem("jwt");
        setAuth(false);
        const token = sessionStorage.getItem("jwt");
        if(token === null) {
            toast.success("You have succesfully logged out", {
                position: toast.POSITION.BOTTOM_LEFT
            });
            return (<Login/>)
        }
        else {
            toast.success("Something happened. Try again later.", {
                position: toast.POSITION.BOTTOM_LEFT
            });
        }
    }
    
    if (isAuthenticated === true) {
        return (<Carlist/>);
    } 
    else {
        return (
            <div>
                <TextField name="username" 
                    label='Username: ' onChange={handleChange}/> <br/>
                <TextField type="password" name="password" 
                    label='Password: ' onChange={handleChange}/> <br/><br/>
                <Button variant="outlined" color="primary" onClick={login}> Login </Button>
                <ToastContainer autoClose={1500} />
            </div>
        );
    }
}

export default Login;