var settings = require('../settings');
var mysql = require('../models/db');
var async = require('async');
var debug = require('debug')('myapp:index');
var ejsExcel = require("./ejsExcel");
var fs = require("fs");
var formidable = require('formidable');
var request = require("request");
var crypto = require("crypto");
var qiniu = require("qiniu");
var Iconv = require('iconv-lite');
var Med = require('../models/med.js');
var Port = require('../models/port.js');
var Cruisecompany = require('../models/cruisecompany.js');
var Cruiseship = require('../models/cruiseship.js');
var Travelnotes = require('../models/travelnotes.js');
var Cruiselineinfo = require('../models/cruiselineinfo.js');
var Shipcabin = require('../models/shipcabin.js');
var Shipservice = require('../models/shipservice.js');
var Shipdinner = require('../models/shipdinner.js');
var Theme = require('../models/theme.js');
var Share = require('../models/share.js');

exports.print = function(req, res) {
	var id = req.query.id;
	var sql = "select * from v_passenger where id = "+id;
	mysql.query(sql, function(err, result) {
		if(err) return console.error(err.stack);
		console.log(result);
		res.render('print', {
			layout: false,
			result:result[0]
		});
	});
}

exports.admin_checkin = function(req, res) {
		res.render('admin_checkin', {
			layout: false
		});
}

exports.home = function(req, res) {
	res.render('home', {
		layout: "layout"
	});
}

exports.login = function(req, res) {
	res.render('login', {
		layout: false
	});
}

exports.view_news = function(req, res) {
	res.render('view_news', {
		layout: "layout"
	});
}

exports.leader = function(req, res) {
	res.render('leader', {
		layout: false
	});
}

exports.news = function(req, res) {
	res.render('news', {
		layout: "layout"
	});
}

exports.view_notice = function(req, res) {
	res.render('view_notice', {
		layout: "layout"
	});
}

exports.notice = function(req, res) {
	res.render('notice', {
		layout: "layout"
	});
}

exports.view_static = function(req, res) {
	res.render('view_static', {
		layout: "layout"
	});
}

exports.view_faq = function(req, res) {
	res.render('view_faq', {
		layout: "layout"
	});
}

exports.leader1 = function(req, res) {
	var accessKey = settings.accessKey;
	var secretKey = settings.secretKey;
	var bucket = 'leader';
	var mac = new qiniu.auth.digest.Mac(accessKey, secretKey);
	console.log(mac);
	var options = {
  		scope: bucket,
	};
	var putPolicy = new qiniu.rs.PutPolicy(options);
	var uploadToken=putPolicy.uploadToken(mac);
	console.log(uploadToken);
	res.render('leader1', {
		layout: "layout",
		uploadToken:uploadToken
	});
}

exports.view_note = function(req, res) {
	res.render('view_note', {
		layout: "layout"
	});
}

exports.faq = function(req, res) {
	res.render('faq', {
		layout: "layout"
	});
}

exports.view_tt = function(req, res) {
	res.render('view_tt', {
		layout: "layout"
	});
}

exports.view_leader = function(req, res) {
	res.render('view_leader', {
		layout: "layout"
	});
}

exports.static_page = function(req, res) {
	res.render('static_page', {
		layout: "layout"
	});
}

exports.note = function(req, res) {
	res.render('note', {
		layout: "layout"
	});
}

exports.view_travel = function(req, res) {
	res.render('view_travel', {
		layout: "layout"
	});
}

exports.travel = function(req, res) {
	var med = new Med();
	var id = req.query.id;
	med.get(function(result) {
		if(result[1] == "r") {
			console.log("get info error!");
		} else {
			var cruiseship = new Cruiseship();
			cruiseship.get(function(result1) {
				if(result1[1] == "r") {
					console.log("get info error!");
				} else {
					var cruisecompany = new Cruisecompany();
					cruisecompany.get(function(result2) {
						if(result2[1] == "r") {
							console.log("get info error!");
						} else {
							var travelnotes = new Travelnotes("", "", "", "", "", "", "");
							travelnotes.get(function(result3) {
								if(result3[1] == "r") {
									console.log("get info error!");
								} else {

									var theme = new Theme();
									theme.get(function(result4) {
										if(result4[1] == "r") {
											console.log("get info error!");
										} else {
											res.render('travel', {
												layout: "layout",
												med: result,
												cruiseship: result1,
												cruisecompany: result2,
												id: id,
												re3: result3,
												theme: result4
											});
										}
									});
								}
							});
						}
					});
				}
			});
		}
	});
}

exports.travelsubmit = function(req, res) {
	var txtCategory1 = req.body['txtCategory1'];
	var txtCategory2 = req.body['txtCategory2'];
	var txtCategory3 = req.body['txtCategory3'];
	var rtfImg = req.body['rtfImg'];
	var txtText = req.body['editor02'];
	var txtTitle = req.body['txtTitle'];
	var stype = req.body['stype'];
	var txtAbbr = req.body['txtAbbr'];

	if(stype == "1") {
		var travelnotes = new Travelnotes("", txtCategory1, txtCategory2, txtCategory3, rtfImg, txtText, txtTitle, txtAbbr);
		travelnotes.save(function(err) {

			if(err == "error") {
				console.log("error!");
			}
			res.redirect('/view_travel');
		});
	} else {
		var travelnotes = new Travelnotes(req.body['docid'], txtCategory1, txtCategory2, txtCategory3, rtfImg, txtText, txtTitle, txtAbbr);
		travelnotes.update(function(err) {

			if(err == "error") {
				console.log("error!");
			}
			res.redirect('/view_travel');
		});
	}
};

exports.userdo = function(req, res) {
	res.setHeader("Access-Control-Allow-Origin", "*");
	var sql = req.params.sql;
	if(sql == "checkLogin") {
		var uname = req.param("uname");
		var pwd = req.param("pwd");
		var sql = "select * from admin where username = '" + uname + "'";
		debug(sql);
		mysql.query(sql, function(err, result) {
			if(err) return console.error(err.stack);
			if(!result[0]) {
				res.send("400");
				return;
			}
			if(result[0].password == pwd) {
				res.json(result[0]);
			} else {
				res.send("400");
			}
		});
	}else if(sql == "getInfo") {
										request({
										    url: 'http://www.cruisesh.com:7777/test',
										    method: 'GET'
										}, function(err, response, body) {
										    if (!err && response.statusCode == 200) {

										    	res.send(body);
										    }
										});
		/*
		var shipNo = req.param("shipNo");
		var passPort = req.param("passPort");
										request({
										    url: 'http://106.14.63.154:8068/Tagapi/FindNameByCardNo?cardNo='+passPort+'&key=0D914187595A4602BF820A9AF4E9A264',
										    method: 'GET'
										}, function(err, response, body) {
										    if (!err && response.statusCode == 200) {
										    	console.log(body);
										    	var r = JSON.parse(body);
										    	var result = (r.result);
										    	var name = (r.content);
										    	var o = {
										    		name:name,
										    		result:result
										    	}
										    	res.json(o);
										    }
										});
		*/
	}else if(sql == "uploadInfo") {
		
		var plist = req.param("plist");
		console.log(plist);
		var arr1 = plist.split(";");
		for(var i=1;i<arr1.length;i++){
			if(arr1[i].indexOf("@")!=-1){
				console.log(arr1[i]);
				var arr2 = arr1[i].split("@");
				var sql1 = "insert into checkin_log(no,time,ship_no) values('"+arr2[1]+"','"+arr2[2]+"','"+arr2[0]+"')";
				mysql.query(sql1, function(err, result) {
					if(err) return console.error(err.stack);
					res.send("300");
				});
			}
		}
	}
}

