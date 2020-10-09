//////////////////////////////////////////////////////
/////   Author: Zhu Sheng Wei (Nov-9th 1980)       ///
////    Nff WebUI Javascript Control TextArea	  ////
//////////////////////////////////////////////////////

(function($,Δ,δ){
	Δ.ctrl.textarea=δ={
		/* 控件事件 */
		events:function(){
			this.onClick="";
			this.onLostFocus ="";		//失去焦点事件
		}
		/* 控件样式配置 */
		,styles:function(){
			this.frameStyle="textarea-frameStyle";		//控件外框样式
			this.textStyle="textarea-textStyle";
		}
		,control:function(){
			Δ.ctrl.base.control.call(this);
			this.events=new δ.events();
			this.styles=new δ.styles();
			this.width="96%";
			this.height="50px";
			this.frameObj=null;
			this.textObj=null;
			
			this.buildElement=function(){
				var f={css:{},attr:{}},t={css:{},attr:{}};
				if(this.id){
					t.attr["id"]=this.id;
					f.attr["id"]=this.id+"_frame";
				}
				if(this.name)t.attr["name"]=this.name;
				with(this.styles){
					f.attr["class"]=frameStyle;
					t.attr["class"]=textStyle;
				}
				if(this.style){
					f.attr["style"]=this.style;
				}
				this.frameObj=$("<div>").attr(f.attr);
				this.textObj=$("<textarea style=\"width:100%;height:100%\">").attr(t.attr);
				this.textObj.ctrl(this);
				this.frameObj.append(this.textObj);
				
				if(!(typeof this.style == "string" && this.style.indexOf("width")>-1)){
					if(this.width)this.setWidth(this.width);
				}
				if(!(typeof this.style == "string" && this.style.indexOf("height")>-1)){
					if(this.height)this.setHeight(this.height);
				}
			};
			this.setText =function(text){
				this.textObj.val(text);
			};
			this.setValue =function(value){
				this.setText(value);
			};
			this.getValue=function(){
				return this.getText();
			};
			this.getText=function(){
				var text = this.textObj.val()+"";
				return text;
			};
			this.propertiesInitialized=function(){
				if(this.data)this.dao = Δ.ctrl.dao.fn.createDataField(this.data);
			};
			this.unload=function(){
				this.frameObj.remove();
				$(document).off("click."+this.version);
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
				$(document).on("click."+ctrl.version,function(e){
					δ.fn.bodyClick(ctrl,e)
				});
				ctrl.frameObj.bind({
					"click":function(e){
						δ.fn.buttonClick(ctrl,e)
					}
				});
			}
			,bodyClick:function(ctrl,e){
				var elem=e.srcElement || e.target;
				if(ctrl.frameObj._isNotChildAndSelf(elem)){
					var text = ctrl.textObj.val()+"";
					if(ctrl.value!=text){
                		ctrl.value=text;
					}
					if(ctrl.events.onLostFocus)Δ.raise(ctrl.events.onLostFocus,{"ctrl":ctrl,"value":ctrl.getValue(),"text":text,"target":elem});
				}
			}
			,buttonClick:function(ctrl,e){
				if(ctrl.events.onClick){
					setTimeout(function(){Δ.raise(ctrl.events.onClick,{"ctrl":this});},20);
				}
			}
		}
	}
})(jQuery,tptps);