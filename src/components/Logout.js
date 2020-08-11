import React, {useState} from 'react';
import Login from './Login';
import Button from '@material-ui/core/Button';

import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Logout = () => {

    const [user, setUser] = useState ({username: '', password: ''});
    const [isAuthenticated, setAuth] = useState (true);

    const logout = () => {
        setUser ({username: '', password: ''});
        sessionStorage.removeItem("jwt");
        setAuth(false);
        const token = sessionStorage.getItem("jwt");
        console.log('token: ' + token);
        console.log ('user: ' + user.username);
        if(token === null && isAuthenticated === false) {
            toast.success("You have succesfully logged out", {
                position: toast.POSITION.BOTTOM_LEFT
            });
            return (<Login/>);
        }
        else {
            toast.success("Something happened. Try again later.", {
                position: toast.POSITION.BOTTOM_LEFT
            });
        }
    }

    return (
        <div>
            <Button variant="outlined" color="secondary" style={{margin: 10}} onClick={logout}> logout</Button>
        </div>
    );
}

export default Logout;

    