exports.leaderdo = function(req, res) {
	res.setHeader("Access-Control-Allow-Origin", "*");
	var sql = req.params.sql;
	if(sql == "create") {
		var mode = req.param("mode");
		var name = req.param("name");
		var no = req.param("no");
		var tel = req.param("tel");
		var img = req.param("img");
		var weixin = req.param("weixin");
		var editid = req.param("editid");
		
		/*编辑模式*/
		if(mode == "edit") {
			var sql = "update leader set ";
			sql += " name = '" + name + "',";
			sql += " no = '" + no + "',";
			sql += " tel = '" + tel + "',";
			sql += " img = '" + img + "',";
			sql += " weixin = '" + weixin + "'";
			sql += " where id = " + editid;
			console.log(sql);
			mysql.query(sql, function(err, result) {
				if(err) return console.error(err.stack);
				if(result.affectedRows == 1) {
					res.send("300");
				}
			});
		} else {
			var sql = "insert into leader (name,no,tel,img,weixin) values ('" + name + "','" + no + "','" + tel + "','"+img+"','" + weixin + "')";
			mysql.query(sql, function(err, result) {
				if(err) return console.error(err.stack);
				if(result.affectedRows == 1) {
					res.send("300");
				}
			});
		}
	} else if(sql == "get") {
		var page = parseInt(req.param("indexPage"));
		var LIMIT = 30;
		page = (page && page > 0) ? page : 1;
		var limit = (limit && limit > 0) ? limit : LIMIT;

		var change = "";

		var sql1 = "select * from leader where 1=1 " + change + " order by id desc limit " + (page - 1) * limit + "," + limit;
		var sql2 = "select count(*) as count from leader where 1=1 " + change;
		debug(sql1);
		async.waterfall([function(callback) {
			mysql.query(sql1, function(err, result) {
				if(err) return console.error(err.stack);
				
				callback(null, result);
			});
		}, function(result, callback) {
			mysql.query(sql2, function(err, rows) {
				if(err) return console.error(err.stack);
				callback(err, rows, result);
			});
		}], function(err, rows, result) {
			if(err) {
				console.log(err);
			} else {

				var total = rows[0].count;
				var totalpage = Math.ceil(total / limit);
				var isFirstPage = page == 1;
				var isLastPage = ((page - 1) * limit + result.length) == total;

				var ret = {
					total: total,
					totalpage: totalpage,
					isFirstPage: isFirstPage,
					isLastPage: isLastPage,
					record: result
				};
				res.json(ret);
			}
		});
	} else if(sql == "del") {
		var id = req.param("id");
		var sql = "delete from leader where id = " + id;
		mysql.query(sql, function(err, result) {
			if(err) return console.error(err.stack);
			if(result.affectedRows == 1) {
				res.send("300");
			}
		});
	} else if(sql == "getById") {
		var id = req.param("id");
		var sql = "select * from leader where id = " + id;
		mysql.query(sql, function(err, result) {
			if(err) return console.error(err.stack);
			res.json(result);
		});
	} else if(sql == "getByIdAndNext") {
		var id = req.param("id");
		var sql = "select * from news where id = " + id;
		mysql.query(sql, function(err, result) {
			if(err) return console.error(err.stack);
			var sql1 = "select * from news where id = (select max(id) from news where id < " + id + ")";
			mysql.query(sql1, function(err1, result1) {
				if(err1) return console.error(err1.stack);
				var sql2 = "select * from news where id = (select min(id) from news where id > " + id + ")";
				mysql.query(sql2, function(err2, result2) {
					if(err2) return console.error(err2.stack);
					result[0].front = result1;
					result[0].next = result2;
					res.json(result);
				});
			});
		});
	}
}

