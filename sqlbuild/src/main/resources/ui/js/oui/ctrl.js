//////////////////////////////////////////////////////
/////   Author: Zhu Sheng Wei (Nov-9th 1980)       ///
////    Nff WebUI Javascript Control Base Class	  ////
//////////////////////////////////////////////////////

(function($,Δ,δ){
	Δ.ctrl=δ={
		/* 运行时对像堆栈 */
		runtime:{
			list:[],map:{},timerObj:null,timerHandle:null
			,set:function(key,obj){
				if(key && key!="")map[key]=ctrl;
			}
			,get:function(key){
				return map[key];
			}
			,add:function(obj){
				this.list.push(obj);
			}
		}
		/* 资源回收 */
		,gc:{
			destructor:function(){
				var del;
				for(var index=0; index<δ.runtime.list.length; index++){
					var obj =δ.runtime.list[index];
					if (obj !=null){
						if (typeof(obj.destructor)=="function") obj.destructor();
						δ.gc.free(obj);
					}
				}
				δ.gc.free(δ.runtime.list);
				δ.gc.free(δ.runtime.map);
				
				del =delete Listener;
			}
			,free:function(obj){
				if(!obj)return;
				if (obj.length >0){
					for (var i=0; i<obj.length; i++){
						delete obj[i];
						obj[i] =null;
					}
					delete obj;
					obj =null;
				}else{
					var n =null;
					for (n in obj){
						delete obj[n];
						obj[n] =null;
					}
					delete obj;
					obj =null;
				}
			}
		}
		,base:{
			glableVersion:0,ctrlIndex:-1,wins:[]
			,object:function(){
				this.parent =null;
				this.version=δ.base.glableVersion++;
				this.newVersion=function()
				{
					this.version=δ.base.glableVersion++;
				};
				this.register =function(ctrl)
				{
					δ.runtime.add(ctrl);
				};
			}
			,widget:function(){
				δ.base.object.call(this);
				this.frameObj=null;
				
				this.getElement=function(){
					return this.frameObj[0];
				};
				this.show=function(){
					this.frameObj.show();
				};
				this.hide=function(){
					this.frameObj.hide();
				};
				this.isHide=function(){
					return this.frameObj.is(":hidden");
				};
				this.unload=function(){
					this.frameObj.remove();
					delete this;
				};
			}
			,move:function(){
				this.move=null;
				
				this.beginMove=function(x,y){			//开始拖
					var p = this.frameObj.offset();
					this.move = {"x":x-p.left,"y":y-p.top};
				};
				this.moving=function(x,y){				//拖动
					this.frameObj.css({"left":x-this.move.x+"px","top":y-this.move.y+"px"});
				};
				this.endMove=function(){			//结束拖动
					if(this.move)this.move=null;
				};
			}
			,resize:function(){
				this.resize=null;
				
				this.beginResize=function(cursor,x,y){			//开始拖动改变窗口尺寸
					if(!this.resize){
						var h = this.frameObj.height();
						var w = this.frameObj.width();
						var p = this.frameObj.position();
						var t = p.top;
						var l = p.left;
						this.resize={"x":x,"y":y,"t":t,"l":l,"w":w,"h":h,"cursor":cursor};
					}
				};
				this.resizing=function(x,y){			//拖动改变大小中
					var c = this.resize.cursor;
					var w = this.resize.x - x;
					var h = this.resize.y - y;
	
					if(c!="w-resize" && c!="e-resize"){
						if(c.indexOf("n")>-1){
							this.frameObj.css({"height":this.resize.h+h});
							this.frameObj.css({"top":this.resize.t-h});
						}else{
							this.frameObj.css({"height":this.resize.h-h});
						}
					}
	
					if(c!="n-resize" && c!="s-resize"){
						if(c.indexOf("w")>-1){
							this.frameObj.css({"width":this.resize.w+w});
							this.frameObj.css({"left":this.resize.l-w});
						}else{
							this.frameObj.css({"width":this.resize.w-w});
						}
					}
				};
				this.endResize=function(){			//拖动改变大小结束
					if(this.resize){
						this.resize=null;
					}
				};
			}
			,drag:function(){
				this.drag=null;
				
				this.beginDrag=function(x,y){
					var dragObj = $("<div onselectstart=\"return false;\" >").attr({"class":"drag-frameStyle"});
					var cloneObj = this.frameObj.clone();
					dragObj.append(cloneObj);
					this.drag = {"obj":dragObj,"x":x,"y":y};
					$("body").append(this.drag.obj);
					dragObj.bind("selectstart",function(){return false;});
					dragObj.hide();
				};
				this.draging=function(x,y){
					this.drag.obj.css({"left":x+"px","top":y+"px"});
					this.drag.obj.show();
				};
				this.endDrag=function(){
					if(this.drag){
						this.drag.obj.remove();
						this.drag = null;
					}
				};
			}
			,control:function(){			//有标签的控件基类
				δ.base.widget.call(this);
				this.ctrlSet=null;
				this.id="";
				this.name="";
				this.value="";
				this.text="";
				this.design=false;			//是否开启设计模式
				
				this.setWidth=function(width){
					if(width){
						var w = width+"";
						this.frameObj.css({"width":w});
					}
				};
				this.getWidth=function(){
					if(this.width)return this.width;
					else return this.frameObj.width();
				};
				this.setHeight=function(height){
					if(height){
						var h = height+"";
						this.frameObj.css({"height":h});
					}
				};
				this.getHeight=function(){
					if(this.height)return this.height;
					else return this.frameObj.height();
				};
			}
			,container:function(){
				δ.base.control.call(this);
				
				this.getContainer=function(){
					return this.frameObj;
				};
				this.addElement=function(elem){
					var co = this.getContainer();
					co.append(elem);
				};
				this.addCtrl=function(ctrl){
					var co = this.getContainer();
					co.append(ctrl.frameObj);
				};
			}
			,window:function(){
				δ.base.container.call(this);
				
				this.register =function(ctrl){
					δ.runtime.add(ctrl);
					δ.base.wins.push(ctrl);
				};
				this.getFirstIndex=function(){
					var firstIndex = -1;
					for(var i=0;i<δ.base.wins.length;i++){
						var win = δ.base.wins[i];
						var z = parseInt(win.frameObj.css("z-index")+"");
						if(z>firstIndex)firstIndex=z;
					}
					return firstIndex;
				};
				this.getLastIndex=function(){
					var lastIndex = 9999;
					for(var i=0;i<δ.base.wins.length;i++){
						var win = δ.base.wins[i];
						var z = parseInt(win.frameObj.css("z-index")+"");
						if(z<lastIndex)lastIndex=z;
					}
					return lastIndex;
				};
				this.raiseFirst=function(){			//窗口显示到最前面
					var first = this.getFirstIndex();
					var last = this.getLastIndex();
					var index = parseInt(this.frameObj.css("z-index")+"");
					if(index<first || index==last){
						if((first-last+1)<δ.base.wins.length){
							this.frameObj.css({"z-index":first+1});
						}
						else{
							for(var i=0;i<δ.base.wins.length;i++){
								var win = δ.base.wins[i];
								var z = parseInt(win.frameObj.css("z-index")+"");
								if(z>last)win.frameObj.css({"z-index":z-1});
							}
							this.frameObj.css({"z-index":first});
						}
					}
				};
				this.raiseSecond=function(){
					var first = this.getFirstIndex();
					var last = this.getLastIndex();
					var index = parseInt(this.frameObj.css("z-index")+"");
					var second = (first==last)?first:first-1;
					if(index<second || index==last){
						if((first-last+1)<δ.base.wins.length){
							for(var i=0;i<δ.base.wins.length;i++){
								var win = δ.base.wins[i];
								var z = parseInt(win.frameObj.css("z-index")+"");
								if(z==first)win.frameObj.css({"z-index":first+1});
							}
							this.frameObj.css({"z-index":first});
						}else{
							for(var i=0;i<δ.base.wins.length;i++){
								var win = δ.base.wins[i];
								var z = parseInt(win.frameObj.css("z-index")+"");
								if(z>last && z<first)win.frameObj.css({"z-index":z-1});
							}
							this.frameObj.css({"z-index":second});
						}
					}
				};
			}
			,fn:{
				getMouseOverElement:function(x,y){				//得到鼠标拖放到的控件
					var frame;
					$("body").find("*:visible").each(function(){
						if(this._mourseOver(x,y)){
							frame = this;
						}
					});
					return frame;
				}
			}
		}
		,node:function(){			//控件节点对像
			this.tagName="";
			this.attrs={};					//节点属性集合
			this.lowerAttrs={};				//节点小写属性集合
			this.item=null;					//控件构造配置
			this.ctrl=null;					//节点控件
			this.container=null;			//节点容器
			this.parent=null;				//父节点
			this.children=[];				//子节点
			this.elem=null;					//标签对像
			this.setting={};				//控件属性配置对像
			this.objAttrs={"styles":true,"events":true,"data":true};		//对像属性
			this.specAttrs={"value":true,"onclick":true,"style":true};
			
			this.setup=function(elem){		//封装节点
				this.elem=elem;
				this.parentNode=elem.parentNode;
				this.tagName=elem.tagName;
				if(elem.attributes){
					var obj = $(elem);
					for(var i=0;i<elem.attributes.length;i++){
						var attr = elem.attributes[i];
						var nm=attr.nodeName;
						if(attr.specified || this.specAttrs[nm]){
							this.lowerAttrs[nm.toLowerCase()]=this.attrs[nm]=obj.attr(nm);
						}
					}
				}
				if(this.lowerAttrs["setting"]){
					this.setting = eval(this.lowerAttrs["setting"]);
				}
				for(var nm in this.attrs){
					var attr=this.attrs[nm];
					this.setting[nm]=attr;
				}
			};
			this.parseAttrs=function(attrStr){			//解析属性集合字符串
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
			};
			this.render=function(pc){		//显现
				if(this.elem && this.elem.parentNode && this.ctrl){
					var pNode = this.elem.parentNode;
					var cElem = this.ctrl.getElement();
					pNode.replaceChild(cElem,this.elem);
					if(this.ctrl.render)this.ctrl.render(pc);
				}
			};
			this.hasAttr=function(attrName){			//是否包括此属性
				var attrVal=this.attrs[attrName.toLowerCase()];
				return attrVal!=null && attrVal!="";
			};
			this.getAttr=function(attrName){			//得到属性值
				return this.attrs[attrName.toLowerCase()];
			};
		}
		,container:function(){
			this.nodes=[];
			this.find=function(elem,pNode){		/* 查找自定义标签对像 */ 
				if(elem){
					var item = δ.plugins.getCtrl(elem);
					if(item && item.parent && pNode){
						var node=new δ.node();
						node.container=this;
						node.parent=pNode;
						node.setup(elem);
						node.item=item;
						pNode.children.push(node);
					}else if(item){
						var node=new δ.node();
						node.container=this;
						node.parent=null;
						node.setup(elem);
						node.item=item;
						if(node.item.attrs){		//组合属性
							for(var nm in node.item.attrs){
								var attrs = node.setting[nm];
								if(attrs)node.setting[nm]=node.parseAttrs(attrs);
							}
						}
						for(var i=0;i<elem.children.length;i++){
							var c=elem.children[i];
							if(c)this.find(c,node);
						}
						if(pNode){
							pNode.children.push(node);
							//继承父节点的设计属性
							//if(!node.setting.design)node.setting.design=pNode.setting.design;
						}else this.nodes.push(node);
					}else{
						for(var i=0;i<elem.children.length;i++){
							var c=elem.children[i];
							if(c)this.find(c,pNode);
						}
					}
				}
			};
			this.render=function(){
				var ctrls=[];
				for(var i=0;i<this.nodes.length;i++){
					var node=this.nodes[i];
					var ctrl=δ.factory.createByNode(node);
					if(ctrl){
						node.ctrl=ctrl;
						node.render();
						ctrls.push(ctrl);
					}
				}
				return ctrls;
			};
		}
		,context:function(){
			this.node=null;
			this.item=null;
		}
		,factory:{
			createByNode:function(node){
				var item = node.item;
				var construct = item.construct;
				var ctrl = Δ.raise(construct,node);
				if(item.container){
					ctrl.addChildren(node.elem.children);
					for(var i=0;i<node.children.length;i++){
						var c = node.children[i];
						this.createChildByNode(c,ctrl);
					}
				}
				return ctrl;
			}
			,createChildByNode:function(node,pCtrl){
				var ctrl=δ.factory.createByNode(node);
				if(ctrl){
					node.ctrl=ctrl;
					node.render(pCtrl);
				}
			}
		}
		,plugins:{
			typeMap:{},childrenMap:{}
			,addCtrl:function(item){			//添加控件配置
				if(item.typeName){
					if(!this.typeMap[item.typeName.toUpperCase()])this.typeMap[item.typeName.toUpperCase()]=item;
					document.createElement(item.typeName);
				}
				if(item.children){
					for(var i=0;i<item.children.length;i++){
						var child = item.children[i];
						child.parent = item;
						
						if(child.typeName){
							if(!this.typeMap[child.typeName.toUpperCase()])this.typeMap[child.typeName.toUpperCase()]=child;
							document.createElement(child.typeName);
						}
					}
				}
			}
			,getCtrl:function(elem){					//根据标签得到控件配置对像
				if(elem.tagName){
					var item = this.typeMap[elem.tagName.toUpperCase()];
					if(item){
						return item;
					}else{
						var typeName=elem.getAttribute("type");
						if(typeName){
							item = this.typeMap[typeName.toUpperCase()];
							if(item && item.tagName.toUpperCase()==elem.tagName.toUpperCase()){
								return item;
							}
						}
					}
				}
			}
			,isCtrlElement:function(elem){			//判断是否为控件标签
				if(elem.tagName){
					var item = this.typeMap[elem.tagName.toUpperCase()];
					if(item){
						return true;
					}else{
						var typeName=elem.getAttribute("type");
						item = this.typeMap[typeName.toUpperCase()];
						if(item && item.tagName.toUpperCase()==elem.tagName.toUpperCase()){
							return true;
						}
					}
				}
				return false;
			}
		}
		,complex:function(html){				//创建组件控件
			var html = "<div>"+html+"</div>";
			var elem = $(html);
			$("body").append(elem);
			var ctrls = δ.render(elem[0]);
			var cx = {};
			for(var i=0;i<ctrls.length;i++){
				var ctrl = ctrls[i];
				if(ctrl.name){
					cx[ctrl.name]=ctrl;
				}
				if(ctrl.ctrls && ctrl.ctrls.length>0){
					for(var j=0;j<ctrl.ctrls.length;j++){
						if(ctrl.ctrls[j].name){
							cx[ctrl.ctrls[j].name]=ctrl.ctrls[j];
						}
					}
				}
			}
			return cx;
		}
		,render:function(elem){
			if(typeof elem == "string"){
				var html = "<div>"+elem+"</div>";
				var elem = $(html);
				return δ.render(elem[0]);
			}else{
				if(!elem)elem=document.body;
				var container = new δ.container();
				container.find(elem);
				return container.render();
			}
		}
		,loadSrc:function(src,callback,args){
			var iframe = $("<iframe src=\""+src+"\" style=\"display:none\" >");
			$("body").append(iframe);
			iframe.bind("load",function(){
				var html = this.contentDocument.body.innerHTML;
				if(html && html.length>3){
					if(html.substr(0,4)=="<pre"){
						var n = html.indexOf(">");
						var m = html.lastIndexOf("<");
						html=html.substr(n+1,m-n-1);
					}
				}
				callback(html,args);
				$(this).remove();
			});
		}
	};
	/* 通过jQuery对外开放控件操作API */
	$.extend({ctrl:{render:δ.render,loadSrc:δ.loadSrc}});
})(jQuery,tptps);