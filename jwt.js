const Koajwt = require('koa-jwt');
const SECRET = "!HG$$^J8&&*J$#76%^";
const jwtInstance = Koajwt({secret: SECRET});
const jwt = require('jsonwebtoken');

exports.jwt = () => jwtInstance;

exports.errorHandler = (ctx, next) => {
    return next().catch( (err) => {
        if (err.status == 401) {
            ctx.status = 401;
            ctx.body = {error: "Not authorized"};
        } else {
            throw err;
        }
    });
};

exports.issue = (payload) => {
    return jwt.sign(payload, SECRET);
};