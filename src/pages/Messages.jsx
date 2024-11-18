import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { fetchUserMessages } from '../data/db';
import Cookies from 'js-cookie';
import NotLoggedIn from '../components/NotLoggedIn';
import {Link} from 'react-router-dom';

const Messages = () => {
    const isLoggedIn = Cookies.get('isLoggedIn');
    const walletId = Cookies.get('uid');
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchMessages = async () => {
            if (!isLoggedIn) {
                setLoading(false);
                return;
            }
            try {
                const data = await fetchUserMessages(walletId);
                setMessages(data);
            } catch (fetchError) {
                setError('Failed to load messages.');
            } finally {
                setLoading(false);
            }
        };

        fetchMessages();
    }, [isLoggedIn]);

    if (loading) {
        return <div className="text-center mt-4">Loading messages...</div>;
    }

    if (!isLoggedIn) {
        return (
            <>
                <NotLoggedIn text="Por favor, inicia sessão para veres as tuas mensagens." />
            </>
        );
    }

    if (error) {
        return <div className="text-red-500 text-center">{error}</div>;
    }

    return (
        <>
            <Helmet>
                <title>Messages</title>
                <meta name='description' content='User  messages and chat' />
            </Helmet>

            <div className="px-4 mt-6">
                <h1 className="text-2xl font-bold mb-4">Mensagens</h1>

                {messages.length === 0 ? (
                    <div className="text-start text-gray-500">
                        <p>Não há mensagens para mostrar. A tua caixa de entrada está vazia.</p>

                        <Link to="/" >
                            <button className="btn mt-4 py-2 px-4 rounded-md">
                                Ir para a Página Inicial
                            </button>
                        </Link>
                    </div>
                ) : (
                    <div className="bg-white border rounded-lg shadow-md p-4">
                        {messages.map((message) => (
                            <div key={message.id} className="mb-4 border-b pb-2">
                                <div className="font-semibold text-gray-800">
                                    From: {message.chat_from} <span className="text-gray-500">to {message.chat_to}</span>
                                </div>
                                <div className="text-gray-700">{message.msg}</div>
                                <div className="text-sm text-gray-500">
                                    {new Date(message.timestamp).toLocaleString('pt-PT', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit',
                                    })}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </>
    );
};

export default Messages;