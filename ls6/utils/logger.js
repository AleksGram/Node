let reqCounter = 0;
let requests = [];
let logTimer = null;

exports.Logger = {
    logRequest: ({ req, res }, ws) => {
        const currentReq = {
            id: reqCounter += 1,
            url: req.url,
            Client: req.headers['user-agent'].split(' ')[0],
            status: res.statusCode
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
            }, 60000);
        }
    },

    logSendFile: (ws, { res, req }, { date, timeSpent }) => {
        console.log("send file", date)

        if (date && timeSpent) ws.write(`Finished sending: ${date}\n
        Time spent: ${timeSpent} sec
        Status code: ${res.statusCode}`)

        if (date) ws.write(`\nStart sending: ${date}\n
         url: ${req.url}\n`)
    }
}
