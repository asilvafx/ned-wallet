const dev = true;
let API_URL = "";
let SITE_URL = "";
let API_KEY = "B0I9nR2el8UNWNpIZnCMdRXtR5";

if (dev) {
    API_URL = 'https://ned.local/v1';
    SITE_URL = 'https://ned.local';
} else {
    API_URL = 'https://client-pix.dreamhosters.com/v1';
    SITE_URL = 'https://client-pix.dreamhosters.com';
}

const WLD_ACTION = "auth";
const WLD_APP_ID = "app_22f503b7107497ff51011caa16433fd2";
const WLD_VERIFICATION_LEVEL = "device";
const WLD_SERVER_URL = "https://world-auth.dreamhosters.com/";

const WEB3_TOKEN_NAME = "Novo Escudo Digital";
const WEB3_TOKEN_SYMBOL = "NED";
const WEB3_TOKEN_PROVIDER = "https://polygon-mainnet.infura.io/v3/920a2e9becd34f0fb89a37dde7b3fb88";
const WEB3_TOKEN_CONTRACT = "0xcAe70C1E0d33484D157F13CF04C554512ED225f6";
const WEB3_TOKEN_OWNER_PK = "0xACCOUNT_OWNER_PUBLIC_ADDRESS";
const WEB3_TOKEN_OWNER_SK = "0xACCOUNT_OWNER_SECRET_KEY";

const SITE_FIAT_CURRENCY_NAME = "Euro"
const SITE_FIAT_CURRENCY_CODE = "EUR"
const SITE_FIAT_CURRENCY_SYMBOL = "€"

export { API_KEY, API_URL, SITE_URL, WLD_ACTION, WLD_APP_ID, WLD_VERIFICATION_LEVEL, WLD_SERVER_URL, SITE_FIAT_CURRENCY_NAME, SITE_FIAT_CURRENCY_CODE, SITE_FIAT_CURRENCY_SYMBOL, WEB3_TOKEN_NAME, WEB3_TOKEN_SYMBOL, WEB3_TOKEN_PROVIDER, WEB3_TOKEN_CONTRACT, WEB3_TOKEN_OWNER_PK, WEB3_TOKEN_OWNER_SK };

