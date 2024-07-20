import * as CryptoJS from 'crypto-js';

const object = {
    "hello": "howareyou",
    "test": "deeez nutz",
}

export function encrypt(originalobject,secretKey) {
    const string = JSON.stringify(originalobject)
    const encryptedText = CryptoJS.AES.encrypt(originalText, secretKey).toString();
    return encryptedText
}

// const key = import.meta.env.ENCRYPT_STRING;
// console.log(import.meta.env.ENCRYPT_STRING);

const apiUrl = import.meta.env.VITE_API_URL;
const apiKey = import.meta.env.VITE_API_KEY;

console.log(apiKey);

// encrypt(object, key);