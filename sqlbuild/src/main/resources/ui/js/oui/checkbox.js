//////////////////////////////////////////////////////
/////   Author: Zhu Sheng Wei (Nov-9th 1980)       ///
////    Nff WebUI Javascript Control Checkbox	  ////
//////////////////////////////////////////////////////

(function($,Δ,δ){
	Δ.ctrl.checkbox=δ={
		/* 控件样式配置 */
		styles:function(){
			this.frameStyle="check-frameStyle";		//控件外框样式
			this.iconStyle="check-iconStyle";
			this.textStyle="check-textStyle";
		}
		,control:function(){
			Δ.ctrl.base.control.call(this);
			this.styles=new δ.styles();
			this.width="";
			this.rowHeight=22;
			this.frameObj=null;
			this.iconObj=null;
			this.textObj=null;
			this.checkvalue=1;
			this.value=null;
			this.uncheckvalue=0;
			this.text="";
			this.onvaluechanged="";
			this.onlostfocus="";
			
			this.buildElement=function(){
				var f={css:{},attr:{}},i={css:{},attr:{}};
				with(this.styles){
					f.attr["class"]=frameStyle;
				}
				if(this.id){
					i.attr["id"]=this.id;
					f.attr["id"]=this.id+"_frame";
				}
				if(this.name)i.attr["name"]=this.name;
				if(this.style)f.attr["style"]=this.style;
				this.frameObj=$("<div>").attr(f.attr);
				this.iconObj=Δ.widget.graph.getElement("check","normal","<input type=button >").addClass(this.styles.iconStyle);
				this.frameObj.append(this.iconObj);
				this.valueObj=$("<input type=hidden />").attr(i.attr).css(i.css);
				this.frameObj.append(this.valueObj);
				this.valueObj.ctrl(this);
				if(this.text){
					this.textObj=$("<label>").attr("class",this.styles.textStyle);
					this.textObj.text(this.text);
					this.frameObj.append(this.textObj);
				}
				this.setWidth(this.width);
			};
			this.dataBinding=function(){
				if(this.dao){
					var v = this.dao.getValue();
					this.setValue(v);
				}else{
					var v = this.value;
					this.setValue(v);
				}
			};
			this.setValue=function(value){
				if(value!=undefined){
					if(this.checkvalue==undefined)this.checkvalue = value;
					if(this.checkvalue==value){
						this.setStyle("select");
						this.valueObj.val(this.checkvalue);
					}else{
						if(this.uncheckvalue!=undefined)this.valueObj.val(this.uncheckvalue);
					}
				}
			};
			this.getValue=function(){
				var value = this.valueObj.val()+"";
				return value;
			};
			this.getText=function(){
				return "√";
			};
			this.isChecked=function(){
				return this.iconObj.attr("state")=="select";
			};
			this.setStyle=function(state){
				switch(state){
					case "normal":
						Δ.widget.graph.setElement("check","normal",this.iconObj);
						break;
					case "select":
						Δ.widget.graph.setElement("check","select",this.iconObj);
						break;
					case "over":
						Δ.widget.graph.setElement("check","over",this.iconObj);
						break;
				}
			};
			this.unload=function(){
				this.frameObj.remove();
				$(document).off("click."+this.version);
			};
			this.propertiesInitialized=function(){
				if(this.data)this.dao = Δ.ctrl.dao.fn.createDataField(this.data);
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
				ctrl.dataBinding();
				if(Δ.design && Δ.design.mode=="layout" && ctrl.design){
					var frame = Δ.design.frame.fn.create(ctrl);
					ctrl.frameObj.append(frame.frameObj);
				}else{
					this.addEvents(ctrl);
				}
				return ctrl;
			}
			,setPropertys:function(ctrl){		//设置控件属性
				if (ctrl.ctrlSet!=null){
					Δ.setPropertiesRecursive(ctrl,ctrl.ctrlSet,false);
					ctrl.buildElement();
				}
			}
			,addEvents:function(ctrl){
				$(document).on("click."+ctrl.version,function(e){
					δ.fn.bodyClick(ctrl,e)
				});
				
				ctrl.frameObj.bind({
					"mouseover":function(e){
						δ.fn.mouseOver(ctrl,e)
					}
					,"mouseout":function(e){
						δ.fn.mouseOut(ctrl,e)
					}
					,"click":function(e){
						δ.fn.checkClick(ctrl,e)
					}
				});
			}
			,bodyClick:function(ctrl,e){
				var elem=e.srcElement || e.target;
				if(ctrl.frameObj._isNotChildAndSelf(elem)){
					if(ctrl.onlostfocus)Δ.raise(ctrl.onlostfocus,{"ctrl":ctrl,"value":ctrl.getValue(),"text":ctrl.getText(),"target":elem});
				}
			}
			,mouseOver:function(ctrl,e){
				var elem=e.srcElement || e.target;
				if(!ctrl.isChecked())ctrl.setStyle("over");
			}
			,mouseOut:function(ctrl,e){
				var elem=e.srcElement || e.target;
				if(!ctrl.isChecked())ctrl.setStyle("normal");
			}
			,checkClick:function(ctrl,e){
				var elem=e.srcElement || e.target;
				if(ctrl.frameObj.find(elem).length){
					if(ctrl.isChecked()){
						ctrl.setStyle("normal");
						ctrl.setValue(ctrl.uncheckvalue);
					}else{
						ctrl.setStyle("select");
						ctrl.setValue(ctrl.checkvalue);
					}
				}
			}
		}
	}
})(jQuery,tptps);