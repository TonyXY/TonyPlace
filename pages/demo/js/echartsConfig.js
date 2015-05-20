function requireEcharts(needMap, requireCallback) {
    var paths = {
        'echarts': 'js/echarts',
        'echarts/chart/pie': 'js/echarts', // 把所需图表指向单文件
    };
    var pathArr = [
            'echarts',
            'echarts/chart/pie', // 按需加载所需图表
        ];

    if (needMap) {
        paths['echarts/chart/map'] = 'js/echarts-map';
        pathArr.push('echarts/chart/map');
    }

    require.config({
        paths: paths
    });

    require(
        pathArr,
        requireCallback
    );
}

function MyChart(myEcharts, ecConfig, dom_id, option, flag, initFlag) {
    this.myEcharts = myEcharts;
    this.ecConfig = ecConfig;
    this.dom_id = dom_id; //渲染的位置id
    this.option = option; //chart option
    this.loading_flag = flag; //显示过渡效果标志 --0:不显示, 1:显示
    this.chart = '';
    if (initFlag) {
        this.init();
    }
}

MyChart.prototype.init = function () {
    this.chart = this.myEcharts.init(document.getElementById(this.dom_id));
    this.chart.on(this.ecConfig.EVENT.RESIZE, this.eConsole);
}

MyChart.prototype.resetOption = function () {
    this.chart = this.myEcharts.init(document.getElementById(this.dom_id));
    this.chart.setOption(this.option);
}

MyChart.prototype.eConsole = function (param) {
    //console.log(param);
}

MyChart.prototype.loadingData = function(){// 开始加载数据,显示过渡效果
    if (this.loading_flag) {
        this.chart.showLoading({
            text: 'loading',
            effect: 'whirling'
        });
    }
    this.getNewData();
}

MyChart.prototype.getDataBack = function(){//获取数据后,关闭过渡效果,重绘chart
    //---------正式使用时请注释----
    var curChart = this;
    // ajax return
    setTimeout(function() {
        if (curChart.loading_flag) {
            curChart.chart.hideLoading();
        }
    }, 2200);
    //-----------
//    if (this.loading_flag) {
//        this.chart.hideLoading();
//    }
    this.chart.setOption(this.option);
}                   
                    

MyChart.prototype.getNewData = function () {//加载数据
    // ajax --------
    this.getDataBack();
}

$(function() {
    $('.saveImgBtn').click(function(){
        if($('.zhezhao').length == 0){
            $('body').append('<div class="zhezhao"><i class="fixMiddle"></i><div class="temp_img"></div></div>');
            $('.temp_img img').click(function(e){
                e.preventDefault();
            });
            $('.zhezhao').click(function(e){
                $(this).hide(0);
                e.preventDefault();
            });     
        }
        var btn = $(this);
        btn.hide(0);
        html2canvas(btn.closest('.canSaveImg'), {
          onrendered: function(canvas) {
            var img = new Image();
            img.src = canvas.toDataURL("image/png")
            $('.zhezhao .temp_img').html(img);
            $('.zhezhao').show(0);
            btn.show(0);
          }
        });
    });
});