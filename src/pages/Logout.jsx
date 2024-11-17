import React from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

const Logout = () => {
    const navigate = useNavigate();

    // Clear authentication cookies
    Cookies.remove('isLoggedIn');
    Cookies.remove('uid');

    // Redirect to the homepage or login page
    window.location.href = "/";

    return (
        <div>
            <p>Logging out...</p>
        </div>
    );
};

export default Logout;