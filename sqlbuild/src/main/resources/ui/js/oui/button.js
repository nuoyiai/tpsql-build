//////////////////////////////////////////////////////
/////   Author: Zhu Sheng Wei (Nov-9th 1980)       ///
////    Nff WebUI Javascript Control Button	  	  ////
//////////////////////////////////////////////////////

(function($,Δ,δ){
	Δ.ctrl.button=δ={
		/* 控件样式配置 */
		styles:function(){
			this.frameStyle="button-frameStyle";		//控件外框样式
		}
		,control:function(){
			Δ.ctrl.base.control.call(this);
			this.styles=new δ.styles();
			this.width=-1;
			this.skin="default";
			this.onclick="";			//点击事件
			this.frameObj=null;
			
			this.buildElement=function(){
				var f={css:{},attr:{}};
				if(this.id)f.attr["id"]=this.id;
				with(this.styles){
					f.attr["class"]=frameStyle+"-"+this.skin;
				}
				if(this.style)f.attr["style"]=this.style;
				this.frameObj=$("<span>").attr(f.attr);
				var label = $("<label>");
				if(this.value)label.text(this.value);
				this.frameObj.append(label);
				if(this.width>0)this.setWidth(this.width);
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
					"click":function(e){
						δ.fn.buttonClick(ctrl,e)
					}
				});
			}
			,buttonClick:function(ctrl,e){
				if(ctrl.onclick){
					setTimeout(function(){Δ.raise(ctrl.onclick,{"ctrl":this,"id":ctrl.id,"name":ctrl.name});},20);
				}
			}
		}
	}
})(jQuery,tptps);