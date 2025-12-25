const {createClient} = require("redis");
require("dotenv").config({
    path:__dirname+"./../.env"
});
const redis = createClient({
    username: 'default',
    password: 'EVyvbAK5nWrmJWhHfXWtPVwCgXRs7VIm',
    socket: {
        host: 'redis-16292.c330.asia-south1-1.gce.cloud.redislabs.com',
        port: 16292
    }
});

redis.on("connect", () => console.log("✅ Redis Connected"));
redis.on("error", (err) => console.error("❌ Redis Error:", err));
(async() => {

await redis.connect();

})();
module.exports = {redis}
