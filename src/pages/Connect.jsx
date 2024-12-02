import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';
import Web3 from 'web3';
import { IDKitWidget } from '@worldcoin/idkit';
import { encryptPassword, decryptPassword } from '../lib/crypto';
import {fetchUserData} from '../data/db';
import { CiUser, CiLock } from "react-icons/ci";

import {
    API_URL,
    API_KEY,
    SITE_URL,
    WLD_ACTION,
    WLD_APP_ID,
    WLD_VERIFICATION_LEVEL,
    WLD_SERVER_URL,
    WEB3_TOKEN_PROVIDER,
    WEB3_TOKEN_CONTRACT } from '../data/config';

const Connect = () => {
    const { t } = useTranslation();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [verified, setVerified] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const [web3, setWeb3] = useState(null);

    useEffect(() => {
        const newWeb3 = new Web3(new Web3.providers.HttpProvider(WEB3_TOKEN_PROVIDER));
        setWeb3(newWeb3);
    }, []);

    const handleVerify = async (proof) => {
        try {
            const modifiedProof = {
                ...proof,
                action: WLD_ACTION,
            };

            const res = await fetch(WLD_SERVER_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(modifiedProof),
            });

            if (!res.ok) {
                throw new Error('Verificação falhou.');
            }

            const response = await res.json();
            const nullifierHash = response.data.nullifier_hash;
            const verficationLevel = response.data.verification_level;

            const widResponse = await fetchUserData(nullifierHash);

            let userData = {};
            let dataType = "post";
            if (widResponse) {
                console.log('Updating account..');
                const userResponse = widResponse[0];

                userData = {
                    verification_level: verficationLevel
                }
                dataType = "put";

                Cookies.set('isLoggedIn', 'true', { path: '', secure: true, sameSite: 'strict' });
                Cookies.set('uid', nullifierHash, { path: '', secure: true, sameSite: 'strict' });

                setVerified(true);

            } else {
                console.log('Creating new account..');
                const walletAccount = web3.eth.accounts.create();
                const walletBalance = parseFloat("0.0000");

                userData = {
                    world_id: nullifierHash,
                    wallet_pk: walletAccount.address,
                    wallet_sk: encryptPassword(walletAccount.privateKey),
                    last_balance: walletBalance,
                    verification_level: verficationLevel
                }
            }

            let saveUserResponse = null;
            if(dataType==="post"){
                saveUserResponse = await axios.post(`${API_URL}/accounts`, userData, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${API_KEY}`,
                    },
                });
            } else if(dataType==="put") {
                saveUserResponse = await axios.put(`${API_URL}/accounts/world_id/${nullifierHash}`, userData, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${API_KEY}`,
                    },
                });
            }

            if (saveUserResponse.data.status === 'success') {
                Cookies.set('isLoggedIn', 'true', { path: '', secure: true, sameSite: 'strict' });
                Cookies.set('uid', nullifierHash, { path: '', secure: true, sameSite: 'strict' });

                setVerified(true);
            } else {
                console.log(saveUserResponse.data);
                alert('Ops! Algo deu errado, tenta novamente mais tarde.');
                return false;
            }

        } catch (error) {
            console.error('Erro durante a verificação:', error);
        }
    };

    const onSuccess = () => {
        setLoading(true);
        setTimeout(() => {
            //window.location.href = "/";
        }, 1500);
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            setError("");

            const response = await axios({
                url: `${API_URL}/users/email/${email}`,
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${API_KEY}`,
                }
            });

            if (!response.data.message) {
                setError("Email ou senha inválidos.");
                return false;
            } else {
                const userCrypt = response.data.message[0].crypt;

                if (userCrypt && decryptPassword(userCrypt) === password) {
                    alert('Login bem-sucedido!');

                    Cookies.set('isLoggedIn', 'true', { path: '', secure: true, sameSite: 'strict' });
                    Cookies.set('uid', response.data.message[0].uid, { path: '', secure: true, sameSite: 'strict' });

                    navigate('/');
                    return false;
                } else {
                    setError("Email ou senha inválidos.");
                    return false;
                }
            }
        } catch (err) {
            console.error("Erro de login:", err);
            setError("Erro ao fazer login. Tente novamente.");
        }
    };

    return (
        <>
            <Helmet>
                <title>{t('Connect')}</title>
                <meta name="description" content={t('Conecta à tua conta')} />
            </Helmet>


            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 mt-6">

                <div className="bg-secondary border rounded-lg shadow-lg p-6">
                    {!verified ? (
                        <>
                            <h1 className="text-2xl font-bold text-center mb-2 text-color">
                                Conecta-te à tua conta
                            </h1>
                            <p className="text-gray-500 mb-10 text-center">Utiliza as tuas credenciais para acederes à tua conta e carteira NED. Podes também aceder, utilizando a tua World ID da Worldcoin.</p>

                            <form onSubmit={handleLogin} className="space-y-4">
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-600 inline-flex items-center gap-1">
                                        <CiUser className="text-primary" /> Endereço de Email
                                    </label>
                                    <input
                                        type="text"
                                        id="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full p-3 border rounded-md mt-2"
                                        required
                                    />
                                </div>

                                <div>
                                    <label htmlFor="password" className="block text-sm font-medium text-gray-600 inline-flex items-center gap-1">
                                        <CiLock className="text-primary" /> Senha
                                    </label>
                                    <input
                                        type="password"
                                        id="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full p-3 border rounded-md mt-2"
                                        required
                                    />
                                </div>

                                {error && <p className="text-red-500 text-sm">{error}</p>}

                                <div className="pt-6 w-full">
                                    <button
                                        type="submit"
                                        className="w-full py-3 btn-primary rounded-md"
                                    >
                                        Entrar
                                    </button>
                                </div>


                            </form>

                            <div className="flex items-center justify-center my-6">
                                <hr className="w-full border-gray-300"/>
                                <span className="mx-2 text-gray-500 text-sm">ou</span>
                                <hr className="w-full border-gray-300"/>
                            </div>

                            <IDKitWidget
                                app_id={WLD_APP_ID}
                                action={WLD_ACTION}
                                verification_level={WLD_VERIFICATION_LEVEL}
                                handleVerify={handleVerify}
                                onSuccess={onSuccess}
                            >
                                {({open}) => (
                                    <button
                                        className="w-full py-3 mt-4 rounded-md flex items-center justify-center gap-2 hover:bg-green-600"
                                        onClick={open}
                                        disabled={loading}
                                    >
                                        <img src={`${SITE_URL}/public/uploads/files/worldcoin.svg`} alt="Worldcoin Logo"
                                             className="w-5 h-5"/>
                                        <span>Entrar com World ID</span>
                                    </button>
                                )}
                            </IDKitWidget>
                        </>
                    ) : (
                        <div className="text-center min-h-full flex flex-col items-center justify-center">
                            <h2 className="text-2xl font-semibold mb-4 text-green-600">
                                🎉 Conexão bem-sucedida!
                            </h2>
                            <p>Estás a ser redirecionado...</p>
                        </div>
                    )}

                    <p className="text-sm text-color text-center mt-6">Ao iniciares sessão estás a aceitar os nossos Termos e Condições.</p>

                </div>

                <div className="bg-secondary border rounded-lg shadow-lg p-6">
                    <h2 className="text-2xl font-semibold text-center mb-6 text-color">
                        Como Instalar o Worldcoin?
                    </h2>
                    <p className="text-color mb-4">
                        <span>Para criares uma nova conta, precisas primeiro obter a tua World ID<sub
                            className="text-gray-500">*1</sub> através da Worldcoin. Se
                        ainda não
                        estiveres registado,

                        </span>
                    </p>
                    <p className="text-primary mb-6 text-lg">
                        Segue estes passos:
                    </p>
                    <ol className="list-decimal list-inside pl-4 space-y-2 text-color mb-8">
                        <li>Descarrega a aplicação Worldcoin no teu smartphone ou tablet.</li>
                        <li>Regista-te na Worldcoin ou inicia sessão com uma World ID já existente.</li>
                        <li>Clica no botão "Entrar com World ID".</li>
                        <li>Completa o processo de verificação<sub className="text-gray-500">*2</sub> na Worldcoin.</li>
                        <li>Uma vez autorizado, poderás aceder à tua conta e carteira NED.</li>
                    </ol>
                    <div className="w-full flex flex-wrap gap-4 justify-center items-center mb-6">
                        <img className="h-10 lg:h-12 w-auto rounded-lg border-2"
                             src={`${SITE_URL}/public/uploads/files/google_play_light.jpg`}/>
                        <img className="h-10 lg:h-12 w-auto rounded-lg border-2"
                             src={`${SITE_URL}/public/uploads/files/app_store_light.jpg`}/>
                    </div>
                    <p className="text-gray-500 text-sm mb-2">
                        *1. World ID is a digital proof of human for the internet. Securely and anonymously proves you
                        are human online.
                    </p>
                    <p className="text-gray-500 text-sm">
                        *2. Verificares a tua identidade através da Orb World, garante extra segurança e confiança
                        entre
                        utilizadores. De forma, a reduzir spam, perfils falsos, burlas e entre outras atividades
                        indesejadas.
                    </p>
                </div>
            </div>

            <div className="relative p-4 mt-6">
                <div className="bg-card border rounded-lg shadow-lg p-6">
                <h2 className="text-2xl font-bold mb-4 text-center text-primary mb-6">Como Começar em 3 Passos</h2>
                    <ol className="grid grid-cols-1 md:grid-cols-3 gap-4 text-color">
                    <li className="flex flex-col">
                            <span className="text-3xl text-gray-600">1.</span>
                            <span className="text-lg">Verifica a tua identidade usando a Worldcoin. Este processo é obrigatório.</span>
                        </li>
                        <li className="flex flex-col">
                            <span className="text-3xl text-gray-600">2.</span>
                            <span className="text-lg">Entra na tua conta NED com o teu World ID. Uma nova carteira digital irá ser criada para ti.</span>
                        </li>
                        <li className="flex flex-col">
                            <span className="text-3xl text-gray-600">3.</span>
                            <span className="text-lg">Explora todas as funcionalidades. Começa a comprar e vender!</span>
                        </li>
                    </ol>
                </div>
            </div>

        </>
    );
};

export default Connect;
