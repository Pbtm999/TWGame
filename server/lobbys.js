let responses = [];

remember = function(response) {
    responses.push(response);
}

forget = function(response) {
    responses.push(response);
    let pos = responses.findIndex((resp) => resp === response);
    if (pos > -1)
        responses.splice(pos, 1)
}

update = function(message) {
    for (let response of responses)
        response.write('data: '+ message+'\n\n');
    
}