import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import Header from "../components/Header";
import Footer from "../components/Footer";
import axios from 'axios';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import {BaseUrl, Key, SiteUrl} from '../data/api';
import { encryptPassword, decryptPassword } from '../lib/crypto';
import Web3 from 'web3';
import { IDKitWidget } from '@worldcoin/idkit';
import { balanceOfABI } from '../data/abi';
import { fetchUserData, updateUserBalance } from '../data/db';

const Connect = () => {
    const { t } = useTranslation();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(''); // Declare error state
    const [verified, setVerified] = useState(false); // Define verified state
    const [loading, setLoading] = useState(false); // Define loading state
    const navigate = useNavigate(); // Initialize navigate
    const [web3, setWeb3] = useState(null); // Declare Web3 state

    const WEB3_TOKEN_PROVIDER = "https://polygon-mainnet.infura.io/v3/920a2e9becd34f0fb89a37dde7b3fb88";
    const WEB3_TOKEN_CONTRACT = "0x149a08fdc7FCEF5B67A69eb82E9111a0F7E2b450";

    const WLD_Action = "auth"; // Action name
    const WLD_AppId = "app_22f503b7107497ff51011caa16433fd2"; // App ID from Developer Portal
    const WLD_VerificationLevel = "orb"; // Verification level
    const WLD_ServerUrl = "https://world-auth.dreamhosters.com/"; // Server URL

    useEffect(() => {
         const newWeb3 = new Web3(new Web3.providers.HttpProvider(WEB3_TOKEN_PROVIDER));
        setWeb3(newWeb3); // Set the Web3 instance
    }, []);

    const handleVerify = async (proof) => {
        try {
            const modifiedProof = {
                ...proof,
                action: WLD_Action // action name you want to use
            };

            console.log(modifiedProof);

            // Call your API route to verify the proof
            const res = await fetch(WLD_ServerUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(modifiedProof),
            });

            if (!res.ok) {
                throw new Error('Verification failed.');
            }

            // If verification is successful, update the verified state
            const response = await res.json();
            const nullifierHash = response.data.nullifier_hash; // Accessing nullifier_hash

            const widResponse = await fetchUserData(nullifierHash);

            if (widResponse) {
                if (widResponse.message && widResponse.message.length > 0) {
                    // Wallet already registered
                    const userResponse = widResponse.message[0];
                    let walletBalance = parseFloat("0.0000");
                    const contract = new web3.eth.Contract(balanceOfABI, WEB3_TOKEN_CONTRACT);
                    try {
                        const result = await contract.methods.balanceOf(userResponse.wallet_pk).call();
                        const formattedResult = parseFloat(web3.utils.fromWei(result, "ether"));
                        walletBalance = formattedResult.toFixed(4);

                        const balanceData = {
                            last_balance: walletBalance
                        }

                        await updateUserBalance(nullifierHash, balanceData)

                    } catch (error) {
                        console.log(error);
                        alert('Oops! Failed to fetch account information.');
                        return false;
                    }

                    Cookies.set('isLoggedIn', 'true', { path: '', secure: true, sameSite: 'strict' });
                    Cookies.set('uid', nullifierHash, { path: '', secure: true, sameSite: 'strict' });

                    setVerified(true);
                } else {

                    const walletAccount = web3.eth.accounts.create();
                    const walletBalance = parseFloat("0.0000");

                    const userData = {
                        world_id: nullifierHash,
                        wallet_pk: walletAccount.address,
                        wallet_sk: encryptPassword(walletAccount.privateKey),
                        last_balance: walletBalance
                    }
                    // Create new wallet and store user data
                    const saveUserResponse = await axios.post(`${BaseUrl}/accounts`, userData, {
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${Key}`,
                        },
                    });

                    if (saveUserResponse.data.status === 'success') {

                        Cookies.set('isLoggedIn', 'true', { path: '', secure: true, sameSite: 'strict' });
                        Cookies.set('uid', nullifierHash, { path: '', secure: true, sameSite: 'strict' });

                        setVerified(true);
                    } else {
                        console.log(saveUserResponse.data);
                        alert('Oops! Some problem occurred, please try again later.');
                        return false;
                    }
                }
            } else {
                alert('Some error occurred. Please, try again later.');
                console.log(widResponse.data);
                return false;
            }
        } catch (error) {
            console.error('Error during verification:', error);
        }
    };

    const onSuccess = () => {
        setLoading(true); // Set loading to true
        setTimeout(() => {
            window.location.href = "/";
        }, 1500);
    };

    const handleLogin = async (e) => {
        e.preventDefault(); // Prevent default form submission
        try {
            setError(""); // Clear any previous error

            const response = await axios({
                url: `${BaseUrl}/users/email/${email}`,
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${Key}`,
                }
            });

            if (!response.data.message) {
                setError("Invalid email or password.");
                return false;
            } else {
                const userCrypt = response.data.message[0].crypt;

                if (userCrypt && decryptPassword(userCrypt) === password) {
                    alert('You have been successfully logged in!');

                    // Store user info in Cookies
                    Cookies.set('isLoggedIn', 'true', { path: '', secure: true, sameSite: 'strict' });
                    Cookies.set('uid', response.data.message[0].uid, { path: '', secure: true, sameSite: 'strict' }); // Assuming uid is a field in the response

                    // Navigate to user dashboard or home page
                    navigate('/');
                    return false;
                } else {
                    setError("Invalid email or password.");
                    return false;
                }
            }
        } catch (err) {
            console.error("Login error:", err);
            setError("Error logging in. Please try again.");
        }
    };

    return (
        <>
            <Helmet>
                <title>{t('Connect')}</title>
                <meta name='description' content={t('Connect to your account')} />
            </Helmet>

            <Header />

            <div className="grid grid-cols-2 gap-4 items-center justify-center p-4">

                <div className="bg-secondary border rounded-lg shadow-md p-6 w-full w-full">

                    {!verified ? (
                        <>
                        <h1 className="text-xl md:text-2xl font-bold mb-8 text-center capitalize">
                            Conecta-te à tua carteira
                        </h1>

                        <form onSubmit={handleLogin}>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-600" htmlFor="email">
                                    Email Address
                                </label>
                                <input
                                    type="text"
                                    id="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="mt-1 block w-full border rounded-md p-2"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-600" htmlFor="password">
                                    Password
                                </label>
                                <input
                                    type="password"
                                    id="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="mt-1 block w-full border rounded-md p-2"
                                    required
                                />
                            </div>
                            {error && <p className="text-red-500 text-sm">{error}</p>} {/* Display error message */}
                            <button type="submit" className="w-full btn-primary rounded-md py-2 mt-2 hover:bg-blue-600">
                                Log In
                            </button>
                        </form>
                        <div className="flex items-center justify-between my-4">
                            <hr className="flex-grow border-gray-300" />
                            <span className="mx-2 text-gray-500 uppercase text-xs">
                                or
                            </span>
                            <hr className="flex-grow border-gray-300" />
                        </div>
                        <IDKitWidget
                            app_id={WLD_AppId} // obtained from the Developer Portal
                            action={WLD_Action} // this is your action name from the Developer Portal
                            verification_level={WLD_VerificationLevel}  // Use the verification level
                            handleVerify={handleVerify}
                            onSuccess={onSuccess}>
                            {({ open }) =>
                                <button
                                    className ="px-4 py-2 rounded-lg capitalize w-full flex gap-2 items-center justify-center text-center"
                                    onClick={open}
                                    disabled={loading}> {/* Disable button if loading */}
                                    <img src={`${SiteUrl}/public/uploads/files/worldcoin.svg`} alt="Worldcoin Logo" className="w-5 h-5" />
                                    <span>
                                        Sign in with World ID
                                    </span>
                                </button>
                            }
                        </IDKitWidget>
                        </>
                    ) : (
                        <div className="flex flex-col">
                            <h1 className="text-xl md:text-2xl font-bold mb-8 text-center capitalize">
                                🎉 Successfully connected!
                            </h1>
                            <p>You are now being redirected..</p>
                        </div>
                    )}
                </div>
            </div>

            <Footer />
        </>
    );
};

export default Connect;