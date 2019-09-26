import axios from "axios"

export default async function (req, res, next) {
    // req is the Node.js http request object
    console.log("server code...")
            const ip = await axios.post("https://s.altnet.rippletest.net:51234", {
                "method": "account_currencies",
                "params": [{
                    "account": "rJ9kLgNCbyW3tAW1TuDyvAyXdr8oKH3VeR",
                    "account_index": 0,
                    "ledger_index": "validated",
                    "strict": true
                }]
            })
            console.log(ip)

    // res is the Node.js http response object

    // next is a function to call to invoke the next middleware
    // Don't forget to call next at the end if your middleware is not an endpoint!
    next()
}