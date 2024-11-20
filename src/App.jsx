import React, { Suspense, lazy, useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import Cookies from 'js-cookie';
import Web3 from 'web3';

// Load Pages
import Home from './pages/Home';
const Listings = lazy(() => import('./pages/Listings'));
const Profile = lazy(() => import('./pages/Profile'));
const Create = lazy(() => import('./pages/Create'));
const Favorites = lazy(() => import('./pages/Favorites'));
const Messages = lazy(() => import('./pages/Messages'));
const Wallet = lazy(() => import('./pages/Wallet'));
const Logout = lazy(() => import('./pages/Logout'));
const Connect = lazy(
    () => import('./pages/Connect'));
const ItemView = lazy(() => import('./pages/ItemView'));
const Walkthrough = lazy(() => import('./pages/Walkthrough'));
const Receive = lazy(() => import('./pages/Receive'));
const Send = lazy(() => import('./pages/Send'));
const Buy = lazy(() => import('./pages/Buy'));


// Load Components
import CookiesAddon from './components/Cookies';
import ScrollToTop from './components/ScrollToTop';
import Header from "./components/Header";
import Footer from "./components/Footer";

// Load Data
import { fetchUserData, updateUserBalance } from './data/db';
import { WEB3_TOKEN_PROVIDER, WEB3_TOKEN_CONTRACT } from './data/config';

const App = () => {
    const [showWalkthrough, setShowWalkthrough] = useState(false);
    const [isSignedIn, setIsSignedIn] = useState(false);
    const [loading, setLoading] = useState(true);
    const [web3, setWeb3] = useState(null); // Declare Web3 state
    const walletId = Cookies.get('uid');

    useEffect(() => {
        const newWeb3 = new Web3(new Web3.providers.HttpProvider(WEB3_TOKEN_PROVIDER));
        setWeb3(newWeb3); // Set the Web3 instance
    }, []);

    useEffect(() => {
        const isLoggedIn = Cookies.get('isLoggedIn');
        const hasVisited = Cookies.get('hasVisited');
        if (!hasVisited) {
            setShowWalkthrough(true);
        }
        try {
        if (isLoggedIn) {
            setIsSignedIn(true);
            const fetchUserDataFromApi = async () => { // Rename the function to avoid confusion
                const data = await fetchUserData(walletId); // Call the imported function
                if (walletId && data) {
                    if(data.wallet_pk) {
                        await updateBalance(data.wallet_pk, walletId);
                    } else {
                        console.log(data);
                    }
                } else {
                    // Handle invalid user data
                    Cookies.remove('uid');
                    Cookies.remove('isLoggedIn');
                    window.location.href = "/";
                }
            };
            fetchUserDataFromApi(); // Call the renamed function
        }
        } catch (fetchError) {
           console.log('Failed to fetch the user data.');
        } finally {
            setLoading(false);
        }
    }, []);

    const updateBalance = async (walletPk, walletId) => {
        if (!web3) return; // Ensure web3 is initialized
        const contract = new web3.eth.Contract(balanceOfABI, WEB3_TOKEN_CONTRACT); // Use your ABI here

        try {
            const balance = await contract.methods.balanceOf(walletPk).call(); // Fetch balance from contract
            const formattedBalance = parseFloat(web3.utils.fromWei(balance, "ether")).toFixed(4); // Convert to Ether and format

            // Update the user data in database
            const balanceData = { last_balance: formattedBalance };
            await updateUserBalance(walletId, balanceData);

        } catch (error) {
            console.error("Error fetching or updating balance:", error);
        }
    };

    const handleWalkthroughComplete = () => {
        Cookies.set('hasVisited', 'true', { path: '', secure: true, sameSite: 'strict' });
        setShowWalkthrough(false);
    };

    if(loading){
        return (
            <div id="loading">Loading...</div>
        );
    }


    return (
        <HelmetProvider>
            <Suspense fallback={<div id="loading">Loading...</div>}>
                <Router>
                    <CookiesAddon />
                    <ScrollToTop />

                    <Header />
                    <div className="page-view min-h-screen">
                        <Routes>
                            {showWalkthrough ? (
                                <>
                                <Route path="/" element={<Walkthrough onComplete={handleWalkthroughComplete} />} />
                                <Route path="*" element={<Walkthrough onComplete={handleWalkthroughComplete} />} />
                                </>
                                ) : (
                                <>
                                <Route path="/" element={<Home />} />
                                <Route path="*" element={<Home />} />
                                </>
                            )}
                            <Route path="/listing/:id" element={<ItemView />} />
                            <Route path="/listings" element={<Listings />} />
                            <Route path="/listings/:categoryId" element={<Listings />} />
                            <Route path="/create" element={<Create />} />
                            <Route path="/favorites" element={<Favorites />} />
                            <Route path="/logout" element={<Logout />} />
                            <Route path="/chat" element={<Messages />} />
                            <Route path="/profile" element={<Profile />} />
                            <Route path="/profile/edit" element={<Profile />} />
                            <Route path="/connect" element={isSignedIn ? <Navigate to="/wallet" /> : <Connect />} />
                            <Route path="/wallet" element={isSignedIn ? <Wallet /> : <Navigate to="/connect" />} />
                            <Route path="/receive" element={isSignedIn ? <Receive /> : <Navigate to="/connect" />} />
                            <Route path="/send" element={isSignedIn ? <Send /> : <Navigate to="/connect" />} />
                            <Route path="/buy" element={isSignedIn ? <Buy /> : <Navigate to="/connect" />} />
                        </Routes>
                    </div>

                    <Footer />
                </Router>
            </Suspense>
        </HelmetProvider>
    );
};

export default App;