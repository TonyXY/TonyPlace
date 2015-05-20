/**
 * @author 愚人码头
 * 文本域字符数判断,插入文本，还提供了事件回调参数与方法，完成简单的输入反馈与字符插入功能。
 * 参数：
 * ｛maxLength: -1,          //最大字符
 *   onInput: null,         //回调事件函数
 *   cjk: false,            //true:将中文视为一个字符，将英文视为半个字符，也就是两个英文字符按一个字符计算。
 *   urlCharsTag:false,     //是否缩减URL
 *   wild: false,           //是否允许文字超出最大字符还能输入
 *   maxHeight,             //文本框是否自动撑高，默认：null，不自动撑高；如果自动撑高必须输入数值，该值作为文本框自动撑高的最大高度
 *   minHeight,             //文本框的默认高度，一般不做设置
 *   ATtag,                 //是否开启@功能，默认：true，开启；false关闭，关闭状态下 mode、  itemCount、 customData参数无效
 *   mode，                 //@功能加载数据的方式，默认  complete，目前只有默认形式
 *   itemCount              //@后面的检索字符串的最大个数 ，默认10
 *   tips，                 //@提示。
 *  ｝
 * 更多http://www.css88.com/
 */

;(function($) {
    if ($.fn.insertTextarea) {
        return;
    }

    var replaceCJK = /[\u2E80-\u9FFF\uF92C-\uFFE5]/g,
        testCJK    = /[\u2E80-\u9FFF\uF92C-\uFFE5]/;
    var regexp = new RegExp("(http[s]{0,1}|ftp)://[a-zA-Z0-9\\.\\-]+\\.([a-zA-Z]{2,4})(:\\d+)?(/[a-zA-Z0-9\\.\\-~!@#$%^&*+?:_/=<>]*)?", "gi"),
    regexpAT=new RegExp("@[^()]{1,20}(\\([a-zA-Z0-9_]*?\\))", "gi"),
    regexpATUserID=new RegExp("@[^()]{1,20}\\(([a-zA-Z0-9_]*?)\\)", "gi");
    // jQuery doesn't support a is string judgement, so I made it by myself.
    var imitateTextarea, $suggest,
        // $suggest 列表索引值
        //ind = 0,
		// $suggest 列表size,多少个用户
        userNum = 0,
        m = "",
        //@用户数组
        userArray = [],
        //@后的字符
        schChar = "";
    function isString(obj) {
        return typeof obj == "string" || Object.prototype.toString.call(obj) === "[object String]";
    }
    /*var uNameArray = [],
    uIDArray = [];*/
    //localTopKeyObj:本地TOP数据的json对象;localTopKeyObjArr: 本地TOP数据的json对象临时存储的用户ID数组
    var localTopKeyObj=null,localTopKeyObjArr=[];
    var localTopKey = "top_feiwen8772";
    var localDataKey = "follow_0_feiwen8772";  //key 临时数据
$.fn.insertTextarea = function(settings) {
    var oBody = $("body");

	var defaults = {
		maxLength: -1,//最大字符
		onInput: null,//回调事件函数
		cjk: false, //true:将中文视为一个字符，将英文视为半个字符，也就是两个英文字符按一个字符计算。
        urlCharsTag:false,//是否缩减URL
		wild: false, //是否允许文字超出最大字符还能输入
        maxHeight:null,//文本框是否自动撑高，默认：null，不自动撑高；如果自动撑高必须输入数值，该值作为文本框自动撑高的最大高度
        minHeight:$(this).height(),//文本框原始高度
        //begin @ 参数
        ATtag :false,
        dataUrl:"",
        mode: "complete",
        itemCount: 10,
        itemMax: 1E3,
        tips: "@朋友帐号,他就能在[提到我的]页收到",
        //end @ 参数
		_pasteHandler: function(event) {
			var textarea = this;
			window.setTimeout(function() {
				inputHandler.call(textarea, event);
			}, 0);
		},
		_cutHandler: function(event) {
			var textarea = this;
			window.setTimeout(function() {
				inputHandler.call(textarea, event);
			}, 0);
		},
		_keyupHandler: function(event) {
			if (opts.maxLength < 0) {
				if ($.isFunction(opts.onInput)) {
					opts.onInput.call(this, event, {maxLength: opts.maxLength, leftLength: -1});
				}
			}
			else {
				inputHandler.call(this, event);
			}
		},
        _keydownHandler:function(event){
            if (opts.maxLength < 0) {
				if ($.isFunction(opts.onInput)) {
					opts.onInput.call(this, event, {maxLength: opts.maxLength, leftLength: -1});
				}
			}
			else {
			    keydowninputHandler.call(this, event);
			}
        },
        _focusHandler: function(event) {
			if (opts.maxLength < 0) {
				if ($.isFunction(opts.onInput)) {
					opts.onInput.call(this, event, {maxLength: opts.maxLength, leftLength: -1});
				}
			}
			else {
				inputHandler.call(this, event);
			}
		},
		_blurHandler: function(event) {
			if (!opts.wild) {
				fixLength(this);
			}
		}
	};
	var opts = $.extend(defaults, settings);
    var h = true;
    var pluginFun={
        //光标在页面中的位置
        getCarePos: function(textArea, textAreaVal) {
            //imitateCursor模拟光标对象
            var imitateCursor = $("<em>&nbsp;</em>"),
                textArea = $(textArea),
                textAreaSeat = textArea.offset(),
                //imitateCursor模拟光标位置
                imitateCursorSeat = {};

            //console.log(scrollTop);
            //imitateTextarea 模拟文本框的对象
            if(opts.maxHeight){
                imitateTextarea || (imitateTextarea = $("<div></div>"),imitateTextarea.appendTo("body"));
                imitateTextarea.css(this.initPreStyle(textArea));
            }else{
                imitateTextarea || (imitateTextarea = $("<div></div>").css(this.initPreStyle(textArea)),imitateTextarea.appendTo("body"));
            }
            var scrollTop=textArea.scrollTop();
            imitateTextarea.html(textAreaVal).append(imitateCursor).scrollTop(scrollTop);//
            imitateCursorSeat = imitateCursor.position();
            return {
                left: imitateCursorSeat.left + textAreaSeat.left + 2,
                top: imitateCursorSeat.top + textAreaSeat.top + 20
            }
        },
        //imitateTextarea 模拟文本框的样式
        initPreStyle: function(textArea) {
            //console.log(textArea.height());
            return {
                position: "absolute",
                left: -9999,
                display:"block",
                width: textArea.width() + "px",
                height: textArea.height() + "px",
                overflowY:textArea.css("overflowY"),
                padding: textArea.css("padding"),
                fontSize:textArea.css("fontSize"),
                lineHeight:textArea.css("lineHeight"),
                fontFamily:textArea.css("fontFamily"),
                //font: '12px/20px "Helvetica Neue", Helvetica, Arial',
                "word-wrap": "break-word",
                border: "1px"
            }
        },
        //高亮用户名，替换@后的字符串
        highlightName: function(userArray, textAreaVal) {
            $.each(userArray,
                function(userArray, items) {
                    itemsArray = items.split(":");
                    textAreaVal = textAreaVal.replace(RegExp("@" + itemsArray[1], "g"), '<b id="' + itemsArray[0] + '">@' + itemsArray[1] + "</b>");
                    //textAreaVal = textAreaVal.replace(RegExp("@" + itemsArray[1], "g"), '<b id="' + itemsArray[0] + '">@' + itemsArray[1] + "</b> ")
                });
            return textAreaVal
        },
        moveSelectedItem: function(index) {
            //console.log(index);
            var selLi = $suggest.find("li");
            //var size = selLi.size();
            var ind = $suggest.find(".on").index();
            //userNum && (ind += index,ind >= userNum && (ind -= userNum),ind < 0 && (ind === -2 && (ind = -1),ind += userNum),selLi.removeClass("on"),$(selLi[ind]).addClass("on"));
            //console.log(userNum);
            if(userNum){
                ind += index;
                if (ind >= userNum) {
                    ind -= userNum
                }
                if(ind < 0){
                    if(ind === -2){
                        ind = -1;
                    }
                    ind += userNum;
                }

                if(userNum > 10 && ind >= 5){
                    //var nowScrollTop=24* (ind-5);
                    $suggest.find(".autoCmt").scrollTop(24* (ind-5))
                }

                if(ind==0){
                    $suggest.find(".autoCmt").scrollTop(0)
                }
                selLi.removeClass("on");
                $(selLi[ind]).addClass("on");
            }

        },

        //删除@后面的检索字符
        deleteRangeText: function(textArea, delCharL) {
            //光标位置
            var cursorSeat = getInsertPos(textArea),
                textAreaScT = textArea.scrollTop,
                textAreaVal = textArea.value;
            textArea.value = delCharL > 0 ? textAreaVal.slice(0, cursorSeat - delCharL) + textAreaVal.slice(cursorSeat) : textAreaVal.slice(0, cursorSeat) + textAreaVal.slice(cursorSeat - delCharL);
            setInsertPos(textArea, cursorSeat - (delCharL < 0 ? 0 : delCharL));
            firefox = $.browser.mozilla && setTimeout(function() {
                if (textArea.scrollTop !== textAreaScT){
                    textArea.scrollTop = textAreaScT;
                }
            },10)
        },
        //插入内容
        /*insertAfterCursor: function(textArea, userName,event) {
            //console.log(userName);
            if (document.selection){
                textArea.focus();
                document.selection.createRange().text = userName + " ";
                *//*g = this.highlightName(userArray, textArea.value);

                $(highlighter).html(g);*//*
            }else {
                var startPos = textArea.selectionStart;
                var endPos = textArea.selectionEnd;


                var scrollTop = textArea.scrollTop;
                var textAreaVal = textArea.value.substring(0, startPos) + userName + textArea.value.substring(endPos, textArea.value.length);

                //textAreaVal = this.highlightName(userArray, textAreaVal).replace(/\s{2,}/g, " ");

                //$(highlighter).html(textAreaVal);
                //console.log(textAreaVal);
                textArea.value = textAreaVal.replace(/<b[^>]+>|<\/b>/g, "");
                textArea.focus();
                setInsertPos(textArea, startPos + userName.length);
                firefox = $.browser.mozilla && setTimeout(function() {
                    if (textArea.scrollTop !== scrollTop){
                        textArea.scrollTop = scrollTop;
                    }
                },200);

            }

        },*/
        whole2sim: function(a,sp) {
            a = a.split(sp);
            for (var b = "", c = 0; c < a.length; ++c) b += a[c].charAt(0) || "?";
            return b.toLowerCase()
        },
        strEscapeReg:function(a) {
            for (var b = [],c = 0; c < a.length; c++) {
                var g = a.charAt(c);
                switch (g) {
                    case ".":
                    case "$":
                    case "^":
                    case "{":
                    case "[":
                    case "(":
                    case "|":
                    case ")":
                    case "*":
                    case "+":
                    case "?":
                    case "\\":
                        b.push("\\x" + g.charCodeAt(0).toString(16).toUpperCase());
                        break;
                    default:
                        b.push(g)
                }
            }
            return b.join("")
        },
        sim: function(a, b) {
            var c = a.indexOf(b);
            return c == -1 ? null: [c, b.length]
        }
    };
	// This is the prefect get caret position function.
	// You can use it cross browsers.
	function getInsertPos(textbox) {
		var iPos = 0;
		if (textbox.selectionStart || textbox.selectionStart == "0") {
			iPos = textbox.selectionStart;
		}
		else if (document.selection) {
			textbox.focus();
			var range = document.selection.createRange();
			var rangeCopy = range.duplicate();
			rangeCopy.moveToElementText(textbox);
			while (range.compareEndPoints("StartToStart", rangeCopy) > 0) {
				range.moveStart("character", -1);
				iPos++;
			}
		}
		return iPos;
	}

	// This is the prefect set caret position function.
	// You can use it cross browsers.
	function setInsertPos(textbox, iPos) {
        //console.log(iPos)
		textbox.focus();
		if (textbox.selectionStart || textbox.selectionStart == "0") {
			textbox.selectionStart = iPos;
			textbox.selectionEnd = iPos;
		}
		else if (document.selection) {
			var range = textbox.createTextRange();
			range.moveStart("character", iPos);
			range.collapse(true);
			range.select();
		}
	}

	function isGreateMaxLength(strValue, strDelete) {
		var maxLength = opts.cjk ? opts.maxLength * 2 : opts.maxLength;
		if (maxLength > 0) {
			var valueLength = (opts.cjk ? strValue.replace(replaceCJK, "lv") : strValue).replace(/\r/g, "").length;
			var deleteLength = (strDelete ? (opts.cjk ? strDelete.replace(replaceCJK, "lv") : strDelete).replace(/\r/g, "").length : 0);

			return valueLength - deleteLength > maxLength;
		}
		else {
			return false;
		}
	}

	function fixLength(textbox) {
		var maxLength = opts.cjk ? opts.maxLength * 2 : opts.maxLength;
		if (maxLength > 0) {
			var strValue = textbox.value.replace(/\r/g, "");
			if (isGreateMaxLength(strValue)) {
				if (opts.cjk) {
					for (var i = 0, index = 0; i < maxLength; index++) {
						if (testCJK.test(strValue.charAt(index))) {
							i += 2;
						}
						else {
							i += 1;
						}
					}
					maxLength = index;
				}

				textbox.value = strValue.substr(0, maxLength);
			}
		}
	}
    //用户列表键盘操作，向下，向上，回车等等。
    function keydowninputHandler(event){
        h = (event.ctrlKey || event.metaKey) && event.keyCode === 65 || event.shiftKey && (event.keyCode === 37 || event.keyCode === 39) ? !1 : !0;
        if ($suggest && $suggest.is(":visible") && $suggest.find("ul").length) switch (event.keyCode) {
            case 32:
                $suggest.hide();
                break;
            case 38:
                event.preventDefault();
                pluginFun.moveSelectedItem(- 1);
                break;
            case 40:
                event.preventDefault();
                pluginFun.moveSelectedItem(1);
                break;
            case 9:
            case 13:
                event.preventDefault()
        }

    }
	function inputHandler(event) {
		// truck extra input text
		var strValue = this.value.replace(/\r/g, "");
		if (!opts.wild && isGreateMaxLength(strValue)) {
			// remember the scroll top position.
			var scrollTop = this.scrollTop,
				insertPos = getInsertPos(this),
				deleteLength = 0;

			if (opts.cjk) {
				var overLength = strValue.replace(replaceCJK, "lv").length - opts.maxLength * 2;
				for (var i = 0; i < overLength; deleteLength++) {
					if (testCJK.test(strValue.charAt(insertPos - deleteLength - 1))) {
						i += 2;
					}
					else {
						i += 1;
					}
				}
			}
			else {
				deleteLength = strValue.length - opts.maxLength;
			}

			var iInsertToStartLength = insertPos - deleteLength;
			this.value = strValue.substr(0, iInsertToStartLength) + strValue.substr(insertPos);
			setInsertPos(this, iInsertToStartLength);

			// set back the scroll top position.
			this.scrollTop = scrollTop;
		}

        if(opts.ATtag){//光标位置
            var offset = getInsertPos(this);
            //光标位置最后一个字符
            var preChar = event.target.value.charAt(offset - 1);
            /*if (offset < event.target.value.length + 1 && userArray.length && h) {
                setInsertPos(event.target, offset);
            }*/
            event.keyCode !== 38 && event.keyCode !== 40 && event.keyCode !== 13 && event.keyCode !== 16 && event.keyCode !== 9 && getATData(this, preChar, offset);
            (event.keyCode === 9 || event.keyCode === 13) && $suggest && $suggest.find(".on").size() && $suggest.is(":visible") && selSuggestList(this);
        }
        //自动撑高
        var maxHeight =opts.maxHeight;
        if(maxHeight && jQuery.type(maxHeight)==="number"){
            autoTextarea(this,maxHeight);
        }
        //@开始

		if ($.isFunction(opts.onInput)) {
			// callback for input handler
			opts.onInput.call(this, event, {
				maxLength: opts.maxLength,
				leftLength: getLeftLength(this)
			});
		}
	}

	function getSelectedText(textbox) {
		var strText = "";
		if (textbox.selectionStart || textbox.selectionStart == "0") {
			strText = textbox.value.substring(textbox.selectionStart, textbox.selectionEnd);
		}
		else {
			strText = document.selection.createRange().text;
		}
		return strText.replace(/\r/g, "");
	}
    //获取@用户ID //regexpATUserID
    function getATUserID(textbox){
        if(opts.ATtag){
            var matchATusers1,matchATusersID=[];
            while (matchATusers1 = regexpATUserID.exec(textbox.value)){
                if (matchATusers1 != null){
                    matchATusersID.push(matchATusers1[1]);

                }
            }
        }
    }
    //获取剩余字符数
	function getLeftLength(textbox) {
        //var matchATusers=regexpAT.exec(textbox.value);

        var userIDLen=0;
        if(opts.ATtag){
            var matchATusers;
            while (matchATusers = regexpAT.exec(textbox.value)){
                if (matchATusers != null){
                    userIDLen+=matchATusers[1].length;

                }
            }
        }


        if(opts.urlCharsTag){
            var urls = textbox.value.match(regexp) || [];
            //console.log(urls);
            var urlsNum = urls.length;
            var urlLen=0;
            for(var i=0; i<urlsNum; i++){
               urlLen+=urls[i].length
            }
            return opts.cjk ?
            Math.round(((opts.maxLength * 2 - textbox.value.replace(/\r/g, "").replace(replaceCJK, "lv").length)+urlLen+userIDLen) / 2)-10*urlsNum :
            opts.maxLength - textbox.value.replace(/\r/g, "").length;
        } else{
            return opts.cjk ?
                Math.round((opts.maxLength * 2 - textbox.value.replace(/\r/g, "").replace(replaceCJK, "lv").length+userIDLen) / 2) :
                opts.maxLength - textbox.value.replace(/\r/g, "").length;
        }

	}
    function autoTextarea(textbox,maxHeight){
        //var extra = extra || 20;

        //var minHeight=$(textbox).height();

        var height,style=textbox.style;
        //scrollTop = document.body.scrollTop || document.documentElement.scrollTop;
        textbox.style.height = opts.minHeight + 'px';
		if (textbox.scrollHeight > opts.minHeight) {
            //alert(textbox.scrollHeight+"---"+opts.minHeight)
			if (maxHeight && textbox.scrollHeight > maxHeight) {
				height = maxHeight;
				style.overflowY = 'scroll';
			} else {
				height = textbox.scrollHeight;
				style.overflowY = 'hidden';
			}

			style.height = height  + 'px';
			//scrollTop += parseInt(style.height) - textbox.currHeight;
			//document.body.scrollTop = scrollTop;
			//document.documentElement.scrollTop = scrollTop;
			textbox.currHeight = parseInt(style.height);
		}

    }
	function unbindEvents(textbox, opts) {
		$(textbox)
				.unbind("paste", opts._pasteHandler)
				.unbind("cut", opts._cutHandler)
				.unbind("keyup", opts._keyupHandler)
                .unbind("keydown", opts._keydownHandler)
				.unbind("blur", opts._blurHandler)
                .unbind("focus", opts._focusHandler);

	}

	function bindEvents(textbox, opts) {
		var $textbox = $(textbox);

		if (opts.maxLength < 0) {
			$textbox.bind("keyup", opts._keyupHandler);
		}
		else {
			$textbox
					.bind("paste", opts._pasteHandler)
					.bind("cut", opts._cutHandler)
					.bind("keyup", opts._keyupHandler)
                    .bind("keydown", opts._keydownHandler)
					.bind("blur", opts._blurHandler)
                    .bind("focus", opts._focusHandler);


			if (!opts.wild) {
				fixLength(textbox);
			}
		}
	}

    function getATData(textArea, lastChar, mouseIndex) {
        //console.log(lastChar);
        //textArea this对象
        //lastChar:最后一个字符
        //mouseIndex:光标位置
        var textAreaVal = textArea.value,
            //最后一个@的位置
            lastATIndex = textAreaVal.substring(0, mouseIndex).lastIndexOf("@"),
            //最后一个@后面空格的位置
            lastATSpaceIndex = textAreaVal.substring(lastATIndex, mouseIndex).indexOf(" "),
            //光标在页面中的位置
            mouseOffset = {};
            //console.log(lastATIndex+"------"+textAreaVal.substring(lastATIndex, mouseIndex)+"-----|"+lastATSpaceIndex);
        function b(r) {
            var o = {
                info: {}
            },
            v = {};

            if ($.isArray(r.info)){
                for (var t = 0; t < r.info.length; ++t) {
                o.info[r.info[t][0]] = r.info[t][1];
                if (r.info[t][2]){ v[r.info[t][0]] = [r.info[t][2].toLowerCase(), pluginFun.whole2sim(r.info[t][2],"|")] }
            }
            } else{ o = r}
            //console.log([o, v]);
            return [o, v]
        }



        //var localDatas=SOD.localData.getItem(localDataKey);
        //console.log(localDatas);
        /*if(!SOD.localData.getItem("localDataTime")){
            SOD.localData.setItem("localDataTime", (new Date).getTime());
        }*/
        //console.log(SOD.localData.getItem("localDataTime"));
        //@后面的字符
        schChar = textAreaVal.substring(lastATIndex + 1, mouseIndex);
        if (opts.mode === "complete") {
            if (lastChar === "@") {
                mouseOffset = pluginFun.getCarePos(textArea, textAreaVal.substring(0, mouseIndex - 1));
                //console.log(mouseOffset);
                showSuggest(textArea, mouseOffset);
            }
        }

        if(lastATIndex !== -1){
            if(lastATSpaceIndex === -1){
                if(opts.mode === "complete" && schChar.length <= 10){
                    mouseOffset = pluginFun.getCarePos(textArea, textAreaVal.substring(0, lastATIndex));
                    showSuggest(textArea, mouseOffset);
                    showSuggestTip()
                }

                //(new Date).getTime() - SOD.localData.getItem("localDataTime") > 432E5 //大于12小时


                if(!SOD.localData.getItem("localDataTime")||(schChar &&( (new Date).getTime() - SOD.localData.getItem("localDataTime") > 432E5))){

                    $.ajax({
                        url: opts.dataUrl,
                        dataType: "json",
                        type:"GET",
                        success: function(data) {
                            var localDataStr=JSON.stringify(data);

                            var r = b(data);

                            SOD.localData.setItem(localDataKey,localDataStr);
                            SOD.localData.setItem("localDataTime", (new Date).getTime());

                            showATList(schChar,r[0],r[1]);
                            showSuggest(textArea, mouseOffset);
                        },
                        error:function(){
                            $suggest && $suggest.hide();
                        }

                    });
                    /*$.getJSON(
                        opts.dataUrl,
                        {count: opts.itemCount,word: schChar},
                        function(data) {
                            var localDataStr=JSON.stringify(data);

                            var r = b(data);

                            SOD.localData.setItem(localDataKey,localDataStr);
                            SOD.localData.setItem("localDataTime", (new Date).getTime());

                            showATList(schChar,r[0],r[1]);
                            showSuggest(textArea, mouseOffset);
                        }
                    )*/
                }else{
                    var localDataJson=JSON.parse(SOD.localData.getItem(localDataKey));

                    var r = b(localDataJson);
                    showATList(schChar,r[0],r[1]);
                    showSuggest(textArea, mouseOffset);
                }

            }else{
                $suggest && $suggest.hide();
            }

        }else{
            $suggest && $suggest.hide();
        }
    }
    function showATList(schChar, uName, uIndex){
        var sChar=pluginFun.strEscapeReg(schChar),//转换@后输入的特殊字符，".,$,^,{,[,(,|,),*,+,?,\\"
            sCharRegExp = RegExp("(^" + sChar + ")", "i"),//匹配正则
            sCharRegExpGlobal = RegExp("(" + sChar + ")", "ig"),
            r =  10,
            uNameObj=uName.info,//用户名对象
            uNameArray = [],
            uIDArray = [],
            uIndex=uIndex || {},
            //v = {},
            itemNum=0;//列表数
            //l = 0;
        //opts.itemMax
        if(sChar){
            for (var i in uNameObj) {
                if (itemNum >= opts.itemMax){
                    break;
                }
                if (uNameObj[i] && (i.match(sCharRegExp) || uNameObj[i].match(sCharRegExp))) {
                    uNameArray.push(uNameObj[i].replace(sCharRegExp, "<b>" + RegExp.$1 + "</b>") + "(" + i.replace(sCharRegExp, "<b>" + RegExp.$1 + "</b>") + ")" + (i.substr(0, 1) == "*" ? '<em class="ico_qGroup"></em>': ""));
                    uIDArray.push(i);
                    //v[i] = 1;
                    itemNum++;
                }
                //l++;
            }

            if (itemNum < opts.itemMax) {
                var schCharLower = schChar.toLowerCase(); //小写的检索文本

                for (i in uNameObj) {
                    if (itemNum >= opts.itemMax){
                        break;
                    }
                    if (! (!uIndex[i] )) {
                        if (r = pluginFun.sim(uIndex[i][1], schCharLower)) {
                            uNameArray.push(uNameObj[i].substring(0, r[0]) + "<b>" + uNameObj[i].substring(r[0], r[0] + r[1]) + "</b>" + uNameObj[i].substring(r[0] + r[1]) + "(" + i + ")" + (i.substr(0, 1) == "*" ? '<em class="ico_qGroup"></em>': ""));
                            uIDArray.push(i);
                            //v[i] = 1;
                            itemNum++
                        }
                        //l++
                    }
                }
            }
            if (itemNum < opts.itemMax){
                for (i in uNameObj) {
                    if (itemNum >= opts.itemMax){
                        break;
                    }
                    if (uNameObj[i] && (i.slice(1).match(sCharRegExpGlobal) || uNameObj[i].slice(1).match(sCharRegExpGlobal))) {
                        uNameArray.push(uNameObj[i].replace(sCharRegExpGlobal, "<b>" + RegExp.$1 + "</b>") + "(" + i.replace(sCharRegExpGlobal, "<b>" + RegExp.$1 + "</b>") + ")" + (i.substr(0, 1) == "*" ? '<em class="ico_qGroup"></em>': ""));
                        uIDArray.push(i);
                        //v[i] = 1;
                        itemNum++
                    }
                    //l++
                }
            }


        }else{
            //localTopKeyObj
            SOD.localData.getItem(localTopKey) || SOD.localData.setItem(localTopKey, "{}");
            //console.log(SOD.localData.getItem(localTopKey));
            //localTopKeyObj:本地TOP数据的json对象;localTopKeyObjArr: 本地TOP数据的json对象临时存储的用户ID数组
            if (!localTopKeyObj) {
                localTopKeyObj = JSON.parse(SOD.localData.getItem(localTopKey));
            }

            //localTopKeyObjArr: 本地TOP数据的json对象临时存储的用户ID数组
            $.each(localTopKeyObj,function(i,val){
                //如果该数据项已经存在，则不加人该数组
                if(!localTopKeyObjArr.contains(i)){
                    localTopKeyObjArr.push(i);
                }
            });
            //localTopKeyArray本地TOP数据的json对象临时存储的用户ID数组和@次数数组
            //例如：[{account:"feiwen8772",count:2},{account:"yure",count:1}]
            var localTopKeyArray = [],
            useraccount;
            for (useraccount in localTopKeyObj){
                localTopKeyArray.push({
                    account: useraccount,
                    count: localTopKeyObj[useraccount]
                });
            }
            //console.log(localTopKeyObj);
            //localTopKeyArray排序
            localTopKeyArray = localTopKeyArray.sort(function(c,e){
                return e.count - c.count;
            });
            //本地TOP数据计数，
            var j = 0;
            for (var usersArrNum = localTopKeyArray.length; j < usersArrNum; j++) {
                //如果本地TOP数据计数大于等于10，break
                if (j >= r){
                    break;
                }
                //userAccountItem 本地TOP数据数组中用户名
                var userAccountItem = localTopKeyArray[j].account;
                //uNameObj=uName.info,//用户名对象
                var userNameItem=""; //用户名
                if (userNameItem = uNameObj[userAccountItem]) {
                    uNameArray.push(userNameItem + "(" + userAccountItem + ")");
                    itemNum++;
                    uIDArray.push(userAccountItem);
                    //v[p] = 1
                }
            }
            //console.log(localTopKeyObjArr);
        }
        //var UserListHtml = '<div class="autoCmt"><ul><li>' +uNameArray.join('</li><li>') + "</li></ul></div>";
        var UserListHtml='<div class="autoCmt"><ul>';
        $.each(uIDArray,function(index,val){
            UserListHtml+='<li id="'+val+'">'+uNameArray[index]+'</li>';
        });
        UserListHtml+="</ul></div>";
        $suggest.prepend(UserListHtml);
        if(uNameArray.length>10){
            $suggest.find(".autoCmt").css({"height":260,"overflow":"auto"});
        }
        $suggest.find("li").hasClass("on") || $suggest.find("li:first").attr("class", "on");
        userNum = $suggest.find("li").size();

    }
    //点击或者选取
    function selSuggestList(textArea) {

        var userHTML = $suggest.find(".on").text() || "";
        var userID  = $suggest.find(".on").attr("id");
            //userName = $.trim($suggest.find(".on").text().split("(")[0]);
            //console.log(userID+"--"+userName)
        //userArray.push(userID + ":" + userName);
        //userArray = $.unique(userArray);
        pluginFun.deleteRangeText(textArea, schChar.length);
        $suggest.hide();
        insertCon(textArea,userHTML+" ");
        //old
        /*var userID = $suggest.find(".on").attr("id").replace(/(<\/|<)b>/g, "") || "",
            userName = $.trim($suggest.find(".on").text().split("(")[0]);
            //console.log(userID+"--"+userName)
        userArray.push(userID + ":" + userName);
        userArray = $.unique(userArray);
        pluginFun.deleteRangeText(textArea, schChar.length);
        $suggest.hide();
        insertCon(textArea,userName+"("+userID+") ");*/
        //pluginFun.insertAfterCursor(textArea, userName+"("+userID+") ",event);
        //b.mode === "complete" && vStatusBox.updateNum(140 - $.trim(d.value).length);

        //console.log(userID);
        /*var localTopKey = "top_feiwen8772";
        if(!SOD.localData.getItem("localTopKey")){
            SOD.localData.setItem("localTopKey", "");
        }*/
        //本地Top值操作
        //userID是@某人的用户ID

        //localTopKeyObjArr.push(userID);
        //localTopKeyObj
        localTopData(userID);


        //自动撑高
        var maxHeight =opts.maxHeight;
        if(maxHeight && jQuery.type(maxHeight)==="number"){
            autoTextarea(textArea,maxHeight);
        }
    }
    //本地Top值操作
    function localTopData(userID){
        //判断@某人是否已经存在本地TOP值中，已经存在的话+1；

        if(!localTopKeyObjArr.contains(userID)){
            localTopKeyObjArr.push(userID);
            localTopKeyObj[userID]=1;
        }else{
            localTopKeyObj[userID]+=1;
        }
        //本地存储
        SOD.localData.setItem(localTopKey,JSON.stringify(localTopKeyObj));

    }
    function showSuggestTip() {
        $suggest.html('<div class="bd">' + opts.tips + "</div>")
    }

    function showSuggest(textArea, mouseOffset) {

        $("#db-suggest-flist").remove();
        //suggest
        $suggest = $("#db-suggest-list");
        if(!$suggest.length){
            $suggest = $('<div id="{ID}" class="suggest-overlay"></div>'.replace("{ID}", "db-suggest-list"));
            $suggest.appendTo("body");
        }
        //$suggest.length || ($suggest = $('<div id="{ID}" class="suggest-overlay"></div>'.replace("{ID}", "db-suggest-list")),$suggest.appendTo("body"));
        $suggest.css({
            top: mouseOffset.top + "px",
            left: mouseOffset.left + "px"
        }).show();
        $suggest.find("li").click(function(event) {
            selSuggestList(textArea)
        });
        //鼠标选择用户
        $suggest.find("li").hover(function(){
            $(this).parent().children(".on").removeClass().end().end().toggleClass("on");
        });

    }

    //点击页面其他地方
    var thatTextArea=this;
    oBody.click(function(event) {
        //console.log(SOD.isParent(event.target,thatTextArea[0]));
        if(!SOD.isParent(event.target,thatTextArea[0])){
            $suggest && $suggest.length && $suggest.hide();
        }
    });
    function insertCon(obj,strText,t,r){
        if (opts.wild || !isGreateMaxLength(obj.value + strText, getSelectedText(obj))) {

            //过滤重复内容
            if(r){
                var strTextS = obj.value.indexOf(strText);
                if(strTextS>=0){
                    obj.value=obj.value.replace(strText,"");
                    setInsertPos(obj,strTextS);
                }
            }

            if(document.selection) {
                obj.focus();
                var range = document.selection.createRange();
                range.text = strText;
                //range.moveStart ('character', -l);
                var wee = range.text.length;
                if(t){
                    var l = obj.value.length;
                    range.moveEnd("character", wee+t );
                    t<=0?range.moveStart("character",wee-2*t-strText.length):range.moveStart("character",wee-t-strText.length);

                    range.select();
                }


            }
            else if (obj.selectionStart || obj.selectionStart == "0") {
                var startPos = obj.selectionStart;
                var endPos = obj.selectionEnd;
                var scrollTop = obj.scrollTop;

                obj.value = obj.value.substring(0, startPos) + strText + obj.value.substring(endPos, obj.value.length);
                obj.focus();

                var cPos = startPos + strText.length;
                obj.selectionStart = cPos;
                obj.selectionEnd = cPos;
                obj.scrollTop = scrollTop;
                if(t){
                    obj.setSelectionRange(startPos-t,obj.selectionEnd+t);
                    obj.focus();
                }
            }else {
                obj.value += strText;
                obj.focus();
            }

            // fired when insert text has finished
            if ($.isFunction(opts.onInput)) {
                opts.onInput.call(this, {type: "insert"}, {
                    maxLength: opts.maxLength,
                    leftLength: getLeftLength(obj)
                });
            }
        }
    }
    //获取@用户ID //regexpATUserID
    this.getATUserID=function(){
        var $textbox = this.filter("textarea");
        if(opts.ATtag){
            var matchATusers,matchATusersID=[];
            while (matchATusers = regexpATUserID.exec($textbox.val())){
                if (matchATusers != null){
                    matchATusersID.push(matchATusers[1]);

                }
            }
        }
        return matchATusersID;
    };

	this.maxLength = function(maxLength) {
		if (maxLength) {
			opts.maxLength = maxLength;
			return this.filter("textarea").each(function() {
				unbindEvents(this, $(this).data("textbox-opts"));
				$(this).data("textbox-opts", opts);
				bindEvents(this, opts);
			}).end();
		}
		else {
			return opts.maxLength;
		}
	};

	this.insertPos = function(value) {
		var $textbox = this.filter("textarea");

		if (typeof value == "undefined") {
			return $textbox.length ? getInsertPos($textbox[0]) : null;
		}
		else if ($textbox.length) {
			if (isString(value) && value.toLowerCase() == "start") {
				value = 0;
			}
			else if (isString(value) && value.toLowerCase() == "end") {
				value = $textbox[0].value.replace(/\r/g, "").length;
			}

			setInsertPos($textbox[0],
					Math.min(Math.max(parseInt(value) || 0, 0), $textbox[0].value.replace(/\r/g, "").length));
		}

		return this;
	};

	this.input = function(callback) {
		if ($.isFunction(callback)) {
			opts.onInput = callback;
			return this.filter("textarea").each(function() {
				$(this).data("textbox-opts", opts);
			}).end();
		}

		return this;
	};

	this.fixLength = function() {
		return this.filter("textarea").each(function() {
			fixLength(this);
		}).end();
	};
    /*this.autoTextarea=function(){
        // fired when insert text has finished
        return this.filter("textarea").each(function() {
            console.log("fuck");
			autoTextarea(this)
		}).end();
    };*/
	this.insertText = function(strText,t,r) {
		strText = strText.replace(/\r/g, "");
		return this.filter("textarea").each(function() {
            insertCon(this,strText,t,r)
		}).end();
	};


	return this.filter("textarea").each(function() {
		var $textbox = $(this);

		if (settings) {
			if ($textbox.data("textbox-opts")) {
				unbindEvents(this, $textbox.data("textbox-opts"));
				$textbox.data("textbox-opts", opts);
				bindEvents(this, opts);
			}
			else {
				$textbox.data("textbox-opts", opts);
				bindEvents(this, opts);
			}
		}
		else {
			if ($textbox.data("textbox-opts")) {
				opts = $textbox.data("textbox-opts");
			}
		}
	}).end();

    /*oBody.delegate(".suggest-overlay li","hover",function(){
        $(this).parent().children(".on").removeClass().end().end().toggleClass("on");
    });
    oBody.click(function() {
        $suggest && $suggest.length && $suggest.hide()
    });*/
};
})(jQuery);