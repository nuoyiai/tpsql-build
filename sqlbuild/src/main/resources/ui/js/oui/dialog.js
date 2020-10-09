//////////////////////////////////////////////////////
/////   Author: Zhu Sheng Wei (Nov-9th 1980)       ///
////    Nff WebUI Javascript Control Dialog		  ////
//////////////////////////////////////////////////////

(function($,Δ,δ){
	Δ.ctrl.dialog=δ={
		/* 控件样式配置 */
		styles:function(){
			this.frameStyle="dialog-frameStyle";
			this.tableStyle="dialog-tableStyle";
			this.headStyle="dialog-headStyle";
			this.headInnerStyle="dialog-head-innerStyle";
			this.headTextStyle="dialog-head-textStyle";
			this.closeIconStyle="dialog-close-iconStyle";
			this.bodyStyle="dialog-bodyStyle";
			this.shadowRadiusStyle="dialog-shadow-radius";
			this.iframeStyle="dialog-iframeStyle";
		}
		,control:function(){
			Δ.ctrl.base.window.call(this);
			this.register(this);
			this.styles=new δ.styles();
			this.coverPanel = new Δ.widget.cover();
			this.frameObj=null;
			this.headObj=null;
			this.bodyObj=null;
			this.textObj=null;
			this.closeObj=null;
			this.iframeObj=null;
			this.title="";
			this.cover=true;
			this.url="";
			this.closed="";
			
			this.buildElement=function(){
				var f={css:{},attr:{}};
				if(this.id)f.attr["id"]=this.id;
				if(this.style)f.attr["style"]=this.style;
				with(this.styles){
					f.attr["class"]=frameStyle;
					this.frameObj=$("<div>").attr(f.attr).css(f.css);
					this.frameObj.addClass(shadowRadiusStyle);
					this.frameObj.ctrl(this);
					this.tableObj=$("<table cellpadding=\"0\" cellspacing=\"0\">").addClass(tableStyle);
					var tr1=$("<tr>").addClass(this.styles.headStyle);
					var tr2=$("<tr>");
					this.headObj=$("<td>").addClass(headStyle);
					this.bodyObj=$("<td>").addClass(bodyStyle);
					this.textObj=$("<div>").addClass(headTextStyle);
					this.closeObj=$("<span>×</span>").addClass(closeIconStyle);
					var innerObj = $("<div>").addClass(headInnerStyle);
					innerObj.append(this.textObj);
					innerObj.append(this.closeObj);
					this.headObj.append(innerObj);
					tr1.append(this.headObj);
					tr2.append(this.bodyObj);
					this.tableObj.append(tr1);
					this.tableObj.append(tr2);
					this.frameObj.append(this.tableObj);
					this.setWidth(this.width);
					this.setHeight(this.height);
					this.setTitle(this.title);
				}
			};
			this.setTitle=function(title){
				this.textObj.html(title);
			};
			this.addChildren=function(children){	//添加子元素
				if(children){
					this.bodyObj.append(children);
				}

			};
			this.render=function(){
				if(!this.visible)this.hide();
			};
			this.setUrl=function(url){			//设置对话框打开的网页地址
				if(this.url!=url){
					this.url=url;
					if(this.iframeObj==null){
						this.iframeObj=$("<iframe src=\""+url+"\" frameborder=\"0\" >").addClass(this.styles.iframeStyle);
						this.bodyObj.append(this.iframeObj);
					}else{
						this.iframeObj.attr({"src":url});
					}
				}
				return this;
			};
			this.beginDrag=function(x,y){			//开始拖动窗口
				var p = this.frameObj.offset();
				var z = this.frameObj.css("z-index");
				this.drag = {"x":x-p.left,"y":y-p.top};
				this.raiseFirst();
			};
			this.draging=function(x,y){				//拖动窗口中
				this.frameObj[0].style.left=x-this.drag.x+"px";
				this.frameObj[0].style.top=y-this.drag.y+"px";

			};
			this.endDrag=function(){			//结束拖动窗口
				this.drag=null;
			};
			this.show=function(x,y){
				this.frameObj.show();
				if(x || y)this.frameObj.css({"left":x,"top":y});
				else{
					var w = $("body").width();
					var h = $(window).height();
					var l = (w-this.frameObj.width())/2;
					var t = (h-this.frameObj.height())/2;
					this.frameObj.css({"left":l,"top":t});
				}
				if(this.cover)this.coverPanel.show();
			};
			this.hide=function(){
				this.frameObj.hide();
				if(this.cover)this.coverPanel.hide();
			};
			this.close=function(){
				this.hide();
				if(this.closed=="unload")this.unload();
			};
			this.unload=function(){
				this.frameObj.remove();
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
				return ctrl;
			}
			,setPropertys:function(ctrl){		//设置控件属性
				if (ctrl.ctrlSet!=null){
					Δ.setPropertiesRecursive(ctrl,ctrl.ctrlSet,false);
					ctrl.buildElement();
				}
			}
			,addEvents:function(ctrl){
				ctrl.headObj.bind({
					"mousedown":function(e){
						δ.fn.mouseDown(ctrl,e);
					}
				});
				ctrl.closeObj.bind({
					"click":function(e){
						δ.fn.closeClick(ctrl,e);
					}
				});
				$(document).bind({
					"click":function(e){
						δ.fn.bodyClick(ctrl,e);
					}
					,"mouseup":function(e){
						δ.fn.mouseUp(ctrl,e);
					}
					,"mousemove":function(e){
						δ.fn.mouseMove(ctrl,e);
					}
				});
			}
			,bodyClick:function(ctrl,e){
				
			}
			,closeClick:function(ctrl,e){
				ctrl.close();
			}
			,mouseDown:function(ctrl,e){
				var elem=e.srcElement || e.target;
				ctrl.beginDrag(e.pageX,e.pageY);
			}
			,mouseMove:function(ctrl,e){
				var y = e.pageY;
				var x = e.pageX;
				
				if(ctrl.drag){
					ctrl.draging(x,y);			//拖动进行中
				}
			}
			,mouseUp:function(ctrl,e){
				if(ctrl.drag){
					ctrl.endDrag();
				}
			}
		}
	}
})(jQuery,tptps);