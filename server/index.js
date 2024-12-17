let PORT = 8113;

const http = require('http');
const url = require('url');
const users = require('./modules/users.js');
const rankings = require('./modules/rankings.js');
const game = require('./modules/game.js');
const { error } = require('console');

const headers = {
    plain: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache',
        'Access-Control-Allow-Origin': '*',
    },
    corspreflight: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Max-Age': 86400
    },
    sse: {    
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Access-Control-Allow-Origin': '*',
        'Connection': 'keep-alive'
    }
}

const doGet = (pathname, query, req, res) => {

    switch(pathname) {
        case '/update':
            const gameId = query.game
            res.writeHead(200, headers.sse);
            game.addUpdater(gameId, req, res);
            break;
        default:
            res.writeHead(404, headers.plain);
            res.end();
            break;
    }

}

const doPost = (pathname, request, response) => {

    const sendResponse = (status, objectResponse) => {
        response.writeHead(status, headers.plain);
        response.end(JSON.stringify(objectResponse));
    };
 
    const analyzeRequest = (requestToAnalyze, cb) => {
        let dataReceived = '';
        requestToAnalyze
            .on('data', (chunk) => {dataReceived += chunk;})
            .on('end', () => {
                try {
                    dataParsed = JSON.parse(dataReceived);
                    cb(dataParsed);
                } catch (err) {
                    sendResponse(400,  { error: `Invalid JSON format: ${err}` });
                }
    
            })
            .on('error', (err) => {
                sendResponse(500,  { error: "Internal server error" });
                console.log(err.message); 
            });
    }

    switch(pathname) {
        case '/register':
            analyzeRequest(request, (dataParsed) => {users.loginRegister(dataParsed.nick, dataParsed.password, sendResponse);})
            break;
        case '/join':
            analyzeRequest(request, (dataParsed) => {game.join(dataParsed.group, dataParsed.size, dataParsed.nick, dataParsed.password, sendResponse);
            })
            break;
        case '/leave':
            analyzeRequest(request, (dataParsed) => {game.leave(dataParsed.nick, dataParsed.password, dataParsed.game, sendResponse);})
            break;
        case '/notify':
            analyzeRequest(request, (dataParsed) => {game.notify(dataParsed.nick, dataParsed.password, dataParsed.game, dataParsed.cell, sendResponse);})
            break;
        case '/ranking':
            analyzeRequest(request, (dataParsed) => {rankings.getRanking(dataParsed.group, dataParsed.size, sendResponse)})
            break;
        default:
            sendResponse(404, { error: "Unknown request" });
            break;
    }
}

http.createServer(function(request, response) {
    const parsedUrl = url.parse(request.url,true);
    const pathname = parsedUrl.pathname;
    
    switch(request.method) {
        case 'OPTIONS':
            response.writeHead(200, headers.corspreflight);
            response.end();
            return;
            case 'GET':
            const query = parsedUrl.query;
            doGet(pathname, query, request, response);
            break
        case 'POST':
            doPost(pathname, request, response);
            break
        default:
            response.writeHead(404, headers.plain);
            response.end(JSON.stringify({ error: "Bad request" }));
            break;
    }
}).listen(PORT);
