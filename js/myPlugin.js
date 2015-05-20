define('myPlugin',[],function(AS) {
    var myPlugin = {};
    var dicts;
    var compiledTemplate = {};
    //合并对象
    myPlugin.extend=function(o,n,override){
       for(var p in n)if(n.hasOwnProperty(p) && (!o.hasOwnProperty(p) || override))o[p]=n[p];
    };
    //绑定事件
    myPlugin.bindEvents=function (bindings) {
        for (var i in bindings) {
            $7(bindings[i].element).on(bindings[i].event, bindings[i].handler);
        }
    };
    //金额格式化(数字，小数点位数0是无小数点)
    myPlugin.fmoney=function (s, n) { 
        n = (n == undefined ? 0 : n);
        n = n > -1 && n <= 20 ? n : 2;
        s = parseFloat((s + "").replace(/[^\d\.-]/g, "")).toFixed(n) + "";
        var l = s.split(".")[0].split("").reverse(),
        r = s.split(".")[1];
        t = "";
        for (i = 0; i < l.length; i++) {
            t += l[i] + ((i + 1) % 3 == 0 && (i + 1) != l.length ? "," : "");
        }
        return t.split("").reverse().join("") + (n != 0 ? "." + r : "");
    };
    //日期时间格式化
    myPlugin.formatDate = function (dateString, format) {
        if (!dateString) return;
        var date = new Date(parseInt(dateString.substr(0, 4)), parseInt(dateString.substr(4, 2))-1, parseInt(dateString.substr(6, 2)),
            parseInt(dateString.substr(8, 2) || 0), parseInt(dateString.substr(10, 2) || 0), parseInt(dateString.substr(12, 2) || 0));
        if (!date instanceof Date) return;
        var dict = {
            "yyyy": date.getFullYear(),
            "yy":(date.getFullYear() % 100)>9?(date.getFullYear() % 100).toString():'0' + (date.getFullYear() % 100),
            "M": date.getMonth()+1,
            "d": date.getDate(),
            "H": date.getHours(),
            "m": date.getMinutes(),
            "s": date.getSeconds(),
            "MM": ("" + (date.getMonth() + 101)).substr(1),
            "dd": ("" + (date.getDate() + 100)).substr(1),
            "HH": ("" + (date.getHours() + 100)).substr(1),
            "mm": ("" + (date.getMinutes() + 100)).substr(1),
            "ss": ("" + (date.getSeconds() + 100)).substr(1)
        };
        return format.replace(/(yyyy|yy?|MM?|dd?|HH?|ss?|mm?)/g, function () {
            return dict[arguments[0]];
        })
    };
    //编译模板
    myPlugin.compileTemp=function (tempId,data) {  
        if(!compiledTemplate[tempId]){
            var template = $7('script#'+tempId).html();
            compiledTemplate[tempId] = Template7.compile(template);
        }
        return compiledTemplate[tempId](data);
    };
    //提示类弹框
    myPlugin.toast = function(msg,callback){
        app.f7.modal({
            title:  '',
            text: msg,
            buttons: []
        });
        setTimeout(function () {
            app.f7.closeModal();
            callback&&callback();
        }, 2000);
    }
    return myPlugin;
});
