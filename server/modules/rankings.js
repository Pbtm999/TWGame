const fs = require('fs');
let rankings = {};

fs.readFile('./data/rankings.json',function(err,data) {
    if(! err) {
        try {
            rankings = JSON.parse(data.toString());
        } catch (parseErr) {
            rankings = {}
            console.log("Error parsing rankings (possibly empty)! Reinitializing as empty Error: ", parseErr);
        }
    } else {
        console.log("Error reading rankings.json:", err.message);
        rankings = {}
    }
});

const verifyData = function(group, size) {
    if (!group )
        return {status: 400, objt: { error: "Undefined group" }};
    else if (! size || ! Number.isInteger(size))
        return {status: 400, objt: { error: `Invalid size '${size}'` }};
    else if (! Number.isInteger(group))
        return {status: 400, objt: { error: `Invalid group '${group}'` }};
    return undefined;
};

module.exports.getRanking = function(group, size, sendResponse) {

    let answer = verifyData(group, size);
    if (answer !== undefined) {
        sendResponse(answer.status, answer.objt);
        return
    }

    if (rankings[group] && rankings[group][size]) 
        sendResponse(200, { ranking: rankings[group][size] });
    else
        sendResponse(200, { ranking: [] });
}

module.exports.addGame = function(group, size, winner, loser) {

    const foundIndex = (nick, array) => {
        return array.findIndex(player => player.nick === nick);
    };

    let answer = verifyData(group, size);
    if (answer !== undefined) {
        console.log("Data error in adding on ranking!")
        return;
    }

    if (rankings[group] == undefined) rankings[group] = {}
    if (rankings[group][size] == undefined) rankings[group][size] = []


    let winnerIndex = foundIndex(winner, rankings[group][size]);
    if (winnerIndex === -1) 
        rankings[group][size].push({ nick: winner, victories: 1, games: 1 });
    else {
        rankings[group][size][winnerIndex].victories += 1;
        rankings[group][size][winnerIndex].games += 1;
    }

    let loserIndex = foundIndex(loser, rankings[group][size]);
    if (loserIndex === -1)
        rankings[group][size].push({ nick: loser, victories: 0, games: 1 });
    else
        rankings[group][size][loserIndex].games += 1;

    rankings[group][size].sort((a, b) => b.victories - a.victories);
    
    fs.writeFile('./data/rankings.json', JSON.stringify(rankings), function(err) {
        if(err) {
            console.error("Error saving user data:", err);
        }
    });
}