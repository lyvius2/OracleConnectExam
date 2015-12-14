/**
 * Created by lyvius2 on 2015-12-11.
 */
module.exports = function(pool){

    // DB Connection Pool에서 연결 가져오기
    var doConnect = function(callback){
        pool.getConnection(function(err, connection){
            if(err){
                console.log("Error : " + new Date() + " DB Connection Pool getConnection - " + err.message);
                return callback(err);
            }
            return callback(err, connection);
        })
    }

    var oracledb = require('oracledb');

    // SQL 쿼리 실행
    var doExecute = function(connection, sql, params, callback){
        connection.execute(sql, params, {autoCommit:false, outFormat: oracledb.OBJECT}, function(err, result){
            if(err){
                console.log("Error : " + new Date() + " SQL Query Execute - " + err.message);
                return callback(err);
            }
            return callback(err, result, '1');
        })
    }

    // 연결 Release
    var doRelease = function(connection){
        connection.release(function(err){
            if(err){
                console.log("Error : " + new Date() + " DB Connection Release - " + err.message);
            }
            return;
        })
    }

    // 일반쿼리 실행
    var doQuery = function(sql, params, callback){
        doConnect(function(err, connection){
            if(err) return callback(err);
            doExecute(connection, sql, params, function(err, result){
                if(err) {
                    connection.rollback(function(err){
                        doRelease(connection);
                        return callback(err);
                    })
                }
                connection.commit(function(err){
                    doRelease(connection);
                    return callback(err, result);
                })
            })
        })
    }

    module.exports.doConnect = doConnect;
    module.exports.doExecute = doExecute;
    module.exports.doRelease = doRelease;
    module.exports.doQuery = doQuery;
}