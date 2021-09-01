// const express = require("express");
const Koa = require('koa');
const staticFiles = require("koa-static")

const app = new Koa();

// const app = express();
// const cors = require("cors");
// const bodyParser = require("body-parser");
const bodyParser = require("koa-bodyparser");
const router = require('./index');
// app.use(cors) //解决跨域
// app.use(bodyParser.json());
app.use(bodyParser());
app.use(async (ctx,next)=>{
    ctx.set("Access-Control-Allow-Origin", "*");
    await next();
})

//测试
// app
//     .use(passport.initialize())
//     .use(passport.session())
// app.use(bodyParser.urlencoded({ extended: false })); //表单请求


// app.use('/',router)

// app.use(router.routes())
// app.use(router.allowedMethods())

// app.use( async (ctx,next)=>{ 
//     ctx.body='hello koa2'
//     // console.log('ctx',ctx);
//     // await next()
// })

app.use(staticFiles(__dirname + "/dist"));
app
  .use(router.routes())


app.listen(9797, () => {
  console.log("服务器启动成功");
});
//解决跨域
// app.all('*',function (req, res, next) {
//     res.header('Access-Control-Allow-Origin', '*');
//     res.header('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With');
//     res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
//     if (req.method == 'OPTIONS') {
//       res.send(200);
//     }
//     else {
//       next();
//     }
//   });

// app.all('*', function(req, res, next) {
//     res.header("Access-Control-Allow-Origin", "*");
//     res.header("Access-Control-Allow-Headers", "X-Requested-With");
//     res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
//     res.header("X-Powered-By",' 3.2.1')
//     res.header("Content-Type", "application/json;charset=utf-8");
//     next();
// });