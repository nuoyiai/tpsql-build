//////////////////////////////////////////////////////
/////   Author: Zhu Sheng Wei (Nov-9th 1980)       ///
////    Nff WebUI Javascript Control Radio		  ////
//////////////////////////////////////////////////////

(function($,Δ,δ){
	Δ.ctrl.radio=δ={
		group:{}
		/* 控件样式配置 */
		,styles:function(){
			this.frameStyle="radio-frameStyle";		//控件外框样式
			this.iconStyle="radio-iconStyle";
			this.textStyle="radio-textStyle";
		}
		,control:function(){
			Δ.ctrl.base.control.call(this);
			this.styles=new δ.styles();
			this.width="";
			this.rowHeight=22;
			this.frameObj=null;
			this.iconObj=null;
			this.textObj=null;
			this.label="";
			this.group="";
			this.onlostfocus="";
			
			this.buildElement=function(){
				var f={css:{},attr:{}},i={css:{},attr:{}};
				if(this.id){
					i.attr["id"]=this.id;
					f.attr["id"]=this.id+"_frame";
				}
				if(this.name)i.attr["name"]=this.name;
				with(this.styles){
					f.attr["class"]=frameStyle;
				}
				if(this.style)f.attr["style"]=this.style;
				this.frameObj=$("<div>").attr(f.attr);
				this.iconObj=Δ.widget.graph.getElement("radio","normal","<input type=button >").addClass(this.styles.iconStyle);
				this.frameObj.append(this.iconObj);
				this.valueObj=$("<input type=hidden />").attr(i.attr).css(i.css);
				this.frameObj.append(this.valueObj);
				this.valueObj.ctrl(this);
				if(this.label){
					this.textObj=$("<label>").attr("class",this.styles.textStyle);
					this.textObj.text(this.label);
					this.frameObj.append(this.textObj);
				}
				this.setWidth(this.width);
			};
			this.setValue=function(value){
				this.valueObj.val(value);
			};
			this.getValue=function(){
				var value = this.valueObj.val()+"";
				return value;
			};
			this.getText=function(){
				return "√";
			};
			this.isSelected=function(){
				return this.iconObj.attr("state")=="select";
			};
			this.setStyle=function(state){
				switch(state){
					case "normal":
						Δ.widget.graph.setElement("radio","normal",this.iconObj);
						break;
					case "select":
						Δ.widget.graph.setElement("radio","select",this.iconObj);
						break;
					case "over":
						Δ.widget.graph.setElement("radio","over",this.iconObj);
						break;
				}
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
				if(!Δ.design || !Δ.design.mode)this.addEvents(ctrl);
				if(Δ.design && Δ.design.mode=="layout"){
					var frame = Δ.design.frame.fn.create(ctrl);
					ctrl.frameObj.append(frame.frameObj);
				}
				if(ctrl.group){
					if(!δ.group[ctrl.group])δ.group[ctrl.group]=[];
					δ.group[ctrl.group].push(ctrl);
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
				$("body").on("click."+ctrl.version,function(e){
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
						δ.fn.radioClick(ctrl,e)
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
				if(!ctrl.isSelected())ctrl.setStyle("over");
			}
			,mouseOut:function(ctrl,e){
				var elem=e.srcElement || e.target;
				if(!ctrl.isSelected())ctrl.setStyle("normal");
			}
			,radioClick:function(ctrl,e){
				var elem=e.srcElement || e.target;
				if(ctrl.frameObj.find(elem).length){
					ctrl.setStyle("select");
					ctrl.setValue(ctrl.value);
					if(ctrl.group){
						for(var i=0;i<δ.group[ctrl.group].length;i++){
							if(δ.group[ctrl.group][i]!=ctrl){
								δ.group[ctrl.group][i].setStyle("normal");
							}
						}
					}
				}
			}
		}
	}
})(jQuery,tptps);