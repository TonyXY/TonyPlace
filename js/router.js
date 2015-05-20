define('router', [], function() {
    var $ = Framework7.$;

    function init(mainView) {
        $(document).on('pageInit', function(e) {
            var page = e.detail.page;
            load(page);
        });
        $(document).on("pageReinit", function(e) {
            var page = e.detail.page;
            if (page.query.refresh) load(page);
        });

    }

    function load(page) {
        require(['controllers/' + page.name + 'Controller'], function(controller) {
            controller && controller.init(page);
        });
    }

    return {
        init: init,
        load: load
    };
});

define('controllers/indexController', ["app"], function(app) {
    var $ = Framework7.$;
    var options = {
            'bgcolor': '#0da6ec',
            'fontcolor': '#fff',
            'open': false,
            'onOpened': function() {
                console.log("welcome screen opened");
            },
            'onClosed': function() {
                console.log("welcome screen closed");
            }
        },
        welcomescreen_slides,
        welcomescreen;

    welcomescreen_slides = [{
        id: 'slide0',
        picture: '<div class="tutorialicon">♥</div>',
        text: 'Welcome to this tutorial. In the <a class="tutorial-next-link" href="#">next steps</a> we will guide you through a manual that will teach you how to use this app.'
    }, {
        id: 'slide1',
        picture: '<div class="tutorialicon">✲</div>',
        text: 'This is slide 2'
    }, {
        id: 'slide2',
        picture: '<div class="tutorialicon">♫</div>',
        text: 'This is slide 3'
    }, {
        id: 'slide3',
        picture: '<div class="tutorialicon">☆</div>',
        text: 'Thanks for reading! Enjoy this app or go to <a class="tutorial-previous-slide" href="#">previous slide</a>.<br><br><a class="tutorial-close-btn" href="#">End Tutorial</a>'
    }];

    welcomescreen = app.f7.welcomescreen(welcomescreen_slides, options);

    function init() {
        $7(document).on('click', '.tutorial-close-btn', function() {
            welcomescreen.close();
        });

        $7('.tutorial-open-btn').click(function() {
            welcomescreen.open();
        });

        $7(document).on('click', '.tutorial-next-link', function(e) {
            welcomescreen.next();
        });

        $7(document).on('click', '.tutorial-previous-slide', function(e) {
            welcomescreen.previous();
        });
        var listData = {
            list: [{
                type: "HTML/CSS",
                name: 'HTML/CSS',
                total: 0
            }, {
                type: "JavaScript",
                name: 'JavaScript',
                total: 0
            }, {
                type: "Jquery插件",
                name: 'Jquery插件',
                total: 0
            }, {
                type: "其他",
                name: '其他',
                total: 0
            }, {
                type: "Tools",
                name: 'Tools',
                total: 0
            }]
        };
        var outPut = app.myPlugin.compileTemp('TypeListTemplate', listData);
        $7("#typeList").html(outPut);
        $7("#typeListLeft").html(outPut);
    }
    return {
        init: init
    };
});
