import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { fetchUserMessages } from '../data/db'; // Assume this function fetches messages from your API

const Messages = () => {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchMessages = async () => {
            try {
                const data = await fetchUserMessages(); // Fetch messages from the API
                setMessages(data); // Set the messages state
            } catch (fetchError) {
                setError('Failed to load messages.');
            } finally {
                setLoading(false);
            }
        };

        fetchMessages();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <>
            <Helmet>
                <title>Messages</title>
                <meta name='description' content='User  messages and chat' />
            </Helmet>

            <Header />

            <div className="px-4 mt-8">
                <h1 className="text-xl mb-4">Mensagens</h1>

                {messages.length === 0 ? (
                    <div className="text-start text-gray-500">
                        <p>No messages to show. Start chatting with other users!</p>
                    </div>
                ) : (
                    <div className="bg-secondary border rounded-lg p-4">
                        {messages.map((message, index) => (
                            <div key={index} className="mb-4">
                                <div className="font-semibold">{message.sender}</div>
                                <div className="text-gray-700">{message.content}</div>
                                <div className="text-sm text-gray-500">{new Date(message.timestamp).toLocaleString()}</div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <Footer />
        </>
    );
};

export default Messages;