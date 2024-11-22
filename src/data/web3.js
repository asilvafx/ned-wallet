import Web3 from 'web3';
import { WEB3_TOKEN_PROVIDER, WEB3_TOKEN_CONTRACT } from '../data/config';

// Initialize Web3
const web3 = new Web3(new Web3.providers.HttpProvider(WEB3_TOKEN_PROVIDER));

// Function to get the current token market price
const tokenPrice = async () => {
    return "0.10";
}

// Function to get the current market price of MATIC
// https://docs.google.com/spreadsheets/d/1wTTuxXt8n9q7C4NDXqQpI3wpKu1_5bGVmP9Xz0XGSyU/edit?pli=1&gid=0#gid=0
const netPrice = () => {
    return new Promise((resolve, reject) => {
        let crypto = 'polygon-ecosystem-token'; // bitcoin, ethereum, solana, polygon-ecosystem-token,..
        let currency = 'eur'; // eur, usd, inr, ..
        let xhr = new XMLHttpRequest();
        xhr.open('GET', 'https://api.coingecko.com/api/v3/simple/price?ids=' + crypto + '&vs_currencies=' + currency);

        xhr.onload = function () {
            if (this.status === 200) {
                const data = JSON.parse(this.responseText);
                resolve(data[crypto][currency]); // Resolve with the price
            } else {
                reject(new Error("Failed to fetch price")); // Reject on failure
            }
        };

        xhr.onerror = function () {
            reject(new Error("Network error")); // Handle network errors
        };

        xhr.send();
    });
};

// Function to get the balance of an address
const getBalance = async (walletPk) => {
    const contract = new web3.eth.Contract(balanceOfABI, WEB3_TOKEN_CONTRACT);

    try {
        const balance = await contract.methods.balanceOf(walletPk).call();
        return parseFloat(web3.utils.fromWei(balance, "ether")).toFixed(4); // Convert to Ether and format
    } catch (error) {
        console.error("Error fetching balance:", error);
        return null;
    }
};

const balanceOfABI = [
    {
        "constant": true,
        "inputs": [
            {
                "name": "_owner",
                "type": "address"
            }
        ],
        "name": "balanceOf",
        "outputs": [
            {
                "name": "balance",
                "type": "uint256"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
];

const transferABI = [
    {
        "constant": false,
        "inputs": [
            {
                "name": "_to",
                "type": "address"
            },
            {
                "name": "_value",
                "type": "uint256"
            }
        ],
        "name": "transfer",
        "outputs": [
            {
                "name": "",
                "type": "bool"
            }
        ],
        "type": "function"
    }
];

export { tokenPrice, netPrice, getBalance, balanceOfABI, transferABI };