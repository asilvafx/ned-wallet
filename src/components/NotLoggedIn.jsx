import React from "react";
import {useNavigate} from 'react-router-dom';
import {SiteUrl} from "../data/api";

const NotLoggedIn = ({ text = 'Por favor, inicia sessão para obteres acesso!' }) => {

    const navigate = useNavigate();

    return (
        <div className="flex flex-col items-center justify-center h-screen text-center">
            <img src={`${SiteUrl}/public/uploads/files/placeholder.png`} alt="Sign In" className="w-auto h-32 mb-4" />
            <h1 className="text-2xl font-bold mb-4">Não estás conectado</h1>
            <p className="mb-4">{text}</p>
            <a href="/connect" className="bg-primary text-white py-2 px-4 rounded-md">
                Entrar
            </a>
        </div>
    );
};

export default NotLoggedIn;
