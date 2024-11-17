const dev = true;
let BaseUrl = "";
let SiteUrl = "";
let Key = "B0I9nR2el8UNWNpIZnCMdRXtR5";

if (dev) {
    BaseUrl = 'https://ned.local/v1';
    SiteUrl = 'https://ned.local';
} else {
    BaseUrl = 'https://client-pix.dreamhosters.com/v1';
    SiteUrl = 'https://client-pix.dreamhosters.com';
}

export { Key, BaseUrl, SiteUrl };

