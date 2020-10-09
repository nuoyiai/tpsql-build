//////////////////////////////////////////////////////
/////   Author: Zhu Sheng Wei (Nov-9th 1980)       ///
////    Nff WebUI Javascript Control Window		  ////
//////////////////////////////////////////////////////

(function($,Δ,δ){
	Δ.ctrl.window=δ={
		/* 控件样式配置 */
		styles:function(){
			this.frameStyle={"normal":"window-frameStyle-normal","select":"window-frameStyle-select"};
			this.shadowRadiusStyle="window-shadow-radius";
			this.tableStyle="window-tableStyle";
			this.headStyle="window-headStyle";
			this.bodyStyle="window-bodyStyle";
			this.textStyle="window-textStyle";
			this.iconStyle="window-iconStyle";
			this.lineStyle={"normal":"window-lineStyle-normal","select":"window-lineStyle-select"};
			this.buttonStyle={"normal":"window-buttonStyle-normal","over":"window-buttonStyle-over"};
			this.buttonIconStyle="window-button-iconStyle";
			
			this.boxStyle="dock-position-boxStyle";
			this.dockIconStyle="dock-iconStyle";
			this.dockCoverStyle="dock-coverStyle";
			this.dockTableStyle="dock-tableStyle";
			
			this.nodeStyle="dock-nodeStyle";
			this.tabStyle="window-tabStyle";
			this.tabTextStyle="window-tab-textStyle";
			this.tabItemStyle={"normal":"window-tab-itemStyle-normal","over":"window-tab-itemStyle-over","select":"window-tab-itemStyle-select"};
		}
		,dock:function(ctrl,styles){
			this.signNum=9;
			this.ctrl=ctrl;
			this.styles=styles;
			this.tableObj=null;
			this.coverObj=null;
			this.pos=null;
			this.images=["upDock","downDock","leftDock","rightDock","centerDock","upHalfDock","downHalfDock","leftHalfDock","rightHalfDock"];
			this.boxs=["up","down","left","right"];
			this.raiseTimerHandler=-1;
			this.raiseTime=500;
			this.imageObjs=[];
			this.boxObjs=[];
			this.opposite={"up":"down","down":"up","left":"right","right":"left"};
			this.layout={"up":"vertical","down":"vertical","left":"horizontal","right":"horizontal"};
			this.drag=null;
			
			this.buildElement=function(){
				this.buildSignElement();
				this.hideSign();
				this.hideCover();
			};
			this.buildSignElement=function(){				////构造停靠标记
				for(var i=0;i<4;i++){
					var boxObj = this.buildImageElement(i,i);
				}
				
				this.coverObj = $("<div>").attr({"class":this.styles.dockCoverStyle});
				this.tableObj = $("<table cellpadding=0 cellspacing=0 >").attr({"class":this.styles.dockTableStyle});
				var boxIndex=0;
				var pos = {"1":0,"3":2,"4":4,"5":3,"7":1};
				var d = null;
				for(var i=0;i<3;i++){
					var tr = $("<tr>");
					for(var j=0;j<3;j++){
						var td = $("<td>").css("text-align","center");
						d = i*3+j;
						if(pos[d]!=null){
							var boxObj = this.buildImageElement(pos[d],boxIndex+4);
							td.append(boxObj);
							boxIndex++;
						}
						tr.append(td);
					}
					this.tableObj.append(tr);
				}
			};
			this.buildImageElement=function(imgIndex,boxIndex){				//构造停靠标记图片
				var imgSrc = this.images[imgIndex];
				var iconElem = $("<div toward=\""+imgSrc.substr(0,imgSrc.length-4)+"\" >").attr("class",this.styles.dockIconStyle);
				var imageObj = Δ.widget.graph.getElement(imgSrc,"",iconElem);
				with(this.styles){
					var boxObj = $("<div toward=\""+imgSrc.substr(0,imgSrc.length-4)+"\" >").attr({"class":boxStyle+"-"+boxIndex});
					boxObj.append(imageObj);
				}
				this.imageObjs.push(imageObj);
				this.boxObjs.push(boxObj);
				return boxObj;
			};
			this.appendTo=function(elem){			//停靠标记添加到要显示的窗口
				for(var i=0;i<this.boxs.length;i++){
					var box = this.boxObjs[i];
					elem.append(box);
				}
				elem.append(this.tableObj);
				elem.append(this.coverObj);
			};
			this.showSign=function(){			//显示停靠指示标记
				var win = this.ctrl;
				var t = win.frameObj.offset().top;
				var l = win.frameObj.offset().left;
				var h = win.frameObj.height();
				var w = win.frameObj.width();
				
				var r = 20;
				var pos = {"up":{"x":w/2-r,"y":0},"down":{"x":w/2-16,"y":h-r*2},"left":{"x":0,"y":h/2-r},"right":{"x":w-r*2,"y":h/2-r},"center":{"x":w/2-r*3+4,"y":h/2-r*3+4}};
				
				for(var i=0;i<this.boxs.length;i++){
					var box = this.boxObjs[i];
					var p = pos[this.boxs[i]];
					box.css({"left":l+p.x,"top":t+p.y,"z-index":2001});
					box.show();
				}
				
				this.tableObj.css({"left":l+pos.center.x,"top":t+pos.center.y,"z-index":2001});
				this.tableObj.show();
				
				if(this.raiseTimerHandler<0){
					this.raiseTimerHandler = setTimeout(function(){
						win.raiseSecond();
					},this.raiseTime);
				}
			};
			this.hideSign=function(){			//隐藏停靠指示标记
				for(var i=0;i<this.boxs.length;i++){
					this.boxObjs[i].hide();
				}
				this.tableObj.hide();
				if(this.raiseTimerHandler>-1){
					clearTimeout(this.raiseTimerHandler);
					this.raiseTimerHandler=-1;
				}
			};
			this.showCover=function(toward){			//显示停靠遮罩
				var elem = this.ctrl.frameObj;
				var t = elem.offset().top;
				var l = elem.offset().left;
				var h = elem.height();
				var w = elem.width();
				
				var pos = {"up":{"x":0,"y":0,"w":w,"h":h/2},"down":{"x":0,"y":h/2,"w":w,"h":h/2},"left":{"x":0,"y":0,"w":w/2,"h":h},"right":{"x":w/2,"y":0,"w":w/2,"h":h},"center":{"x":0,"y":0,"w":w,"h":h}};
				
				var p = pos[toward];
				this.coverObj.css({"left":l+p.x,"top":t+p.y,"width":p.w,"height":p.h,"z-index":2000});
				this.coverObj.attr("toward",toward);
				this.coverObj.show();
			};
			this.hideCover=function(toward){				//隐藏停靠遮罩
				var to = this.coverObj.attr("toward")+"";
				if(toward){
					if(to==toward){
						this.coverObj.attr("toward","");
						this.coverObj.hide();
					}
				}else{
					this.coverObj.hide();
				}
			};
			this.dragIn=function(toward,drag){				//拖入窗口
				var elem = this.ctrl.frameObj;
				var h = elem.height();
				var w = elem.width();
				var t = elem.offset().top;
				var l = elem.offset().left;
				var f = toward=="up" || toward=="left";
				var topWin = (this.ctrl.parent)?this.ctrl.parent:δ.fn.create({"setting":{"width":w,"height":h}});
				if(!this.ctrl.parent){
					topWin.frameObj.insertBefore(elem);
					topWin.frameObj.css({"top":t,"left":l});
					var hh = topWin.headObj.height();
					topWin.setHeight(h+hh);
					topWin.frameObj.removeAttr("dock");
					topWin.addWin(this.ctrl);
					topWin.bodyObj.append(elem);
					t=hh;
					l=0;
				}else{
					t = elem.position().top;
					l = elem.position().left;
				}
				topWin.bodyObj.append(drag);
				topWin.addWin(drag.ctrl());
				var th = topWin.bodyObj.height();
				var tw = topWin.bodyObj.width();
				var pos = {"up":{"x":l,"y":t,"w":w,"h":Math.round(h/2)},"down":{"x":l,"y":t+Math.floor(h/2),"w":w,"h":Math.floor(h/2)},"left":{"x":l,"y":t,"w":Math.round(w/2),"h":h},"right":{"x":l+Math.floor(w/2),"y":t,"w":Math.floor(w/2),"h":h}};
				var oppo = this.opposite[toward];
				var p1 = pos[oppo];
				var p2 = pos[toward];
				elem.css({"top":p1.y,"left":p1.x,"width":p1.w,"height":p1.h});
				elem.attr({"toward":oppo,"oppo":toward});
				this.ctrl.setStyle("dockIn");
				this.ctrl.resetRate();
				
				var dc = drag.ctrl();
				if(dc.children.length){				//拖动的窗口包含子窗口
					var ow = dc.frameObj.width();
					var oh = dc.frameObj.height();
					dc.childrenResize(ow,oh,p2.w,p2.h,{"t":p2.y,"l":p2.x});
					for(var i=0;i<dc.children.length;i++){
						var child = dc.children[i];
						topWin.bodyObj.append(child.frameObj);
						topWin.addWin(child);
						child.resetRate();
					}
					dc.unload();
				}else{
					dc.frameObj.css({"top":p2.y,"left":p2.x,"width":p2.w,"height":p2.h});
					dc.frameObj.attr({"toward":toward,"oppo":oppo});
					dc.setStyle("dockIn");
					dc.resetRate();
				}
			};
			this.tabIn=function(drag){			//拖入选项卡
				var elem = this.ctrl.frameObj;
				var h = elem.height();
				var w = elem.width();
				var t = elem.offset().top;
				var l = elem.offset().left;
				var tab = this.ctrl.tab;
				if(!tab){
					tab = δ.fn.createTab();
					tab.addWin(this.ctrl);
					tab.selectByWin(this.ctrl);
				}
				var dc = drag.ctrl();
				if(dc.tab){
					dc.tab.frameObj.remove();
					var items = dc.tab.items;
					for(var i=0;i<items.length;i++){
						tab.addWin(items[i].win);
						if(items[i].isSelected()){
							tab.selectByWin(items[i].win);
						}
						//tab.removeByItem(item);
					}
				}else{
					tab.addWin(dc);
					tab.selectByWin(dc);
				}
			};
		}
		,tabItem:function(tab,win){
			this.tab=tab;
			this.frameObj=null;
			this.textObj=null;
			this.text="";
			this.win=win;
			
			this.buildElement=function(){
				this.frameObj=$("<span>");
				this.textObj=$("<label>");
				this.frameObj.append(this.textObj);
				this.setStyle("normal");
			};
			this.setText=function(text){
				this.textObj.text(text);
			};
			this.isSelected=function(text){
				return this.frameObj.attr("class")==this.tab.styles.tabItemStyle.select;
			};
			this.setSelected=function(){
				var selItem = this.tab.getSelectItem();
				if(selItem){
					var w1 = selItem.win;
					var p = (w1.parent)?w1.frameObj.position():w1.frameObj.offset();
					var t = p.top;
					var l = p.left;
					var w = w1.frameObj.width();
					var h = w1.frameObj.height();
					this.win.frameObj.css({"top":t,"left":l,"width":w,"height":h});
					w1.frameObj.hide();
					this.win.show();
					this.win.tableObj.append(this.tab.frameObj);
				}else{
					this.win.tableObj.append(this.tab.frameObj);
				}
				this.setStyle("select");
				for(var i=0;i<this.tab.items.length;i++){
					if(this.tab.items[i]!=this)this.tab.items[i].setStyle("normal");
				}
			};
			this.setStyle=function(state){
				with(this.tab.styles){
					switch(state){
						case "normal":
							Δ.dynamic.setToNormal(this.frameObj,tabItemStyle);
							this.textObj.attr({"class":tabTextStyle});
							break;
						case "over":
							Δ.dynamic.setToOver(this.frameObj,tabItemStyle);
							break;
						case "select":
							Δ.dynamic.setToSelect(this.frameObj,tabItemStyle);
							break;
					}
				}
			};
		}
		,tab:function(styles){				//选项卡
			this.styles=styles;
			this.frameObj=null;
			this.cellObj=null;
			this.items=[];
			this.height=22;
			
			this.buildElement=function(){
				this.frameObj=$("<tr>").attr({"class":this.styles.tabStyle}).css({"height":this.height});
				this.cellObj=$("<td colspan=2 >");
				this.frameObj.append(this.cellObj);
			};
			this.addWin=function(win){
				var item=new δ.tabItem(this,win);
				item.buildElement();
				item.setText(win.title);
				this.cellObj.append(item.frameObj);
				this.items.push(item);
				win.tab=this;
				win.setStyle("tabIn");
			};
			this.getSelectItem=function(){
				for(var i=0;i<this.items.length;i++){
					var item = this.items[i];
					if(item.isSelected())return item;
				}
			};
			this.getItemByWin=function(win){
				for(var i=0;i<this.items.length;i++){
					var item = this.items[i];
					if(item.win==win)return item;
				}
			};
			this.getItemByIndex=function(index){
				return this.items[index];
			};
			this.selectByWin=function(win){
				var item = this.getItemByWin(win);
				if(item)item.setSelected();
			};
			this.selectByIndex=function(index){
				var item = this.getItemByIndex(index);
				if(item)item.setSelected();
			};
		}
		,control:function(){
			Δ.ctrl.base.window.call(this);
			this.register(this);
			this.styles=new δ.styles();
			this.dock=new δ.dock(this,this.styles);
			this.node=null;
			this.frameObj=null;
			this.tableObj=null;
			this.headObj=null;
			this.bodyObj=null;
			this.footObj=null;
			this.textObj=null;
			this.iconObj=null;
			this.lineObj=null;
			this.btnCellObj=null;			//按钮单元格对像
			this.buttonObjs=[];
			this.iconObjs=[];
			this.children=[];				//子窗口
			this.width="100%";
			this.height="100%";
			this.neighbor={};				//子窗口的邻居
			this.drag=null;
			this.resize=null;
			this.resizeRate=null;			//缩放比率索数
			this.icon="logo";
			this.title="";
			this.pos=null;
			this.min={"width":80,"height":40};			//拖动最小宽度和高度
			this.parent=null;			//父窗体
			this.tab=null;				//选项卡
			this.visible=true;
			this.buttons="closeWin,revertWin,maxWin,minWin";
			this.opposite={"w-resize":"e-resize","e-resize":"w-resize","n-resize":"s-resize","s-resize":"n-resize"};
			
			this.buildElement=function(){
				var f={css:{},attr:{}},h={css:{},attr:{}},t={css:{},attr:{}},b={css:{},attr:{}};
				with(this.styles){
					h.attr["class"]=headStyle;
					t.attr["class"]=textStyle;
					b.attr["class"]=bodyStyle;
					f.attr["container"]=true;
					f.attr["dock"]=false;
					if(this.id)f.attr["id"]=this.id;
					f.css["position"]="absolute";
					h.attr["undrag"]=true;
				}
				if(this.style)f.attr["style"]=this.style;
				this.frameObj=$("<div>").attr(f.attr).css(f.css);
				this.frameObj.ctrl(this);
				this.tableObj=$("<table cellpadding=\"0\" cellspacing=\"0\">").addClass(this.styles.tableStyle);
				var tr1=$("<tr>").addClass(this.styles.headStyle);
				var tr2=$("<tr>");
				this.headObj=$("<td>").attr(h.attr).css(h.css);
				this.bodyObj=$("<td colspan=2>").attr(b.attr).css(b.css);
				this.textObj=$("<label>").attr(t.attr).css(t.css);
				if(this.icon){
					this.iconObj = Δ.widget.graph.getIcon(this.icon,"<div>");
					this.iconObj.attr("class",this.styles.iconStyle);
					this.headObj.append(this.iconObj);
				}
				this.headObj.append(this.textObj);
				tr1.append(this.headObj);
				tr2.append(this.bodyObj);
				this.tableObj.append(tr1);
				this.tableObj.append(tr2);
				this.frameObj.append(this.tableObj);
				this.setWidth(this.width);
				this.setHeight(this.height);
				this.setTitle(this.title);
				this.setStyle("normal");
				this.setStyle("dockOut");
				this.btnCellObj = $("<td>");
				var tdw = 0;
				this.buttons=this.buttons.split(",");
				for(var i=0;i<this.buttons.length;i++){
					var btype = this.buttons[i];
					var btn = this.buildButtonElement(i,btype,btype=="revertWin");
					this.btnCellObj.append(btn);
				}
				tr1.append(this.btnCellObj);
				this.dock.buildElement();
			};
			this.buildButtonElement=function(index,type,hiddenFlag){
				var i={css:{},attr:{}},b={css:{},attr:{}};
				with(this.styles){
					i.attr["class"]=buttonIconStyle;
					b.attr["class"]=buttonStyle.normal;
				}
				var btn = $("<span>").attr(b.attr).css(b.css);
				btn.attr({"index":index,"btype":type});
				var icon = Δ.widget.graph.getElement(type,"normal",$("<input type=button >").attr(i.attr).css(i.css));
				icon.attr({"index":index,"btype":type});
				this.iconObjs.push(icon);
				this.buttonObjs.push(btn);
				btn.append(icon);
				this.headObj.append(btn);
				if(hiddenFlag)btn.hide();
				return btn;
			};
			this.resizeButtonWidth=function(){
				var w = 0;
				this.btnCellObj.children().each(function(){
					w+=$(this).width();
				});
				if(w>0)this.btnCellObj.width(w);
			};
			this.render=function(){
				this.resizeButtonWidth();
				if(!this.visible)this.hide();
			};
			this.setTitle=function(title){
				this.textObj.text(title);
			};
			this.hasChildren=function(){			//是否有子窗口
				return this.children.length>0;
			};
			this.addWin=function(win){				//添加子窗口
				win.parent=this;
				this.children.push(win);
				if(win.tab){						//添加选项卡中的窗口
					for(var i=0;i<win.tab.items.length;i++){
						var item = win.tab.items[i];
						if(item.win!=win){
							item.win.setStyle("dockIn");
							item.win.parent=this;
							this.bodyObj.append(item.win.frameObj);
						}
					}
				}
			};
			this.addChildren=function(children){
				if(children){
					this.bodyObj.append(children);
				}
			};
			this.removeWin=function(win){			//移除子窗口
				win.parent=null;
				var drag = win.frameObj;
				var oppo =drag.attr("oppo");
				var w = drag.width();
				var h = drag.height();
				this.frameObj.find("div[dock]").each(function(){
					var elem = $(this);
					if(win.frameObj.isNeighbor(oppo,elem,5)){
						switch(oppo){
							case "up":
								elem.css({"height":elem.height()+h});
								break;
							case "down":
								elem.css({"height":elem.height()+h,"top":elem.position().top-h});
								break;
							case "left":
								elem.css({"width":elem.width()+w});
								break;
							case "right":
								elem.css({"width":elem.width()+w,"left":elem.position().left-w});
								break;
						}
					}
				});
				drag.insertBefore(this.frameObj);
				win.setStyle("dockOut");
				this.children.removeObj(win);
				if(win.tab){						//添加选项卡中的窗口
					for(var i=0;i<win.tab.items.length;i++){
						var item = win.tab.items[i];
						if(item.win!=win){
							item.win.setStyle("dockOut");
							item.win.parent=null;
							item.win.frameObj.insertBefore(win.frameObj);
						}
					}
				}
				if(this.children.length==1){
					var last = this.children[0];
					var o = this.frameObj.offset();
					last.frameObj.insertBefore(this.frameObj);
					last.frameObj.css({"top":o.top,"left":o.left});
					last.setStyle("dockOut");
					last.parent=null;
					this.frameObj.remove();
				}
			};
			this.beginDrag=function(x,y){			//开始拖动窗口
				var p = this.frameObj.offset();
				var z = this.frameObj.css("z-index");
				this.drag = {"x":x-p.left,"y":y-p.top};
				this.raiseFirst();
			};
			this.draging=function(x,y){				//拖动窗口中
				//this.frameObj.css({"left":x-this.drag.x+"px","top":y-this.drag.y+"px"});
				this.frameObj[0].style.left=x-this.drag.x+"px";
				this.frameObj[0].style.top=y-this.drag.y+"px";
				this.frameObj.attr("draging",true);
			};
			this.endDrag=function(){			//结束拖动窗口
				this.frameObj.attr("draging",false);
				this.drag=null;
			};
			this.maximize=function(index){			//窗口最大化
				var p = this.frameObj.offset();
				var w1 = this.frameObj.width();
				var h1 = this.frameObj.height();
				this.pos={"x":p.left,"y":p.top,"w":w1,"h":h1};
				this.frameObj.css({"width":"100%","height":"100%","left":"0px","top":"0px","border-width":"0px","padding":"0px"});
				this.buttonObjs[index].hide();
				this.buttonObjs[index-1].show();
				this.raiseFirst();
				var w2 = this.frameObj.width();
				var h2 = this.frameObj.height();
				this.childrenResize(w1,h1,w2-1,h2-1);
			};
			this.minimize=function(){			//窗口最小化
				
			};
			this.revert=function(index){				//窗口尺寸还原
				var w1 = this.frameObj.width();
				var h1 = this.frameObj.height();
				this.frameObj.css({"left":this.pos.x,"top":this.pos.y,"border-width":"1px","padding":"0px"});
				this.setWidth(this.pos.w);
				this.setHeight(this.pos.h);
				this.buttonObjs[index+1].show();
				this.buttonObjs[index].hide();
				var w2 = this.frameObj.width();
				var h2 = this.frameObj.height();
				this.childrenResize(w1,h1,w2,h2);
			};
			this.resizeEnable=function(cursor){				//能否拖动改变尺寸
				if(this.parent){
					var t = this.frameObj.position().top;
					var l = this.frameObj.position().left;
					var w1 = this.frameObj.width();
					var h1 = this.frameObj.height();
					var w2 = this.parent.frameObj.width();
					var h2 = this.parent.bodyObj.height();
					var d = 1;
					switch(cursor){
						case "w-resize":
							return l>d;
						case "e-resize":
							return l+w1<w2-d;
						case "n-resize":
							return t>d;
						case "s-resize":
							return t+h1<h2-d;
					}
					return false;
				}
				return true;
			};
			this.resetRate=function(){			//重置子窗口相对父窗口的比率
				if(this.parent){
					var ph = this.parent.bodyObj.height();
					var pw = this.parent.bodyObj.width();
					var w = this.frameObj.width();
					var h = this.frameObj.height();
					var t = this.frameObj.position().top;
					var l = this.frameObj.position().left;
					this.resizeRate = {"w":w/pw,"h":h/ph,"t":t/ph,"l":l/pw};
				}else{
					this.resizeRate=null;
				}
			};
			this.repairRate=function(){				//修复改变大小时产生的误差
				for(var i=0;i<this.children.length;i++){			//父窗口改变尺寸
					var child = this.children[i];
				}
			};
			this.childrenResize=function(w1,h1,w2,h2,pos){			//改变子窗口大小，非拖动
				var w = w2 - w1;
				var h = h2 - h1;
				for(var i=0;i<this.children.length;i++){			//父窗口改变尺寸
					var child = this.children[i];
					var ct = child.frameObj.position().top;
					var cl = child.frameObj.position().left;
					var cw = child.frameObj.width();
					var ch = child.frameObj.height();
					if(child.resizeRate){
						child.frameObj.css({"height":ch+h*child.resizeRate.h,"top":ct+child.resizeRate.t*h});
						child.frameObj.css({"width":cw+w*child.resizeRate.w,"left":cl+w*child.resizeRate.l});
					}
					if(pos){
						var t = child.frameObj.position().top;
						var l = child.frameObj.position().left;
						child.frameObj.css({"top":t+pos.t,"left":l+pos.l});
					}
				}
			};
			this.beginResize=function(cursor,x,y,inFlag){			//开始拖动改变窗口尺寸
				if(!this.resize){
					var h = this.frameObj.height();
					var w = this.frameObj.width();
					var p = (this.resizeRate!=null)?this.frameObj.position():this.frameObj.offset();
					var t = p.top;
					var l = p.left;
					this.resize={"x":x,"y":y,"t":t,"l":l,"w":w,"h":h,"cursor":cursor,"inFlag":inFlag};
					for(var i=0;i<this.children.length;i++){			//父窗口改变尺寸
						this.children[i].beginResize(cursor,x,y);
					}
					if(inFlag && this.frameObj.mourseOver(x,y)){			//子窗口改变尺寸
						for(var i=0;i<this.parent.children.length;i++){			//父窗口改变尺寸
							var c = this.parent.children[i];
							if(c!=this){
								var newCursor = c.frameObj.borderCursor(cursor,x,y,5);
								if(newCursor)c.beginResize(newCursor,x,y,inFlag);
							}
						}
					}
				}
			};
			this.resizing=function(x,y){			//拖动改变大小中
				var c = this.resize.cursor;
				var w = this.resize.x - x;
				var h = this.resize.y - y;

				if(c!="w-resize" && c!="e-resize"){
					h = (c.indexOf("n")>-1)?h:-h;
					if(this.resizeRate){
						if(this.resize.inFlag){
							if(this.resize.t>0)this.frameObj.css({"height":this.resize.h+h,"top":this.resize.t-h});
							else this.frameObj.css({"height":this.resize.h+h});
						}else{
							this.frameObj.css({"height":this.resize.h+h*this.resizeRate.h,"top":this.resize.t+this.resizeRate.t*h});
						}
					}else{
						this.frameObj.css({"height":this.resize.h+h});
					}
				}

				if(c!="n-resize" && c!="s-resize"){
					w = (c.indexOf("w")>-1)?w:-w;
					if(this.resizeRate){
						if(this.resize.inFlag){
							if(this.resize.l>0)this.frameObj.css({"width":this.resize.w+w,"left":this.resize.l-w});
							else this.frameObj.css({"width":this.resize.w+w});
						}else{
							this.frameObj.css({"width":this.resize.w+w*this.resizeRate.w,"left":this.resize.l+w*this.resizeRate.l});
						}
					}else{
						this.frameObj.css({"width":this.resize.w+w});
					}
				}
				
				if(!this.resizeRate){
					if(c=="nw-resize"){
						this.frameObj.css({"left":this.resize.l-w,"top":this.resize.t-h});
					}else if(c=="n-resize" || c=="ne-resize"){
						this.frameObj.css({"top":this.resize.t-h});
					}else if(c=="w-resize" || c=="sw-resize"){
						this.frameObj.css({"left":this.resize.l-w});
					}
				}
			};
			this.endResize=function(){			//拖动改变大小结束
				if(this.resize){
					this.resize=null;
				}
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
			};
			this.setStyle=function(state){
				with(this.styles){
					switch(state){
						case "normal":
							Δ.dynamic.setToNormal(this.frameObj,frameStyle);
							break;
						case "select":
							Δ.dynamic.setToSelect(this.frameObj,frameStyle);
							break;
						case "dockIn":			//在窗口内
							this.frameObj.removeClass(shadowRadiusStyle);
							this.frameObj.css({"border-width":0});
							break;
						case "dockOut":			//在窗口外
							this.frameObj.addClass(shadowRadiusStyle);
							this.frameObj.css({"border-width":1});
							break;
						case "tabIn":			//有选项卡
							this.frameObj.removeClass(shadowRadiusStyle);
							if(this.tab)this.bodyObj.css({"bottom":this.tab.height});
							break;
						case "tabOut":			//没选项卡
							this.frameObj.addClass(shadowRadiusStyle);
							this.bodyObj.css({"bottom":0});
							break;
					}
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
				this.setPropertys(ctrl);
				this.addEvents(ctrl);
				ctrl.dock.appendTo($("body"));
				return ctrl;
			}
			,createTab:function(context){
				var tab = new δ.tab(new δ.styles());
				tab.buildElement();
				tab.frameObj.bind({
					"click":function(e){
						δ.fn.tabClick(tab,e);
					}
				});
				return tab;
			}
			,setupTab:function(context){
				var tab = δ.fn.createTab();
				for(var i=0;i<context.children.length;i++){
					var node = context.children[i];
					var ctrl=Δ.ctrl.factory.createByNode(node);
					node.ctrl=ctrl;
					node.render();
					tab.addWin(ctrl);
					tab.selectByWin(ctrl);
				}
				tab.selectByIndex(0);
				return false;
			}
			,tabClick:function(tab,e){
				var elem=e.srcElement || e.target;
				tab.frameObj.find("span").each(function(i){
					if(elem==this || $(this).find(elem).length){
						var item = tab.getItemByIndex(i);
						if(item && !item.isSelected())item.setSelected();
					}
				});
			}
			,setPropertys:function(ctrl){		//设置控件属性
				if (ctrl.ctrlSet!=null){
					Δ.setPropertiesRecursive(ctrl,ctrl.ctrlSet,false);
					ctrl.buildElement();
				}
			}
			,addEvents:function(ctrl){
				for(var i=0;i<ctrl.buttonObjs.length;i++){
					var btn = ctrl.buttonObjs[i];
					btn.bind({
						"mouseover":function(e){
							δ.fn.mouseOver(ctrl,e)
						}
						,"mouseout":function(e){
							δ.fn.mouseOut(ctrl,e)
						}
						,"mouseup":function(e){
							δ.fn.buttonClick(ctrl,e)
						}
					});
				}
				ctrl.headObj.bind({
					"mousedown":function(e){
						δ.fn.mouseDown(ctrl,e);
					}
				});
				ctrl.frameObj.bind({
					"mousedown":function(e){
						δ.fn.frameDown(ctrl,e);
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
				for(var i=0;i<ctrl.dock.boxObjs.length;i++){
					var box = ctrl.dock.boxObjs[i];
					box.bind({
						"mouseenter":function(e){
							δ.fn.dockEnter(ctrl.dock,e)
						}
						,"mouseleave":function(e){
							δ.fn.dockLeave(ctrl.dock,e);
						}
						,"mouseup":function(e){
							δ.fn.dockUp(ctrl.dock,e);
						}
					});
				}
			}
			,getForwardElement:function(x,y){
				var maxIndex = -1;
				var forward = null;
				$("div[dock='true']").each(function(){
					if($(this)._mourseOver(x,y) && $(this).is(":visible")){
						var z = parseInt($(this).css("z-index")+"");
						if(maxIndex<=z){
							maxIndex=z;
							forward=this;
						}
					}
				});
				return forward;
			}
			,bodyClick:function(ctrl,e){
				var elem=e.srcElement || e.target;
				if(ctrl.frameObj[0] == elem || ctrl.frameObj.find(elem).length){
					ctrl.setStyle("select");
					ctrl.raiseFirst();
				}
				else{
					ctrl.setStyle("normal");
				}
			}
			,frameDown:function(ctrl,e){
				var y = e.pageY;
				var x = e.pageX;
				
				var cursor = ctrl.frameObj._resizeCursor(x,y,3);
				if(cursor){
					if(ctrl.resizeEnable(cursor)){
						ctrl.beginResize(cursor,x,y,ctrl.parent?true:false);
					}
				}
			}
			,mouseDown:function(ctrl,e){
				var elem=e.srcElement || e.target;
				if(Δ.mouse.getButton(e)==0){
					if($(elem).attr("index")==null){
						ctrl.beginDrag(e.pageX,e.pageY);
						$("[dock]").each(function(){
							if(this!=ctrl.frameObj[0])$(this).attr("dock",true);
						});
					}else{
						var index = parseInt($(elem).attr("index")+"")
						var icon = ctrl.iconObjs[index];
					}
				}
			}
			,mouseMove:function(ctrl,e){
				var y = e.pageY;
				var x = e.pageX;
				
				if(!ctrl.resize){
					var cursor = ctrl.frameObj._resizeCursor(x,y,3);
					
					if(cursor){
						ctrl.frameObj.css({"cursor":cursor});
					}else{
						if(ctrl.frameObj[0].style.cursor)				//IE卡,加个判断
							ctrl.frameObj[0].style.cursor="";
					}
				}
				
				if(ctrl.resize){				//改变窗体大小
					ctrl.resizing(x,y);
				}else if(ctrl.drag){
					if(ctrl.parent){			//有父窗体时，从父窗体中移出
						ctrl.parent.removeWin(ctrl);
					}
					ctrl.draging(x,y);			//拖动进行中
				}
				/*
				var dockFlag = ctrl.frameObj.attr("dock")+"";
				if(dockFlag=="true"){
					if(ctrl.frameObj.mourseOver(x,y)){			//光标在窗口内
						var forward = δ.fn.getForwardElement(x,y);
						if(ctrl.frameObj[0]==forward){			//是否为最前面的窗口
							ctrl.dock.showSign();			//显示停靠标记
						}
						else{
							ctrl.dock.hideSign();
						}
					}else{
						ctrl.dock.hideSign();
					}
				}
				else{
					ctrl.dock.hideSign();
				}
				*/
			}
			,mouseUp:function(ctrl,e){
				var elem=e.srcElement || e.target;
				if(ctrl.resize){
					ctrl.endResize();
				}
				if(ctrl.drag){
					ctrl.endDrag();
					$("[dock]").attr("dock",false);
				}
			}
			,mouseOver:function(ctrl,e){
				var elem=e.srcElement || e.target;
				var index = parseInt($(elem).attr("index")+"")
				var btn = ctrl.buttonObjs[index];
				var icon = ctrl.iconObjs[index];
				Δ.dynamic.setToOver(btn,ctrl.styles.buttonStyle);
				Δ.widget.graph.setElement(icon.attr("btype")+"","over",icon);
			}
			,mouseOut:function(ctrl,e){
				var elem=e.srcElement || e.target;
				var index = parseInt($(elem).attr("index")+"");
				var btn = ctrl.buttonObjs[index];
				var icon = ctrl.iconObjs[index];
				Δ.dynamic.setToNormal(btn,ctrl.styles.buttonStyle);
				Δ.widget.graph.setElement(icon.attr("btype")+"","normal",icon);
			}
			,buttonClick:function(ctrl,e){
				var elem=e.srcElement || e.target;
				var index = parseInt($(elem).attr("index")+"");
				var type = $(elem).attr("btype")+"";
				switch(type){
					case "minWin":
						ctrl.minimize();
						break;
					case "maxWin":
						ctrl.maximize(index);
						break;
					case "closeWin":
						ctrl.hide();
						break;
					case "revertWin":
						ctrl.revert(index);
						break;
				}
			}
			,dockEnter:function(dock,e){
				var elem=e.srcElement || e.target;
				var toward = $(elem).attr("toward");
				if(toward)dock.showCover(toward);
			}
			,dockLeave:function(dock,e){
				var elem=e.srcElement || e.target;
				var toward = $(elem).attr("toward");
				if(toward)dock.hideCover(toward);
			}
			,dockUp:function(dock,e){
				var elem=e.srcElement || e.target;
				var toward = $(elem).attr("toward");
				var drag = $("div[draging='true']");
				if(toward=="center")dock.tabIn(drag);
				else dock.dragIn(toward,drag);
			}
		}
	}
})(jQuery,tptps);

(function($,Δ,δ){
	Δ.ctrl.panel=δ={
		styles:function(){
			Δ.ctrl.window.styles.call(this);
			this.headStyle="panel-headStyle";
		}
		,control:function(){
			Δ.ctrl.window.control.call(this);
			this.styles=new δ.styles();
			this.icon="";
			this.buttons="closeWin,revertWin,maxWin,minWin";
		}
		,construct:function(context){
			var ctrl = this.fn.create(context);
			return ctrl;
		}
		,fn:{
			create:function(context){
				var ctrl = new δ.control();
				ctrl.ctrlSet=context.setting;
				Δ.ctrl.window.fn.setPropertys(ctrl);
				Δ.ctrl.window.fn.addEvents(ctrl);
				ctrl.dock.appendTo($("body"));
				return ctrl;
			}
		}
	}
})(jQuery,tptps);