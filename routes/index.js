var settings = require('../settings');
var mysql = require('../models/db');
var async = require('async');
var debug = require('debug')('myapp:index');
var ejsExcel = require("./ejsExcel");
var fs = require("fs");
var formidable = require('formidable');
var request = require("request");
var crypto = require("crypto");
var Iconv = require('iconv-lite');

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

exports.news = function(req, res) {
	res.render('news', {
		layout: "layout"
	});
}

exports.userdo = function(req, res) {
	res.setHeader("Access-Control-Allow-Origin", "*");
	var sql = req.params.sql;
	if (sql == "checkLogin") {
		var uname = req.param("uname");
		var pwd = req.param("pwd");
		var sql = "select * from admin where username = '" + uname + "'";
		debug(sql);
		mysql.query(sql, function(err, result) {
			if (err) return console.error(err.stack);
			if (!result[0]) {
				res.send("400");
				return;
			}
			if (result[0].password == pwd) {
				res.json(result[0]);
			} else {
				res.send("400");
			}
		});
	}
}

exports.newsdo = function(req, res) {
	res.setHeader("Access-Control-Allow-Origin", "*");
	var sql = req.params.sql;
	if (sql == "create") {
		var mode = req.param("mode");
		var title = req.param("title");
		var post = req.param("post");
		var summary = req.param("summary");
		var editid = req.param("editid");
		/*对单引号进行转义*/
		title = title.replace(/'/g, "\\'");
		post = post.replace(/'/g, "\\'");
		/*编辑模式*/
		if (mode == "edit") {
			var sql = "update news set ";
			sql += " title = '" + title + "',";
			sql += " summary = '" + summary + "',";
			sql += " post = '" + post + "'";
			sql += " where id = " + editid;
			mysql.query(sql, function(err, result) {
				if (err) return console.error(err.stack);
				if (result.affectedRows == 1) {
					res.send("300");
				}
			});
		} else {
			var sql = "insert into news (title,post,summary,publishAt) values ('" + title + "','" + post + "','" + summary + "',now())";
			mysql.query(sql, function(err, result) {
				if (err) return console.error(err.stack);
				if (result.affectedRows == 1) {
					res.send("300");
				}
			});
		}
	} else if (sql == "get") {
		var page = parseInt(req.param("indexPage"));
		var LIMIT = 8;
		page = (page && page > 0) ? page : 1;
		var limit = (limit && limit > 0) ? limit : LIMIT;

		var change = "";

		var sql1 = "select * from news where 1=1 " + change + " order by publishAt desc limit " + (page - 1) * limit + "," + limit;
		var sql2 = "select count(*) as count from news where 1=1 " + change;
		debug(sql1);
		async.waterfall([function(callback) {
			mysql.query(sql1, function(err, result) {
				if (err) return console.error(err.stack);
				for (var i in result) {
					result[i].publishAt = (result[i].publishAt).Format("yyyy-MM-dd hh:mm:ss");
				}
				callback(null, result);
			});
		}, function(result, callback) {
			mysql.query(sql2, function(err, rows) {
				if (err) return console.error(err.stack);
				callback(err, rows, result);
			});
		}], function(err, rows, result) {
			if (err) {
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
	} else if (sql == "del") {
		var id = req.param("id");
		var sql = "delete from news where id = " + id;
		mysql.query(sql, function(err, result) {
			if (err) return console.error(err.stack);
			if (result.affectedRows == 1) {
				res.send("300");
			}
		});
	} else if (sql == "getById") {
		var id = req.param("id");
		var sql = "select * from news where id = " + id;
		mysql.query(sql, function(err, result) {
			if (err) return console.error(err.stack);
			res.json(result);
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
	if (/(y+)/.test(fmt)) {
		fmt = fmt.replace(RegExp.$1, (d.getFullYear() + "").substr(4 - RegExp.$1.length));
	}
	for (var k in o) {
		if (new RegExp("(" + k + ")").test(fmt)) {
			fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
		}
	}
	return fmt;
}