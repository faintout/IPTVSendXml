const { getLiveList, pool, Result, addTbale } = require("./connect");
const axios = require('axios');
const Router = require("koa-router");
const router = new Router();
const queryString = require("querystring");
const cache = require("memory-cache");

router.get("/", (ctx, next) => {
    ctx.body = "<h1>服务器请求成功</h1>";
});
router.post("/sendXml", async (ctx, next) => {
    let result= new Result({})
    console.log(ctx.request.body);
    //缓存播放列表
    cache.put('playIdListStr',ctx.request.body.playIdList)
    //发送请求
    let res = await axios.post(
        'http://172.17.13.151:8313', ctx.request.body.xml
    )
    if (res.status == 200) {
        ctx.body = result
    } else {
        result.success = false
        ctx.body = result
    }
});

//获取节目清单
router.post("/getLiveList", async (ctx, next) => {
    ctx.body = await getLiveList('t_Live_2021_08_31_copy')
});

//获取播放列表
router.post("/getLivePlayIdList", async (ctx, next) => {
    let result  = new Result({})
    result.data = cache.get('playIdListStr')
    ctx.body = result
    // 获取缓存数据
});

module.exports = router;
