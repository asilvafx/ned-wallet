import { BaseUrl, Key } from './api.js';
import axios from 'axios';

// Function to fetch user messages based on wallet ID
export const fetchUserMessages = async (walletId) => {
    try {
        const response = await axios({
            url: `${BaseUrl}/messages/chat_from/${walletId}`,
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${Key}`,
            }
        });
        return response.data.message; // Return the response data
    } catch (error) {
        console.error("Error fetching user messages:", error);
        return null; // Return null on error
    }
};

// Function to fetch user data based on wallet ID
export const fetchUserData = async (walletId) => {
    try {
        const response = await axios({
            url: `${BaseUrl}/accounts/world_id/${walletId}`,
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${Key}`,
            }
        });
        return response.data.message[0] || response.data.message; // Return the response data
    } catch (error) {
        console.error("Error fetching user data:", error);
        return null; // Return null on error
    }
};

// Function to fetch user data based on wallet ID
export const updateUserBalance = async (walletId, balanceData) => {
    try {

        const response = await axios.put(`${BaseUrl}/accounts/world_id/${walletId}`, balanceData, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${Key}`,
            },
        });
        return response.data; // Return the response data
    } catch (error) {
        console.error("Error updating user balance:", error);
        return null; // Return null on error
    }
};

// Existing function to fetch users
export const fetchUsers = async () => {
    try {
        // Your logic here
    } catch (error) {
        console.error("Error fetching users:", error);
        return []; // Return an empty array on error
    }
};

// Function to fetch categories
export const fetchCategories = async () => {
    return [
        { id: 1, emoji: '🚗', name: 'Carros', slug: 'carros' },
        { id: 2, emoji: '🏍️', name: 'Motos', slug: 'motos' },
        { id: 3, emoji: '🚤', name: 'Barcos', slug: 'barcos' },
        { id: 4, emoji: '🏠', name: 'Imóveis', slug: 'casas' },
        { id: 5, emoji: '👶', name: 'Bebé e Criança', slug: 'bebe-crianca' },
        { id: 6, emoji: '🎉', name: 'Lazer', slug: 'lazer' },
        { id: 7, emoji: '📱', name: 'Telefones & Tablets', slug: 'telefones-tablets' },
        { id: 8, emoji: '🌾', name: 'Agricultura', slug: 'agricultura' },
        { id: 9, emoji: '🐶', name: 'Animais', slug: 'animais' },
        { id: 10, emoji: '⚽', name: 'Desporto', slug: 'desporto' },
        { id: 11, emoji: '👗', name: 'Moda', slug: 'moda' },
        { id: 12, emoji: '🛋️', name: 'Móveis, Casa e Jardim' },
        { id: 13, emoji: '💻', name: 'Tecnologia', slug: 'tecnologia' },
        { id: 14, emoji: '💼', name: 'Emprego', slug: 'emprego' },
        { id: 16, emoji: '🔧', name: 'Equipamentos e Ferramentas', slug: 'equipamentos-ferramentas' },
        { id: 17, emoji: '📦', name: 'Outras Vendas', slug: 'outras-vendas' },
        { id: 18, emoji: '🪑', name: 'Móveis', slug: 'moveis' },
    ];
};