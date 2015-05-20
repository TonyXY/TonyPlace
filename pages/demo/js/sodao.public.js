var SOD={
    /**
     *判断是否子对象
     *exp: var flag = isParent(event.toElement, $("#boxindex")[0]);
     *取得鼠标事件event.toElement
     *
     */
    isParent:function (obj,pobj){
        while (obj != undefined && obj != null && obj.tagName.toUpperCase() != 'BODY'){
            if (obj == pobj)
                return true;
            obj = obj.parentNode;
        }
        return false;
    },
    localData:{
        getItem:function(key){
            if (window.localStorage) {
                return localStorage.getItem(key);
            }else{
                return UserData.getItem(key);
            }
        },
        setItem:function(key, value){
            if (window.localStorage) {
                localStorage.setItem(key, value);
            } else {
                UserData.setItem(key,value);
            }
        },
        removeItem:function(key){
            if (window.localStorage) {
                localStorage.removeItem(key);
            } else {
                UserData.remove(key);
            }
        }
    }
};
//判断:当前元素是否是被筛选元素的子元素
jQuery.fn.isChildOf = function(b){
    return (this.parents(b).length > 0);
};
//判断:当前元素是否是被筛选元素的子元素或者本身
jQuery.fn.isChildAndSelfOf = function(b){
    return (this.closest(b).length > 0);
};
//检查数组中是否存在某一项；
Array.prototype.contains = function(item){
  return RegExp("\\b"+item+"\\b").test(this);
};


function is_mobile() {
    return navigator.userAgent.match(/iPhone/i) || navigator.userAgent.match(/iPod/i)
}
//ie 本地存储UserData对象
var UserData = {
    userData : null,
    name : location.hostname,
    //name : "www.css88.com";
    init : function(){
        if (!UserData.userData) {
            try {
                UserData.userData = document.createElement('INPUT');
                UserData.userData.type = "hidden";
                UserData.userData.style.display = "none";
                UserData.userData.addBehavior ("#default#userData");
                document.body.appendChild(UserData.userData);
                var expires = new Date();
                expires.setDate(expires.getDate()+365);
                UserData.userData.expires = expires.toUTCString();
            } catch(e) {
                return false;
            }
        }
        return true;
    },
    setItem : function(key, value) {
        if(UserData.init()){
            UserData.userData.load(UserData.name);
            UserData.userData.setAttribute(key, value);
            UserData.userData.save(UserData.name);
        }
    },
    getItem : function(key) {
        if(UserData.init()){
            UserData.userData.load(UserData.name);
            return UserData.userData.getAttribute(key);
        }
    },
    remove : function(key) {
        if(UserData.init()){
            UserData.userData.load(UserData.name);
            UserData.userData.removeAttribute(key);
            UserData.userData.save(UserData.name);
        }
    }
};
//JSON.stringify()将JSON转为字符串。JSON.parse()将字符串转为JSON格式
var JSON;if(!JSON){JSON={}}(function(){function f(n){return n<10?"0"+n:n}if(typeof Date.prototype.toJSON!=="function"){Date.prototype.toJSON=function(key){return isFinite(this.valueOf())?this.getUTCFullYear()+"-"+f(this.getUTCMonth()+1)+"-"+f(this.getUTCDate())+"T"+f(this.getUTCHours())+":"+f(this.getUTCMinutes())+":"+f(this.getUTCSeconds())+"Z":null};String.prototype.toJSON=Number.prototype.toJSON=Boolean.prototype.toJSON=function(key){return this.valueOf()}}var cx=/[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,escapable=/[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,gap,indent,meta={"\b":"\\b","\t":"\\t","\n":"\\n","\f":"\\f","\r":"\\r",'"':'\\"',"\\":"\\\\"},rep;function quote(string){escapable.lastIndex=0;return escapable.test(string)?'"'+string.replace(escapable,function(a){var c=meta[a];return typeof c==="string"?c:"\\u"+("0000"+a.charCodeAt(0).toString(16)).slice(-4)})+'"':'"'+string+'"'}function str(key,holder){var i,k,v,length,mind=gap,partial,value=holder[key];if(value&&typeof value==="object"&&typeof value.toJSON==="function"){value=value.toJSON(key)}if(typeof rep==="function"){value=rep.call(holder,key,value)}switch(typeof value){case"string":return quote(value);case"number":return isFinite(value)?String(value):"null";case"boolean":case"null":return String(value);case"object":if(!value){return"null"}gap+=indent;partial=[];if(Object.prototype.toString.apply(value)==="[object Array]"){length=value.length;for(i=0;i<length;i+=1){partial[i]=str(i,value)||"null"}v=partial.length===0?"[]":gap?"[\n"+gap+partial.join(",\n"+gap)+"\n"+mind+"]":"["+partial.join(",")+"]";gap=mind;return v}if(rep&&typeof rep==="object"){length=rep.length;for(i=0;i<length;i+=1){if(typeof rep[i]==="string"){k=rep[i];v=str(k,value);if(v){partial.push(quote(k)+(gap?": ":":")+v)}}}}else{for(k in value){if(Object.prototype.hasOwnProperty.call(value,k)){v=str(k,value);if(v){partial.push(quote(k)+(gap?": ":":")+v)}}}}v=partial.length===0?"{}":gap?"{\n"+gap+partial.join(",\n"+gap)+"\n"+mind+"}":"{"+partial.join(",")+"}";gap=mind;return v}}if(typeof JSON.stringify!=="function"){JSON.stringify=function(value,replacer,space){var i;gap="";indent="";if(typeof space==="number"){for(i=0;i<space;i+=1){indent+=" "}}else{if(typeof space==="string"){indent=space}}rep=replacer;if(replacer&&typeof replacer!=="function"&&(typeof replacer!=="object"||typeof replacer.length!=="number")){throw new Error("JSON.stringify")}return str("",{"":value})}}if(typeof JSON.parse!=="function"){JSON.parse=function(text,reviver){var j;function walk(holder,key){var k,v,value=holder[key];if(value&&typeof value==="object"){for(k in value){if(Object.prototype.hasOwnProperty.call(value,k)){v=walk(value,k);if(v!==undefined){value[k]=v}else{delete value[k]}}}}return reviver.call(holder,key,value)}text=String(text);cx.lastIndex=0;if(cx.test(text)){text=text.replace(cx,function(a){return"\\u"+("0000"+a.charCodeAt(0).toString(16)).slice(-4)})}if(/^[\],:{}\s]*$/.test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g,"@").replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,"]").replace(/(?:^|:|,)(?:\s*\[)+/g,""))){j=eval("("+text+")");return typeof reviver==="function"?walk({"":j},""):j}throw new SyntaxError("JSON.parse")}}}());
