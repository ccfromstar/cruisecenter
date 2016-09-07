module.exports = function (app, routes) {
    //app.post('/uploadImg',routes.uploadImg);
    app.get('/home',routes.home);
    
    app.get('/view_news',routes.view_news);
    app.get('/news',routes.news);
    app.post('/news/:sql',routes.newsdo);
    
    app.get('/view_notice',routes.view_notice);
    app.get('/notice',routes.notice);
    app.post('/notice/:sql',routes.noticedo);
    
    app.get('/view_travel',routes.view_travel);
    app.get('/travel',routes.travel);
    app.post('/travel/:sql',routes.traveldo);
    
    app.post('/travel',routes.travelsubmit);
    
    app.post('/post/:sql',routes.postdo);
    
    app.post('/uploadImg',routes.uploadImg);
    app.get('/login',routes.login);
    app.post('/user/:sql',routes.userdo);
    
    app.get('/c_destination',routes.c_destination);
    
    
    app.get('/c_destination_sec', routes.c_destination_sec);
    app.get('/c_destinationsp_sec', routes.c_destinationsp_sec);
    app.get('/c_destinationport_sec', routes.c_destinationport_sec);
    
    app.get('/c_curisecompany',routes.c_curisecompany);
    app.get('/c_curisecompany_sec', routes.c_curisecompany_sec);
    app.get('/c_curisecompanysp_sec', routes.c_curisecompanysp_sec);
    
    app.get('/c_curisecship_sec', routes.c_curisecship_sec);
    
    app.get('/c_theme',routes.c_theme);
    app.get('/c_share',routes.c_share);
    
};