module.exports = function (app, routes) {
    //app.post('/uploadImg',routes.uploadImg);
    app.get('/home',routes.home);
    
    app.get('/view_news',routes.view_news);
    app.get('/news',routes.news);
    app.post('/news/:sql',routes.newsdo);
    
    app.get('/view_notice',routes.view_notice);
    app.get('/notice',routes.notice);
    app.post('/notice/:sql',routes.noticedo);
    
    app.post('/uploadImg',routes.uploadImg);
    app.get('/login',routes.login);
    app.post('/user/:sql',routes.userdo);
};