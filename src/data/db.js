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

// Function to fetch user messages based on wallet ID
export const fetchUserFavorites = async (walletId) => {
    try {
        const response = await axios({
            url: `${BaseUrl}/watchlist/user/${walletId}`,
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

// Function to fetch all Items
export const fetchItems = async () => [
    {
        id: 1,
        uid: 'uid-1',
        name: 'Item 1',
        author: '0x000...000010',
        price: '0.50 NED',
        description: 'Description for Item 1',
        category: 'Category 1',
        tags: ['tag1', 'tag2'],
        location: 'Location 1',
        gallery: [
            'https://via.placeholder.com/150',
            'https://via.placeholder.com/150/0000FF',
            'https://via.placeholder.com/150/008000'
        ],
        cover: 'https://via.placeholder.com/150',
        stock: -1, // Unlimited stock
        status: 1, // 1 for available
        digital: 0, // 0 for false (not a digital product)
        service: 0, // 0 for false (not a service)
    },
    {
        id: 2,
        uid: 'uid-2',
        name: 'Item 2',
        author: '0x000...000010',
        price: '1.00 NED',
        description: 'Description for Item 2',
        category: 'Category 2',
        tags: ['tag3', 'tag4'],
        location: 'Location 2',
        gallery: [
            'https://via.placeholder.com/150',
            'https://via.placeholder.com/150/FF0000',
            'https://via.placeholder.com/150/FFFF00'
        ],
        cover: 'https://via.placeholder.com/150',
        stock: 5, // Limited stock
        status: 1, // 1 for available
        digital: 1, // 1 for true (is a digital product)
        service: 0, // 0 for false (not a service)
    },
    {
        id: 3,
        uid: 'uid-3',
        name: 'Item 3',
        author: '0x000...000010',
        price: '1.50 NED',
        description: 'Description for Item 3',
        category: 'Category 3',
        tags: ['tag5', 'tag6'],
        location: 'Location 3',
        gallery: [
            'https://via.placeholder.com/150',
            'https://via.placeholder.com/150/00FF00',
            'https://via.placeholder.com/150/000000'
        ],
        cover: 'https://via.placeholder.com/150',
        stock: 0, // Out of stock
        status: 0, // 0 for not available
        digital: 0, // 0 for false (not a digital product)
        service: 1, // 1 for true (is a service)
    },
    {
        id: 4,
        uid: 'uid-4',
        name: 'Item 4',
        author: '0x000...000010',
        price: '2.00 NED',
        description: 'Description for Item 4',
        category: 'Category 4',
        tags: ['tag7', 'tag8'],
        location: 'Location 4',
        gallery: [
            'https://via.placeholder.com/150',
            'https://via.placeholder.com/150/800080',
            'https://via.placeholder.com/150/FFA500'
        ],
        cover: 'https://via.placeholder.com/150',
        stock: -1, // Unlimited stock
        status: 1, // 1 for available
        digital: 1, // 1 for true (is a digital product)
        service: 1, // 0 for false (not a service)
    },
    {
        id: 5,
        uid: 'uid-5',
        name: 'Item 5',
        author: '0x000...000010',
        price: '122.00 NED',
        description: 'Description for Item 5',
        category: 'Category 5',
        tags: ['tag9', 'tag10'],
        location: 'Location 5',
        gallery: [
            'https://via.placeholder.com/150',
            'https://via.placeholder.com/150/800080',
            'https://via.placeholder.com/150/FFA500'
        ],
        cover: 'https://via.placeholder.com/150',
        stock: -1, // Unlimited stock
        status: 1, // 1 for available
        digital: 0, // 1 for true (is a digital product)
        service: 0, // 0 for false (not a service)
    },
];

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