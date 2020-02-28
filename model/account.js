var pool = require('./pool'),
    message = require('./Message'),
    uuid = require('node-uuid'),
    crypto = require('crypto');

var account = {
    // 注册账号
    addAccount : function(req, res){
        var username = req.query.username;
        if(!username){
            message.errno = -1;
            message.msg = "请输入账号";
            res.json(message);
        }
        var password = req.query.password;
        if(!password){
            message.errno = -1;
            message.msg = "密码不能为空";
            res.json(message);
        }
        var sex = req.query.sex ? req.query.sex : 2;
        // 先查询用户名是否已被注册
        var sql = "SELECT COUNT(1) AS count FROM account WHERE user_name = '" + username + "'" ;
        pool.getConnection(function(err, connection){
            connection.query(sql, function(err, rows){
                connection.release();
                if(!rows){
                    message.errno = -1;
                    message.msg = "服务器繁忙，请稍后再请求";
                    return res.json(message);
                }
                if(rows[0].count > 0){
                    message.errno = -1;
                    message.msg = "该用户名已注册,请换另一个";
                    return res.json(message);
                }else{
                    var id = uuid.v1().replace(/-/g, '');
                    var mdPassword = crypto.createHash('md5').update(password).digest("hex");
                    sql = "INSERT INTO account (id,user_name,`password`,sex) VALUES('" + id + "', '" + username + "', '" + mdPassword + "', '"+ sex + "')";
                    connection.query(sql, function(err, rows){
                        if(err){
                            message.errno = -1;
                            message.msg = "注册失败";
                            res.json(message);
                        }
                        message.errno = 0;
                        message.msg = "注册成功";
                        message.data = {"username": username,"accountId":id}
                        return res.json(message);
                    });
                }
            });

        });

    },

    // 帐号登录
    login : function(req, res){
        var username = req.query.username;
        var password = req.query.password;
        var mdPassword = crypto.createHash('md5').update(password).digest("hex");
        var sql = "SELECT id AS accountId, user_name AS username, password FROM account WHERE user_name = '" + username + "'";
        pool.getConnection(function(err, connection){
            connection.query(sql, function(err, rows){
                connection.release();
                if(!rows[0]){
                    message.errno = -1;
                    message.msg = "帐号不存在";
                    return res.json(message);
                }
                var password = '';
                if(rows[0]){
                    password = rows[0].password;
                }
                if(!password || password != mdPassword){
                    message.errno = -1;
                    message.msg = "密码错误，请重新输入";
                    return res.json(message);
                }else {
                    message.errno = 0;
                    message.msg = "请求成功";
                    message.data = {"accountId":rows[0].accountId};
                    return res.json(message);
                }
            });

        });
    }

};

module.exports = account;