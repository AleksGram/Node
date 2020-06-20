let reqCounter = 0;
let requests = [];
let logTimer = null;

exports.Logger = {
    logRequest: ({ req, res }, ws, timeSpent) => {
        console.log("ts", timeSpent);
        const currentReq = {
            id: reqCounter += 1,
            url: req.url,
            Client: req.headers['user-agent'].split(' ')[0],
            status: res.statusCode,
            timeSpent,
        };
        requests.push(currentReq);
        if (!logTimer) {
            logTimer = setInterval(() => {
                if (requests.length) {
                    console.log("log request")
                    ws.write(`\n----------- logs: ${new Date().toDateString()}\n`);
                    ws.write(JSON.stringify(requests));
                    requests = [];
                }
            }, 5000);
        }
    },
}
