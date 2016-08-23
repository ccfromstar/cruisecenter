module.exports = function (app, routes) {
    //app.post('/uploadImg',routes.uploadImg);
    app.get('/home',routes.home);
    app.get('/view_news',routes.view_news);
    app.get('/news',routes.news);
    app.post('/news/:sql',routes.newsdo);
    app.post('/uploadImg',routes.uploadImg);
    app.get('/login',routes.login);
    app.post('/user/:sql',routes.userdo);
};