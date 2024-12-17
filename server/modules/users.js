const fs = require('fs');
const crypto = require('crypto');

const hashPassword = (password, callback, salt=crypto.randomBytes(16).toString('hex')) => {
    const iterations = 100000;
    const keyLength = 64;
    const digest = 'sha512';

    crypto.pbkdf2(password, salt, iterations, keyLength, digest, (err, derivedKey) => {
        if (err) {
            callback(err, null);
            return;
        }
        callback(null, {
            salt: salt,
            hash: derivedKey.toString('hex'),
        });
    });
};

let users = {};

fs.readFile('./data/users.json',function(err,data) {
    if(! err) {
        try {
            users = JSON.parse(data.toString());
        } catch (parseErr) {
            users = {}
            console.log("Error parsing users (possibly empty)! Reinitializing as empty Error: ", parseErr);
        }
    } else {
        console.log("Error reading users.json:", err.message);
        users = {}
    }
});

const verifyData = function(nick, password, sendResponse) {
    if (!nick )
        return {status: 400, objt: { error: "nick is undefined" }};
    else if (!password)
        return {status: 400, objt: { error: "password is undefined" }};
    else if (typeof password !== 'string')
        return {status: 400, objt: { error: "password is not a valid string" }};
    else if (typeof nick !== 'string')
        return {status: 400, objt: { error: "nick is not a valid string" }};
    return undefined;
};

module.exports.verifyCredentials = async (nick, password) => {
    if (users[nick] === undefined) return false;

    let salt = users[nick].salt;

    const hashPasswordPromise = (password, salt) => {
        return new Promise((resolve, reject) => {
            hashPassword(password, (err, result) => {
                if (err) reject(err);
                else resolve(result);
            }, salt);
        });
    };

    try {
        const result = await hashPasswordPromise(password, salt);
        return users[nick].hash === result.hash;
    } catch (err) {
        console.error("Error during hashing:", err);
        return false;
    }
};

module.exports.loginRegister = function(nick, password, sendResponse) {
    let answer = verifyData(nick, password, sendResponse);
    if (answer !== undefined) {
        sendResponse(answer.status, answer.objt);
        return
    }

    let salt = undefined;
    if (users[nick] !== undefined) salt = users[nick].salt;

    hashPassword(password, (err, result) => {
        if (err) {
            console.error('Error hashing password:', err);
            sendResponse(500, { error: "Internal server error" });
        } else {
            if (users[nick] !== undefined && (users[nick].hash != result.hash))
                sendResponse(401, { error: "User registered with a different password" });
            else {
                if (users[nick] === undefined) {
                    users[nick] = result;
                    fs.writeFile('./data/users.json', JSON.stringify(users), function(err) {
                        if(err) {
                            console.error("Error saving user data:", err);
                            sendResponse(500, { error: "Internal server error" });
                        } else
                            sendResponse(200, {});
                    });
                } else 
                    sendResponse(200, {});
            }
        }
    }, salt);
}