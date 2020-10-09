(function($,Δ,δ){
	Δ.verify=δ={
		rules:{}
		,addRule:function(ops){
			var op;
			if(ops){
				if(ops.length){
					for(var i=0;i<ops.length;i++){
						op = ops[i];
						if(op && op.name){
							δ.rules[op.name] = op;
						}
					}
				}else{
					op = ops;
					if(op.name)δ.rules[op.name] = op;
				}
			}
		}
		,getRule:function(ruleAttr){
			if(typeof ruleAttr == "string"){
				if(ruleAttr.charAt(0)=='{' || ruleAttr.charAt(0)=='['){
					var op = Δ.assert.get(function(){return Δ.json.parse(ruleAttr);},"1111",ruleAttr);
					if(op instanceof Array){
						var ops = [];
						for(var i=0;i<op.length;i++){
							var o = op[i];
							if(o.name){
								if(o.rule)ops.push(o);
								else{
									o = δ.rules[o.name];
									if(o)ops.push(o);
								}
							}
						}
						return ops;
					}else{
						if(op.name){
							return (op.rule)?op:δ.rules[op.name];
						}
					}
				}else{
					var n = ruleAttr.indexOf(":");
					if(n>-1){
						var op = parseAttrs(ruleAttr);
						if(op.name){
							return (op.rule)?op:δ.rules[op.name];
						}
					}else{
						return δ.rules[ruleAttr];
					}
				}
			}
		}
		,parseAttrs:function(attrStr){			//解析属性集合字符串
			var obj={};
			var as=attrStr.split(";");
			var a=an=av="";
			for(var i=0;i<as.length;i++){
				var a=as[i];
				var n=a.indexOf(":");
				if(n>-1){
					an=a.substr(0,n).replace(/(^\s*)|(\s*$)/g,"");
					av=a.substr(n+1,a.length-n-1).replace(/(^\s*)|(\s*$)/g,"");
					if(an!="" && av!=""){
						obj[an]=av;
					}
				}
			}
			return obj;
		}
		,fn:{
			//
			doVerify:function(obj,ops){
				var op,result;
				if(!δ.fn.doNullable(obj)){
					δ.fn.showError(obj,"必填项,不能为空");
					return false;
				}
				if(ops instanceof Array){
					for(var i=0;i<ops.length;i++){
						if(!δ.fn.doVerify(obj,ops[i]))return false;
					}
				}else{
					op = ops;
					if(typeof op.rule == "function"){
						result = δ.fn.doFunction(obj,op.rule);
					}else{
						result = δ.fn.doRegular(obj,op.rule);
					}
					if(result!=null){
						if(typeof result == "boolean"){				//
							if(!result){
								δ.fn.showError(obj,op.tips);
								return false;
							}
						}
						if(typeof result == "string"){				//当返回字符串时，有内容为不成功，并把返回结果作为提示内容
							if(result){
								δ.fn.showError(obj,result);
								return false;
							}
						}
					}
				}
				return true;
			}
			,doNullable:function(obj){
				var nullable = $(obj).attr("nullable");
				if(nullable=="false"){
					var val = $(obj).val();
					if(val==null || val==""){
						return false;
					}
				}
				return true;
			}
			//执行正则表达式
			,doRegular:function(obj,reg){
				var val = $(obj).val();
				return reg.test(val);
			}
			//执行函数
			,doFunction:function(obj,fun){
				var val = $(obj).val();
				Δ.raise(fun,val);
			}
			//显示错误
			,showError:function(obj,error){
				var bw = parseInt($(obj).css('border-left-width')) || 0;
				if(bw>0){
					$(obj).css("border-color","#ff0000");
					$(obj).attr("title",error);
				}else{
					var pObj = $(obj).parent();
					if(pObj){
						pObj.css("border-color","#ff0000");
						pObj.attr("title",error);
					}
				}
			}
			//移除错误
			,removeError:function(obj){
				var bw = parseInt($(obj).css('border-left-width')) || 0;
				if(bw>0){
					$(obj).css("border-color","");
					$(obj).attr("title","");
				}else{
					var pObj = $(obj).parent();
					if(pObj){
						pObj.css("border-color","");
						pObj.attr("title","");
					}
				}
			}
			,bindEvent:function(obj,ops){
				if(ops){
					var rule = Δ.toJson(ops);
					$(obj).data("rule",rule);
				}
				$(obj).bind("blur",function(e){
					var ruleAttr = $(this).attr("rule");
					if(ruleAttr){
						var op = δ.getRule(ruleAttr);
						if(op){
							var result = δ.fn.doVerify(this,op);
							if(result)δ.fn.removeError(this);
						}
					}else{
						var op = $(obj).data("rule");
						if(op){
							var result = δ.fn.doVerify(this,op);
							if(result)δ.fn.removeError(this);
						}else if($(this).attr("nullable")){
							var result = δ.fn.doVerify(this,[]);
							if(result)δ.fn.removeError(this);
						}
					}
				});
			}
			,unbindEvent:function(obj){
				$(obj).unbind("blur");
			}
		}
	};
	
	$.fn.bindVerify=function(ops){
		var elem = this;
		var inputs,op;
		if(elem.is('input')){			//单个输入框
			if(ops){
				δ.fn.bindEvent(elem,ops);
			}else{
				δ.fn.bindEvent(input);
			}
		}else{												//该DOM元素下的多个输入框
			inputs = elem.find("input[rule],input[nullable]");
			for(var i=0;i<inputs.length;i++){
				var input = inputs.get(i);
				δ.fn.bindEvent(input);
			}
		}
	};

	$.fn.doVerify=function(){
		var elem = this;
		var inputs,op,result;
		var flag = true; 
		if(elem.is('input')){			//单个输入框
			inputs = elem;
			op=ops;
		}else{												//该DOM元素下的多个输入框
			inputs = elem.find("input[rule],input[nullable]");
		}
		if(inputs.length){
			for(var i=0;i<inputs.length;i++){
				var input = inputs.get(i);
				var ruleAttr = $(input).attr("rule");
				if(ruleAttr){
					op = δ.getRule(ruleAttr);
					if(op){
						result = δ.fn.doVerify(input,op);
						if(result)δ.fn.removeError(input);
						else flag = false;
					}
				}else{
					result = δ.fn.doVerify(input,[]);
					if(result)δ.fn.removeError(input);
					else flag = false;
				}
			}
		}
		return flag;
	};
	
})(jQuery,tptps);