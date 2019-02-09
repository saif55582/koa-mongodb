const Koa = require('koa');
const Router = require('koa-router');
const bodyParser = require('koa-body');
const logger = require('koa-logger');
const mongo = require('./mongo');
const ObjectID = require('mongodb').ObjectID;
const jwt = require("./jwt");


const app = new Koa();
const router = new Router();
const securedRouter = new Router();
mongo(app);

app.use(logger());
app.use(bodyParser({
    multipart: true
}));

app.use(router.routes()).use(router.allowedMethods());
app.use(securedRouter.routes()).use(securedRouter.allowedMethods());

securedRouter.use(jwt.errorHandler);
securedRouter.use(jwt.jwt());

router.post('/login', async (ctx) => {
    let username = ctx.request.body.username;
    let password = ctx.request.body.passsword;

    var user = await ctx.app.people.findOne({email: username});
    if (user) {
        ctx.body =  {
            user: user,
            accessToken: jwt.issue(user)
        };
    } else {
        ctx.status = 401;
        ctx.body = {error: "Invalid credentials"};
    }

});

securedRouter.get('/developers', async (ctx) => {
    const people = ctx.app.people;
    ctx.body = await people.find().toArray();
});

securedRouter.get("/developers/:id", async (ctx) => {
    ctx.body = await ctx.app.people.find({_id: ObjectID(ctx.params.id)}).toArray();
});

securedRouter.post('/developers', async (ctx) => {
    const people = ctx.app.people;
    ctx.body = await people.insert(ctx.request.body)
});

securedRouter.put('/developers/:id', async (ctx) => {
    const where = {_id: ObjectID(ctx.params.id)}
    const data = ctx.request.body;
    //ctx.body = await data;
    ctx.body = await ctx.app.people.updateOne(where, {   
        $set: {
            name: ctx.request.body.name, 
            email: ctx.request.body.email
        }});
});

securedRouter.delete('/developers/:id',  async (ctx) => {
    const where = {_id: ObjectID(ctx.params.id)};
    ctx.body = await ctx.app.people.deleteOne(where)
});

app.listen(3000);