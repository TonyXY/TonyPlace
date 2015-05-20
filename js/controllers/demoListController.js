/*关于*/
define(['app'], function (app) {
	function init(page){
		var type = page.query.type;
		$7("#demoLtitle").text(type);
		var listData = {
            list: [{
                url: "demo1",
                name: 'div水平垂直居中'
            }, {
                url: "demo11",
                name: '全国城市三级联动'
            }, {
                url: "demo3",
                name: '自动伸缩的查询框'
            }, {
                url: "demo4",
                name: 'CSS与文本框上清除按钮的隐藏与显示'
            }, {
                url: "demo15",
                name: '奔跑中的人CSS3'
            }, {
                url: "demo16",
                name: 'css3实现很酷的图片标题'
            }, {
                url: "demo20",
                name: 'canvas 圆环百分比'
            }, {
                url: "demo23",
                name: '文本域字符数判断'
            }]
        };
        var outPut = app.myPlugin.compileTemp('DemoListTemplate', listData);
        console.log(outPut);
        $7("#demoList").html(outPut);
	}
	return {
		init:init
	};
});
