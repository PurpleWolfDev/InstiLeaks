const jsonwebtoken = require("jsonwebtoken");
require("dotenv").config({path:__dirname+"./../.env"});

const jwtAssign = (data) => {
    return jsonwebtoken.sign(data, process.env.jwt_key);
};