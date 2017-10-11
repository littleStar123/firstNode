var express = require("express");
var app = express();
var fs = require("fs");
var cookieParser = require('cookie-parser');
app.use(cookieParser());

app.get('/', function(req, res) {
	res.sendFile(__dirname + "/" + "index.htm");
	console.log("Cookies: ", req.cookies)
});

app.get('/listData', function(req, res) {
	fs.readFile(__dirname + "/" + "users.json", "utf8", function(err, data) {
		console.log(data);
		res.end(data);
	});
});

app.get('/listUsers', function(req, res) {
	fs.readFile(__dirname + "/" + "users.json", "utf8", function(err, data) {
		console.log(data);
		res.end(data);
	});
});
app.get('/addUser_g', function(req, res) {
	console.log(req.query)
	fs.readFile(__dirname + "/" + "users.json", "utf8", function(err, data) {
		data = JSON.parse(data);
		console.log(data);
		var id = data.users[data.users.length - 1].id;
		req.query.id = id + 1;
		data.users.push(req.query)
		console.log(data);
		fs.writeFile('users.json', JSON.stringify(data), function(err) {
			if(err) {
				return console.error(err);
			}
			console.log("数据写入成功！");
			console.log("--------我是分割线-------------")
			console.log("读取写入的数据！");
			fs.readFile('users.json', function(err, data) {
				if(err) {
					return console.error(err);
				}
				console.log("异步读取文件数据: " + data.toString());
			});
		});
		res.end(JSON.stringify(data))
	})
})
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({
	extended: false
})
app.post('/addUser_p', urlencodedParser, function(req, res) {
	fs.readFile(__dirname + "/" + "users.json", "utf8", function(err, data) {
		data = JSON.parse(data);
		console.log(data);
		var id = data.users[data.users.length - 1].id;
		req.body.id = id + 1;
		data.users.push(req.body)
		console.log(data);
		fs.writeFile('users.json', JSON.stringify(data), function(err) {
			if(err) {
				return console.error(err);
			}
			console.log("数据写入成功！");
			console.log("--------我是分割线-------------")
			console.log("读取写入的数据！");
			fs.readFile('users.json', function(err, data) {
				if(err) {
					return console.error(err);
				}
				console.log("异步读取文件数据: " + data.toString());
			});
		});
		res.end(JSON.stringify(data))
	})
})

app.get('/deleteUser', function(req, res) {
	console.log("delete")
		// First read existing users.
	fs.readFile(__dirname + "/" + "users.json", 'utf8', function(err, data) {
		data = JSON.parse(data);
		delete data["user" + 2];
		fs.writeFile('users.json', JSON.stringify(data), function(err) {
			if(err) {
				return console.error(err);
			}
			console.log("数据写入成功！");
			console.log("--------我是分割线-------------")
			console.log("读取写入的数据！");
			fs.readFile('users.json', function(err, data) {
				if(err) {
					return console.error(err);
				}
				console.log("异步读取文件数据: " + data.toString());
			});
		});
		console.log(data);
		res.end(JSON.stringify(data));
	});
})
var multer  = require('multer');
app.use(multer({ dest: '/tmp/'}).array('file'));
app.post('/file_upload',urlencodedParser, function (req, res) {
	console.log(req.files)
   console.log(req.files[0]);  // 上传的文件信息
   var des_file = __dirname + "/uploadFile/" + req.files[0].originalname;
   console.log(des_file)
   fs.readFile( req.files[0].path, function (err, data) {
        fs.writeFile(des_file, data, function (err) {
         if( err ){
              console.log( err );
         }else{
               response = {
                   message:'File uploaded successfully', 
                   filename:req.files[0].originalname,
              };
         }
          console.log( response );
          res.end( JSON.stringify( response ) );
       });
   });
})

app.get('/:id', function(req, res) { //放最后，不然后面的就获取不到
	// 首先我们读取已存在的用户
	fs.readFile(__dirname + "/" + "users.json", 'utf8', function(err, data) {
		data = JSON.parse(data);
		var user = data["user" + req.params.id]
		console.log(user);
		res.end(JSON.stringify(user));
	});
})

var server = app.listen(8081, function() {
	var host = server.address().address;
	var port = server.address().port;
	console.log("应用实例，访问地址为 http://%s:%s", host, port)
})