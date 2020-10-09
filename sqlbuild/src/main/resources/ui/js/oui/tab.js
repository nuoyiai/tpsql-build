//////////////////////////////////////////////////////
/////   Author: Zhu Sheng Wei (Nov-9th 1980)       ///
////    Nff WebUI Javascript Control Tab		  ////
//////////////////////////////////////////////////////

(function($,Δ,δ){
	Δ.ctrl.tab=δ={
		events:function(){
			
		}
		/* 控件样式配置 */
		,styles:function(){
			this.frameStyle="tab-frameStyle";
			this.headStyle="tab-headStyle";
			this.bodyStyle="tab-bodyStyle";
			this.itemHeadStyle={"normal":"tab-item-headStyle-normal","over":"tab-item-headStyle-over","select":"tab-item-headStyle-select"};
			this.itemTextStyle={"normal":"tab-item-textStyle-normal","over":"tab-item-textStyle-over","select":"tab-item-textStyle-select"};
			this.itemIconStyle="tab-item-iconStyle";
			
			this.itemFrameStyle = "tab-item-frameStyle";
		}
		,option:function(ctrl){
			this.headObj=null;
			this.textObj=null;
			this.iconObj=null;
			this.src="";
			this.url="";
			this.item=null;
			this.ctrl=ctrl;
			this.bodyObj=null;
			this.bodyFrameObj=null;
			this.loaded=false;
			
			this.buildElement=function(){
				this.headObj=$("<a>");
				this.textObj=$("<span>");
				this.iconObj=Δ.widget.graph.getElement("tabFork","normal","<input type=button >");
				this.iconObj.attr("class",this.ctrl.styles.itemIconStyle);
				this.headObj.append(this.textObj);
				this.headObj.append(this.iconObj);
				this.textObj.text(this.item.text);
				this.setStyle("normal");
			};
			this.buildBodyElement=function(){
				var b={css:{},attr:{}};
				with(this.ctrl){
					b.attr["class"]=styles.itemFrameStyle;
				}
				this.bodyObj=$("<div container=\"true\" >").attr(b.attr).css(b.css);
				if(this.item.url){
					var frameObj=$("<iframe src=\""+this.item.url+"\" >");
					this.bodyObj.append(frameObj);
				}else if(this.item.src){
					var obj = this.bodyObj;
					Δ.ctrl.page.loadSrc(this.item.src,function(html){
						var htmlObj=$("<div>"+html+"</div>");
						Δ.ctrl.render(htmlObj[0]);
						obj.append(htmlObj);
					});
				}else if(this.item.html){
					var htmlObj=$("<div>"+this.item.html+"</div>");
					Δ.ctrl.render(htmlObj[0]);
					this.bodyObj.append(htmlObj);
				}
				this.ctrl.bodyObj.append(this.bodyObj);
			};
			this.load=function(){
				if(!this.loaded){
					this.loaded=true;
					this.buildBodyElement();
				}
			};
			this.close=function(){
				this.headObj.remove();
				this.bodyObj.remove();
				this.ctrl.options.removeObj(this);
				this.ctrl.firstLoad();
			};
			this.setSelected=function(flag){
				with(this.ctrl){
					if(flag){
						this.setStyle("select");
						if(this.bodyObj)this.bodyObj.show();
						for(var i=0;i<options.length;i++){
							if(options[i]!=this){
								options[i].setSelected(false);
							}
						}
					}else{
						this.setStyle("normal");
						if(this.bodyObj)this.bodyObj.hide();
					}
				}
			};
			this.isSelected=function(){
				return this.headObj.attr("class")==this.ctrl.styles.itemHeadStyle.select;
			};
			this.resetHeidht=function(){
				var h1 = this.ctrl.frameObj.height();
				var h2 = this.headObj.outerHeight();
				this.bodyObj.height(h1-h2);
			};
			this.show=function(){
				this.headObj.hide();
				this.bodyObj.show();
			};
			this.hide=function(){
				this.headObj.hide();
				this.bodyObj.hide();
			};
			this.setStyle=function(state){
				with(this.ctrl.styles){
					switch(state){
						case "normal":
							Δ.dynamic.setToNormal(this.headObj,itemHeadStyle);
							Δ.dynamic.setToNormal(this.textObj,itemTextStyle);
							break;
						case "over":
							Δ.dynamic.setToOver(this.headObj,itemHeadStyle);
							Δ.dynamic.setToOver(this.textObj,itemTextStyle);
							break;
						case "select":
							Δ.dynamic.setToSelect(this.headObj,itemHeadStyle);
							Δ.dynamic.setToSelect(this.textObj,itemTextStyle);
							break;
					}
				}
			};
		}
		,control:function(){
			Δ.ctrl.base.control.call(this);
			this.styles=new δ.styles();
			this.options=[];
			this.frameObj=null;
			this.headObj=null;
			this.bodyObj=null;
			this.toward="up";
			
			this.buildElement=function(){
				var f={css:{},attr:{}},h={css:{},attr:{}},b={css:{},attr:{}};
				with(this.styles){
					f.attr["class"]=frameStyle;
					h.attr["class"]=headStyle;
					b.attr["class"]=bodyStyle;
				}
				if(this.style)f.attr["style"]=this.style;
				this.frameObj=$("<div>").attr(f.attr).css(f.css);
				this.headObj=$("<div onselectstart=\"return false;\" >").attr(h.attr).css(h.css);
				this.bodyObj=$("<div>").attr(b.attr).css(b.css);
				if(this.toward=="up"){
					this.frameObj.append(this.headObj);
					this.frameObj.append(this.bodyObj);
				}else if(this.toward=="down"){
					this.frameObj.append(this.bodyObj);
					this.frameObj.append(this.headObj);
				}
				
				this.setWidth(this.width);
				this.setHeight(this.height);
				
				this.buildChildrenElement();
			};
			this.render=function(){
				this.firstLoad();
			};
			this.getItemByElement=function(elem){
				for(var i=0;i<this.options.length;i++){
					if(this.options[i].headObj[0]==elem || this.options[i].headObj.find(elem).length)return this.options[i];
				}
			};
			this.hasSelectedItem=function(){
				for(var i=0;i<this.options.length;i++){
					if(this.options[i].isSelected())return true;
				}
				return false;
			};
			this.firstLoad=function(){
				if(!this.hasSelectedItem()){			//没有选中项
					if(this.options.length){
						if(!this.options[0].loaded)this.options[0].load();
						this.options[0].setSelected(true);
						this.options[0].resetHeidht();
					}
				}
			};
			this.removeItemByValue=function(val){			//移除页卡通过值
				if(val){
					for(var i=0;i<this.options.length;i++){
						if(this.options[i].item.value==val)return this.options[i].close();
					}
				}
			};
			this.removeItemByName=function(name){			//移除页卡通过名称
				if(name){
					for(var i=0;i<this.options.length;i++){
						if(this.options[i].item.name==name)return this.options[i].close();
					}
				}
			};
			this.buildChildrenElement=function(){
				for(var i=0;i<this.items.length;i++){
					var option = new δ.option(this);
					option.item = this.items[i];
					option.buildElement();
					this.headObj.append(option.headObj);
					this.options.push(option);
				}
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
				var items = [];
				for(var i=0;i<context.children.length;i++){
					var setting = context.children[i].setting;
					setting["html"] = context.children[i].elem.innerHTML;
					items.push(setting);
				}
				ctrl["items"]=items;
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
				ctrl.frameObj.bind({
					"mouseover":function(e){
						δ.fn.mouseOver(ctrl,e)
					}
					,"mouseout":function(e){
						δ.fn.mouseOut(ctrl,e)
					}
					,"click":function(e){
						δ.fn.boxClick(ctrl,e)
					}
				});
			}
			,mouseOver:function(ctrl,e){
				var elem=e.srcElement || e.target;
				var item = ctrl.getItemByElement(elem);
				if(item){
					if(elem.tagName=="INPUT"){
						Δ.widget.graph.setElement("tabFork","over",item.iconObj);
					}
					if(!item.isSelected())item.setStyle("over");
				}
			}
			,mouseOut:function(ctrl,e){
				var elem=e.srcElement || e.target;
				var item = ctrl.getItemByElement(elem);
				if(item){
					if(elem.tagName=="INPUT"){
						Δ.widget.graph.setElement("tabFork","normal",item.iconObj);
					}else if(elem.tagName=="A"){
						if(!item.isSelected())item.setStyle("normal");
					}
				}
			}
			,boxClick:function(ctrl,e){
				var elem=e.srcElement || e.target;
				var elem=e.srcElement || e.target;
				var item = ctrl.getItemByElement(elem);
				if(item){
					if(elem.tagName!="INPUT"){
						item.load();
						item.setSelected(true);
						item.resetHeidht();
					}else{
						item.close();
					}
				}
			}
		}
	}
})(jQuery,tptps);