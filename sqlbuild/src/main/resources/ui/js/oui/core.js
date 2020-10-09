//////////////////////////////////////////////////////
/////   Author: Zhu Sheng Wei (Nov-9th 1980)       ///
////    Nff WebUI Javascript Core API			  ////
//////////////////////////////////////////////////////

var tptps = {version:"0.1.0",author:"zhusw","Δδ":"得尔塔"};

(function($,Δ){

	/* 判断浏览器 */
	Δ._ua=navigator.userAgent;
	Δ._opera=/opera[56789]|opera\/[56789]/i.test(Δ._ua);
	Δ._ie=/MSIE/.test(Δ._ua) || /Trident/.test(Δ._ua);
	Δ._ie6=Δ._ie&&/MSIE [6]/.test(Δ._ua);
	Δ._ie7=Δ._ie&&/MSIE [7]/.test(Δ._ua);
	Δ._ie8=Δ._ie&&/MSIE [8]/.test(Δ._ua);
	Δ._ie6_8=Δ._ie6 || Δ._ie7 || Δ._ie8;
	Δ._moz=!Δ._opera && !Δ._ie && /gecko/i.test(Δ._ua);
	Δ._chrome=Δ._ua.indexOf("Chrome") > -1;
	
	/* ------------------------------------------------------扩展核心API---------------------------------------------------- */
	
	/* 添加命名空间的功能 */
	Δ.namespace=function(){	//
		var a=arguments, o=null, i, j, d, rt;
		for (i=0; i<a.length; ++i) {
			d=a[i].split(".");
			rt = d[0];
			eval('if (typeof ' + rt + ' == "undefined"){' + rt + ' = {};} o = ' + rt + ';');
			for (j=1; j<d.length; ++j) {
				o[d[j]]=o[d[j]] || {};
				o=o[d[j]];
			}
		}
	};
	/* 克隆对像（只克隆属性）*/
	Δ.copyProperties=function(source,target){
		var cloneObj = target?target:{};
		for(n in source){
			var obj=source[n];
			if(typeof(obj)!="function")cloneObj[n] = obj;
		}
		return cloneObj;
	};
	/* 给复杂嵌套对像赋值 */
	Δ.setPropertiesRecursive=function(object,source,flag){
		if(!flag)Δ.setProperties(object,source);
		for(nm in source){
			var v=source[nm];
			var obj=object[nm];
			if(obj==null){
				try{
					cObjFn=eval(nm);
					obj=cObjFn();
				}catch(e){
				}
			}
			if(obj!=null){
				if(obj.constructor==Array){
					if(v.constructor==Array){
						for(var i=0;i<v.length;i++){
							Δ.setProperties(obj[i],v[i],obj);
							if(typeof v[i]== "object"){
								Δ.setPropertiesRecursive(obj[i],v[i],true);
							}
							obj[i]=v[i];
						}
					}
				}else{
					Δ.setProperties(obj,v,obj);
					if(typeof v== "object"){
						Δ.setPropertiesRecursive(obj,v,true);
					}
				}
			}
		}
	};
	/* 给对像赋值 */
	Δ.setProperties=function(object,source,parent){			
		if (object!=null && source!=null){
			var t,nm,v;
			var list =[];
			var index =0;
			for(s in source){
				nm =s;
				v =source[s];
				uv = (typeof v=="string")?v.toUpperCase():v;
				t =typeof(object[nm]);
				if (t=="undefined")object[nm] =undefined;
				switch(t){
					case "number" : object[nm] = isNaN(v)?v:parseFloat(v);
					break;
					case "string" : object[nm] = v;
					break;
					case "boolean" : object[nm] = (typeof v =="boolean")?v:((uv=="TRUE" || uv=="READONLY" || uv=="CHECKED") ? true : false);
					break;
					case "undefined" : object[nm] =(uv!="TRUE" && uv!="FALSE")? v : (uv=="TRUE" ? true : false);
					if (nm.indexOf("Style")>-1 &&nm.indexOf("Style")==nm.length-5){
						list[index]=nm;
						index++;
					}
					break;
					case "object" : if (object[nm]!=null){
						if (object[nm].constructor==Array &&v.length>0)object[nm] =v;
					}else{
						if (uv == "TRUE" || uv =="FALSE") object[nm] = (uv=="TRUE");
						else if (!isNaN(parseFloat(v))) object[nm] =parseFloat(v);
						else object[nm] =v;
					}
					break;
				}
			}
			//if(parent!=null)object.parent=parent;
			if (typeof(object.propertiesInitialized)=="function"){					//当对像赋值结束时，调用此方式，来做控件内的初始化工作，如：设置数据访问层dao
				object.propertiesInitialized();
			}
		}
	};
	
	/* ------------------------------------------------------事件核心API---------------------------------------------------- */
	
	/* 事件机制的核心函数，触发事件、回调函数用 */
	Δ.raise=function(){				
		var reFlag =true;
		var evtHandler,params;
		evtHandler =arguments[0];
		try{
			if (evtHandler==null ||evtHandler=="")return reFlag;
		}catch(e){
		}
		if (typeof(evtHandler)=="function"){
			reFlag =evtHandler(arguments[1],arguments[2],arguments[3],arguments[4],arguments[5]);
			if (reFlag==null)reFlag =true;
			return reFlag;
		}else if (evtHandler.constructor ==Array ||typeof(evtHandler)=="object"){
			for (var index=0; index<evtHandler.length; index++){
				var eFun =evtHandler[index];
				if (eFun ==null)continue;
				reFlag =eFun(arguments[1],arguments[2],arguments[3],arguments[4],arguments[5]);
				if (reFlag==null)reFlag =true;
				if (!reFlag)break;
			}
			return reFlag;
		}
		params ="";
		for(var index=1;index<arguments.length;index++){
			if (arguments[index]!=null){
				if (arguments[index].constructor==String) params =params +"'" +escape(arguments[index])+"',";
				else params =params +"arguments[" +index +"],";
			}
			else params =params +"null,";
		}
		if (params.length>0) params ="(" +params.substr(0,params.length-1)+")";
		if (evtHandler.indexOf(";")>-1){
			var funs =evtHandler.split(';');
			for(var index=0; index<funs.length; index++){
				var fun =funs[index];
				if (fun.indexOf("(")==-1) fun +=params;
				reFlag =eval(fun);
				if (reFlag==null)reFlag =true;
				if (!reFlag)break;
			}
		}else{
			if (evtHandler.indexOf("(")==-1) evtHandler +=params;
			reFlag =eval(evtHandler);
		}
		if (reFlag==null)reFlag =true;
		return reFlag;
	};

	/* --------------------------------------Json操作核心API------------------------------------------- */
	
	/* Json对像转化为字符串 */
	Δ.toJson=function(json){	
		if(json!=null){
			if(json.constructor==Array)return Δ.json.arrayToJson(json);
			else if(json.constructor==Date)return Δ.json.dateToJson(json);
			else{
				switch(typeof(json)){
					case "object":
						return Δ.json.objectToJson(json);
					case "string":
						return Δ.json.stringToJson(json);
					default:
						return json;
				}
			}
		}
		else return "null";
	};
	/* 解析Json字符串 */
	Δ.parseJson=function(jsonString){		
		var ex="(function(){var temp="+jsonString+";return temp})()";
		var json=eval(ex);
		return json;
	};
	/* 连接Json对像 */
	Δ.attachJson=function(name,json){	
		if(name)this.json.attach(name,json);
	};
	/* 设置Json对像 */
	Δ.setJson=function(name,json){		
		if(name){
			var o = eval(name);
			if(o==null)Δ.namespace(name);
			var n = name.lastIndexOf(".");
			if(n>-1){
				var p = eval(name.substr(0,n));
				p[name.substr(n+1,name.length-n-1)]=json;
			}
			else{
				eval("name="+this.toJson(json));
			}
		}
	};
	/* Json内部API */
	Δ.json={
		"listeners":{}					//回调函数用，数据源监听
		/* 把Json字符串转化成Json对像 */
		,parse:function(jsonString){				
			return Δ.parseJson(jsonString);
		}
		/* 把成Json对像转化成字符串 */
		,toString:function(jsonObject){
			return Δ.toJson(jsonObject);
		}
		/* 对像转化处理 */
		,objectToJson:function(obj){
			var json = [];   
			for(var n in obj){   
				if(!obj.hasOwnProperty(n)) continue;   
				json.push(
					Δ.toJson(n) + " : " + 
					((obj[n] != null) ? Δ.toJson(obj[n]) : "null")
				)   
			}
			var beginStr="{\n ";
			var endStr="\n};";
			return  beginStr+json.join(",\n ") + endStr.substr(0,2);
		}
		/* 数组转化处理 */
		,arrayToJson:function(array){
			for(var i=0,json=[];i<array.length;i++)   
			json[i] = (array[i] != null) ? Δ.toJson(array[i]) : "null"; 
			return "["+json.join(", ")+"]";
		}
		/* 字符串转化处理 */
		,stringToJson:function(str){
			return '"' +   
			str.replace(/(\\|\")/g,"\\$1")   
			.replace(/\n|\r|\t/g,function(){   
				var a = arguments[0];   
				return  (a == '\n') ? '\\n':   
						(a == '\r') ? '\\r':   
						(a == '\t') ? '\\t': ""  
			}) +   
			'"'
		}
		/* 日期转化处理 */
		,dateToJson:function(date){
			return "new Date(" + date.getTime() + date.getTimezoneOffset() + ")";
		}
		
		/* --------------------------------------Json数据源核心API------------------------------------------- */
		
		/* 把Json数据挂接到全局变量上 */
		,attach:function(name,data){
			Δ.namespace(name);
			var n=eval(name);
			if(n && data){
				Δ.copyProperties(data,n);
				for(var nm in data){
					if(typeof(data[nm])!="function"){
						this.raiseListener(name+"."+nm);
					}
				}
			}
		}
		/* 克隆对像（包括属性和方法）*/
		,copy:function(source,target){
			var cloneObj = target?target:{};
			for(n in source){
				cloneObj[n] = source[n];
			}
			return cloneObj;
		}
		/* 添加操作Json数据时的回调事件,当数据改变时控件会自动刷新 */
		,addListener:function(name,callback){
			if(name && callback){
				var exFlag = true;
				var tarFlag = false;
				if(callback.target!=null)tarFlag = true;
				if(this.listeners[name]==null)this.listeners[name]=[];
				for(var i=0;i<this.listeners[name].length;i++){
					var source = this.listeners[name][i];
					if(callback.toString()==source.toString()){
						if(tarFlag){
							if(callback.target==source.target){
								exFlag = false;
								break;
							}
						}else{
							exFlag = false;
							break;
						}
					}
				}
				if(exFlag)this.listeners[name].push(callback);
			}
		}
		/* 移除数据源监听 */
		,removeListener:function(name,callback){			
			if(name && callback){
				var tarFlag = false;
				var index = -1;
				if(callback.target!=null)tarFlag = true;
				if(this.listeners[name]!=null){
					for(var i=0;i<this.listeners[name].length;i++){
						var source = this.listeners[name][i];
						if(callback.toString()==source.toString()){
							if(tarFlag){
								if(callback.target==source.target){
									index = i;
									break;
								}
							}else{
								index = i;
								break;
							}
						}
					}
				}
				if(index>0)this.listeners[name].splice(index,1);
			}
		}
		/* 触发数据源监听回调函数 */
		,raiseListener:function(name){
			if(this.listeners[name]!=null){
				for(var i=0;i<this.listeners[name].length;i++){
					var callback = this.listeners[name][i];
					if(callback){
						try{
							Δ.raise(callback,name);
						}catch(e){
							
						}
					}
				}
			}
		}
	};
	
	/* --------------------------------------------动态样式----------------------------------------------  */
	Δ.dynamic={
		style:function(n,o,a,s,i,e){
			this.normal =this.active =this.over =this.interval =this.select=this.error="";
			this.obj =null;
			if (n) this.normal =n;
			if (o) this.over =o;
			if (a) this.active =a;
			if (s) this.select = s;
			if (i) this.interval = i;
			if (e) this.error = e;
			this.setNormal=function(){
				if (this.obj!=null) this.obj.attr("class",this.normal);
			};
			this.setActive=function(){
				if (this.obj!=null) this.obj.attr("class",this.active);
			};
			this.setOver=function(){
				if (this.obj!=null) this.obj.attr("class",this.over);
			};
			this.setInterval=function(){
				if (this.obj!=null) this.obj.attr("class",this.interval);
			};
			this.setSelect=function(){
				if (this.obj!=null) this.obj.attr("class",this.select);
			};
			this.setError=function(){
				if (this.obj!=null) this.obj.attr("class",this.error);
			};
			this.isNormal=function(){
				return this.obj.attr("class")==this.normal;
			};
			this.isError=function(){
				return this.obj.attr("class")==this.error;
			};
		}
		,assign:function(dss,dsObj){
			var ds;
			if (dss!=null){
				ds =new Δ.dynamic.style();
				Δ.setProperties(ds,dss);
				if (dsObj){
					ds.obj =dsObj;
					ds.setNormal();
				}
			}
			return ds;
		}
		,removeStyle:function(elem,dCss){
			if (elem!=null && dCss!=null){
				for(var nm in dCss){
					elem.removeClass(dCss[nm]);
				}
			}
		}
		,setToActive:function(elem,dCss){
			if (elem!=null && dCss!=null){
				this.removeStyle(elem,dCss);
				elem.addClass(dCss.active);
			}
		}
		,setToOver:function(elem,dCss){
			if (elem!=null && dCss!=null){
				this.removeStyle(elem,dCss);
				elem.addClass(dCss.over);
			}
		}
		,setToNormal:function(elem,dCss){
			if (elem!=null && dCss!=null){
				this.removeStyle(elem,dCss);
				elem.addClass(dCss.normal);
			}
		}
		,setToInterval:function(elem,dCss){
			if (elem!=null && dCss!=null){
				this.removeStyle(elem,dCss);
				elem.addClass(dCss.interval);
			}
		}
		,setToSelect:function(elem,dCss){
			if (elem!=null && dCss!=null){
				this.removeStyle(elem,dCss);
				elem.addClass(dCss.select);
			}
		}
		,setToError:function(elem,dCss){
			if (elem!=null && dCss!=null){
				this.removeStyle(elem,dCss);
				elem.addClass(dCss.error);
			}
		}
	};
	
	/* ----------------------------------------格式化字符串----------------------------------------- */
	
	/* 字符串格式化 */
	Δ.format=function(val,format){	
		switch(typeof val){
			case "number":
				return Δ.numberFormat(val,format);
			case "string":
				return Δ.textFormat(val,format);
			case "object":
				if(val instanceof Date){
					if(format){
						var n = format.indexOf("y");
						var m = format.indexOf("h");
						if(n>-1 && m>-1){
							return Δ.datetimeFormat(val,format);
						}else if(n>-1){
							return Δ.dateFormat(val,format);
						}else if(m>-1){
							return Δ.timeFormat(val,format);
						}
					}else{
						return Δ.datetimeFormat(val);
					}
				}
		}
	};
	/* 数据格式化 */
	Δ.numberFormat=function(num,format){
		if(format=="xxx,xxx.xx"){
			num = num.toString().replace(/\$|\,/g,'');
			if(isNaN(num))
			num = "0";
			sign = (num == (num = Math.abs(num)));
			num = Math.floor(num*100+0.50000000001);
			cents = num%100;
			num = Math.floor(num/100).toString();
			if(cents<10)
			cents = "0" + cents;
			for (var i = 0; i < Math.floor((num.length-(1+i))/3); i++)
			num = num.substring(0,num.length-(4*i+3))+','+
			num.substring(num.length-(4*i+3));
			return (((sign)?'':'-') + num + '.' + cents);
		}
		return num;
	};
	/* 日期格式化 */
	Δ.dateFormat=function(date,formatter){
		if(!formatter || formatter == "")formatter = "yyyy-MM-dd";
		var year = date.getFullYear().toString();
		var month = (date.getMonth()+1).toString();
		var day = date.getDate().toString();
		var yearMarker = formatter.replace(/[^y|Y]/g,'');
		if(yearMarker.length == 2)year = year.substring(2,4);
		var monthMarker = formatter.replace(/[^M]/g,'');
		if(monthMarker.length > 1 && month.length == 1) month = "0" + month;
		var dayMarker = formatter.replace(/[^d]/g,'');
		if(dayMarker.length > 1 && day.length == 1)day = "0" + day;
		var dateStr = formatter.replace(yearMarker,year).replace(monthMarker,month).replace(dayMarker,day);
		return dateStr;
	};
	/* 时间格式化 */
	Δ.timeFormat=function(time,formatter){
		if(!formatter || formatter == "")formatter = "hh:mm:ss";
		var hour = time.getHours()+"";
	    var minute = time.getMinutes()+"";
	    var second = time.getSeconds()+"";
	    
	    var hourMarker = formatter.replace(/[^h|H]/g,'');
	    if(hourMarker.length > 1 && hour.length == 1)hour = "0" + hour; 
	    var minuteMarker = formatter.replace(/[^m]/g,'');
	    if(minuteMarker.length > 1 && minute.length == 1)minute = "0" + minute;
	    var secondMarker = formatter.replace(/[^s|S]/g,'');
	    if(secondMarker.length > 1 && second.length == 1)second = "0" + second;
	    var timeStr = formatter.replace(hourMarker,hour).replace(minuteMarker,minute).replace(secondMarker,second);
		return timeStr;
	};
	/* 日期时间格式化 */
	Δ.datetimeFormat=function(dt,formatter){
		if(!formatter || formatter == "")formatter = "yyyy-MM-dd hh:mm:ss";
		var timeStr = Δ.timeFormat(dt,formatter);
		var dateStr = Δ.dateFormat(dt,timeStr);
		return dateStr;
	};
	Δ.textFormat=function(text,format){
		return text;
	};

	/* 鼠标按键 */ 
	Δ.mouse={
		getButton:function(e){
			if (e==null)e = window.event;
			if (Δ._ie){
				if(Δ._ie6_8){
					if(e.button==1)return 0;
					if(e.button==4)return 1;
				}
			}
			return e.button;
		}
	};
	
	/* 键盘操作 */
	Δ.keyboard={
		enter:13, tab:9, up:38, down:40, left:37, right:39, space:32, shift:16, ctrl:17, alt:18, esc:27, f1:112, f2:113, f3:114, f4:115, f5:116, f6:117, f7:118, f8:119, f9:120, f10:121, f11:122, f12:123, del:46, backspace:8, insert:45, home:36, end:35, pgUp:33, pgDn:34, numLock:144, numPad0:96, numPad1:97, numPad2:98, numPad3:99, numPad4:100, numPad5:101, numPad6:102, numPad7:103, numPad8:104, numPad9:105, numPadDivide:111, numPadMultiply:106, numPadMinus:109,numPadPlus:107
		,shiftSymbol:[["~",192],["!",49],["@",50],["#",51],["$",52],["%",53],["^",54],["&",55],["*",56],["(",57],[")",48],["|",220],["{",219],["}",221],["\"",222],["<",188],[">",190],["?",191],["*",106],["-",109],["+",107],[".",110],["/",111]].concat(Δ.ie?[["_",189],["+",187],[":",186]]:Δ.moz?[["_",109],["+",61],[":",59]]:[])
		,unShiftSymbol:[["`",192],["-",189],["\\",220],["[",219],["]",221],["'",222],[",",188],[".",190],["/",191],["/",111],["*",106],["-",109],["+",107],[".",110]].concat(Δ.ie?[["=",187],[";",186]]:Δ.moz?[["=",61],[";",59]]:[])
		,hasKeys:function(keys,e){
			if (e==null)e =window.event;
			var ks = (typeof keys =="string")?keys.split(","):keys;
			for(var i=0;i<ks.length;i++){
				var k=ks[i];
				if(k && this[k]){
					if(this.hasKey(k,e))return true;
				}
			}
			return false;
		}
		,hasKey:function(key,e){
			if (e==null)e =window.event;
			if(e.keyCode == this[key] || e.which == this[key])return true;
		}
		,isSpecialKey:function(key){
			return ((key >=112 &&key <=123)||key ==13 ||key ==32);
		}
		,isDirection:function(key,e){
			if (e==null)e =window.event;
			if (key==null)key =e.keyCode || e.which;
			return (37<=key &&key<=40);
		}
		,isLetter:function(key,e){
			if (e==null)e =window.event;
			if (key==null)key =e.keyCode || e.which;
			return (65<=key &&key<=90);
		}
		,isUpperCaseLetter:function(key,e){
			if (e==null)e =window.event;
			if (key==null)key =e.keyCode || e.which;
			return (65<=key &&key<=90 &&!e.shiftKey);
		}
		,isLowerCaseLetter:function(key,e){
			if (e==null)e =window.event;
			if (key==null)key =e.keyCode || e.which;
			return (65<=key &&key<=90 &&e.shiftKey);
		}
		,isNumber:function(key,e){
			if (e==null)e =window.event;
			if (key==null)key =e.keyCode || e.which;
			return ((48<=key &&key<=57 && !e.shiftKey) || (96<=key && key<=105) || e.ctrlKey);
		}
		,isShiftSymbol:function(key,e){
			if (e==null)e =window.event;
			if (key==null)key =e.keyCode || e.which;
			if (!e.shiftKey)return false;
			var flag =false;
			for(var index=0;index<this.shiftSymbol.length; index++)
			{
				if (this.shiftSymbol[index][1]==key)
				{
					flag =true;
					break;
				}
			}
			return flag;
		}
		,isUnShiftSymbol:function(key,e){
			if (e==null)e =window.event;
			if (key==null)key =e.keyCode || e.which;
			if (e.shiftKey)return false;
			var flag =false;
			for(var index=0;index<this.unShiftSymbol.length; index++)
			{
				if (this.unShiftSymbol[index][1]==key)
				{
					flag =true;
					break;
				}
			}
			return flag;
		}
		,isSymbol:function (key,e){
			return (this.isShiftSymbol(key,e)||this.isUnShiftSymbol(key,e));
		}
		,getChar:function(key,e){
			var c ="";
			if (e==null)e =window.event;
			if (key==null)key =e.keyCode || e.which;
			if (this.isLetter(key)){
				c =String.fromCharCode(key);
				if (!e.shiftKey)c =c.toLowerCase();
			}else{
				if (this.isNumber(key)){
					if (48<=key &&key<=57) c =key -48;
					else if (96<=key &&key<=105) c =key -96;
					c =c.toString();
				}else{
					if (e.shiftKey){
						for(var i=0;i<this.shiftSymbol.length; i++){
							if (this.shiftSymbol[i][1]==key){
								c =this.shiftSymbol[i][0];
								break;
							}
						}
					}
					else
					{
						for(var i=0;i<this.unShiftSymbol.length; i++){
							if (this.unShiftSymbol[i][1]==key){
								c =this.unShiftSymbol[i][0];
								break;
							}
						}
					}
				}
			}
			return c;
		}
	};
	
	/* ----------------------------------------一些常用的内部使用的判断类API----------------------------------------- */
	
	Δ.isJsonData=function(data){				//是否为Json对像或数组
		return data instanceof Array || data instanceof Object;
	};
	
	/* ----------------------------------------jQuery Dom 对像方法的扩展，仅内部使用前面统一加下划线，防止和第三方库冲突 ----------------------------------------- */
	
	/* 是否为控件容器 */
	$.fn._isContainer = function(flag){
		return this.attr("container");
	}

	/* 得到文件光标的位置 */
    $.fn._selection = function(){
        var s,e,range,stored_range;
        if(this[0].selectionStart == undefined){
            var selection=document.selection;
            if (this[0].tagName.toLowerCase() != "textarea") {
                var val = this.val();
                range = selection.createRange().duplicate();
                range.moveEnd("character", val.length);
                s = (range.text == "" ? val.length:val.lastIndexOf(range.text));
                range = selection.createRange().duplicate();
                range.moveStart("character", -val.length);
                e = range.text.length;
            }else {
                range = selection.createRange(),
                stored_range = range.duplicate();
                stored_range.moveToElementText(this[0]);
                stored_range.setEndPoint('EndToEnd', range);
                s = stored_range.text.length - range.text.length;
                e = s + range.text.length;
            }
        }else{
            s=this[0].selectionStart,
            e=this[0].selectionEnd;
        }
        var te=this[0].value.substring(s,e);
        return {start:s,end:e,text:te}
    };
	
    /* 重置文件光标置未尾 */
    $.fn._resetCursor = function(){
    	if(this[0].createTextRange){
    		var val = this.val();
            var range=this[0].createTextRange(); 
            range.moveStart('character',val.length); 
            range.collapse(true);
            range.select();
        }else if(this[0].setSelectionRange){
            var n=this.val().length;
            this[0].setSelectionRange(n,n);
        }
    };
	
	$.fn._mourseOver = function(x,y){
		var p = this.offset();
		var w = this.width();
		var h = this.height();
		if(x>=p.left && x<=(p.left+w) && y>=p.top && y<=(p.top+h))return true;
		else return false;
	};
	
	$.fn._mourseLeft = function(x,y){					//在对像的左边
		var t = this.offset().top;
		var l = this.offset().left;
		var h = this.height();
		var w = this.width();
		if(y<=t+h && y>=t && x<(l+(w/2)))return true;
		else return false;
	};
	
	$.fn._mourseRight = function(x,y){					//在对像的右边
		var t = this.offset().top;
		var l = this.offset().left;
		var h = this.height();
		var w = this.width();
		if(y<=t+h && y>=t && x>=(l+(w/2)))return true;
		else return false;
	};
	
	$.fn._mourceDistance = function(x,y){
		var t = this.offset().top;
		var l = this.offset().left;
		var h = this.height();
		var w = this.width();
		return {"left":Math.abs(x-l-(w/2)),"top":Math.abs(y-t-(h/2))};
	};
	
	$.fn._isNeighbor = function(toward,elem,dis){			//是否为邻居
		var t1 = this.position().top;
		var l1 = this.position().left;
		var w1 = this.width();
		var h1 = this.height();
		var t2 = elem.position().top;
		var l2 = elem.position().left;
		var w2 = elem.width();
		var h2 = elem.height();
		var d = dis;
		switch(toward){
			case "up":
				return Math.abs(t2+h2-t1)<d && l1<(l2+w2) && (l1+w1)>l2;
			case "down":
				return Math.abs(t1+h1-t2)<d && l1<(l2+w2) && (l1+w1)>l2;
			case "left":
				return Math.abs(l2+w2-l1)<d && t1<(t2+h2) && (t1+h1)>t2;
			case "right":
				return Math.abs(l1+w1-l2)<d && t1<(t2+h2) && (t1+h1)>t2;
		}
		return false;
	};
	
	$.fn._borderCursor = function(cursor,x,y,dis){			//是否在边线
		var d = dis;
		var t = this.offset().top;
		var l = this.offset().left;
		var h = this[0].offsetHeight;
		var w = this[0].offsetWidth;
		switch(cursor){
			case "n-resize":
			case "s-resize":
				if(Math.abs(t-y)<d)return "n-resize";
				else if(Math.abs(t+h-y)<d)return "s-resize";
			case "w-resize":
			case "e-resize":
				if(y>=t && y<=t+h){
					if(Math.abs(l-x)<d)return "w-resize";
					else if(Math.abs(l+w-x)<d)return "e-resize";
				}
		}
		return "";
	};
	
	$.fn._resizeCursor = function(x,y,b){			//得到修变大小的光标

		var t = this.offset().top;
		var l = this.offset().left;
		var h = this[0].offsetHeight;
		var w = this[0].offsetWidth;
		if(x>=l-b && x<=l+b){
			if(y>=t-b && y<=t+b)return "nw-resize";
			else if(y>=t+h-b && y<=t+h+b)return "sw-resize";
			else return "w-resize";
		}else if(x>=l+w-b && x<=l+w+b){
			if(y>=t-b && y<=t+b)return "ne-resize";
			else if(y>=t+h-b && y<=t+h+b)return "se-resize";
			else return "e-resize";
		}else if(y>=t-b && y<=t+b){
			return "n-resize";
		}else if(y>=t+h-b && y<=t+h+b){
			return "s-resize";
		}
		return null;
	};
	
	$.fn._realWidth = function(){
		if(Δ._ie6_8){
			return this.outerWidth();
		}else{
			return this.width();
		}
	};
	
	$.fn._isNotChild = function(elem){			//判断参数元素是否为子元素或本身
		return !this.find(elem).length;
	};
	
	$.fn._isNotChildAndSelf = function(elem){			//判断参数元素是否为子元素或本身
		return elem!=this[0] && !this.find(elem).length;
	};
	
	
	
	/* ----------------------------------------异常捕获处理----------------------------------------- */
	
	/* 断言 */
	Δ.assert={
		errors:{}
		/* 添加错误代码 */
		,addError:function(error){				
			if(!this.errors[error.code])this.errors[error.code]=error;
		}
		,getError:function(code){
			return this.errors[code];
		}
		/* 得到函数运行结果 */
		,get:function(fn,assert,data){
			try{
				return Δ.raise(fn);
			}catch(e){
				if(typeof assert == "string"){
					var error = this.getError(assert);
					Δ.raise(error.callback,error,data);
				}else if(typeof assert == "Function"){
					Δ.raise(assert);
				}
			}
		}
		/* 测试函数运行是否正常 */
		,run:function(fn){
			try{
				Δ.raise(fn);
				return true;
			}catch(e){
				return false;
			}
		}
		/* 显示异常错语 */
		,show:function(error,data){
			alert(error.message+":"+data);
		}
	}
	
	/* ------------------------------------------------------通过jQuery对外开放的API---------------------------------------------------- */
	
	/* 绑定控件到jQuery Dom对像上 */
	$.fn.ctrl = function(ctrl){
		if(ctrl){
			this.data("ctrl",ctrl);
		}else{
			return this.data("ctrl");
		}
	};
	
	/* 处理特殊字符 */
	$.extend({encodeUrl:function(urlStr){		
		var str =urlStr.replace(/[%]/g,"%25");
		str =str.replace(/[+]/g,"%2b");
		str =str.replace(/[#]/g,"%23");
		str =str.replace(/[&]/g,"%26");
		return str;
	}});
	
	/* 触发事件或回调函数 */
	$.extend({raise:Δ.raise});
	
	/* 操作Json数据 */
	$.extend({json:Δ.json});
	
})(jQuery,tptps);
			
jQuery.fn.val=function (base){
	return function(){
		var s = this,isset = arguments.length > 0, v = isset ? arguments[0] : null;
		if(isset&&typeof(base)=="function"){
			base.call(s,v);
			if(this.data("ctrl"))this.change();
			return s;
		}else{
			return base.call(s);
		}
	}
}(jQuery.fn.val);

jQuery.fn.show=function (base){
	return function(){
		var s = this;
		base.call(s);
		this.trigger("render");
		return s;
	}
}(jQuery.fn.show);

Array.prototype.removeObj = function(obj){
	var delIndex = -1;
	for (var i=0; i<this.length; i++){
		 // 严格比较，即类型与数值必须同时相等。
		if (this[i] === obj){
			 this.splice(i, 1);
			 delIndex = i;
			 break;
		}
	}
	return delIndex;
};

Array.prototype.remove = function(index){
	if(index>-1 && index<this.length){
		this.splice(index,1);
		return true;
	}
	return false;
};

Array.prototype.up = function(index){
	if(index>0 && index<this.length){
		var obj = this.splice(index,1);
		this.splice(index-1,0,obj[0]);
		return true;
	}
	return false;
};

Array.prototype.down = function(index){
	if(index>-1 && index<this.length-1){
		var obj = this.splice(index,1);
		this.splice(index+1,0,obj[0]);
		return true;
	}
	return false;
};

Number.prototype.add = function (){
    var r1,r2,m;
    try{r1=arguments[0].toString().split(".")[1].length}catch(e){r1=0}
    try{r2=this.toString().split(".")[1].length}catch(e){r2=0}
    m=Math.pow(10,Math.max(r1,r2))
    return (arguments[0]*m+this*m)/m;
};

String.prototype.isInteger = function(){
	return (new RegExp(/^\d+$/).test(this));
};

String.prototype.isNumber = function(){
	return (new RegExp(/^-?(?:\d+|\d{1,3}(?:,\d{3})+)(?:\.\d+)?$/).test(this));
};

String.prototype.fromChars = function(chars){
	for(var i=0;i<chars.length;i++){
		if(chars.indexOf(this.charAt(i))==-1)return false;
	}
	return true;
};

String.prototype.notIn = function(strs){
	if(strs.constructor==Array){
		for(var i=0;i<strs.length;i++){
			if(this==strs[i])return false;
		}
	} else if(typeof strs == "string"){
		var ss = strs.split(",");
		for(var i=0;i<ss.length;i++){
			if(this==ss[i])return false;
		}
	}
	return true;
};

String.prototype.trim = function(){
	return this.replace(/(^\s*)|(\s*$)|\r|\n/g, "");
};

String.prototype.trans = function(){
	return this.replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&quot;/g,'"');
};

String.prototype.replaceAll = function(os, ns){
	return this.replace(new RegExp(os,"gm"),ns);
};

String.prototype.padLeft = function(len,c){
	return this.pad(len,c,1);
};

String.prototype.padRight = function(len,c){
	return this.pad(len,c,-1);
};

String.prototype.pad = function(len,c,flag){
	if (this.length < len){
		var m = len - this.length;
		var str = this;
		for (var i = 0;i < m;i++){
			str = flag?c+str:str+c;
		}
		return str;
	}
	else return this;
};