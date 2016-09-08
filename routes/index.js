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

exports.static_page = function(req, res) {
	res.render('static_page', {
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
    med.get(function (result) {
        if (result[1] == "r") {
            console.log("get info error!");
        } else {
            var cruiseship = new Cruiseship();
            cruiseship.get(function (result1) {
                if (result1[1] == "r") {
                    console.log("get info error!");
                } else {
                    var cruisecompany = new Cruisecompany();
                    cruisecompany.get(function (result2) {
                        if (result2[1] == "r") {
                            console.log("get info error!");
                        } else {
                            var travelnotes = new Travelnotes("","","","","","","");
                            travelnotes.get(function (result3) {
                                if (result3[1] == "r") {
                                    console.log("get info error!");
                                } else {

                                    var theme = new Theme();
                                    theme.get(function (result4) {
                                        if (result4[1] == "r") {
                                            console.log("get info error!");
                                        } else {
                                            res.render('travel', {layout:"layout",med:result,cruiseship:result1,cruisecompany:result2,id:id,re3:result3,theme:result4});
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

exports.travelsubmit = function (req, res) {
    var txtCategory1 = req.body['txtCategory1'];
    var txtCategory2 = req.body['txtCategory2'];
    var txtCategory3 = req.body['txtCategory3'];
    var rtfImg = req.body['rtfImg'];
    var txtText = req.body['editor02'];
    var txtTitle = req.body['txtTitle'];
    var stype =  req.body['stype'];
    var txtAbbr =  req.body['txtAbbr'];


    if(stype=="1"){
        var travelnotes = new Travelnotes("",txtCategory1,txtCategory2,txtCategory3,rtfImg,txtText,txtTitle,txtAbbr);
        travelnotes.save(function (err) {

            if (err == "error") {
                console.log("error!");
            }
            res.redirect('/view_travel');
        });
    }else{
        var travelnotes = new Travelnotes(req.body['docid'],txtCategory1,txtCategory2,txtCategory3,rtfImg,txtText,txtTitle,txtAbbr);
        travelnotes.update(function (err) {

            if (err == "error") {
                console.log("error!");
            }
            res.redirect('/view_travel');
        });
    }
};

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
		var source = req.param("source");
		var editid = req.param("editid");
		/*对单引号进行转义*/
		title = title.replace(/'/g, "\\'");
		post = post.replace(/'/g, "\\'");
		/*编辑模式*/
		if (mode == "edit") {
			var sql = "update news set ";
			sql += " title = '" + title + "',";
			sql += " summary = '" + summary + "',";
			sql += " source = '" + source + "',";
			sql += " post = '" + post + "'";
			sql += " where id = " + editid;
			mysql.query(sql, function(err, result) {
				if (err) return console.error(err.stack);
				if (result.affectedRows == 1) {
					res.send("300");
				}
			});
		} else {
			var sql = "insert into news (title,post,summary,publishAt,source) values ('" + title + "','" + post + "','" + summary + "',now(),'" + source + "')";
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
	} else if (sql == "getByIdAndNext") {
		var id = req.param("id");
		var sql = "select * from news where id = " + id;
		mysql.query(sql, function(err, result) {
			if (err) return console.error(err.stack);
			var sql1 = "select * from news where id = (select max(id) from news where id < " + id + ")";
			mysql.query(sql1, function(err1, result1) {
				if (err1) return console.error(err1.stack);
				var sql2 = "select * from news where id = (select min(id) from news where id > " + id + ")";
				mysql.query(sql2, function(err2, result2) {
					if (err2) return console.error(err2.stack);
					result[0].front = result1;
					result[0].next = result2;
					res.json(result);
				});
			});
		});
	}
}

exports.noticedo = function(req, res) {
	res.setHeader("Access-Control-Allow-Origin", "*");
	var sql = req.params.sql;
	if (sql == "create") {
		var mode = req.param("mode");
		var title = req.param("title");
		var post = req.param("post");
		var editid = req.param("editid");
		/*对单引号进行转义*/
		title = title.replace(/'/g, "\\'");
		post = post.replace(/'/g, "\\'");
		/*编辑模式*/
		if (mode == "edit") {
			var sql = "update notice set ";
			sql += " title = '" + title + "',";
			sql += " post = '" + post + "'";
			sql += " where id = " + editid;
			mysql.query(sql, function(err, result) {
				if (err) return console.error(err.stack);
				if (result.affectedRows == 1) {
					res.send("300");
				}
			});
		} else {
			var sql = "insert into notice (title,post,publishAt) values ('" + title + "','" + post + "',now())";
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

		var sql1 = "select * from notice where 1=1 " + change + " order by publishAt desc limit " + (page - 1) * limit + "," + limit;
		var sql2 = "select count(*) as count from notice where 1=1 " + change;
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
		var sql = "delete from notice where id = " + id;
		mysql.query(sql, function(err, result) {
			if (err) return console.error(err.stack);
			if (result.affectedRows == 1) {
				res.send("300");
			}
		});
	} else if (sql == "getById") {
		var id = req.param("id");
		var sql = "select * from notice where id = " + id;
		mysql.query(sql, function(err, result) {
			if (err) return console.error(err.stack);
			res.json(result);
		});
	} else if (sql == "getemergency") {
		var sql = "select * from notice where showInhome = 1";
		mysql.query(sql, function(err, result) {
			if (err) return console.error(err.stack);
			res.json(result);
		});
	}
}

exports.staticdo = function(req, res) {
	res.setHeader("Access-Control-Allow-Origin", "*");
	var sql = req.params.sql;
	if (sql == "create") {
		var mode = req.param("mode");
		var name = req.param("name");
		var post = req.param("post");
		var editid = req.param("editid");
		/*对单引号进行转义*/
		name = name.replace(/'/g, "\\'");
		post = post.replace(/'/g, "\\'");
		/*编辑模式*/
		if (mode == "edit") {
			var sql = "update staticpage set ";
			sql += " name = '" + name + "',";
			sql += " post = '" + post + "'";
			sql += " where id = " + editid;
			mysql.query(sql, function(err, result) {
				if (err) return console.error(err.stack);
				if (result.affectedRows == 1) {
					res.send("300");
				}
			});
		} else {
			var sql = "insert into staticpage (name,post) values ('" + name + "','" + post + "')";
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

		var sql1 = "select * from staticpage where 1=1 " + change + " order by id desc limit " + (page - 1) * limit + "," + limit;
		var sql2 = "select count(*) as count from staticpage where 1=1 " + change;
		debug(sql1);
		async.waterfall([function(callback) {
			mysql.query(sql1, function(err, result) {
				if (err) return console.error(err.stack);
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
		var sql = "delete from notice where id = " + id;
		mysql.query(sql, function(err, result) {
			if (err) return console.error(err.stack);
			if (result.affectedRows == 1) {
				res.send("300");
			}
		});
	} else if (sql == "getById") {
		var id = req.param("id");
		var sql = "select * from staticpage where id = " + id;
		mysql.query(sql, function(err, result) {
			if (err) return console.error(err.stack);
			res.json(result);
		});
	} else if (sql == "getByName") {
		var name = req.param("name");
		var sql = "select * from staticpage where name = '" + name + "'";
		mysql.query(sql, function(err, result) {
			if (err) return console.error(err.stack);
			res.json(result);
		});
	} else if (sql == "getemergency") {
		var sql = "select * from notice where showInhome = 1";
		mysql.query(sql, function(err, result) {
			if (err) return console.error(err.stack);
			res.json(result);
		});
	}
}

exports.traveldo = function(req, res) {
	res.setHeader("Access-Control-Allow-Origin", "*");
	var sql = req.params.sql;
	if (sql == "create") {
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
		if (mode == "edit") {
			var sql = "update news set ";
			sql += " title = '" + title + "',";
			sql += " summary = '" + summary + "',";
			sql += " source = '" + source + "',";
			sql += " post = '" + post + "'";
			sql += " where id = " + editid;
			mysql.query(sql, function(err, result) {
				if (err) return console.error(err.stack);
				if (result.affectedRows == 1) {
					res.send("300");
				}
			});
		} else {
			var sql = "insert into news (title,post,summary,publishAt,source) values ('" + title + "','" + post + "','" + summary + "',now(),'" + source + "')";
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

		var sql1 = "select * from travel_notes where 1=1 " + change + " order by id desc limit " + (page - 1) * limit + "," + limit;
		var sql2 = "select count(*) as count from travel_notes where 1=1 " + change;
		debug(sql1);
		async.waterfall([function(callback) {
			mysql.query(sql1, function(err, result) {
				if (err) return console.error(err.stack);
				
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
		var sql = "delete from travel_notes where id = " + id;
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
	} else if (sql == "getByIdAndNext") {
		var id = req.param("id");
		var sql = "select * from news where id = " + id;
		mysql.query(sql, function(err, result) {
			if (err) return console.error(err.stack);
			var sql1 = "select * from news where id = (select max(id) from news where id < " + id + ")";
			mysql.query(sql1, function(err1, result1) {
				if (err1) return console.error(err1.stack);
				var sql2 = "select * from news where id = (select min(id) from news where id > " + id + ")";
				mysql.query(sql2, function(err2, result2) {
					if (err2) return console.error(err2.stack);
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
	res.writeHead(200, {'Content-type' : 'text/html'});
	res.write('<script>');
	res.write('window.parent.postMessage("'+fname+'","*");');
	res.end('</script>');
}

exports.c_destination = function(req, res) {
	var med = new Med();
	med.get(function(result) {
		if (result[1] == "r") {
			console.log("get info error!");
		} else {
			var port = new Port();
			port.get(function(result1) {
				if (result1[1] == "r") {
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
		if (result[1] == "r") {
			console.log("get info error!");
		} else {
			var cruiseship = new Cruiseship();
			cruiseship.get(function(result1) {
				if (result1[1] == "r") {
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
		if (result[1] == "r") {
			console.log("get info error!");
		} else {
			var port = new Port();
			port.get(function(result1) {
				if (result1[1] == "r") {
					console.log("get info error!");
				} else {
					var cruiseship = new Cruiseship();
					cruiseship.get(function(result3) {
						if (result3[1] == "r") {
							console.log("get info error!");
						} else {
							var travelnotes = new Travelnotes();
							travelnotes.get(function(result6) {
								if (result6[1] == "r") {
									console.log("get info error!");
								} else {
									var cruiselineinfo = new Cruiselineinfo();
									cruiselineinfo.get(function(result2) {
										if (result2[1] == "r") {
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
		if (result[1] == "r") {
			console.log("get info error!");
		} else {
			var port = new Port();
			port.get(function(result1) {
				if (result1[1] == "r") {
					console.log("get info error!");
				} else {
					var cruiselineinfo = new Cruiselineinfo();
					cruiselineinfo.get(function(result2) {
						if (result2[1] == "r") {
							console.log("get info error!");
						} else {
							var cruiseship = new Cruiseship();
							cruiseship.get(function(result3) {
								if (result3[1] == "r") {
									console.log("get info error!");
								} else {
									var travelnotes = new Travelnotes();
									travelnotes.get(function(result6) {
										if (result6[1] == "r") {
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
		if (result[1] == "r") {
			console.log("get info error!");
		} else {
			var port = new Port();
			port.get(function(result1) {
				if (result1[1] == "r") {
					console.log("get info error!");
				} else {
					var cruiselineinfo = new Cruiselineinfo();
					cruiselineinfo.get(function(result2) {
						if (result2[1] == "r") {
							console.log("get info error!");
						} else {
							var cruiseship = new Cruiseship();
							cruiseship.get(function(result3) {
								if (result3[1] == "r") {
									console.log("get info error!");
								} else {

									var travelnotes = new Travelnotes();
									travelnotes.get(function(result6) {
										if (result6[1] == "r") {
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
		if (result[1] == "r") {
			console.log("get info error!");
		} else {
			var cruiseship = new Cruiseship();
			cruiseship.get(function(result1) {
				if (result1[1] == "r") {
					console.log("get info error!");
				} else {
					var cruiselineinfo = new Cruiselineinfo();
					cruiselineinfo.get(function(result2) {
						if (result2[1] == "r") {
							console.log("get info error!");
						} else {
							var med = new Med();
							med.get(function(result3) {
								if (result3[1] == "r") {
									console.log("get info error!");
								} else {
									var travelnotes = new Travelnotes();
									travelnotes.get(function(result5) {
										if (result5[1] == "r") {
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
		if (result[1] == "r") {
			console.log("get info error!");
		} else {
			var cruiseship = new Cruiseship();
			cruiseship.get(function(result1) {
				if (result1[1] == "r") {
					console.log("get info error!");
				} else {
					var cruiselineinfo = new Cruiselineinfo();
					cruiselineinfo.get(function(result2) {
						if (result2[1] == "r") {
							console.log("get info error!");
						} else {
							var med = new Med();
							med.get(function(result3) {
								if (result3[1] == "r") {
									console.log("get info error!");
								} else {
									var travelnotes = new Travelnotes();
									travelnotes.get(function(result5) {
										if (result5[1] == "r") {
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
		if (result[1] == "r") {
			console.log("get info error!");
		} else {
			var cruiseship = new Cruiseship();
			cruiseship.get(function(result1) {
				if (result1[1] == "r") {
					console.log("get info error!");
				} else {
					var shipcabin = new Shipcabin();
					shipcabin.get(function(result2) {
						if (result2[1] == "r") {
							console.log("get info error!");
						} else {
							var shipservice = new Shipservice();
							shipservice.get(function(result3) {
								if (result3[1] == "r") {
									console.log("get info error!");
								} else {
									var cruiselineinfo = new Cruiselineinfo();
									cruiselineinfo.get(function(result4) {
										if (result4[1] == "r") {
											console.log("get info error!");
										} else {
											var shipdinner = new Shipdinner();
											shipdinner.get(function(result5) {
												if (result5[1] == "r") {
													console.log("get info error!");
												} else {
													var travelnotes = new Travelnotes();
													travelnotes.get(function(result7) {
														if (result7[1] == "r") {
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
		if (result[1] == "r") {
			console.log("get info error!");
		} else {
			var travelnotes = new Travelnotes();
			travelnotes.get(function(result1) {
				if (result1[1] == "r") {
					console.log("get info error!");
				} else {
					var cruiselineinfo = new Cruiselineinfo();
					cruiselineinfo.get(function(result2) {
						if (result2[1] == "r") {
							console.log("get info error!");
						} else {
							var med = new Med();
							med.get(function(result3) {
								if (result3[1] == "r") {
									console.log("get info error!");
								} else {
									res.render('c_theme', {
										layout: 'c_layouts',
										title: '邮轮度假主题',
										theme: result,
										r1: result1,
										r2: result2,
										med: result3
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

exports.c_share = function(req, res) {
	var share = new Share();
	share.get(function(result) {
		if (result[1] == "r") {
			console.log("get info error!");
		} else {
			var travelnotes = new Travelnotes();
			travelnotes.get(function(result1) {
				if (result1[1] == "r") {
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

exports.c_theme_sec = function (req, res) {
    var pathid = req.query.id;
    var theme = new Theme();
    theme.get(function (result) {
        if (result[1] == "r") {
            console.log("get info error!");
        } else {
            var travelnotes = new Travelnotes();
            travelnotes.get(function (result1) {
                if (result1[1] == "r") {
                    console.log("get info error!");
                } else {
                    res.render('c_theme_sec', {title: '邮轮度假主题',layout: 'c_layouts',menu_path: pathid, share: result,r1:result1});
                }
            });
        }
    });
};

exports.c_share_sec = function (req, res) {
    var pathid = req.query.pid;
    var share = new Share();
    share.get(function (result) {
        if (result[1] == "r") {
            console.log("get info error!");
        } else {
            var travelnotes = new Travelnotes();
            travelnotes.get(function (result1) {
                if (result1[1] == "r") {
                    console.log("get info error!");
                } else {
                    res.render('c_share_sec', {
                    	layout: 'c_layouts',
                        title: '游记文章',
                        menu_path: pathid,
                        share: result, r1: result1
                    });
                }
            });
        }
    });
};

exports.c_sharetheme_sec = function (req, res) {
    var pathid = req.query.id;
    var share = new Share();
    share.get(function (result) {
        if (result[1] == "r") {
            console.log("get info error!");
        } else {
            var travelnotes = new Travelnotes();
            travelnotes.get(function (result1) {
                if (result1[1] == "r") {
                    console.log("get info error!");
                } else {
                    res.render('c_sharetheme_sec', {
                    	layout: 'c_layouts',
                        title: '游记文章',
                        menu_path: pathid,
                        share: result, r1: result1
                    });
                }
            });
        }
    });
};

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