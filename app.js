var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);

var db = require('./sql/dbAction');
var sqltext = require('./sql/selectSql');
// connection pool을 이용한 sample.
app.get('/list', function(req, res){
  db.doQuery(sqltext, {}, function(err, result){
    if(err){
      res.send(err.message);
    } else {
      res.render('listSample',{list:result.rows});
    }
  });
  /*
  db.doConnect(function(err, connection){
    if(err){
      console.log('Err : Unable to use DB connection - ' + err.message);
      return;
    }
    db.doExecute(connection, sqltext.testSql, {}, function(err, result){
      if(err){
        console.log('Err : ' + err.message);
        db.doRelease(connection);
        res.send('Error');
      } else {
        console.log('Result',result.rows);
        db.doRelease(connection);
        res.render('listSample',{list:result.rows});
      }
    });
  });
  */
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;