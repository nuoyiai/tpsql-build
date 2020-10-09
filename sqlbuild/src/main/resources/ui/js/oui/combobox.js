//////////////////////////////////////////////////////
/////   Author: Zhu Sheng Wei (Nov-9th 1980)       ///
////    Nff WebUI Javascript Control Combobox	  ////
//////////////////////////////////////////////////////

(function($,Δ,δ){
	Δ.ctrl.combobox=δ={
		/* 控件样式配置 */
		styles:function(){
			this.frameStyle={"active":"input-frameStyle-active","normal":"input-frameStyle-normal","over":"input-frameStyle-over"};		//控件外框样式
			this.textStyle="input-textStyle";				//文本框样式
			this.prompt="input-promptStyle";			//提示文本样式
		}
		/* 控件主体对像  */
		,control:function(){
			Δ.ctrl.base.control.call(this);
			this.styles=new δ.styles();
			this.drop=new Δ.widget.icon("drop","normal");
			this.popup=null;
			this.textObj=null;
			this.valueObj=null;
			this.listbox=null;
			this.box="list";
			this.width="100%";			//控件宽度
			this.height="22px";			//控件高度
			this.popupwidth=null;
			this.readonly=true;			//是否编辑
			this.align="left";
			this.onlostfocus="";				//失去焦点事件
			this.onvaluechanged="";					//选中事件
			
			this.buildElement=function(){
				this.drop.buildElement();
				
				var f={attr:{},css:{}},t={attr:{},css:{}},i={attr:{},css:{}};
				if(this.id){
					i.attr["id"]=this.id;
					f.attr["id"]=this.id+"_frame";
					t.attr["id"]=this.id+"_text";
				}
				if(this.name)i.attr["name"]=this.name;
				with(this.styles){
					t.attr["class"]=textStyle;
				}
				if(this.style)f.attr["style"]=this.style;
				this.frameObj=$("<div>").attr(f.attr).css(f.css);
				this.textObj=$("<input type=text />").attr(t.attr).css(t.css);
				this.valueObj=$("<input type=hidden />").attr(i.attr).css(i.css);
				this.valueObj.ctrl(this);
				this.frameObj.append(this.textObj);
				this.frameObj.append(this.valueObj);
				this.frameObj.append(this.drop.frameObj);
				this.setWidth(this.width);
				this.setHeight(this.height);
				
				if(this.value){
					this.valueObj.val(this.value);
					this.valueChange();
				}
				
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
				t.css["height"]=f.css["height"]=t.css["line-height"]=height;
				this.frameObj.css(f.css);
				this.textObj.css(t.css);
			};
			this.setText = function(text){
				this.textObj.val(text);
			};
			this.setValue = function(value){
				this.valueObj.val(value);
			};
			this.getValue=function(){
				var value = this.valueObj.val()+"";
				return value;
			};
			this.getText=function(){
				var text = this.textObj.val()+"";
				return text;
			};
			this.valueChange=function(){
				if(this.dao){
					var text = this.dao.getTextByValue(this.getValue(),",");
					this.textObj.val(text);
				}
			};
			this.selectByValue=function(){
				if(this.popup && this.popup.ctrl){
					if(this.popup.ctrl.selectByValue)this.popup.ctrl.selectByValue(this.getValue());
				}
			};
			this.dataBinding=function(data){
				if(this.popup && this.popup.ctrl){
					if(this.popup.ctrl.dataBinding)this.popup.ctrl.dataBinding(data);
				}
			};
			this.focus=function(){
				
			};
			this.render=function(){
				
			};
			this.unload=function(){
				this.frameObj.remove();
				$("body").off("click."+this.version);
			};
			this.propertiesInitialized=function(){
				if(this.data){
					if(this.box=="tree" || this.box=="menu"){
						this.dao = Δ.ctrl.dao.fn.createDataTree(this.data,this.valuefield,this.textfield,this.parentfield);
					}else{
						this.dao = Δ.ctrl.dao.fn.createCodeTable(this.data,this.valuefield,this.textfield);
					}
				}
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
				if(ctrl.design){
					var frame = Δ.design.frame.fn.create(ctrl.frameObj);
					ctrl.frameObj.append(frame.frameObj);
				}else{
					this.addEvents(ctrl);
				}
				return ctrl;
			}
			,createPopup:function(ctrl){
				var setting = Δ.copyProperties(ctrl.ctrlSet);
				setting["width"]="100%";
				var val = ctrl.getValue();
				var context = {"setting":setting};
				ctrl.popup = new Δ.widget.popup();
				ctrl.popup.buildElement();
				switch(ctrl.box){
					case "list":
						var listbox=Δ.ctrl.listbox.fn.create(context);
						listbox.selectByValue(val);
						listbox.onafteritemselected=function(args){
							var val = args.ctrl.getValue();
							var text = args.ctrl.getText();
							ctrl.setValue(val);
							ctrl.setText(text);
							ctrl.popup.hide();
							if(ctrl.onvaluechanged)Δ.raise(ctrl.onvaluechanged,{"ctrl":ctrl,"value":val,"text":text,"item":args.item,"parent":ctrl.parent});
						};
						ctrl.popup.ctrl=listbox;
						ctrl.popup.frameObj.append(listbox.frameObj);
						break;
					case "grid":
						var gridbox=Δ.ctrl.gridbox.fn.create(context);
						gridbox.selectByValue(val);
						gridbox.onafterrowselected=function(args){
							var val = args.ctrl.getValue();
							var text = args.ctrl.getText();
							ctrl.setValue(val);
							ctrl.setText(text);
							ctrl.popup.hide();
							if(ctrl.onvaluechanged)Δ.raise(ctrl.onvaluechanged,{"ctrl":ctrl,"value":val,"text":text,"row":args.row,"parent":ctrl.parent});
						};
						ctrl.popup.ctrl=gridbox;
						ctrl.popup.frameObj.append(gridbox.frameObj);
						break;
					case "tree":
						var treebox=Δ.ctrl.treebox.fn.create(context);
						treebox.selectByValue(val);
						treebox.onafternodeselected=function(args){
							var val = args.ctrl.getValue();
							var text = args.ctrl.getText();
							ctrl.setValue(val);
							ctrl.setText(text);
							ctrl.popup.hide();
							if(ctrl.onvaluechanged)Δ.raise(ctrl.onvaluechanged,{"ctrl":ctrl,"value":val,"text":text,"node":args.node});
						};
						ctrl.popup.ctrl=treebox;
						ctrl.popup.frameObj.append(treebox.frameObj);
						break;
					case "menu":
						setting["width"]="auto";
						var menu=Δ.ctrl.menu.fn.create(context);
						menu.onafternodeselected=function(args){
							ctrl.setValue(args.value);
							ctrl.setText(args.text);
							ctrl.popup.hide();
							if(ctrl.onvaluechanged)Δ.raise(ctrl.onvaluechanged,{"ctrl":ctrl,"value":args.value,"text":args.text,"node":args.node});
						};
						ctrl.popup.onhide=function(){
							menu.retractNode();
						};
						ctrl.popup.ctrl=menu;
						ctrl.popup.frameObj.append(menu.frameObj);
						break;
				}
				$("body").append(ctrl.popup.frameObj);
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
				ctrl.valueObj.bind({
					"change":function(){
						ctrl.valueChange();
					}
				});
			}
			,bodyClick:function(ctrl,e){
				var elem=e.srcElement || e.target;
				if(ctrl.popup){
					if(ctrl.popup.frameObj._isNotChildAndSelf(elem) && ctrl.frameObj._isNotChildAndSelf(elem)){
						ctrl.popup.hide();
						if(ctrl.onlostfocus)Δ.raise(ctrl.onlostfocus,{"ctrl":ctrl,"value":ctrl.getValue(),"text":ctrl.getText()});
					}
				}else if(ctrl.frameObj._isNotChildAndSelf(elem)){
					if(ctrl.onlostfocus)Δ.raise(ctrl.onlostfocus,{"ctrl":ctrl,"value":ctrl.getValue(),"text":ctrl.getText()});
				}
			}
			,dropClick:function(ctrl){
				var l = ctrl.frameObj.offset().left;
				var t = ctrl.frameObj.offset().top;
				var h = ctrl.frameObj.outerHeight();
				if(!ctrl.popup)this.createPopup(ctrl);
				else{
					ctrl.dataBinding();
					ctrl.selectByValue();
				}
				if(ctrl.popupwidth>0)ctrl.popup.show(l,t+h-1,ctrl.popupwidth);
				else{
					if(ctrl.box=="menu"){
						ctrl.popup.show(l,t+h-1);
					}else{
						ctrl.popup.show(l,t+h-1,ctrl.frameObj.width());
					}
				}
			}
			,mouseOver:function(ctrl){
				ctrl.styles.frameStyle.setOver();
				ctrl.drop.setState("over");
			}
			,mouseOut:function(ctrl){
				ctrl.styles.frameStyle.setNormal();
				ctrl.drop.setState("normal");
			}
			,boxClick:function(ctrl,e){
				var elem=e.srcElement || e.target;
				ctrl.frameObj.each(i,function(){
					ctrl.selectItem(elem,i);
				});
			}
		}
	};
})(jQuery,tptps);