var pool = require('./pool'),
    message = require('./Message'),
    uuid = require('node-uuid');

var contacts = {
    // 添加联系人
    addContact : function(req, res){
        var phone = req.query.phone;
        if(!(/^1[3456789]\d{9}$/.test(phone))){
            message.errno = -1;
            message.msg = "请输入正确的手机号码";
            return res.json(message);
        }
        var name = req.query.name;
        if(!name){
            message.errno = -1;
            message.msg = "请输入姓名";
            return res.json(message);
        }
        var accountId = req.query.accountId;
        if(!accountId){
            message.errno = -1;
            message.msg = "操作失败，请稍后重试";
            return res.json(message);
        }
        var id = uuid.v1().replace(/-/g, '');
        var sex = req.query.sex ? req.query.sex : 2;
        var address = req.query.address ? req.query.address : '';
        var sql = "SELECT COUNT(1) AS count FROM contacts WHERE name = '" + name + "'"
        pool.getConnection(function(err, connection){
            connection.query(sql, function(err, rows){
                if(!rows){
                    message.errno = -1;
                    message.msg = "服务器繁忙，请稍后再请求";
                    return res.json(message);
                }
                if(rows[0].count > 0){
                    message.errno = -1;
                    message.msg = "该联系人已添加,请勿重复添加";
                    return res.json(message);
                }else{
                    sql = "INSERT INTO contacts (id, `name`, phone, account_id, sex, address) VALUES('" + id + "', '" + name + "', '" + phone + "', '" + accountId + "', '" + sex + "', '" + address + "')";;
                    connection.query(sql, function(err, rows){
                        connection.release();
                        if(err){
                            console.log(err)
                            message.msg = "添加联系人失败";
                            return res.json(message);
                        }
                        message.errno = 0;
                        message.msg = "添加成功";

                        return res.json(message);
                    });
                }
            });
        });
    },
    // 展示联系人
    showContact : function(req, res){
        var accountId = req.query.accountId;
        if(!accountId){
            message.errno = -1;
            message.msg = "操作失败，请稍后重试";
            return res.json(message);
        }
        var sql = "SELECT id, `name`, phone, account_id, sex, address FROM contacts WHERE account_id = '" + accountId + "'";
        pool.getConnection(function(err, connection){
            connection.query(sql, function(err, rows){
                connection.release();
                if(err){
                    message.msg = "展示联系人失败";
                    return res.json(message);
                }
                message.errno = 0;
                message.msg = "展示联系人成功";
                message.data = rows
                return res.json(message);
            });

        });
    },
    // 删除联系人
    removeContact : function(req, res){
        var id = req.query.id;
        if(!id){
            message.errno = -1;
            message.msg = "操作失败，请稍后重试";
            return res.json(message);
        }
        var sql = "DELETE FROM contacts WHERE id = '" + id + "'";
        pool.getConnection(function(err, connection){
            connection.query(sql, function(err, rows){
                connection.release();
                if(err){
                    message.msg = "删除联系人失败";
                    return res.json(message);
                }
                message.errno = 0;
                message.msg = "删除联系人成功";
                message.data = {};
                return res.json(message);
            });

        });
    },
    // 修改联系人
    updateContact : function(req, res){
        var id = req.query.id;
        if(!id){
            message.errno = -1;
            message.msg = "操作失败，请稍后重试";
            return res.json(message);
        }
        var name = req.query.name;
        if(!name){
            message.errno = -1;
            message.msg = "请输入姓名";
            return res.json(message);
        }
        var phone = req.query.phone;
        if(!phone || !(/^1[3456789]\d{9}$/.test(phone))){
            message.errno = -1;
            message.msg = "请输入正确的手机号码";
            return res.json(message);
        }
        var sex = req.query.sex ? req.query.sex : 2;
        var address = req.query.address;
        var sql = "UPDATE contacts SET `name` = '" + name + "' ,phone = '" + phone + "', sex = '" + sex + "', address = '" + address + "' WHERE id = '" + id + "'";
        pool.getConnection(function(err, connection){
            connection.query(sql, function(err, rows){
                connection.release();
                if(err){
                    message.msg = "修改联系人失败";
                    console.log(err)
                    return res.json(message);
                }
                message.errno = 0;
                message.msg = "修改联系人成功";
                return res.json(message);
            });

        });
    }
}

module.exports = contacts;