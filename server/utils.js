function error(messages, data) {
    const obj = {};

    obj.messages = (messages instanceof Array) ? messages : [messages];
    obj.data = (data !== undefined || data !== null) ? data : null;
    
    return obj;
}

module.exports = { error };