//////////////////////////////////////////////////////
/////   Author: Zhu Sheng Wei (Nov-9th 1980)       ///
////    Nff WebUI Javascript Control TextBox	  ////
//////////////////////////////////////////////////////

(function($,Δ,δ){
	Δ.ctrl.textbox=δ={
		/* 控件样式配置 */
		styles:function(){
			this.frameStyle={"active":"input-frameStyle-active","normal":"input-frameStyle-normal","over":"input-frameStyle-over","error":"input-frameStyle-error"};		//控件外框样式
			this.textStyle="input-textStyle";				//文本框样式
			this.promptStyle="input-promptStyle";			//提示文本样式
		}
		/* 控件主体对像  */
		,control:function(){
			Δ.ctrl.base.control.call(this);
			this.frameObj =null;		//控件外框
			this.textObj=null;			//文本框
			this.promptObj=null;		//提示框
			this.value=null;			//值
			this.id="";					//控件ID
			this.text="";				//文本框的值
			this.field="";				//数据字段名
			this.nullable=true;		//是否可以为空
			this.prompt="";				//输入提示
			this.width="100%";			//控件宽度
			this.height="22px";			//控件高度
			this.maxlength=-1;			//最大可输入长度
			this.ime=true;				//输入法开关
			this.readonly=false;		//只读标记
			this.focused=false;		//是否获取焦点
			this.styles=new δ.styles();				//控件样式
			this.onvaluechanged=""					//文本改变事件
			this.onlostfocus ="";					//失去焦点事件
			
			this.buildElement=function(){		//构造Hmtl标签对像
				var f={attr:{},css:{}},t={attr:{},css:{}},p={attr:{}};
				t.attr["value"]=this.value;
				if(!this.ime)t.css["ime-mode"]="disabled";
				if(this.readonly)t.attr["readonly"]="true";
				if(this.maxlength>0)t.attr["maxlength"]=this.maxlength;
				if(this.rule)t.attr["rule"]=this.rule;
				if(!this.nullable)t.attr["nullable"]="false";
				if(this.id){
					t.attr["id"]=this.id;
					f.attr["id"]=this.id+"_frame";
				}
				if(this.name)t.attr["name"]=this.name;
				
				with(this.styles){
					t.attr["class"]=textStyle;
					p.attr["class"]=promptStyle;
				}
				if(this.style)f.attr["style"]=this.style;
				this.frameObj=$("<span>").attr(f.attr);
				this.textObj=$("<input type=text >").attr(t.attr);
				this.textObj.ctrl(this);
				if(this.value)this.textObj.val(this.value);
				
				if(this.prompt!=""){
					this.promptObj = $("<span hideFocus>").attr(p.attr);
					this.promptObj.text(this.prompt);
					$(this.frameObj).append(this.promptObj);
				}
				this.frameObj.append(this.textObj);
				this.setWidth(this.width);
				this.setHeight(this.height);
				return this.frameObj;
			};
			this.setWidth=function(width){
				var f={css:{}},t={css:{}};
				width+="";
				if(width.indexOf("%")>-1){
					f.css["width"]=width;
					t.css["width"]="100%";
				}
				else{
					var n = width.indexOf("px");
					var w = (n>-1)?width.substr(0,n):width;
					f.css["width"]=w+"px";
					t.css["width"]="100%";
				}
				this.frameObj.css(f.css);
				this.textObj.css(t.css);
			};
			this.setHeight=function(height){
				var f={css:{}},t={css:{}};
				var n = height.indexOf("px");
				var h = (n>-1)?height.substr(0,n):height;
				t.css["height"]=f.css["height"]=t.css["line-height"]=h+"px";
				this.frameObj.css(f.css);
				this.textObj.css(t.css);
			};
			this.setText =function(text){
				this.textObj.val(text);
			};
			this.setValue =function(value){
				this.setText(value);
			};
			this.getValue=function(){
				return this.getText();
			};
			this.getText=function(){
				var text = this.textObj.val()+"";
				return text;
			};
			this.focus=function(){        //设置焦点
				if(this.focused)return;
				this.focused=true;
				this.resetCursor();
				this.styles.frameStyle.setOver();
				this.resetPrompt();
			};
			this.blur=function(){         //失去焦点
				
			};
			this.resetCursor=function(){     //重置光标
				this.textObj._resetCursor();
			};
			this.resetPrompt=function(){		//重置输入提示
				if(this.promptObj){
					if(this.focused)this.promptObj.hide();
					else if(this.textObj.val()){
						this.promptObj.hide();
					}else{
						this.promptObj.show();
					}
				}
			};
			this.setStyle=function(state){
				switch(state){
					case "normal":
						this.styles.frameStyle.setNormal();
						break;
					case "over":
						this.styles.frameStyle.setOver();
						break;
					case "error":
						this.styles.frameStyle.setError();
						break;
				}
			};
			this.unload=function(){
				this.frameObj.remove();
				$("body").off("click."+this.version);
			};
		}
		,construct:function(context){		//控件构造函数
			var ctrl = this.fn.create(context);
			return ctrl;
		}
		,fn:{
			create:function(context){		//创建控件对像
				var ctrl=new δ.control();
				ctrl.ctrlSet=context.setting;
				this.setPropertys(ctrl);
				if(ctrl.design){
					var frame = Δ.design.frame.fn.create(ctrl.frameObj);
					ctrl.frameObj.append(frame.frameObj);
				}else{
					this.addEvents(ctrl);
				}
				ctrl.isOnit=true;
				return ctrl;
			}
			,setPropertys:function(ctrl){		//设置控件属性
				if (ctrl.ctrlSet!=null){
					Δ.setPropertiesRecursive(ctrl,ctrl.ctrlSet,false);
					ctrl.buildElement();
					ctrl.styles.frameStyle=Δ.dynamic.assign(ctrl.styles.frameStyle,ctrl.frameObj);
				}
			}
			,addEvents:function(ctrl){		//添加控件事件
				$("body").on("click."+ctrl.version,function(e){
					δ.fn.bodyClick(ctrl,e)
				});
				
				ctrl.frameObj.bind({
					"mouseover":function(){
						δ.fn.frameMouseOver(ctrl)
					}
					,"mouseout":function(){
						δ.fn.frameMouseOut(ctrl)
					}
				});
				
				ctrl.textObj.bind({
					"focus":function(){
						δ.fn.textFocus(ctrl)
					}
					,"click":function(){
						δ.fn.textClick(ctrl)
					}
					,"beforepaste":function(){
						δ.fn.textPaste(ctrl)
					}
				});
				
				if(ctrl.promptObj){
					ctrl.promptObj.bind("click",function(){
						δ.fn.textPaste(ctrl)
					});
				}
			}
			,bodyClick:function(ctrl,e){
				var elem=e.srcElement || e.target;
				if(ctrl.frameObj._isNotChildAndSelf(elem)){
					var text = ctrl.textObj.val()+"";
					if(ctrl.value!=text){
                		ctrl.value=text;
					}
					if(ctrl.focused){
						ctrl.focused=false;
						ctrl.styles.frameStyle.setNormal();
						ctrl.resetPrompt();
						if(ctrl.onlostfocus)Δ.raise(ctrl.onlostfocus,{"ctrl":ctrl,"value":ctrl.value,"text":text,"target":elem});
					}
				}
			}
			,frameMouseOut:function(ctrl){
				if(ctrl.focused)return;
				if(ctrl.styles.frameStyle.isError())return;
				ctrl.setStyle("normal");
			}
			,frameMouseOver:function(ctrl){
				if(ctrl.focused)return;
				if(ctrl.styles.frameStyle.isError())return;
				ctrl.setStyle("over");
			}
			,textFocus:function(ctrl){
				ctrl.focus();
			}
			,textPaste:function(ctrl){
				var result = this.textPasteValid(ctrl);
				var text = ctrl.textObj.val();
				if(result==false)setTimeout(function(){ctrl.textObj.val(text);},10);
				else setTimeout(function(){ctrl.setValue();},10);
			}
			,textClick:function(ctrl){
			
			}
			,textKeyPress:function(ctrl){
			
			}
		}
	}
})(jQuery,tptps);