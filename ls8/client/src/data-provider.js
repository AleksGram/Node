const get = "GET";
const post = "POST";
const deleteMethod = "DELETE";

const send = (path, method, params) => {
    return fetch(`http://localhost:2525/api/${path}`, {
        method,
        // mode: 'no-cors', // no-cors, *cors, same-origin
        // cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        credentials: "include", // include, *same-origin, omit
        headers: {
            "Content-Type": "application/json",
        },
        body: params? JSON.stringify(params) : null
    })
        .then(async function (data) {
           const result = await data.text();
            return JSON.parse(result );
        })
        .catch(error => {
            console.log(error)
            return {error: "System error"};
        })    
}

export const api = {
    getMessages: () => {
        return send("messages/messages", get)
    },

    addMessage: (data) => {
        return send("messages/messages", post, data)
    },

    login: ({email, password}  ) => {
        return send("auth/login", post, {email, password})
    },

    register: ({email, password, nik}) => {
        return send("users/register", post, {email, password, nik})
    },

    deleteMessage: (id) => {
        debugger
        return send(`messages/messages/${id}`, deleteMethod )
    }

}