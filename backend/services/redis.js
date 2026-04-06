const {createClient} = require("redis");
require("dotenv").config({
    path:__dirname+"./../.env"
});
const redis = createClient({
    username: 'default',
    password: 'FNsG61RyLdMxlVzitlPPAjz24SDDiAvN',
    socket: {
        host: 'redis-13834.c91.us-east-1-3.ec2.cloud.redislabs.com',
        port: 13834
    }
});

redis.on("connect", () => console.log("✅ Redis Connected"));
redis.on("error", (err) => console.error("❌ Redis Error:", err));
(async() => {

await redis.connect();

})();
module.exports = {redis}
