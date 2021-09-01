// const options = require("./option");
const option = {
  host: "172.17.13.17",
  user: "root",
  password: "123456",
  port: "3306",
  database: "iptv",
  connectTimeout: 5000,
  multipleStatements: false,
};
const mysql = require("mysql");
let pool;
repool();


let msg = "处理成功";
let succ = true;
let code = 200;

function getLiveList(value) {
  // return (connQuery = pool.query("select * from " + tableName, (e, r) =>
  //   res.json(new Result({ data: r ,success:ifsucc}))
  // ));
  return new Promise((res, rej) => {
    pool.getConnection((err, conn) => {
      conn.query("select * from " + value, (e, r) => {
        if (e) {
          succ = false;
          code = e.code;
          msg = "处理失败" + e.sqlMessage || "";
        }
        msg = "处理成功"
        succ = true
        code = 200;
        console.log(r);
        return res(new Result({ code, msg, data : r, success: succ }))
      });
      conn.release();
    });
  });
}



class Result {
    constructor({ code = 200, msg = "", data = {}, success = true }){
        this.code = code;
        this.msg = msg;
        this.success = success; 
        this.data = data;
    }
}

//断线重连
function repool() {
  pool = mysql.createPool({
    ...option,
    waitForConnections: true, //当无连接池可用时，等待 抛出
    connectionLimit: 100, //链接限制数
    queueLimit: 0, //最大链接等待数0 不限制
  });
  pool.on(
    "error",
    (err) => err.code === "PROTOCAL_CONNECTION_LOST" && setTimeout(repool, 2000)
  );
}

module.exports = { getLiveList, pool, Result};
