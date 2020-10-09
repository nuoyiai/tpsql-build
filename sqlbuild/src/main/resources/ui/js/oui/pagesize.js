//////////////////////////////////////////////////////
/////   Author: Zhu Sheng Wei (Nov-9th 1980)       ///
////    Nff WebUI Javascript Control PageSize	  ////
//////////////////////////////////////////////////////

(function($,Δ,δ){
	Δ.ctrl.pagesize=δ={
		styles:function(){
			this.frameStyle="pagesize-frameStyle";		//控件外框样式
			this.frameInnerStyle="pagesize-frame-innerStyle";
			this.navFrameStyle="pagesize-nav-frameStyle";	//导航外框样式
			this.navGroupStyle="pagesize-nav-groupStyle";
			this.splitStyle="pagesize-splitStyle";			//占位标记
			this.currentPageStyle="pagesize-currentPage-frameStyle";
			this.currentCountStyle="pagesize-currentSize-frameStyle";
		}
		,control:function(){
			Δ.ctrl.base.control.call(this);
			this.styles=new δ.styles();
			this.frameObj=null;
			this.innerObj=null;
			this.navObj=null;
			this.countObj=null;
			this.sizeObj=null;
			this.first = "首页"; 
			this.last = "尾页";
			this.next = "下一页";
			this.prev = "上一页";
			this.pagesize=25;
			this.pagenum=1;
			this.count=0;
			this.frameObj=null;
			this.combo=null;
			this.text=null;
			this.fields="page,size,count";
			this.ongotopage="";
			
			this.buildElement=function(){
				var f={attr:{},css:{}},i={attr:{},css:{}};
				with(this.styles){
					f.attr["class"]=frameStyle;
					i.attr["class"]=frameInnerStyle;
				}
				this.frameObj = $("<div>").attr(f.attr).css(f.css);
				this.innerObj = $("<div>").attr(i.attr).css(i.css).addClass("clearfix");
				this.navObj = $("<div>").addClass(this.styles.navFrameStyle);
				this.innerObj.append(this.navObj);
				this.frameObj.append(this.innerObj);
				this.buildNavElement();
				this.buildPageElement();
				this.buildSizeElement();
			};
			this.buildNavElement=function(){
				var groupObj = $("<span>").addClass(this.styles.navGroupStyle);
				groupObj.append(this.first.frameObj);
				groupObj.append(this.prev.frameObj);
				groupObj.append(this.next.frameObj);
				groupObj.append(this.last.frameObj);
				this.navObj.append(groupObj);
			};
			this.buildPageElement=function(){
				var groupObj = $("<div>").addClass(this.styles.navGroupStyle);
				groupObj.append("<label>第</label>").append(this.text.frameObj).append("<label>页</label>");
				groupObj.append("<label>&nbsp;</label>");
				this.countObj = $("<label>0</label>");
				groupObj.append("<label>共</label>").append(this.countObj).append("<label>页</label");
				this.navObj.append(groupObj);
			};
			this.buildSizeElement=function(){
				var groupObj = $("<div>").addClass(this.styles.navGroupStyle);
				groupObj.append(this.combo.frameObj);
				this.navObj.append(groupObj);
			};
			this.dataBinding=function(){				//绑定数据
				if(this.dao){
					this.pagesize = this.dao.getPageSize();
					this.pagenum = this.dao.getPageNum();
					this.count = this.dao.getCount();
					this.combo.setValue(this.pagesize);
					this.text.setValue(this.pagenum);
					if(this.count>0 && this.pagesize>0){
						var n = this.count%this.pagesize;
						var m = parseInt(this.count/this.pagesize);
						this.countObj.text(n>0?m+1:m);
					}else{
						this.countObj.text(0);
					}
				}
			};
			this.gotoPage=function(){
				if(this.ongotopage)Δ.raise(this.ongotopage,{"page":this.pagenum,"size":this.pagesize});
			};
			this.gotoFirst=function(){
				if(this.pagenum>1)this.setPageNum(1);
			};
			this.gotoLast=function(){
				var maxnum = parseInt(this.countObj.text());
				if(this.pagenum<maxnum)this.setPageNum(maxnum);
			};
			this.gotoNext=function(){
				var maxnum = parseInt(this.countObj.text());
				if(this.pagenum < maxnum){
					this.setPageNum(this.pagenum+1);
				}
			};
			this.gotoPrev=function(){
				if(this.pagenum > 1){
					this.setPageNum(this.pagenum-1);
				}
			};
			this.setPageNum=function(pageNum){
				this.pagenum = parseInt(pageNum);
				this.text.setText(this.pagenum);
				if(this.dao)this.dao.setPageNum(this.pagenum);
				this.gotoPage();
			};
			this.setPageSize=function(pageSize){
				this.pagesize = parseInt(pageSize);
				if(this.dao)this.dao.setPageSize(this.pagesize);
				this.gotoPage();
			};
			this.unload=function(){
				this.frameObj.remove();
				δ.fn.removeEvents(this);
			};
			this.propertiesInitialized=function(){
				if(this.data){
					this.dao = Δ.ctrl.dao.fn.createPageSize(this.data);
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
				ctrl.ctrlSet = context.setting;
				this.setPropertys(ctrl);
				ctrl.text = this.createTextBox(ctrl);
				ctrl.combo = this.createComboBox(ctrl);
				ctrl.first = this.createButton(ctrl,"首页");
				ctrl.last = this.createButton(ctrl,"尾页");
				ctrl.next = this.createButton(ctrl,"下一页");
				ctrl.prev = this.createButton(ctrl,"上一页");
				ctrl.buildElement();
				this.addEvents(ctrl);
				ctrl.dataBinding();
				return ctrl;
			}
			,createTextBox:function(ctrl){
				var box = Δ.ctrl.textbox.fn.create({setting:{width:45,ime:false,value:ctrl.pageNum,"maxlength":8,"style":"text-align:center;"}});
				return box;
			}
			,createComboBox:function(ctrl){
				var pageNum = ctrl.pageSize + "";
				var box = Δ.ctrl.combobox.fn.create({setting:{width:60,value:pageNum,"data":{"25":"25","50":"50","100":"100"}}});
				return box;
			}
			,createButton:function(ctrl,value){
				var btn = Δ.ctrl.button.fn.create({setting:{"value":value,"skin":"nav"}});
				return btn;
			}
			,setPropertys:function(ctrl){		//设置控件属性
				if(ctrl.ctrlSet!=null){
					Δ.setPropertiesRecursive(ctrl,ctrl.ctrlSet,false);
				}
			}
			,addEvents:function(ctrl){
				ctrl.first.onclick=function(){ctrl.gotoFirst();};
				ctrl.prev.onclick=function(){ctrl.gotoPrev();};
				ctrl.next.onclick=function(){ctrl.gotoNext();};
				ctrl.last.onclick=function(){ctrl.gotoLast();};
				ctrl.text.onlostfocus=function(args){
					var oldPage = ctrl.pagenum.toString();
					if(args.text){
						if(args.text != oldPage){
							ctrl.setPageNum(args.text);
						}
					}else{
						ctrl.text.setText(oldPage);
					}
				}
				ctrl.combo.onafteritemselected=function(args){
					var oldSize = ctrl.pagesize.toString();
					if(args.value){
						if(args.value.toString() != oldSize){
							ctrl.setPageSize(args.value);
						}
					}
				}
				if(ctrl.dao && ctrl.dao.dataSourceName)Δ.json.addListener(ctrl.dao.dataSourceName,function(){ctrl.dataBinding(ctrl.version);});
			}
			,removeEvents:function(ctrl){
				if(ctrl.dao && ctrl.dao.dataSourceName)Δ.json.removeListener(ctrl.dao.dataSourceName,function(){ctrl.dataBinding(ctrl.version);});
			}
			,bodyClick:function(ctrl,e){

			}
			,mouseOver:function(ctrl){
				ctrl.styles.frameStyle.setOver();
			}
			,mouseOut:function(ctrl){
				ctrl.styles.frameStyle.setNormal();
			}
		}
	};
})(jQuery,tptps);