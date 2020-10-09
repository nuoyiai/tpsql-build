//////////////////////////////////////////////////////
/////   Author: Zhu Sheng Wei (Nov-9th 1980)       ///
////    Nff WebUI Javascript Control Datebox	  ////
//////////////////////////////////////////////////////

(function($,Δ,δ){
	Δ.ctrl.calendar=δ={
		/* 控件样式配置 */
		styles:function(){
			this.calFrameStyle="calendar-frameStyle";
			this.calWeekStyle="calendar-weekStyle";
			this.calRowStyle="calendar-rowStyle";
			this.calCellStyle={"normal":"calendar-cellStyle-normal","over":"calendar-cellStyle-over","select":"calendar-cellStyle-select"};
			this.calCellDisableStyle = "calendar-cellStyle-disable";
		}
		/* 日历 */
		,control:function(){
			Δ.ctrl.base.control.call(this);
			this.styles=new δ.styles();
			this.frameObj=null;
			this.monthDays=[31,31,28,31,30,31,30,31,31,30,31,30,31];
        	this.months=["1月","2月","3月","4月","5月","6月","7月","8月","9月","10月","11月","12月"];
        	this.weekDay=["日","一","二","三","四","五","六"];
			this.minRange=[1900,0,1];			//日期最小值
        	this.maxRange=[2100,11,31];			//日期最大值
			this.current=[-1,-1,-1];
			this.euroCal=false;					//是否为欧洲日历
			this.cal=null;						//日历数据
			this.onafteritemselected ="";		//选中日期事件
			
			this.buildElement=function(){
				var f={css:{},attr:{}};
				with(this.styles){
					f.attr["class"]=calFrameStyle;
				}
				if(this.style)f.attr["style"]=this.style;
				this.frameObj=$("<table cellpadding=\"0\" cellspacing=\"0\" ></table>").attr(f.attr);
				this.cal=[];
				var row,cell;
				var row = $("<tr>").attr("class",this.styles.calWeekStyle);
				for(var d=0;d<7;d++){
					cell = $("<td>");
					cell.text(this.weekDay[d]);
					row[0].appendChild(cell[0]);
				}
				this.frameObj.append(row);
				var frag = document.createDocumentFragment();
				for (var i=0;i<6;i++){
					row = $("<tr>").attr("class",this.styles.calRowStyle);
					for(var j=0;j<7;j++){
						cell = $("<td></td>");
						row[0].appendChild(cell[0]);
					}
					frag.appendChild(row[0]);
				}
				this.frameObj.append(frag);
            	for (var i=0;i<6;i++){this.cal[i]=[];for(var j=0;j<7;j++)this.cal[i][j]=[];}
			};
			this.buildCal=function(y,m){
				m=parseInt(m);
				this.current[0]=y;
				this.current[1]=m;
				var days=this.getMonthDays(y);
				var iDay1=(days[m]==28)?7:this.getWeek(y,m,1);
				var iLast=days[m-1]-iDay1+1,iDate=1,iNext=1;
				for(var d=0;d<7;d++){
					this.cal[0][d][0]=d<iDay1?m-1:m;
					this.cal[0][d][1]=d<iDay1?iLast+d:iDate++;
				}
				for(var w=1;w<6;w++){
					for(var d=0;d<7;d++){
						this.cal[w][d][0]=iDate<=days[m]?m:m+1;
						this.cal[w][d][1]=iDate<=days[m]?iDate++:iNext++;
					}
				}
				
				var row,cell;
				for(var i=0;i<this.cal.length;i++){
					row = this.frameObj[0].rows[i+1];
					for(var j=0;j<this.cal[i].length;j++){
						cell = row.cells[j];
						if(this.current[1]==this.cal[i][j][0] && this.current[2]==this.cal[i][j][1]){
							Δ.dynamic.setToSelect($(cell),this.styles.calCellStyle);
						}else{
							Δ.dynamic.setToNormal($(cell),this.styles.calCellStyle);
						}
						if(this.current[1]!=this.cal[i][j][0]){
							$(cell).addClass(this.styles.calCellDisableStyle);
						}else{
							$(cell).removeClass(this.styles.calCellDisableStyle);
						}
						cell.innerText=this.cal[i][j][1];
					}
				}
			};
			this.getCellByElement=function(elem){
				var ps;
				if(elem.tagName=="TD")return elem;
				else if($(elem).parents("TD").length){
					ps = $(elem).parents("TD");
					return ps[0];
				}
			};
			this.getCellPosByElement=function(elem){
				var cell = this.getCellByElement(elem);
				if(cell){
					var c = cell.cellIndex;
					var r = $(cell).parent()[0].rowIndex;
					return {"r":r,"c":c,"obj":cell};
				}
			};
			this.selectByElement=function(elem){
				var p = this.getCellPosByElement(elem);
				if(p){
					if(p.r>0){
						var m = this.cal[p.r-1][p.c][0];
						var d = this.cal[p.r-1][p.c][1];
						var y;
						if(m==0){
							y=this.current[0]-1;
							m=12;
						}else if(m==13){
							y=this.current[0]+1;
							m=1;
						}else y = this.current[0];
						this.current[2]=d;
						if(this.current[0]!=y || this.current[1]!=m){
							this.buildCal(y,m);
						}else{
							Δ.dynamic.setToNormal(this.frameObj.find("."+this.styles.calCellStyle.select),this.styles.calCellStyle);
							Δ.dynamic.setToSelect($(p.obj),this.styles.calCellStyle);
						}
						if(this.onafteritemselected)Δ.raise(this.onafteritemselected,{"ctrl":this,"year":y,"month":m-1,"day":d,"date":new Date(y,m-1,d)});
					}
				}
			};
			this.getWeek=function(y,m,d){
				var day=new Date(y,m-1,d).getDay();
				if (this.euroCal)
					if (--day<0) day=6;
				return day;
			};
			this.getMonthDays=function(y){
				var days=this.monthDays.slice(0);
				days[2]=y%4==0&&y%100!=0||y%400==0?29:28;
				return days;
			};
		}
		,construct:function(context){
			var ctrl=this.fn.create(context);
			return ctrl;
		}
		,fn:{
			create:function(context){
				var ctrl=new δ.control();
				ctrl.ctrlSet=context.setting;
				this.setPropertys(ctrl);
				this.addEvents(ctrl);
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
			,addEvents:function(ctrl){
				ctrl.frameObj.bind({
					"mouseover":function(e){
						δ.fn.mouseOver(ctrl,e)
					}
					,"mouseout":function(e){
						δ.fn.mouseOut(ctrl,e)
					}
					,"click":function(e){
						δ.fn.calClick(ctrl,e)
					}
				});
			}
			,calClick:function(ctrl,e){
				var elem=e.srcElement || e.target;
				ctrl.selectByElement(elem);
			}
			,mouseOver:function(ctrl,e){
				var elem=e.srcElement || e.target;
				var cell = ctrl.getCellByElement(elem);
				if(cell){
					if($(cell).attr("month")!=null && $(cell).attr("class")!=ctrl.styles.calCellStyle.select){
						Δ.dynamic.setToOver($(cell),ctrl.styles.calCellStyle);
					}
				}
			}
			,mouseOut:function(ctrl,e){
				var elem=e.srcElement || e.target;
				var cell = ctrl.getCellByElement(elem);
				if(cell){
					if($(cell).attr("month")!=null&& $(cell).attr("class")!=ctrl.styles.calCellStyle.select){
						Δ.dynamic.setToNormal($(cell),ctrl.styles.calCellStyle);
					}
				}
			}
		}
	};
})(jQuery,tptps);

(function($,Δ,δ){
	Δ.ctrl.datebox=δ={
		/* 控件样式配置 */
		styles:function(){
			this.frameStyle={"active":"input-frameStyle-active","normal":"input-frameStyle-normal","over":"input-frameStyle-over"};		//控件外框样式
			this.textStyle="input-textStyle";				//文本框样式
			this.panelStyle="datebox-panelStyle";
			this.panelHeadStyle="datebox-panel-headStyle";
			this.panelYMStyle="datebox-panel-YMStyle";
			this.calFrameStyle="calendar-frameStyle";
			this.calWeekStyle="calendar-weekStyle";
			this.calRowStyle="calendar-rowStyle";
			this.calCellStyle={"normal":"calendar-cellStyle-normal","over":"calendar-cellStyle-over","select":"calendar-cellStyle-select"};
			this.calCellDisableStyle = "calendar-cellStyle-disable";
			this.buttonInnerStyle = "datebox-button-innerStyle";
			this.yearNavInnerStyle = "datebox-year-nav-innerStyle";
		}
		/*  */
		,panel:function(ctrl){
			this.ctrl=ctrl;
			this.styles=ctrl.styles;
			this.cal=null;
			this.year=null;
			this.yearPopup=null;		//年下拉选择框		
			this.month=null;
			this.monthPopup=null;		//月下拉选择框			
			this.clear=null;
			this.today=null;
			this.monthData={"1":"一月","7":"七月","2":"二月","8":"八月","3":"三月","9":"九月","4":"四月","10":"十月","5":"五月","11":"十一","6":"六月","12":"十二"};
			this.yearpage=0;
			this.yearpagesize=10;
			
			this.buildElement=function(){
				this.frameObj=$("<div>").attr("class",this.styles.panelStyle);
				var headObj = $("<table cellpadding=\"0\" cellspacing=\"0\" >").attr("class",this.styles.panelHeadStyle);
				var tr = $("<tr>");
				tr.append("<td></td>");
				var td1 = $("<td style=\"width:50px;\" >");
				td1.append(this.year.frameObj);
				tr.append(td1);
				tr.append("<td class=\""+this.styles.panelYMStyle+"\" >年</td>");
				var td2 = $("<td style=\"width:35px;\" >");
				td2.append(this.month.frameObj);
				tr.append(td2);
				tr.append("<td class=\""+this.styles.panelYMStyle+"\" >月</td>");
				tr.append("<td></td>");
				headObj.append(tr);
				this.frameObj.append(headObj);
				this.frameObj.append(this.cal.frameObj);
				if(this.ctrl.button){
					var inner = $("<div>").addClass(this.styles.buttonInnerStyle);
					inner.append(this.clear.frameObj);
					inner.append(this.today.frameObj);
					this.frameObj.append(inner);
				}
			};
			this.setCal=function(y,m,d){
				if(y==null)y=this.year.value;
				if(m==null)m=this.month.value;
				if(d!=null)this.cal.current[2]=d;
				this.year.setValue(y);
				this.month.setValue(m);
				this.cal.buildCal(y,m);
			};
			this.showMonthPopup=function(){
				if(!this.monthPopup){
					this.monthPopup=δ.fn.createMonthPopup(this);
					this.ctrl.popup.frameObj.append(this.monthPopup.frameObj);
				}
				var mObj = this.month.frameObj;
				var l = mObj.position().left;
				var t = mObj.position().top;
				var h = mObj.outerHeight();
				var val = this.month.getValue();
				this.monthPopup.list.selectByValue(val);
				this.monthPopup.show(l,t+h-1,83);
			};
			this.hideMonthPopup=function(){
				if(this.monthPopup)this.monthPopup.hide();
			};
			this.showYearPopup=function(){
				if(!this.yearPopup){
					this.yearPopup=δ.fn.createYearPopup(this);
					this.ctrl.popup.frameObj.append(this.yearPopup.frameObj);
				}
				var mObj = this.year.frameObj;
				var l = mObj.position().left;
				var t = mObj.position().top;
				var h = mObj.outerHeight();
				var val = this.year.getValue();
				this.yearPopup.list.selectByValue(val);
				this.yearPopup.show(l,t+h-1,83);
			};
			this.hideYearPopup=function(){
				this.yearpage=0;
				if(this.yearPopup)this.yearPopup.hide();
			};
			this.getYearData=function(curYear){
				var data = {};
				var val = curYear?curYear:this.year.getValue();
				if(val){
					var size = this.yearpagesize;
					var n = parseInt(val/size)*size;
					for(var i=0;i<size;i++){
						var y=n+i+"";
						data[y]=y;
					}
				}
				return data;
			};
			this.gotoYearListPage=function(nav){			//前十年
				if(nav=="pre")this.yearpage--;
				else if(nav=="next")this.yearpage++;
				var y = this.year.getValue();
				var data = this.getYearData(y+this.yearpage*this.yearpagesize);
				this.yearPopup.list.dataBinding(data);
			};
		}
		/* 控件主体对像  */
		,control:function(){
			Δ.ctrl.base.control.call(this);
			this.styles=new δ.styles();
			this.popup=null;
			this.panel=null;
			this.drop=new Δ.widget.icon("calendar","normal");
			this.frameObj=null;
			this.textObj=null;
			this.width="100%";			//控件宽度
			this.height="22px";			//控件高度
			this.readonly=true;			//是否编辑
			this.button=true;			//是否显示按钮
			this.format="yyyy-MM-dd";			//时间格式化
			this.onafteritemselected ="";		//选中下拉项事件
			this.onlostfocus ="";				//失去焦点事件
        	
			this.buildElement=function(){
				this.drop.buildElement();
				var f={attr:{},css:{}},t={attr:{},css:{}};
				if(this.id){
					t.attr["id"]=this.id;
					f.attr["id"]=this.id+"_frame";
				}
				if(this.name)t.attr["name"]=this.name;
				
				with(this.styles){
					t.attr["class"]=textStyle;
				}
				this.frameObj=$("<div>").attr(f.attr).css(f.css);
				this.textObj=$("<input type=text />").attr(t.attr).css(t.css);
				this.textObj.ctrl(this);
				if(this.value)this.textObj.val(this.value);
				this.frameObj.append(this.textObj);
				this.frameObj.append("<input type=hidden />");
				this.frameObj.append(this.drop.frameObj);
				this.setWidth(this.width);
				this.setHeight(this.height);
			};
			this.setWidth=function(width){
				var f={css:{}},t={css:{}};
				var dropWidth = this.drop.getWidth();
				width+="";
				if(width.indexOf("%")>-1){
					f.css["width"]=width;
					t.css["width"]="100%";
					//t.css["margin-right"]=dropWidth+"px";
				}
				else{
					var n = width.indexOf("px");
					var w = (n>-1)?width.substr(0,n):width;
					f.css["width"]=w+"px";
					t.css["width"]=(parseInt(w)-dropWidth)+"px";
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
				if(value instanceof Date){
					var text = Δ.format(value,this.format);
					this.setText(text);
				}else{
					this.setText(value);
				}
			};
			this.getValue=function(){
				return this.getText();
			};
			this.getDate=function(){
				var val = this.getValue();
				if(val){
					return new Date(val.replace("-","/").replace("年","/").replace("月","/").replace("日",""));
				}
				return null;
			};
			this.clearValue=function(){
				this.textObj.val("");
			};
			this.getText=function(){
				var text = this.textObj.val()+"";
				return text;
			};
			this.dataBinding=function(){
				if(this.dao){
					var value = this.dao.getValue();
					this.textObj.val(value);
				}
			};
			this.unload=function(){
				this.frameObj.remove();
				if(this.popup)this.popup.frameObj.remove();
				$("body").off("click."+this.version);
			};
		}
		,construct:function(context){
			var ctrl=this.fn.create(context);
			return ctrl;
		}
		,fn:{
			create:function(context){
				var ctrl=new δ.control();
				ctrl.ctrlSet=context.setting;
				this.setPropertys(ctrl);
				this.addEvents(ctrl);
				ctrl.isOnit=true;
				return ctrl;
			}
			,createPopup:function(ctrl){
				var popup = new Δ.widget.popup();
				var panel = this.createPanel(ctrl);
				popup.buildElement();
				panel.buildElement();
				popup.frameObj.append(panel.frameObj);
				$("body").append(popup.frameObj);
				ctrl.popup = popup;
				ctrl.panel = panel;
			}
			,createPanel:function(ctrl){
				var panel = new δ.panel(ctrl);
				panel.year = this.createYearSpin(ctrl);
				panel.month = this.createMonthSpin(ctrl);
				panel.cal = this.createCalendar(ctrl);
				panel.clear = this.createClearButton(ctrl);
				panel.today = this.createTodayButton(ctrl);
				panel.month.onfocus = function(e){
					panel.showMonthPopup();			//点击numspin的文本框，且不是上下箭头
				};
				panel.month.onlostfocus = function(e){
					if(!panel.monthPopup || panel.monthPopup.frameObj._isNotChildAndSelf(e.target)){
						panel.hideMonthPopup();
					}
				};
				panel.year.onfocus = function(e){
					panel.showYearPopup();			//点击numspin的文本框，且不是上下箭头
				};
				panel.year.onlostfocus = function(e){
					if(!panel.yearPopup || panel.yearPopup.frameObj._isNotChildAndSelf(e.target)){
						panel.hideYearPopup();
					}
				};
				return panel;
			}
			,createMonthSpin:function(ctrl){
				var month = Δ.ctrl.numspin.fn.create({setting:{width:35,min:1,max:12}});
				month.onvaluechanged=function(e){
					ctrl.panel.setCal(null,e.value);
					if(ctrl.panel.monthPopup)ctrl.panel.monthPopup.list.selectByValue(e.value);
				};
				return month;
			}
			,createYearSpin:function(ctrl){
				var year = Δ.ctrl.numspin.fn.create({setting:{width:50,min:1900,max:2090}});
				year.onvaluechanged=function(e){
					ctrl.panel.setCal(e.value,null);
					if(ctrl.panel.yearPopup)ctrl.panel.yearPopup.list.selectByValue(e.value);
				};
				return year;
			}
			,createClearButton:function(ctrl){
				var btn = Δ.ctrl.button.fn.create({setting:{value:"清空"}});
				btn.onclick = function(e){
					ctrl.clearValue();
					ctrl.popup.hide();
				};
				return btn;
			}
			,createTodayButton:function(ctrl){
				var btn = Δ.ctrl.button.fn.create({setting:{value:"今天"}});
				btn.onclick = function(e){
					ctrl.setValue(new Date())
					ctrl.popup.hide();
				};
				return btn;
			}
			,createCalendar:function(ctrl){
				var cal = Δ.ctrl.calendar.fn.create({setting:{}});
				cal.onafteritemselected=function(e){
					ctrl.panel.year.setValue(e.year);
					ctrl.panel.month.setValue(e.month);
					ctrl.setValue(e.date);
					ctrl.popup.hide();
				};
				return cal;
			}
			,createMonthPopup:function(panel){
				var popup = Δ.widget.fn.createPopup();
				popup.list = Δ.ctrl.listbox.fn.create({setting:{"itemwidth":40,"data":panel.monthData}});
				popup.list.onafteritemselected=function(e){
					panel.setCal(null,e.value);
					panel.hideMonthPopup();
				};
				popup.frameObj.append(popup.list.frameObj);
				return popup;
			}
			,createYearPopup:function(panel){
				var popup = Δ.widget.fn.createPopup({"border":true});
				popup.list = Δ.ctrl.listbox.fn.create({setting:{"itemwidth":40,"data":panel.getYearData(),"style":"border:0px"}});
				popup.list.onafteritemselected=function(e){
					panel.setCal(e.value,null);
					panel.hideYearPopup();
				};
				popup.frameObj.append(popup.list.frameObj);
				var nav = $("<div><span id=\"pre\">←</span><span id=\"close\" >×</span><span id=\"next\">→</span></div>");
				nav.addClass(panel.styles.yearNavInnerStyle).addClass("select-none");
				nav.bind({"click":function(e){δ.fn.yearNavClick(panel,e);}});
				popup.frameObj.append(nav);
				return popup;
			}
			,setPropertys:function(ctrl){		//设置控件属性
				if (ctrl.ctrlSet!=null){
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
				});
				ctrl.drop.frameObj.bind({
					"click":function(){
						δ.fn.dropClick(ctrl);
					}
				});
			}
			,bodyClick:function(ctrl,e){
				var elem=e.srcElement || e.target;
				if(ctrl.popup){
					if(ctrl.popup.frameObj._isNotChildAndSelf(elem) && ctrl.frameObj._isNotChildAndSelf(elem)){
						ctrl.popup.hide();
						if(ctrl.onlostfocus)Δ.raise(ctrl.onlostfocus,{"ctrl":ctrl,"value":ctrl.getValue(),"text":ctrl.getText(),"target":elem});
					}
				}else if(ctrl.frameObj._isNotChildAndSelf(elem)){
					if(ctrl.onlostfocus)Δ.raise(ctrl.onlostfocus,{"ctrl":ctrl,"value":ctrl.getValue(),"text":ctrl.getText(),"target":elem});
				}
			}
			,dropClick:function(ctrl){
				var l = ctrl.frameObj.offset().left;
				var t = ctrl.frameObj.offset().top;
				var h = ctrl.frameObj.outerHeight();
				if(!ctrl.popup){
					this.createPopup(ctrl);
				}
				var d = ctrl.getDate();
				var date = d?d:new Date();
				var y = date.getFullYear();
				var m = date.getMonth();
				var d = date.getDate();
				ctrl.panel.setCal(y,m+1,d);
				ctrl.popup.show(l,t+h-1,200);
			}
			,mouseOver:function(ctrl){
				ctrl.styles.frameStyle.setOver();
				ctrl.drop.setState("over");
			}
			,mouseOut:function(ctrl){
				ctrl.styles.frameStyle.setNormal();
				ctrl.drop.setState("normal");
			}
			,yearNavClick:function(panel,e){
				var elem=e.srcElement || e.target;
				var id=$(elem).attr("id");
				switch(id){
					case "pre":
						panel.gotoYearListPage("pre");
						break;
					case "close":
						panel.hideYearPopup();
						break;
					case "next":
						panel.gotoYearListPage("next");
						break;
				}
			}
		}
	};
})(jQuery,tptps);

(function($,Δ,δ){
	Δ.ctrl.datespan=δ={
		styles:function(){
			this.frameStyle="datespan-frameStyle";
			this.splitStyle="datespan-splitStyle";
			this.cellStyle="datespan-cellStyle";
		}
		,control:function(){
			Δ.ctrl.base.control.call(this);
			this.styles=new δ.styles();
			this.beginDate=null;
			this.endDate=null;
			this.onlostfocus="";
			
			this.buildElement=function(){
				var f={css:{},attr:{}},s={attr:{}},c={attr:{}};
				with(this.styles){
					f.attr["class"]=frameStyle;
					s.attr["class"]=splitStyle;
					c.attr["class"]=cellStyle;
				}
				this.frameObj=$("<table>").attr(f.attr);
				var tr = $("<tr>");
				var td1 = $("<td>").attr(c.attr);
				if(this.beginDate)td1.append(this.beginDate.frameObj);
				var td2 = $("<td>").attr(s.attr);
				td2.text("-");
				var td3 = $("<td>").attr(c.attr);
				if(this.endDate)td3.append(this.endDate.frameObj);
				tr.append(td1).append(td2).append(td3);
				this.frameObj.append(tr);
			};
			this.setText =function(text){
				this.beginDate.setText(text);
			};
			this.setTextEnd =function(text){
				this.endDate.setText(text);
			};
			this.setValue =function(value){
				this.beginDate.setValue(value);
			};
			this.setValueEnd =function(value){
				this.endDate.setValue(value);
			};
		}
		,construct:function(context){
			var ctrl=this.fn.create(context);
			return ctrl;
		}
		,fn:{
			create:function(context){
				var ctrl=new δ.control();
				var es = Δ.json.copy(context.setting);
				if(es.id)es["id"]=es.id+"End";
				if(es.name)es["name"]=es.name+"End";
				ctrl.beginDate = Δ.ctrl.datebox.fn.create(context);
				ctrl.endDate = Δ.ctrl.datebox.fn.create({"setting":es});
				ctrl.ctrlSet=context.setting;
				this.setPropertys(ctrl);
				this.addEvents(ctrl);
				return ctrl;
			}
			,addEvents:function(ctrl){		//添加控件事件
				ctrl.beginDate.onlostfocus=function(e){
					if(ctrl.onlostfocus)Δ.raise(ctrl.onlostfocus,{"ctrl":ctrl,"value":e.value,"text":e.text});
				};
				ctrl.endDate.onlostfocus=function(e){
					if(ctrl.onlostfocus)Δ.raise(ctrl.onlostfocus,{"ctrl":ctrl,"value":e.value,"text":e.text,"end":"End"});
				};
			}
			,setPropertys:function(ctrl){		//设置控件属性
				if (ctrl.ctrlSet!=null){
					Δ.setPropertiesRecursive(ctrl,ctrl.ctrlSet,false);
					ctrl.buildElement();
				}
			}
		}
	};
})(jQuery,tptps);