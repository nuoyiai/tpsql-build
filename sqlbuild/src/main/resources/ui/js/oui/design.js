(function($,Δ,δ){
	Δ.design.frame=δ={
		events:function(){
			this.onSelected="";
		}
		,styles:function(){
			this.frameStyle={"normal":"design-frame-frameStyle-normal","over":"design-frame-frameStyle-over","select":"design-frame-frameStyle-select"};
			this.contentStyle="design-frame-contentStyle";
			this.boxStyle="design-frame-boxStyle";
			this.tableStyle="design-frame-tableStyle";
			this.downStaffStyle="design-frame-downStaffStyle";
			this.leftStaffStyle="design-frame-leftStaffStyle";
			this.dragFrameStyle="design-drag-frameStyle";
		}
		,component:function(){
			this.styles=new δ.styles();
			this.events=new δ.events();
			this.frameObj=null;
			this.shadowObj=null;
			this.imageObjs=[];
			this.resize=null;
			this.drag=null;
			this.staff={};
			
			this.buildElement=function(){
				this.frameObj=$("<div onselectstart=\"return false;\" >");
				this.shadowObj = $("<div>").attr({"class":this.styles.contentStyle});
				
				var table = $("<table cellpadding=0 cellspacing=0 >").attr({"class":this.styles.tableStyle});
				var imgIndex=0;
				for(var i=0;i<3;i++){
					var tr = $("<tr>");
					for(var j=0;j<3;j++){
						var td = $("<td>").css("text-align","center");
						if(i==1 && j==1){
							td.css("height","100%");
							td.css("width","100%");
							td.append(this.shadowObj);
						}else{
							var state = this.getImageState(imgIndex);
							var imageObj = Δ.widget.graph.getElement("framebox",state,"<div>");
							var boxStyle = this.styles.boxStyle+"-"+imgIndex;
							imageObj.attr({"class":boxStyle,"index":imgIndex});
							this.imageObjs.push(imageObj);
							td.append(imageObj);
							
							if(imgIndex==4){
								this.staff.leftObj = $("<div>").attr({"class":this.styles.leftStaffStyle});
								this.staff.leftTextObj = $("<span>");
								this.staff.leftObj.append(this.staff.leftTextObj);
								td.append(this.staff.leftObj);
							}
							if(imgIndex==6){
								this.staff.downObj = $("<div>").attr({"class":this.styles.downStaffStyle});
								this.staff.downTextObj = $("<span>");
								this.staff.downObj.append(this.staff.downTextObj);
								td.append(this.staff.downObj);
							}
							imgIndex++;
						}
						tr.append(td);
					}
					table.append(tr);
				}
				this.frameObj.append(table);
				
				this.setStyle("normal");
			};
			this.isSelected=function(){
				return this.frameObj.attr("class")==this.styles.frameStyle.select;
			};
			this.getImageState=function(index){
				var width = this.target.attr("width") || this.target.css("width");
				if(!width || width.indexOf("%")>-1 || width=="0px"){
					if(index!=1 && index!=6)return "lock";
				}
				
				var height = this.target.attr("height") || this.target.css("height");
				if(!height || height.indexOf("%")>-1 || height=="0px"){
					if(index!=3 && index!=4)return "lock";
				}
				return "normal";
			};
			this.setStyle=function(state){
				with(this.styles){
					switch(state){
						case "normal":
							Δ.dynamic.setToNormal(this.frameObj,frameStyle);
							this.staff.leftObj.hide();
							this.staff.downObj.hide();
							for(var i=0;i<this.imageObjs.length;i++)this.imageObjs[i].hide();
							break;
						case "select":
							Δ.dynamic.setToSelect(this.frameObj,frameStyle);
							for(var i=0;i<this.imageObjs.length;i++)this.imageObjs[i].show();
							break;
						case "over":
							Δ.dynamic.setToOver(this.frameObj,frameStyle);
							break;
					}
				}
			};
			this.beginDrag=function(x,y){
				var dragObj = $("<div onselectstart=\"return false;\" >").attr({"class":this.styles.dragFrameStyle});
				var cloneObj = this.target.clone();
				dragObj.append(cloneObj);
				this.drag = {"obj":dragObj,"x":x,"y":y};
				$("body").append(this.drag.obj);
				this.drag.obj.hide();
			};
			this.draging=function(x,y){
				if(this.drag){
					this.drag.obj.css({"left":x+"px","top":y+"px"});
					this.drag.obj.show();
				}
			};
			this.endDrag=function(){
				if(this.drag){
					this.drag.obj.remove();
					this.drag = null;
				}
			};
			this.beginResize=function(index,x,y){
				var state = this.getImageState(index);
				if(state!="lock"){
					var image = this.imageObjs[index];
					var h = this.target.height();
					var w = this.target.width();
					Δ.widget.graph.getElement("framebox","active",image);
					this.resize={"obj":image,"x":x,"y":y,"w":w,"h":h,"index":index};
					if(index!=1 && index!=6)this.staff.downObj.show();
					if(index!=3 && index!=4)this.staff.leftObj.show();
					//this.draging(x,y);
				}
			};
			this.resizing=function(x,y){
				var w = this.resize.x - x;
				var h = this.resize.y - y;
				var height = this.resize.h;
				var width = this.resize.w;
				var index = this.resize.index;

				if(index!=3 && index!=4){
					h = index>2?-h:h;
					this.target.height(height+h);
					this.staff.leftTextObj.text(height+h);
				}

				if(index!=1 && index!=6){
					w = (index==0 || index==3 || index==5)?w:-w;
					this.target.width(width+w);
					this.staff.downTextObj.text(width+w);
				}
			};
			this.endResize=function(){
				if(this.resize){
					Δ.widget.graph.getElement("framebox","normal",this.resize.obj);
					this.resize=null;
					this.staff.leftObj.hide();
					this.staff.downObj.hide();
				}
			};
		}
		,fn:{
			create:function(target){
				var cf = new δ.component();
				target.attr("frame",true);
				cf.target=target;
				cf.buildElement();
				this.addEvents(cf);
				return cf;
			}
			,addEvents:function(cf){
				$("body").bind({
					"click":function(e){
						δ.fn.bodyClick(cf,e)
					}
					,"mouseup":function(e){
						δ.fn.mouseUp(cf,e);
					}
					,"mousemove":function(e){
						δ.fn.mouseMove(cf,e);
					}
				});
				cf.frameObj.bind({
					"mouseover":function(){
						δ.fn.mouseOver(cf)
					}
					,"mouseout":function(){
						δ.fn.mouseOut(cf)
					}
					,"click":function(e){
						δ.fn.frameClick(cf,e);
					}
					,"mousedown":function(e){
						δ.fn.mouseDown(cf,e);
					}
				});
			}
			,bodyClick:function(cf,e){
				var elem=e.srcElement || e.target;
				if(!cf.frameObj.find(elem).length){
					cf.setStyle("normal");
				}
			}
			,mouseOver:function(cf){
				if(!cf.isSelected())cf.setStyle("over");
			}
			,mouseOut:function(cf){
				if(!cf.isSelected())cf.setStyle("normal");
			}
			,mouseDown:function(cf,e){
				var elem=e.srcElement || e.target;
				if(Δ.mouse.getButton(e)==0){
					if($(elem).attr("index")!=null){
						var index = $(elem).attr("index");
						cf.beginResize(parseInt(index),e.pageX,e.pageY);
					}else if(!cf.shadowObj.find(elem).length){
						cf.beginDrag(e.pageX,e.pageY);
					}
				}
			}
			,mouseUp:function(cf,e){
				if(cf.resize){
					cf.endResize();
				} else if(cf.drag){
					cf.endDrag();
					var y = e.pageY;
					var x = e.pageX;
					var self = cf.target;
					
					var co = δ.fn.getContainer(self);				//检查有没有父容器
					var top = (co && $(co)._mourseOver(x,y))?$(co):$("body");
					var nearly = δ.fn.getNearly(self,top,x,y);
					
					if(nearly){
						if($(nearly)._isContainer()){
							var co = $(nearly);
							nearly = δ.fn.getNearly(self,co,x,y);
							if(nearly){
								if($(nearly)._mourseLeft(x,y))cf.target.insertBefore(nearly);
								else cf.target.insertAfter(nearly);
							}
							else co.append(cf.target);
						}
						else if($(nearly)._mourseLeft(x,y))cf.target.insertBefore(nearly);
						else cf.target.insertAfter(nearly);
					}
				}
			}
			,getNearly:function(self,top,x,y){			//得到最近的标签
				var dis,nearly;
				top.find("*:visible").each(function(){
					if(self.mourseOver(x,y))return false;
					if(δ.fn.dragEnable($(this),self)){
						if($(this)._mourseLeft(x,y) || $(this)._mourseRight(x,y)){
							if(!nearly || ($(this)._mourceDistance(x,y).left<dis && !$(nearly).has(this).length)){
								nearly=this;
								dis = $(this)._mourceDistance(x,y).left;
							}
						}
					}
				});
				return nearly;
			}
			,getContainer:function(elem){			//得到当前标签的父容器,没有返回空
				if(elem.parents("[container]").length)return elem.parents("[container]")[0];
			}
			,dragEnable:function(elem,self){			//过滤不参与拖动标签
				if(elem[0]==self[0])return false;
				else if(self.has(this).length)return false;
				else if(elem.attr("undrag"))return false;
				else if(elem.parents("[frame]").length)return false;
				else if(elem.parents("[undrag]").length)return false;
				return true;
			}
			,mouseMove:function(cf,e){
				var y = e.pageY;
				var x = e.pageX;
				if(cf.resize){
					cf.resizing(x,y);
				}
				else if(cf.drag){
					cf.draging(x,y);
				}
			}
			,frameClick:function(cf,e){
				if(!cf.isSelected()){
					cf.setStyle("select");
					if(cf.events.onSelected)Δ.raise(cf.events.onSelected);
				}
			}
		}
	};
	Δ.design.setMode=function(mode){
		Δ.design.mode=mode;
		Δ.design.drag=true;
		$(document).bind("selectstart",function(){return false;});
		$(document).bind("contextmenu",function(){return false;});
	};
	Δ.design.setDrag=function(flag){
		Δ.design.drag=flag;
	};
})(jQuery,tptps,tptps.design={});