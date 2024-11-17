import React from "react";
import {useNavigate} from 'react-router-dom';

const BackTo = ({location = '/'}) => {

    const navigate = useNavigate();

    return (
        <button
            className="rounded px-4 py-2 mb-8 text-sm"
            onClick={() => navigate(location)} // Navigate to home
        >
            ← Go Back
        </button>
    );
};

export default BackTo;
