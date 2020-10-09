//////////////////////////////////////////////////////
/////   Author: Zhu Sheng Wei (Nov-9th 1980)       ///
////    Nff WebUI Javascript Control NumSpin	  ////
//////////////////////////////////////////////////////

(function($,Δ,δ){
	Δ.ctrl.numspin=δ={
		styles:function(){
			this.frameStyle={"normal":"input-frameStyle-normal","active":"input-frameStyle-active","over":"input-frameStyle-over"};;		//控件外框样式
			this.textStyle="input-textStyle";				//文本框样式
		}
		,control:function(){
			Δ.ctrl.base.control.call(this);
			this.frameObj=null;
			this.textObj=null;
			this.valueObj=null;
			this.upDownStatus="";
			this.currentDelay=this.delay=200;
			this.speedUp=8;
			this.delta=1;				//增量
			this.delay=200;				//速度
			this.spinWidth="15px";			
			this.width="150";			//宽度
			this.height="22px";			//高度
			this.scale=10;				//整数位数
			this.precision=0;			//小数位数
			this.min=0;					//最小值
			this.max=2147483647;		//最大值
			this.styles=new δ.styles();
			this.spin=new Δ.widget.triangleSpin();
			this.onvaluechanged="";		//值改变事件
			this.onfocus="";			//文本框焦点事件
			this.onlostfocus="";		//失去集点事件
			
			this.buildElement=function(){
				this.spin.buildElement();
				var f={attr:{},css:{}},t={attr:{},css:{}};
				with(this.styles){
					t.attr["class"]=textStyle;
				}
				if(this.id){
					t.attr["id"]=this.id;
					f.attr["id"]=this.id+"_frame";
				}
				if(this.name)t.attr["name"]=this.name;
				if(this.style)f.attr["style"]=this.style;
				this.frameObj=$("<div>").attr(f.attr).css(f.css);
				this.textObj=$("<input type=text />").attr(t.attr).css(t.css);
				
				this.frameObj.append(this.textObj);
				this.frameObj.append(this.valueObj);
				this.frameObj.append(this.spin.frameObj);
				this.setWidth(this.width);
				this.setHeight(this.height);
			};
			this.setWidth=function(width){
				var f={css:{}},t={css:{}};
				var spinWidth = this.spin.getWidth();
				width+="";
				if(width.indexOf("%")>-1){
					f.css["width"]=width;
					t.css["width"]="100%";
					t.css["margin-right"]=spinWidth+"px";
				}
				else{
					var n = width.indexOf("px");
					var w = (n>-1)?width.substr(0,n):width;
					f.css["width"]=w+"px";
					t.css["width"]=(parseInt(w)-spinWidth)+"px";
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
			this.dataBinding=function(){				//绑定数据
				if(this.data && this.field){
					var v=this.data[this.field];
					this.value=v;
					this.textObj.val(this.value);
				}else if(this.value){
					this.textObj.val(this.value);
					if(typeof this.value == "string"){
						this.value = Number(this.value);
					}
				}
			};
			this.setValue=function(val){				//设置控件的值
				if(val!=null){
					this.value=Number(val);
					if(this.textObj)this.textObj.val(val);
				}else{
					var text = this.textObj.val()+"";
					if(text)this.value=Number(text);
				}
			};
			this.getValue=function(){
				return this.value;
			};
			this.getText=function(){
				var text = this.textObj.val()+"";
				return text;
			};
			this.setSpinValue=function(d){
				var v=(this.value==null || this.value=="")?0:this.value;
				v=v.add(d);
				if(this.max!=null)if(v > this.max){v=this.max;this.closeTimer();};
				if(this.min!=null)if(v < this.min){v=this.min;this.closeTimer();};
				var changeFlag=false;    //Event Flag
				if(this.value!=v)changeFlag=true;
				this.setValue(v);
				if(changeFlag && this.onvaluechanged)Δ.raise(this.onvaluechanged,{"ctrl":this,"value":v});
			};
			this.openTimer = function(b,o){
				var z = 0;
				if(o != null){o.currentDelay = o.delay; Δ.ctrl.runtime.timerObj = o; z++;}
				else{
					if((o = Δ.ctrl.runtime.timerObj) == null) return;
					b = o.upDownStatus=="up";
					if(o.speedUp > 1){if(o.currentDelay > o.currentDelay / o.speedUp) z = o.currentDelay = Math.ceil(o.currentDelay * 6 / 7);}
					if(o.speedUp < 1){if(o.currentDelay < o.currentDelay / o.speedUp) z = o.currentDelay = Math.ceil(o.currentDelay * 7 / 6);}
				}
				o.setSpinValue(b ? o.delta : -o.delta);
				if(z == 0) return;
				if(Δ.ctrl.runtime.timerHandle != null) clearInterval(Δ.ctrl.runtime.timerHandle);
				Δ.ctrl.runtime.timerHandle = setInterval(o.openTimer,o.currentDelay);
			};
			this.closeTimer=function(){
				this.upDownStatus=="";
				if(Δ.ctrl.runtime.timerHandle != null) clearInterval(Δ.ctrl.runtime.timerHandle);
			};
			this.focus=function(target){
				this.focused=true;
				this.resetCursor();
				this.styles.frameStyle.setOver();
				this.closedKeys=this.focusCloseKeys;
			};
			this.blur=function(){
				this.focused=false;
				this.styles.frameStyle.setNormal();
				this.setValue();           //复制进来的数据
				this.closedKeys=null;
			};
			this.resetCursor=function(){
				this.textObj._resetCursor();
			};
			this.unload=function(){
				this.frameObj.remove();
				$("body").off("click."+this.version);
			};
		}
		,construct:function(context){
			var ctrl = this.fn.create(context);
			return ctrl;
		}
		,fn:{
			create:function(context){
				var ctrl = new δ.control();
				ctrl.ctrlSet=context.setting;
				this.setPropertys(ctrl);
				this.addEvents(ctrl);
				ctrl.dataBinding();
				return ctrl;
			}
			,setPropertys:function(ctrl){		//设置控件属性
				if(ctrl.ctrlSet!=null){
					Δ.setPropertiesRecursive(ctrl,ctrl.ctrlSet,false);
					ctrl.buildElement();
					ctrl.styles.frameStyle=Δ.dynamic.assign(ctrl.styles.frameStyle,ctrl.frameObj);
				}
			}
			,addEvents:function(ctrl){
				
				$("body").on("click."+ctrl.version,function(e){
					δ.fn.bodyClick(ctrl,e)
				});
				
				ctrl.frameObj.bind({
					"mouseover":function(){
						δ.fn.mouseOver(ctrl)
					}
					,"mouseout":function(){
						δ.fn.mouseOut(ctrl)
					}
					,"resize":function(){
						δ.fn.mouseOut(ctrl)
					}
				});
				
				ctrl.textObj.bind({
					"keydown":function(e){
						δ.fn.textKeyDown(ctrl,e)
					}
					,"keyup":function(e){
						δ.fn.textKeyUp(ctrl,e)
					}
					,"click":function(e){
						δ.fn.textClick(ctrl,e)
					}
					,"focus":function(e){
						δ.fn.textFocus(ctrl,e);
					}
				});
				
				ctrl.spin.up.bind({
					"mousedown":function(e){
						δ.fn.upMouseDown(ctrl,e)
					}
					,"mouseup":function(e){
						δ.fn.upMouseUp(ctrl,e)
					}
					,"mouseout":function(e){
						δ.fn.upMouseOut(ctrl,e)
					}
				});
				
				ctrl.spin.down.bind({
					"mousedown":function(e){
						δ.fn.downMouseDown(ctrl,e)
					}
					,"mouseup":function(e){
						δ.fn.downMouseUp(ctrl,e)
					}
					,"mouseout":function(e){
						δ.fn.downMouseOut(ctrl,e)
					}
				});
			}
			,bodyClick:function(ctrl,e){
				var elem=e.srcElement || e.target;
				if(ctrl.frameObj._isNotChildAndSelf(elem)){
					var text = ctrl.textObj.val()+"";
					if(ctrl.value!=text && ctrl.value!=Number(text)){
                		ctrl.value=(text!="")?Number(text):null;
					}
					if(ctrl.onlostfocus)Δ.raise(ctrl.onlostfocus,{"ctrl":ctrl,"value":ctrl.getValue(),"text":ctrl.getText(),"target":elem});
					ctrl.blur();
				}
			}
			,mouseOver:function(ctrl){
				ctrl.styles.frameStyle.setOver();
			}
			,mouseOut:function(ctrl){
				ctrl.styles.frameStyle.setNormal();
			}
			,resize:function(ctrl){				//刷新样式
				ctrl.frameObj.css({});
			}
			,textKeyUp:function(ctrl,e){
				if(Δ.keyboard.isNumber(e.which,e)){
					var v=ctrl.textObj.val();
					if(v=="")v=0;
					else v=parseInt(v);
					if(ctrl.max!=null)if(v > ctrl.max){v=ctrl.max};
					if(ctrl.min!=null)if(v < ctrl.min){v=ctrl.min};
					ctrl.setValue(v.toString());
				}
			}
			,textKeyDown:function(ctrl,e){
				if(!Δ.keyboard.hasKeys(["space","left","right","up","down"],e)){
					if(!Δ.keyboard.isNumber())return false;
				}
				
				if(Δ.keyboard.hasKey("up",e)){
					ctrl.upDownStatus="up";
					ctrl.openTimer(true,ctrl);
				}
				if(Δ.keyboard.hasKey("down",e)){
					ctrl.upDownStatus="down";
					ctrl.openTimer(false,ctrl);
				}
				return false;
			}
			,upMouseDown:function(ctrl){
				if(ctrl.upDownStatus==""){
				   this.setDownStyle(ctrl,"up");
				   ctrl.openTimer(true,ctrl);
				}
				
			}
			,upMouseUp:function(ctrl){
				if(ctrl.upDownStatus=="up"){
					this.setUpStyle(ctrl,"up");
					ctrl.closeTimer();
				}
			}
			,upMouseOut:function(ctrl,e){
				if(ctrl.upDownStatus=="up" && this.getIsFaultOut(ctrl.spin.up,e)){
					this.setUpStyle(ctrl,"up");
					ctrl.closeTimer();
				}
			}
			,downMouseDown:function(ctrl){
				if(ctrl.upDownStatus==""){
				   this.setDownStyle(ctrl,"down");
				   ctrl.openTimer(false,ctrl);
				}
			}
			,downMouseUp:function(ctrl){
				if(ctrl.upDownStatus=="down"){
					this.setUpStyle(ctrl,"down");
					ctrl.closeTimer();
				}
			}
			,downMouseOut:function(ctrl,e){
				if(ctrl.upDownStatus=="down" && this.getIsFaultOut(ctrl.spin.down,e)){
					this.setUpStyle(box,"down");
					ctrl.closeTimer();
				}
			}
			,getIsFaultOut:function(elem,e){
				var x=e.offsetX;
				var y=e.offsetY;
				var w=elem.width();
				var h=elem.height();
				return (x<-2 || x>w+1) || ((y<-2 || y>h+1));
			}
			,setDownStyle:function(ctrl,t){
				 ctrl.upDownStatus=t;
				 if(t=="up"){
					ctrl.spin.up.attr({"className":ctrl.styles.downStyle});
				 }else{
					ctrl.spin.down.attr({"className":ctrl.styles.downStyle});
				 }
			}
			,setUpStyle:function(ctrl,t){
				 ctrl.upDownStatus="";
				 if(t=="up"){
					 ctrl.spin.up.attr({"className":ctrl.styles.upStyle});
				 }else{
					 ctrl.spin.down.attr({"className":ctrl.styles.upStyle});
				 }
			}
			,textFocus:function(ctrl,e){
				ctrl.focus();
				if(ctrl.onfocus)Δ.raise(ctrl.onfocus,{"ctrl":this});
			}
			,textClick:function(ctrl,e){
			
			}
		}
	};
})(jQuery,tptps);

(function($,Δ,δ){
	Δ.ctrl.numspan=δ={
		styles:function(){
			this.frameStyle="numspan-frameStyle";
			this.splitStyle="numspan-splitStyle";
			this.cellStyle="numspan-cellStyle";
		}
		,control:function(){
			Δ.ctrl.base.control.call(this);
			this.styles=new δ.styles();
			this.beginDate=null;
			this.endDate=null;
			
			this.buildElement=function(){
				var f={css:{},attr:{}},s={attr:{}},c={attr:{}};
				with(this.styles){
					f.attr["class"]=frameStyle;
					s.attr["class"]=splitStyle;
					c.attr["class"]=cellStyle;
				}
				this.frameObj=$("<table cellpadding=0 cellspacing=0 >").attr(f.attr);
				var tr = $("<tr>");
				var td1 = $("<td>").attr(c.attr);
				if(this.beginNum)td1.append(this.beginNum.frameObj);
				var td2 = $("<td>").attr(s.attr);
				td2.text("-");
				var td3 = $("<td>").attr(c.attr);
				if(this.endNum)td3.append(this.endNum.frameObj);
				tr.append(td1).append(td2).append(td3);
				this.frameObj.append(tr);
			};
		}
		,construct:function(context){
			var ctrl=this.fn.create(context);
			return ctrl;
		}
		,fn:{
			create:function(context){
				var ctrl=new δ.control();
				var es = Δ.copy(context.setting);
				if(es.id)es["id"]=es.id+"End";
				if(es.name)es["name"]=es.name+"End";
				ctrl.beginNum = Δ.ctrl.numspin.fn.create(context);
				ctrl.endNum = Δ.ctrl.numspin.fn.create({"setting":es});
				ctrl.ctrlSet=context.setting;
				this.setPropertys(ctrl);
				
				return ctrl;
			}
			,setPropertys:function(ctrl){		//设置控件属性
				if (ctrl.ctrlSet!=null){
					Δ.setPropertiesRecursive(ctrl,ctrl.ctrlSet,false);
					ctrl.buildElement();
				}
			}
		}
	};
})(jQuery,tptps,window);