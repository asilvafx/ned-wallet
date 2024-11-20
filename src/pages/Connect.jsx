import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import { BaseUrl, Key, SiteUrl } from '../data/api';
import { encryptPassword, decryptPassword } from '../lib/crypto';
import Web3 from 'web3';
import { IDKitWidget } from '@worldcoin/idkit';
import { balanceOfABI } from '../data/abi';
import { fetchUserData, updateUserBalance } from '../data/db';

const Connect = () => {
    const { t } = useTranslation();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [verified, setVerified] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const [web3, setWeb3] = useState(null);

    const WEB3_TOKEN_PROVIDER = "https://polygon-mainnet.infura.io/v3/920a2e9becd34f0fb89a37dde7b3fb88";
    const WEB3_TOKEN_CONTRACT = "0x149a08fdc7FCEF5B67A69eb82E9111a0F7E2b450";

    const WLD_Action = "auth";
    const WLD_AppId = "app_22f503b7107497ff51011caa16433fd2";
    const WLD_VerificationLevel = "orb";
    const WLD_ServerUrl = "https://world-auth.dreamhosters.com/";

    useEffect(() => {
        const newWeb3 = new Web3(new Web3.providers.HttpProvider(WEB3_TOKEN_PROVIDER));
        setWeb3(newWeb3);
    }, []);

    const handleVerify = async (proof) => {
        try {
            const modifiedProof = {
                ...proof,
                action: WLD_Action,
            };

            const res = await fetch(WLD_ServerUrl, {
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

            const widResponse = await fetchUserData(nullifierHash);

            if (widResponse) {
                console.log('Updating account..');
                const userResponse = widResponse[0];

                Cookies.set('isLoggedIn', 'true', { path: '', secure: true, sameSite: 'strict' });
                Cookies.set('uid', nullifierHash, { path: '', secure: true, sameSite: 'strict' });


                setVerified(true);

                let walletBalance = parseFloat("0.0000");
                const contract = new web3.eth.Contract(balanceOfABI, WEB3_TOKEN_CONTRACT);
                try {
                    const result = await contract.methods.balanceOf(decryptPassword(userResponse.wallet_pk)).call();
                    const formattedResult = parseFloat(web3.utils.fromWei(result, "ether"));
                    walletBalance = formattedResult.toFixed(4);

                    const balanceData = {
                        last_balance: walletBalance
                    }

                    await updateUserBalance(nullifierHash, balanceData);

                } catch (error) {
                    console.log(error);
                    return;
                }

            } else {
                console.log('Creating new account..');
                const walletAccount = web3.eth.accounts.create();
                const walletBalance = parseFloat("0.0000");

                const userData = {
                    world_id: nullifierHash,
                    wallet_pk: walletAccount.address,
                    wallet_sk: encryptPassword(walletAccount.privateKey),
                    last_balance: walletBalance
                }

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
                    alert('Ops! Algo deu errado, tenta novamente mais tarde.');
                    return false;
                }
            }

        } catch (error) {
            console.error('Erro durante a verificação:', error);
        }
    };

    const onSuccess = () => {
        setLoading(true);
        setTimeout(() => {
            window.location.href = "/";
        }, 1500);
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            setError("");

            const response = await axios({
                url: `${BaseUrl}/users/email/${email}`,
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${Key}`,
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
                            <h1 className="text-2xl font-bold text-center mb-6 text-color">
                                Conecta-te à tua conta
                            </h1>

                            <form onSubmit={handleLogin} className="space-y-4">
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-600">
                                        Endereço de Email
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
                                    <label htmlFor="password" className="block text-sm font-medium text-gray-600">
                                        Senha
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

                                <button
                                    type="submit"
                                    className="w-full py-3 mt-4 btn-primary rounded-md"
                                >
                                    Entrar
                                </button>
                            </form>

                            <div className="flex items-center justify-center my-6">
                                <hr className="w-full border-gray-300" />
                                <span className="mx-2 text-gray-500 text-sm">ou</span>
                                <hr className="w-full border-gray-300" />
                            </div>

                            <IDKitWidget
                                app_id={WLD_AppId}
                                action={WLD_Action}
                                verification_level={WLD_VerificationLevel}
                                handleVerify={handleVerify}
                                onSuccess={onSuccess}
                            >
                                {({ open }) => (
                                    <button
                                        className="w-full py-3 mt-4 rounded-md flex items-center justify-center gap-2 hover:bg-green-600"
                                        onClick={open}
                                        disabled={loading}
                                    >
                                        <img src={`${SiteUrl}/public/uploads/files/worldcoin.svg`} alt="Worldcoin Logo" className="w-5 h-5" />
                                        <span>Entrar com World ID</span>
                                    </button>
                                )}
                            </IDKitWidget>
                        </>
                    ) : (
                        <div className="text-center">
                            <h2 className="text-2xl font-semibold mb-4 text-green-600">
                                🎉 Conexão bem-sucedida!
                            </h2>
                            <p>Estás a ser redirecionado...</p>
                        </div>
                    )}
                </div>

                <div className="bg-secondary border rounded-lg shadow-lg p-6">
                    <h2 className="text-2xl font-semibold text-center mb-6 text-color">
                        Criar Nova Conta?
                    </h2>
                    <p className="text-gray-500 mb-4">
                        Para criares uma nova conta, precisas primeiro verificar a tua identidade através da verificação do Orb da World ID.
                        Isto assegura que apenas utilizadores verificados possam criar uma conta.
                    </p>
                    <p className="text-primary mb-6 text-lg">
                        Segue estes passos:
                    </p>
                    <ol className="list-decimal list-inside pl-4 space-y-2 text-color">
                        <li>Clica no botão "Entrar com World ID".</li>
                        <li>Completa o processo de verificação na aplicação Worldcoin.</li>
                        <li>Uma vez autorizado, poderás aceder à tua conta e carteira NED.</li>
                    </ol>
                </div>
            </div>

            <div className="relative p-4 mt-6">
                <div className="bg-card border rounded-lg shadow-lg p-6">
                    <h2 className="text-2xl font-bold mb-4 text-center text-primary mb-6">Como Começar em 3 Passos</h2>
                    <ol className="grid grid-cols-1 md:grid-cols-3 gap-4 text-color">
                        <li className="flex flex-col">
                            <span className="text-3xl text-gray-600">1.</span>
                            <span className="text-lg">Verifica a tua identidade usando o Orb da Worldcoin. Este processo é obrigatório.</span>
                        </li>
                        <li className="flex flex-col">
                            <span className="text-3xl text-gray-600">2.</span>
                            <span className="text-lg">Entra na tua conta com o teu World ID. Uma nova carteira digital irá ser criada para ti.</span>
                        </li>
                        <li className="flex flex-col">
                            <span className="text-3xl text-gray-600">3.</span>
                            <span className="text-lg">Explora todas as funcionalidades. Começa a comprar e a vender!</span>
                        </li>
                    </ol>
                </div>
            </div>

        </>
    );
};

export default Connect;