exports.newsdo = function(req, res) {
	res.setHeader("Access-Control-Allow-Origin", "*");
	var sql = req.params.sql;
	if(sql == "create") {
		var mode = req.param("mode");
		var title = req.param("title");
		var post = req.param("post");
		var summary = req.param("summary");
		var source = req.param("source");
		var editid = req.param("editid");
		/*对单引号进行转义*/
		title = title.replace(/'/g, "\\'");
		post = post.replace(/'/g, "\\'");
		/*编辑模式*/
		if(mode == "edit") {
			var sql = "update news set ";
			sql += " title = '" + title + "',";
			sql += " summary = '" + summary + "',";
			sql += " source = '" + source + "',";
			sql += " post = '" + post + "'";
			sql += " where id = " + editid;
			mysql.query(sql, function(err, result) {
				if(err) return console.error(err.stack);
				if(result.affectedRows == 1) {
					res.send("300");
				}
			});
		} else {
			var sql = "insert into news (title,post,summary,publishAt,source) values ('" + title + "','" + post + "','" + summary + "',now(),'" + source + "')";
			mysql.query(sql, function(err, result) {
				if(err) return console.error(err.stack);
				if(result.affectedRows == 1) {
					res.send("300");
				}
			});
		}
	} else if(sql == "get") {
		var page = parseInt(req.param("indexPage"));
		var LIMIT = 10;
		page = (page && page > 0) ? page : 1;
		var limit = (limit && limit > 0) ? limit : LIMIT;

		var change = "";

		var sql1 = "select * from news where 1=1 " + change + " order by publishAt desc limit " + (page - 1) * limit + "," + limit;
		var sql2 = "select count(*) as count from news where 1=1 " + change;
		debug(sql1);
		async.waterfall([function(callback) {
			mysql.query(sql1, function(err, result) {
				if(err) return console.error(err.stack);
				for(var i in result) {
					result[i].publishAt = (result[i].publishAt).Format("yyyy-MM-dd hh:mm:ss");
				}
				callback(null, result);
			});
		}, function(result, callback) {
			mysql.query(sql2, function(err, rows) {
				if(err) return console.error(err.stack);
				callback(err, rows, result);
			});
		}], function(err, rows, result) {
			if(err) {
				console.log(err);
			} else {

				var total = rows[0].count;
				var totalpage = Math.ceil(total / limit);
				var isFirstPage = page == 1;
				var isLastPage = ((page - 1) * limit + result.length) == total;

				var ret = {
					total: total,
					totalpage: totalpage,
					isFirstPage: isFirstPage,
					isLastPage: isLastPage,
					record: result
				};
				res.json(ret);
			}
		});
	} else if(sql == "del") {
		var id = req.param("id");
		var sql = "delete from news where id = " + id;
		mysql.query(sql, function(err, result) {
			if(err) return console.error(err.stack);
			if(result.affectedRows == 1) {
				res.send("300");
			}
		});
	} else if(sql == "getById") {
		var id = req.param("id");
		var sql = "select * from news where id = " + id;
		mysql.query(sql, function(err, result) {
			if(err) return console.error(err.stack);
			res.json(result);
		});
	} else if(sql == "getByIdAndNext") {
		var id = req.param("id");
		var sql = "select * from news where id = " + id;
		mysql.query(sql, function(err, result) {
			if(err) return console.error(err.stack);
			var sql1 = "select * from news where id = (select max(id) from news where id < " + id + ")";
			mysql.query(sql1, function(err1, result1) {
				if(err1) return console.error(err1.stack);
				var sql2 = "select * from news where id = (select min(id) from news where id > " + id + ")";
				mysql.query(sql2, function(err2, result2) {
					if(err2) return console.error(err2.stack);
					result[0].front = result1;
					result[0].next = result2;
					res.json(result);
				});
			});
		});
	}
}

exports.faqdo = function(req, res) {
	res.setHeader("Access-Control-Allow-Origin", "*");
	var sql = req.params.sql;
	if(sql == "create") {
		var mode = req.param("mode");
		var title = req.param("title");
		var post = req.param("post");
		var editid = req.param("editid");
		/*对单引号进行转义*/
		title = title.replace(/'/g, "\\'");
		post = post.replace(/'/g, "\\'");
		/*编辑模式*/
		if(mode == "edit") {
			var sql = "update faq set ";
			sql += " title = '" + title + "',";
			sql += " post = '" + post + "'";
			sql += " where id = " + editid;
			mysql.query(sql, function(err, result) {
				if(err) return console.error(err.stack);
				if(result.affectedRows == 1) {
					res.send("300");
				}
			});
		} else {
			var sql = "insert into faq (title,post) values ('" + title + "','" + post + "')";
			mysql.query(sql, function(err, result) {
				if(err) return console.error(err.stack);
				if(result.affectedRows == 1) {
					res.send("300");
				}
			});
		}
	} else if(sql == "get") {
		var page = parseInt(req.param("indexPage"));
		var LIMIT = 8;
		page = (page && page > 0) ? page : 1;
		var limit = (limit && limit > 0) ? limit : LIMIT;

		var change = "";

		var sql1 = "select * from faq where 1=1 " + change + " order by id desc limit " + (page - 1) * limit + "," + limit;
		var sql2 = "select count(*) as count from faq where 1=1 " + change;
		debug(sql1);
		async.waterfall([function(callback) {
			mysql.query(sql1, function(err, result) {
				if(err) return console.error(err.stack);
				callback(null, result);
			});
		}, function(result, callback) {
			mysql.query(sql2, function(err, rows) {
				if(err) return console.error(err.stack);
				callback(err, rows, result);
			});
		}], function(err, rows, result) {
			if(err) {
				console.log(err);
			} else {

				var total = rows[0].count;
				var totalpage = Math.ceil(total / limit);
				var isFirstPage = page == 1;
				var isLastPage = ((page - 1) * limit + result.length) == total;

				var ret = {
					total: total,
					totalpage: totalpage,
					isFirstPage: isFirstPage,
					isLastPage: isLastPage,
					record: result
				};
				res.json(ret);
			}
		});
	} else if(sql == "del") {
		var id = req.param("id");
		var sql = "delete from faq where id = " + id;
		mysql.query(sql, function(err, result) {
			if(err) return console.error(err.stack);
			if(result.affectedRows == 1) {
				res.send("300");
			}
		});
	} else if(sql == "getById") {
		var id = req.param("id");
		var sql = "select * from faq where id = " + id;
		mysql.query(sql, function(err, result) {
			if(err) return console.error(err.stack);
			res.json(result);
		});
	} else if(sql == "getByIdAndNext") {
		var id = req.param("id");
		var sql = "select * from news where id = " + id;
		mysql.query(sql, function(err, result) {
			if(err) return console.error(err.stack);
			var sql1 = "select * from news where id = (select max(id) from news where id < " + id + ")";
			mysql.query(sql1, function(err1, result1) {
				if(err1) return console.error(err1.stack);
				var sql2 = "select * from news where id = (select min(id) from news where id > " + id + ")";
				mysql.query(sql2, function(err2, result2) {
					if(err2) return console.error(err2.stack);
					result[0].front = result1;
					result[0].next = result2;
					res.json(result);
				});
			});
		});
	} else if(sql == "getAll") {
		var id = req.param("id");
		var sql = "select * from faq";
		mysql.query(sql, function(err, result) {
			if(err) return console.error(err.stack);
			res.json(result);
		});
	}
}

exports.noticedo = function(req, res) {
	res.setHeader("Access-Control-Allow-Origin", "*");
	var sql = req.params.sql;
	if(sql == "create") {
		var mode = req.param("mode");
		var title = req.param("title");
		var post = req.param("post");
		var editid = req.param("editid");
		/*对单引号进行转义*/
		title = title.replace(/'/g, "\\'");
		post = post.replace(/'/g, "\\'");
		/*编辑模式*/
		if(mode == "edit") {
			var sql = "update notice set ";
			sql += " title = '" + title + "',";
			sql += " post = '" + post + "'";
			sql += " where id = " + editid;
			mysql.query(sql, function(err, result) {
				if(err) return console.error(err.stack);
				if(result.affectedRows == 1) {
					res.send("300");
				}
			});
		} else {
			var sql = "insert into notice (title,post,publishAt) values ('" + title + "','" + post + "',now())";
			mysql.query(sql, function(err, result) {
				if(err) return console.error(err.stack);
				if(result.affectedRows == 1) {
					res.send("300");
				}
			});
		}
	} else if(sql == "get") {
		var page = parseInt(req.param("indexPage"));
		var LIMIT = 8;
		page = (page && page > 0) ? page : 1;
		var limit = (limit && limit > 0) ? limit : LIMIT;

		var change = "";

		var sql1 = "select * from notice where 1=1 " + change + " order by publishAt desc limit " + (page - 1) * limit + "," + limit;
		var sql2 = "select count(*) as count from notice where 1=1 " + change;
		debug(sql1);
		async.waterfall([function(callback) {
			mysql.query(sql1, function(err, result) {
				if(err) return console.error(err.stack);
				for(var i in result) {
					result[i].publishAt = (result[i].publishAt).Format("yyyy-MM-dd hh:mm:ss");
				}
				callback(null, result);
			});
		}, function(result, callback) {
			mysql.query(sql2, function(err, rows) {
				if(err) return console.error(err.stack);
				callback(err, rows, result);
			});
		}], function(err, rows, result) {
			if(err) {
				console.log(err);
			} else {

				var total = rows[0].count;
				var totalpage = Math.ceil(total / limit);
				var isFirstPage = page == 1;
				var isLastPage = ((page - 1) * limit + result.length) == total;

				var ret = {
					total: total,
					totalpage: totalpage,
					isFirstPage: isFirstPage,
					isLastPage: isLastPage,
					record: result
				};
				res.json(ret);
			}
		});
	} else if(sql == "del") {
		var id = req.param("id");
		var sql = "delete from notice where id = " + id;
		mysql.query(sql, function(err, result) {
			if(err) return console.error(err.stack);
			if(result.affectedRows == 1) {
				res.send("300");
			}
		});
	} else if(sql == "getById") {
		var id = req.param("id");
		var sql = "select * from notice where id = " + id;
		mysql.query(sql, function(err, result) {
			if(err) return console.error(err.stack);
			res.json(result);
		});
	} else if(sql == "getemergency") {
		var sql = "select * from notice order by id desc";
		mysql.query(sql, function(err, result) {
			if(err) return console.error(err.stack);
			res.json(result);
		});
	} else if(sql == "getemergencyhome") {
		var sql = "select * from notice order by id desc limit 0,6";
		mysql.query(sql, function(err, result) {
			if(err) return console.error(err.stack);
			res.json(result);
		});
	} else if(sql == "getcal") {
		var d1 = new Date();
		d1 = d1.Format("yyyy-MM-dd");
		var sql = "select * from cruise_cal where datestart = '" + d1 + "'";
		mysql.query(sql, function(err, result) {
			if(err) return console.error(err.stack);
			res.json(result);
		});
	} else if(sql == "getcalAll") {
		var sql = "select * from cruise_cal";
		mysql.query(sql, function(err, result) {
			if(err) return console.error(err.stack);
			res.json(result);
		});
	}
}

exports.staticdo = function(req, res) {
	res.setHeader("Access-Control-Allow-Origin", "*");
	var sql = req.params.sql;
	if(sql == "create") {
		var mode = req.param("mode");
		var name = req.param("name");
		var post = req.param("post");
		var editid = req.param("editid");
		/*对单引号进行转义*/
		name = name.replace(/'/g, "\\'");
		post = post.replace(/'/g, "\\'");
		/*编辑模式*/
		if(mode == "edit") {
			var sql = "update staticpage set ";
			sql += " name = '" + name + "',";
			sql += " post = '" + post + "'";
			sql += " where id = " + editid;
			mysql.query(sql, function(err, result) {
				if(err) return console.error(err.stack);
				if(result.affectedRows == 1) {
					res.send("300");
				}
			});
		} else {
			var sql = "insert into staticpage (name,post) values ('" + name + "','" + post + "')";
			mysql.query(sql, function(err, result) {
				if(err) return console.error(err.stack);
				if(result.affectedRows == 1) {
					res.send("300");
				}
			});
		}
	} else if(sql == "get") {
		var page = parseInt(req.param("indexPage"));
		var LIMIT = 8;
		page = (page && page > 0) ? page : 1;
		var limit = (limit && limit > 0) ? limit : LIMIT;

		var change = "";

		var sql1 = "select * from staticpage where 1=1 " + change + " order by id desc limit " + (page - 1) * limit + "," + limit;
		var sql2 = "select count(*) as count from staticpage where 1=1 " + change;
		debug(sql1);
		async.waterfall([function(callback) {
			mysql.query(sql1, function(err, result) {
				if(err) return console.error(err.stack);
				callback(null, result);
			});
		}, function(result, callback) {
			mysql.query(sql2, function(err, rows) {
				if(err) return console.error(err.stack);
				callback(err, rows, result);
			});
		}], function(err, rows, result) {
			if(err) {
				console.log(err);
			} else {

				var total = rows[0].count;
				var totalpage = Math.ceil(total / limit);
				var isFirstPage = page == 1;
				var isLastPage = ((page - 1) * limit + result.length) == total;

				var ret = {
					total: total,
					totalpage: totalpage,
					isFirstPage: isFirstPage,
					isLastPage: isLastPage,
					record: result
				};
				res.json(ret);
			}
		});
	} else if(sql == "del") {
		var id = req.param("id");
		var sql = "delete from notice where id = " + id;
		mysql.query(sql, function(err, result) {
			if(err) return console.error(err.stack);
			if(result.affectedRows == 1) {
				res.send("300");
			}
		});
	} else if(sql == "getById") {
		var id = req.param("id");
		var sql = "select * from staticpage where id = " + id;
		mysql.query(sql, function(err, result) {
			if(err) return console.error(err.stack);
			res.json(result);
		});
	} else if(sql == "getByName") {
		var name = req.param("name");
		var sql = "select * from staticpage where name = '" + name + "'";
		mysql.query(sql, function(err, result) {
			if(err) return console.error(err.stack);
			res.json(result);
		});
	} else if(sql == "getemergency") {
		var sql = "select top 1 * from notice where showInhome = 1";
		mysql.query(sql, function(err, result) {
			if(err) return console.error(err.stack);
			res.json(result);
		});
	} else if(sql == "getShip") {
		var sql = "select * from note";
		mysql.query(sql, function(err, result) {
			if(err) return console.error(err.stack);
			res.json(result);
		});
	} else if(sql == "getExchange") {
		request({
		    url: 'http://op.juhe.cn/onebox/exchange/currency?key=9ad0ed90238c78e611fffd7430af77c4&from=CNY&to=USD',
		    method: 'GET'
		}, function(err, response, body1) {
		    if (!err && response.statusCode == 200) {
		    	var b1 = JSON.parse(body1);
		        request({
				    url: 'http://op.juhe.cn/onebox/exchange/currency?key=9ad0ed90238c78e611fffd7430af77c4&from=CNY&to=JPY',
				    method: 'GET'
				}, function(err, response, body2) {
				    if (!err && response.statusCode == 200) {
				    	var b2 = JSON.parse(body2);
				        request({
						    url: 'http://op.juhe.cn/onebox/exchange/currency?key=9ad0ed90238c78e611fffd7430af77c4&from=CNY&to=KER',
						    method: 'GET'
						}, function(err, response, body3) {
						    if (!err && response.statusCode == 200) {
						    	var b3 = JSON.parse(body3);
						        request({
								    url: 'http://op.juhe.cn/onebox/exchange/currency?key=9ad0ed90238c78e611fffd7430af77c4&from=CNY&to=GBP',
								    method: 'GET'
								}, function(err, response, body4) {
								    if (!err && response.statusCode == 200) {
								    	var b4 = JSON.parse(body4);
								        request({
										    url: 'http://op.juhe.cn/onebox/exchange/currency?key=9ad0ed90238c78e611fffd7430af77c4&from=CNY&to=EUR',
										    method: 'GET'
										}, function(err, response, body5) {
										    if (!err && response.statusCode == 200) {
										    	var b5 = JSON.parse(body5);
										        var o = {
										        	USD: b1.result[1].exchange,
										        	JPY: b2.result[1].exchange,
										        	KER: b3.result[1].exchange,
										        	GBP: b4.result[1].exchange,
										        	EUR: b5.result[1].exchange
										        };
										        res.json(o);
										    }
										});
								    }
								});
						    }
						});
				    }
				});
		    }
		});
	}else if(sql == "getUserExchange") {
		var from = req.param("from");
		var to = req.param("to");
		var money = req.param("money");
		request({
			url: 'http://op.juhe.cn/onebox/exchange/currency?key=9ad0ed90238c78e611fffd7430af77c4&from='+from+'&to='+to,
			method: 'GET'
		}, function(err, response, body) {
			if (!err && response.statusCode == 200) {
				var b = JSON.parse(body);
				var r = Number(b.result[0].exchange)*Number(money);
				r = r + " ";
				res.send(r);
			}
		});
	} else if(sql == "getList"){
		request({
			url: 'http://op.juhe.cn/onebox/exchange/list?key=9ad0ed90238c78e611fffd7430af77c4',
			method: 'GET'
		}, function(err, response, body) {
			if (!err && response.statusCode == 200) {
				var b = JSON.parse(body);
				var o = b.result.list;
				//console.log(o);
				var option_list = '';
				for(var i in o){
					if(o[i].code =='KRW'){
						o[i].code = 'KER';
					}
					option_list += '<option value="'+o[i].code+'">'+o[i].name+'('+o[i].code+')</option>';
				}
				res.send(option_list);
			}
		});
	} else if(sql == "getProduct"){
		
		request({
			url: 'http://139.196.87.14:1339/product/get4calendar?time=123456',
			method: 'GET'
		}, function(err, response, body) {
			if (!err && response.statusCode == 200) {
				console.log(body);
				res.json(JSON.parse(body));
			}else{
				console.log(err);
			}
		});
		/*
		var p = req.param("page");

		console.log(p);

		if(!p || p == null){
			p = 1;
		}
		console.log("p:"+p);
		request({
			url: 'http://b.youlunhai.com/youlh/voyage/findVouageListBySearch',
			method: 'POST',
			headers: {
				'reqSource':'cruiseCenter158950b8e66a44c78784adc2b0890c75'
			},
			form:{
				page:p
			}
		}, function(err, response, body) {
			console.log(response);
			if (!err && response.statusCode == 200) {
				console.log(JSON.parse(body));
				res.json(JSON.parse(body));
			}else{
				console.log(err);
			}
		});*/
	}else if(sql == "getDetail"){
		var p = req.param("page");

		request({
			url: 'http://b.youlunhai.com/youlh/voyage/findVoyageListItem',
			method: 'GET',
			headers: {
				'reqSource':'cruiseCenter158950b8e66a44c78784adc2b0890c75'
			},
			form:{
				voyageNo:p
			}
		}, function(err, response, body) {
			if (!err && response.statusCode == 200) {
				//console.log(JSON.parse(body));
				res.json(JSON.parse(body));
			}else{
				console.log(err);
			}
		});
	}
}



exports.ttdo = function(req, res) {
	res.setHeader("Access-Control-Allow-Origin", "*");
	var sql = req.params.sql;
	if(sql == "create") {
		var mode = req.param("mode");
		var name = req.param("name");
		var post = req.param("post");
		var editid = req.param("editid");
		/*对单引号进行转义*/
		name = name.replace(/'/g, "\\'");
		post = post.replace(/'/g, "\\'");
		/*编辑模式*/
		if(mode == "edit") {
			var sql = "update note set ";
			sql += " name = '" + name + "',";
			sql += " post = '" + post + "'";
			sql += " where id = " + editid;
			mysql.query(sql, function(err, result) {
				if(err) return console.error(err.stack);
				if(result.affectedRows == 1) {
					res.send("300");
				}
			});
		} else {
			var sql = "insert into note (name,post) values ('" + name + "','" + post + "')";
			mysql.query(sql, function(err, result) {
				if(err) return console.error(err.stack);
				if(result.affectedRows == 1) {
					res.send("300");
				}
			});
		}
	} else if(sql == "get") {
		var page = parseInt(req.param("indexPage"));
		var LIMIT = 30;
		page = (page && page > 0) ? page : 1;
		var limit = (limit && limit > 0) ? limit : LIMIT;

		var change = "";

		var sql1 = "select * from ttbooking where 1=1 " + change + " order by id desc limit " + (page - 1) * limit + "," + limit;
		var sql2 = "select count(*) as count from ttbooking where 1=1 " + change;
		debug(sql1);
		async.waterfall([function(callback) {
			mysql.query(sql1, function(err, result) {
				if(err) return console.error(err.stack);
				for(var i in result) {
					result[i].createAt = (result[i].createAt).Format("yyyy-MM-dd hh:mm:ss");
				}
				callback(null, result);
			});
		}, function(result, callback) {
			mysql.query(sql2, function(err, rows) {
				if(err) return console.error(err.stack);
				callback(err, rows, result);
			});
		}], function(err, rows, result) {
			if(err) {
				console.log(err);
			} else {

				var total = rows[0].count;
				var totalpage = Math.ceil(total / limit);
				var isFirstPage = page == 1;
				var isLastPage = ((page - 1) * limit + result.length) == total;

				var ret = {
					total: total,
					totalpage: totalpage,
					isFirstPage: isFirstPage,
					isLastPage: isLastPage,
					record: result
				};
				res.json(ret);
			}
		});
	} else if(sql == "del") {
		var id = req.param("id");
		var sql = "delete from note where id = " + id;
		mysql.query(sql, function(err, result) {
			if(err) return console.error(err.stack);
			if(result.affectedRows == 1) {
				res.send("300");
			}
		});
	} else if(sql == "getById") {
		var id = req.param("id");
		var sql = "select * from note where id = " + id;
		mysql.query(sql, function(err, result) {
			if(err) return console.error(err.stack);
			res.json(result);
		});
	} else if(sql == "getByName") {
		var name = req.param("name");
		var sql = "select * from note where name = '" + name + "'";
		mysql.query(sql, function(err, result) {
			if(err) return console.error(err.stack);
			res.json(result);
		});
	} else if(sql == "getemergency") {
		var sql = "select top 1 * from note where showInhome = 1";
		mysql.query(sql, function(err, result) {
			if(err) return console.error(err.stack);
			res.json(result);
		});
	}
}

exports.notedo = function(req, res) {
	res.setHeader("Access-Control-Allow-Origin", "*");
	var sql = req.params.sql;
	if(sql == "create") {
		var mode = req.param("mode");
		var name = req.param("name");
		var post = req.param("post");
		var editid = req.param("editid");
		/*对单引号进行转义*/
		name = name.replace(/'/g, "\\'");
		post = post.replace(/'/g, "\\'");
		/*编辑模式*/
		if(mode == "edit") {
			var sql = "update note set ";
			sql += " name = '" + name + "',";
			sql += " post = '" + post + "'";
			sql += " where id = " + editid;
			mysql.query(sql, function(err, result) {
				if(err) return console.error(err.stack);
				if(result.affectedRows == 1) {
					res.send("300");
				}
			});
		} else {
			var sql = "insert into note (name,post) values ('" + name + "','" + post + "')";
			mysql.query(sql, function(err, result) {
				if(err) return console.error(err.stack);
				if(result.affectedRows == 1) {
					res.send("300");
				}
			});
		}
	} else if(sql == "get") {
		var page = parseInt(req.param("indexPage"));
		var LIMIT = 8;
		page = (page && page > 0) ? page : 1;
		var limit = (limit && limit > 0) ? limit : LIMIT;

		var change = "";

		var sql1 = "select * from note where 1=1 " + change + " order by id desc limit " + (page - 1) * limit + "," + limit;
		var sql2 = "select count(*) as count from note where 1=1 " + change;
		debug(sql1);
		async.waterfall([function(callback) {
			mysql.query(sql1, function(err, result) {
				if(err) return console.error(err.stack);
				callback(null, result);
			});
		}, function(result, callback) {
			mysql.query(sql2, function(err, rows) {
				if(err) return console.error(err.stack);
				callback(err, rows, result);
			});
		}], function(err, rows, result) {
			if(err) {
				console.log(err);
			} else {

				var total = rows[0].count;
				var totalpage = Math.ceil(total / limit);
				var isFirstPage = page == 1;
				var isLastPage = ((page - 1) * limit + result.length) == total;

				var ret = {
					total: total,
					totalpage: totalpage,
					isFirstPage: isFirstPage,
					isLastPage: isLastPage,
					record: result
				};
				res.json(ret);
			}
		});
	} else if(sql == "del") {
		var id = req.param("id");
		var sql = "delete from note where id = " + id;
		mysql.query(sql, function(err, result) {
			if(err) return console.error(err.stack);
			if(result.affectedRows == 1) {
				res.send("300");
			}
		});
	} else if(sql == "getById") {
		var id = req.param("id");
		var sql = "select * from note where id = " + id;
		mysql.query(sql, function(err, result) {
			if(err) return console.error(err.stack);
			res.json(result);
		});
	} else if(sql == "getByName") {
		var name = req.param("name");
		var sql = "select * from note where name = '" + name + "'";
		mysql.query(sql, function(err, result) {
			if(err) return console.error(err.stack);
			res.json(result);
		});
	} else if(sql == "getemergency") {
		var sql = "select top 1 * from note where showInhome = 1";
		mysql.query(sql, function(err, result) {
			if(err) return console.error(err.stack);
			res.json(result);
		});
	}
}

exports.traveldo = function(req, res) {
	res.setHeader("Access-Control-Allow-Origin", "*");
	var sql = req.params.sql;
	if(sql == "create") {
		var mode = req.param("mode");
		var title = req.param("title");
		var post = req.param("post");
		var summary = req.param("summary");
		var source = req.param("source");
		var editid = req.param("editid");
		/*对单引号进行转义*/
		title = title.replace(/'/g, "\\'");
		post = post.replace(/'/g, "\\'");
		/*编辑模式*/
		if(mode == "edit") {
			var sql = "update news set ";
			sql += " title = '" + title + "',";
			sql += " summary = '" + summary + "',";
			sql += " source = '" + source + "',";
			sql += " post = '" + post + "'";
			sql += " where id = " + editid;
			mysql.query(sql, function(err, result) {
				if(err) return console.error(err.stack);
				if(result.affectedRows == 1) {
					res.send("300");
				}
			});
		} else {
			var sql = "insert into news (title,post,summary,publishAt,source) values ('" + title + "','" + post + "','" + summary + "',now(),'" + source + "')";
			mysql.query(sql, function(err, result) {
				if(err) return console.error(err.stack);
				if(result.affectedRows == 1) {
					res.send("300");
				}
			});
		}
	} else if(sql == "get") {
		var page = parseInt(req.param("indexPage"));
		var LIMIT = 30;
		page = (page && page > 0) ? page : 1;
		var limit = (limit && limit > 0) ? limit : LIMIT;

		var change = "";

		var sql1 = "select * from travel_notes where 1=1 " + change + " order by id desc limit " + (page - 1) * limit + "," + limit;
		var sql2 = "select count(*) as count from travel_notes where 1=1 " + change;
		debug(sql1);
		async.waterfall([function(callback) {
			mysql.query(sql1, function(err, result) {
				if(err) return console.error(err.stack);

				callback(null, result);
			});
		}, function(result, callback) {
			mysql.query(sql2, function(err, rows) {
				if(err) return console.error(err.stack);
				callback(err, rows, result);
			});
		}], function(err, rows, result) {
			if(err) {
				console.log(err);
			} else {

				var total = rows[0].count;
				var totalpage = Math.ceil(total / limit);
				var isFirstPage = page == 1;
				var isLastPage = ((page - 1) * limit + result.length) == total;

				var ret = {
					total: total,
					totalpage: totalpage,
					isFirstPage: isFirstPage,
					isLastPage: isLastPage,
					record: result
				};
				res.json(ret);
			}
		});
	} else if(sql == "del") {
		var id = req.param("id");
		var sql = "delete from travel_notes where id = " + id;
		mysql.query(sql, function(err, result) {
			if(err) return console.error(err.stack);
			if(result.affectedRows == 1) {
				res.send("300");
			}
		});
	} else if(sql == "getById") {
		var id = req.param("id");
		var sql = "select * from news where id = " + id;
		mysql.query(sql, function(err, result) {
			if(err) return console.error(err.stack);
			res.json(result);
		});
	} else if(sql == "getByIdAndNext") {
		var id = req.param("id");
		var sql = "select * from news where id = " + id;
		mysql.query(sql, function(err, result) {
			if(err) return console.error(err.stack);
			var sql1 = "select * from news where id = (select max(id) from news where id < " + id + ")";
			mysql.query(sql1, function(err1, result1) {
				if(err1) return console.error(err1.stack);
				var sql2 = "select * from news where id = (select min(id) from news where id > " + id + ")";
				mysql.query(sql2, function(err2, result2) {
					if(err2) return console.error(err2.stack);
					result[0].front = result1;
					result[0].next = result2;
					res.json(result);
				});
			});
		});
	}
}

exports.uploadImg = function(req, res) {
	var fname = req.files.imgFile.path.replace("public\\upload\\", "").replace("public/upload/", "");
	var info = {
		"error": 0,
		"url": "/upload/" + fname
	};
	res.send(info);
}

exports.postdo = function(req, res) {
	res.setHeader("Access-Control-Allow-Origin", "*");
	var fname = req.files.fileUp.path.replace("public\\upload\\", "").replace("public/upload/", "");
	res.writeHead(200, {
		'Content-type': 'text/html'
	});
	res.write('<script>');
	res.write('window.parent.postMessage("' + fname + '","*");');
	res.end('</script>');
}

exports.servicedo = function(req,res){
	var sql = req.params.sql;
    if (sql == "setTurnplate") {
		var ip = req.param("ip");
		var reward_id = req.param("reward_id");
		var sql = "insert into turnplate(ip,reward_id) values('"+ip+"',"+reward_id+")";
		console.log(sql);
		mysql.query(sql, function(err2, result2) {
			if(err2) return console.error(err2.stack);
		});
	}else if (sql == "applyleader") {
		var no = req.param("no");
		var sql0  = "select count(id) as count from applyleader where line = '2017-04-27 歌诗达大西洋'";
		mysql.query(sql0, function(err, result0) {
			if(err) return console.error(err.stack);
			console.log(result0);
			if(result0[0].count > 6){
				res.send("300");
				return false;
			}
			var sql1 = "select * from leader where no = '"+no+"'";
			mysql.query(sql1, function(err, result1) {
				if(err) return console.error(err.stack);
				if(!result1[0]){
					res.send("400");
					return false;
				}
				var sql3 = "select * from applyleader where no ='"+no+"' and line = '2017-04-27 歌诗达大西洋'";
				mysql.query(sql3, function(err, result3) {
					if(err) return console.error(err.stack);
					if(result3[0]){
						res.send("500");
						return false;
					}
					var sql2 = "insert into applyleader(no,createAt) value('"+no+"',now())";
					mysql.query(sql2, function(err, result2) {
						if(err) return console.error(err.stack);
						res.send("200");
					});
				});
			});
		});
	}else if(sql == "py_getShip"){
		var date = req.param("date");
		request({
			url: 'http://www.cruisesh.com:7777/getShip?startDate='+date,
			method: 'GET'
		}, function(err, response, body) {
			if (!err && response.statusCode == 200) {
				//res.json(JSON.parse(body));
				res.send(body);
			}else{
				console.log(err);
			}
		});
	}else if(sql == "py_getTotal"){
		var date = req.param("date");
		var ship_id = req.param("ship_id");
		request({
			url: 'http://www.cruisesh.com:7777/getTotal?startDate='+date+'&shortEn='+ship_id,
			method: 'GET'
		}, function(err, response, body) {
			if (!err && response.statusCode == 200) {
					var sql2 = "select count(DISTINCT no) as count,min(time) as min,max(time) as max from checkin_log where time like '"+date+"%' and ship_no='"+ship_id+"'" ;
					mysql.query(sql2, function(err, result2) {
						if(err) return console.error(err.stack);
						request({
							url: 'http://www.cruisesh.com:7777/getShipName?shortEn='+ship_id,
							method: 'GET'
						}, function(err, response, body2) {
							if (!err && response.statusCode == 200) {
								var sql3 = "select a.time from checkin_log a right join (select max(id) id from checkin_log  where time like '"+date+"%' group by no) b on b.id = a.id where a.id is not null and a.ship_no = '"+ship_id+"' order by a.time";
								mysql.query(sql3, function(err, result3) {
									if(err) return console.error(err.stack);
									var dif = 0;
									range = '';
									var arr1 = [];
									var arr2 = [];
									if(result2[0].count != 0){
										dif = GetDateDiff(result2[0].min+"",result2[0].max+"");
										range = (result2[0].min).Format("hh:mm:ss")+"~"+(result2[0].max).Format("hh:mm:ss");
										/*根据result3计算chart的值*/
										var node_min = (result2[0].min).Format("yyyy-MM-dd hh:mm:ss");
										var node_max = (result2[0].max).Format("yyyy-MM-dd hh:mm:ss");
										var tmp1 = node_min.split(":");
										node_min = tmp1[0]+":"+tmp1[1];
										var tmp2 = node_max.split(":");
										node_max = tmp2[0]+":"+tmp2[1];
										var j = 0;
										for(var i=0;i<parseInt(dif)+2;i++){
											var m = new Date(node_min);
											var n = new Date(m.getTime() + 1000 * 60 * i);
											var mn = n.Format("yyyy-MM-dd hh:mm");
											var s_mn =  n.Format("hh:mm");
											arr1.push(s_mn);
										    /*计算这1分钟的人数*/
										    var np = 0;
										    
										    while(j<result3.length){
										    	var t = (result3[j].time).Format("yyyy-MM-dd hh:mm:ss") +"";
										 
										    	if(t.indexOf(mn) != -1){
										    		np++;
										    		j++;
										    	}else{
										    		break;
										    	}
										    }
										    arr2.push(np);
										}
										/*
										for(var j=0;j<result3.length;j++){
											console.log(result3[j]);
										}*/	
									}
									
									var o = {
										scan_num:result2[0].count,
										total_num:body,
										ship_id:body2,
										range:range,
										dif:dif,
										x:arr1,
										y:arr2
									};
									res.json(o);
								});
							}else{
								console.log(err);
							}
						});
					});
			}else{
				console.log(err);
			}
		});
	}
}

function GetDateDiff(startDate,endDate)  {  
    var startTime = new Date(Date.parse(startDate.replace(/-/g,   "/"))).getTime();     
    var endTime = new Date(Date.parse(endDate.replace(/-/g,   "/"))).getTime();     
    var dates = Math.abs((startTime - endTime))/(1000*60);     
    return  dates;    
}

exports.c_destination = function(req, res) {
	var med = new Med();
	med.get(function(result) {
		if(result[1] == "r") {
			console.log("get info error!");
		} else {
			var port = new Port();
			port.get(function(result1) {
				if(result1[1] == "r") {
					console.log("get info error!");
				} else {
					res.render('c_destination', {
						layout: 'c_layouts',
						title: '邮轮度假目的地',
						med: result,
						port: result1
					});
				}
			});
		}
	});
};

exports.c_curisecompany = function(req, res) {
	var cruisecompany = new Cruisecompany();
	cruisecompany.get(function(result) {
		if(result[1] == "r") {
			console.log("get info error!");
		} else {
			var cruiseship = new Cruiseship();
			cruiseship.get(function(result1) {
				if(result1[1] == "r") {
					console.log("get info error!");
				} else {
					res.render('c_curisecompany', {
						layout: 'c_layouts',
						title: '邮轮公司荟萃',
						ccompany: result,
						cship: result1
					});
				}
			});
		}
	});
};

exports.c_destination_sec = function(req, res) {
	var pathid = req.query.pid;
	var med = new Med();
	med.get(function(result) {
		if(result[1] == "r") {
			console.log("get info error!");
		} else {
			var port = new Port();
			port.get(function(result1) {
				if(result1[1] == "r") {
					console.log("get info error!");
				} else {
					var cruiseship = new Cruiseship();
					cruiseship.get(function(result3) {
						if(result3[1] == "r") {
							console.log("get info error!");
						} else {
							var travelnotes = new Travelnotes();
							travelnotes.get(function(result6) {
								if(result6[1] == "r") {
									console.log("get info error!");
								} else {
									var cruiselineinfo = new Cruiselineinfo();
									cruiselineinfo.get(function(result2) {
										if(result2[1] == "r") {
											console.log("get info error!");
										} else {
											res.render('c_destination_sec', {
												layout: 'c_layouts',
												title: '邮轮度假目的地',
												menu_path: pathid,
												med: result,
												port: result1,
												lines: result2,
												cship: result3,
												r1: result6
											});
										}
									});
								}
							});
						}
					});
				}
			});
		}
	});
};

exports.c_destinationsp_sec = function(req, res) {
	var pathid = req.query.pid;
	var med = new Med();
	med.get(function(result) {
		if(result[1] == "r") {
			console.log("get info error!");
		} else {
			var port = new Port();
			port.get(function(result1) {
				if(result1[1] == "r") {
					console.log("get info error!");
				} else {
					var cruiselineinfo = new Cruiselineinfo();
					cruiselineinfo.get(function(result2) {
						if(result2[1] == "r") {
							console.log("get info error!");
						} else {
							var cruiseship = new Cruiseship();
							cruiseship.get(function(result3) {
								if(result3[1] == "r") {
									console.log("get info error!");
								} else {
									var travelnotes = new Travelnotes();
									travelnotes.get(function(result6) {
										if(result6[1] == "r") {
											console.log("get info error!");
										} else {
											res.render('c_destinationsp_sec', {
												title: '邮轮度假目的地卖点',
												layout: 'c_layouts',
												menu_path: pathid,
												med: result,
												port: result1,
												lines: result2,
												cship: result3,
												r1: result6
											});
										}
									});

								}
							});
						}
					});
				}
			});
		}
	});
};

exports.c_destinationport_sec = function(req, res) {
	var pathid = req.query.pid;
	var med = new Med();
	med.get(function(result) {
		if(result[1] == "r") {
			console.log("get info error!");
		} else {
			var port = new Port();
			port.get(function(result1) {
				if(result1[1] == "r") {
					console.log("get info error!");
				} else {
					var cruiselineinfo = new Cruiselineinfo();
					cruiselineinfo.get(function(result2) {
						if(result2[1] == "r") {
							console.log("get info error!");
						} else {
							var cruiseship = new Cruiseship();
							cruiseship.get(function(result3) {
								if(result3[1] == "r") {
									console.log("get info error!");
								} else {

									var travelnotes = new Travelnotes();
									travelnotes.get(function(result6) {
										if(result6[1] == "r") {
											console.log("get info error!");
										} else {
											res.render('c_destinationport_sec', {
												layout: 'c_layouts',
												title: '邮轮度假目的港口',
												menu_path: pathid,
												med: result,
												port: result1,
												lines: result2,
												cship: result3,
												r1: result6
											});
										}
									});

								}
							});
						}
					});
				}
			});
		}
	});
};

exports.c_curisecompanysp_sec = function(req, res) {
	var pathid = req.query.pid;
	var cruisecompany = new Cruisecompany();
	cruisecompany.get(function(result) {
		if(result[1] == "r") {
			console.log("get info error!");
		} else {
			var cruiseship = new Cruiseship();
			cruiseship.get(function(result1) {
				if(result1[1] == "r") {
					console.log("get info error!");
				} else {
					var cruiselineinfo = new Cruiselineinfo();
					cruiselineinfo.get(function(result2) {
						if(result2[1] == "r") {
							console.log("get info error!");
						} else {
							var med = new Med();
							med.get(function(result3) {
								if(result3[1] == "r") {
									console.log("get info error!");
								} else {
									var travelnotes = new Travelnotes();
									travelnotes.get(function(result5) {
										if(result5[1] == "r") {
											console.log("get info error!");
										} else {
											res.render('c_curisecompanysp_sec', {
												layout: 'c_layouts',
												title: '邮轮公司荟萃',
												menu_path: pathid,
												ccompany: result,
												cship: result1,
												lines: result2,
												med: result3,
												r1: result5
											});
										}
									});
								}
							});
						}
					});
				}
			});
		}
	});
};

exports.c_curisecompany_sec = function(req, res) {
	var pathid = req.query.pid;
	var cruisecompany = new Cruisecompany();
	cruisecompany.get(function(result) {
		if(result[1] == "r") {
			console.log("get info error!");
		} else {
			var cruiseship = new Cruiseship();
			cruiseship.get(function(result1) {
				if(result1[1] == "r") {
					console.log("get info error!");
				} else {
					var cruiselineinfo = new Cruiselineinfo();
					cruiselineinfo.get(function(result2) {
						if(result2[1] == "r") {
							console.log("get info error!");
						} else {
							var med = new Med();
							med.get(function(result3) {
								if(result3[1] == "r") {
									console.log("get info error!");
								} else {
									var travelnotes = new Travelnotes();
									travelnotes.get(function(result5) {
										if(result5[1] == "r") {
											console.log("get info error!");
										} else {
											res.render('c_curisecompany_sec', {
												title: '邮轮公司荟萃',
												layout: 'c_layouts',
												menu_path: pathid,
												ccompany: result,
												cship: result1,
												lines: result2,
												med: result3,
												r1: result5
											});
										}
									});
								}
							});
						}
					});
				}
			});
		}
	});
};

exports.c_curisecship_sec = function(req, res) {
	var pathid = req.query.pid;
	var cruisecompany = new Cruisecompany();
	cruisecompany.get(function(result) {
		if(result[1] == "r") {
			console.log("get info error!");
		} else {
			var cruiseship = new Cruiseship();
			cruiseship.get(function(result1) {
				if(result1[1] == "r") {
					console.log("get info error!");
				} else {
					var shipcabin = new Shipcabin();
					shipcabin.get(function(result2) {
						if(result2[1] == "r") {
							console.log("get info error!");
						} else {
							var shipservice = new Shipservice();
							shipservice.get(function(result3) {
								if(result3[1] == "r") {
									console.log("get info error!");
								} else {
									var cruiselineinfo = new Cruiselineinfo();
									cruiselineinfo.get(function(result4) {
										if(result4[1] == "r") {
											console.log("get info error!");
										} else {
											var shipdinner = new Shipdinner();
											shipdinner.get(function(result5) {
												if(result5[1] == "r") {
													console.log("get info error!");
												} else {
													var travelnotes = new Travelnotes();
													travelnotes.get(function(result7) {
														if(result7[1] == "r") {
															console.log("get info error!");
														} else {
															res.render('c_curisecship_sec', {
																title: '邮轮公司荟萃',
																layout: 'c_layouts',
																menu_path: pathid,
																ccompany: result,
																cship: result1,
																croom: result2,
																cent: result3,
																lines: result4,
																sd: result5,
																r1: result7,
															});
														}
													});
												}
											});
										}
									});
								}
							});
						}
					});
				}
			});
		}
	});
};

exports.c_theme = function(req, res) {
	var theme = new Theme();
	theme.get(function(result) {
		if(result[1] == "r") {
			console.log("get info error!");
		} else {
			var travelnotes = new Travelnotes();
			travelnotes.get(function(result1) {
				if(result1[1] == "r") {
					console.log("get info error!");
				} else {
					var cruiselineinfo = new Cruiselineinfo();
					res.render('c_theme', {
						layout: 'c_layouts',
						title: '邮轮度假主题',
						theme: result,
						r1: result1
					});
				}
			});
		}
	});
};

exports.c_share = function(req, res) {
	var share = new Share();
	share.get(function(result) {
		if(result[1] == "r") {
			console.log("get info error!");
		} else {
			var travelnotes = new Travelnotes();
			travelnotes.get(function(result1) {
				if(result1[1] == "r") {
					console.log("get info error!");
				} else {
					res.render('c_share', {
						title: '邮轮生活分享',
						layout: 'c_layouts',
						theme: result,
						r1: result1
					});
				}
			});
		}
	});
};

exports.c_theme_sec = function(req, res) {
	var pathid = req.query.id;
	var theme = new Theme();
	theme.get(function(result) {
		if(result[1] == "r") {
			console.log("get info error!");
		} else {
			var travelnotes = new Travelnotes();
			travelnotes.get(function(result1) {
				if(result1[1] == "r") {
					console.log("get info error!");
				} else {
					res.render('c_theme_sec', {
						title: '邮轮度假主题',
						layout: 'c_layouts',
						menu_path: pathid,
						share: result,
						r1: result1
					});
				}
			});
		}
	});
};

exports.c_share_sec = function(req, res) {
	var pathid = req.query.pid;
	var share = new Share();
	share.get(function(result) {
		if(result[1] == "r") {
			console.log("get info error!");
		} else {
			var travelnotes = new Travelnotes(pathid);
			travelnotes.get(function(result1) {
				if(result1[1] == "r") {
					console.log("get info error!");
				} else {
					travelnotes.getById(function(result2) {
						if(result2[1] == "r") {
							console.log("get info error!");
						} else {
							res.render('c_share_sec', {
								layout: 'c_layouts',
								title: '游记文章',
								menu_path: pathid,
								share: result,
								r1: result1,
								r0:result2
							});
						}
					});
				}
			});
		}
	});
};

exports.c_sharetheme_sec = function(req, res) {
	var pathid = req.query.id;
	var share = new Share();
	share.get(function(result) {
		if(result[1] == "r") {
			console.log("get info error!");
		} else {
			var travelnotes = new Travelnotes();
			travelnotes.get(function(result1) {
				if(result1[1] == "r") {
					console.log("get info error!");
				} else {
					res.render('c_sharetheme_sec', {
						layout: 'c_layouts',
						title: '游记文章',
						menu_path: pathid,
						share: result,
						r1: result1
					});
				}
			});
		}
	});
};

exports.getopenid = function(req, res) {
	var code = req.query.code;
	var appId = settings.AppID;
	var appSecret = settings.AppSecret;
	var url = "https://api.weixin.qq.com/sns/oauth2/access_token?grant_type=authorization_code&appid=" + appId + "&secret=" + appSecret + "&code=" + code;
	request(url, function(err, response, body) {
		if (!err && response.statusCode == 200) {
			if (JSON.parse(body).errcode != null) {
				console.log(body);
				res.redirect(req.url);
				return false;
			}
			console.log(body);
			var openid = JSON.parse(body).openid;
			res.redirect(settings.hosts + "/turnplate/index.html?openid=" + openid);
		}
	});
}

Date.prototype.Format = function(fmt) {
	var d = this;
	var o = {
		"M+": d.getMonth() + 1, //月份
		"d+": d.getDate(), //日
		"h+": d.getHours(), //小时
		"m+": d.getMinutes(), //分
		"s+": d.getSeconds(), //秒
		"q+": Math.floor((d.getMonth() + 3) / 3), //季度
		"S": d.getMilliseconds() //毫秒
	};
	if(/(y+)/.test(fmt)) {
		fmt = fmt.replace(RegExp.$1, (d.getFullYear() + "").substr(4 - RegExp.$1.length));
	}
	for(var k in o) {
		if(new RegExp("(" + k + ")").test(fmt)) {
			fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
		}
	}
	return fmt;
}