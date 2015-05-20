//配置页面加载模块参数
require.config({
    baseUrl: 'js/',
    //添加加载异步加载CSS的插件
    map:{
        '*':{
            'css':'css.min'
        }
    },
    paths: {
        "modernizr"         :"../lib/modernizr.custom",
        "jquery"            :"../lib/jquery-2.1.3.min"
    },
    waitSeconds:30,
    shim: {//模块依赖关系 demo
        //'swiperscrollbar': {deps:['swiper']},
        //'swiper': {deps: ['jquery']},
    }
});

//配置页面加载模块
require(['modernizr'],function(modernizr) {
    !Modernizr.rgba?window.location="np.html":'';
});
//加载对应css模块
/*require([
    "css!../css/style1"
]);*/
var $7 = Framework7.$;
define('app', ['router','myPlugin'], function (Router,myPlugin) {
    Router.init();
    var f7 = new Framework7({
        // Default title for modals
        modalTitle: 'TonyPlace',
        pushState: true,
        fastClicksDistanceThreshold:10,
        onAjaxStart: function (xhr) {
            f7.showIndicator();
        },
        onAjaxComplete: function (xhr) {
            f7.hideIndicator();
        }
    });
    var mainView = f7.addView('.view-main', {
        dynamicNavbar: true,
        domCache: true //enable inline pages
    });
    var app = {
        f7: f7,
        mainView: mainView,
        router: Router,
        myPlugin:myPlugin
    };
    return app;
}); 
