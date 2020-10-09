//////////////////////////////////////////////////////
/////   Author: Zhu Sheng Wei (Nov-9th 1980)       ///
////    Nff WebUI Javascript Control ListBox	  ////
//////////////////////////////////////////////////////

(function($,Δ,δ){
	Δ.ctrl.listbox=δ={
		/* 控件样式配置 */
		styles:function(){
			this.frameStyle="listbox-frameStyle";
			this.itemStyle={"normal":"listbox-itemStyle-normal","over":"listbox-itemStyle-over","select":"listbox-itemStyle-select"};
			this.iconStyle="listbox-iconStyle";
			this.itemTextStyle="listbox-item-textStyle";
		}
		,item:function(ctrl,index){
			this.ctrl=ctrl;
			this.frameObj=null;
			this.iconObj=null;
			this.textObj=null;
			this.index=index;
			
			this.buildElement=function(){
				with(this.ctrl){
					var i={css:{},attr:{}},l={css:{},attr:{}};
					i.css["line-height"]=rowHeight+"px";
					i.css["width"]=itemwidth;
					l.attr["class"]=styles.itemTextStyle;
					this.frameObj=$("<li>").css(i.css);
					if(icon){
						this.iconObj=Δ.widget.graph.getElement(icon,"normal","<input type=button >").addClass(styles.iconStyle);
						this.frameObj.append(this.iconObj);
					}
					var text = codetable.getText(this.index);
					this.textObj=$("<label>").attr(l.attr);
					this.textObj.text(text);
					this.frameObj.append(this.textObj);
					this.setItemStyle("normal");
				}
			};
			this.getValue=function(){
				if(this.ctrl.codetable){
					return this.ctrl.codetable.getValue(this.index);
				}
			};
			this.getText=function(){
				if(this.ctrl.codetable){
					return this.ctrl.codetable.getText(this.index);
				}
			};
			this.isSelected=function(){
				if(this.iconObj){
					return this.iconObj.attr("state")=="select";
				}else{
					return this.frameObj.attr("class")==this.ctrl.styles.itemStyle.select;
				}
			};
			this.setSelected=function(flag){
				with(this.ctrl){
					if(flag)this.setItemStyle("select");
					else this.setItemStyle("normal");
					if(!multiselect){			//是否为多选,单选情况下，清除其他选中项
						for(var i=0;i<items.length;i++){
							if(items[i]!=this){
								items[i].setItemStyle("normal");
							}
						}
					}
				}
			};
			this.setItemStyle=function(state){
				with(this.ctrl){
					switch(state){
						case "normal":
							Δ.dynamic.setToNormal(this.frameObj,styles.itemStyle);
							if(this.iconObj)Δ.widget.graph.setElement(icon,"normal",this.iconObj);
							break;
						case "select":
							if(this.iconObj){
								Δ.widget.graph.setElement(icon,"select",this.iconObj);
								Δ.dynamic.setToNormal(this.frameObj,styles.itemStyle);
							}else Δ.dynamic.setToSelect(this.frameObj,styles.itemStyle);
							break;
						case "over":
							Δ.dynamic.setToOver(this.frameObj,styles.itemStyle);
							if(this.iconObj)Δ.widget.graph.setElement(icon,"over",this.iconObj);
							break;
					}
				}
			};
		}
		,control:function(){
			Δ.ctrl.base.control.call(this);
			this.codetable=null;
			this.styles=new δ.styles();
			this.width="100%";
			this.itemwidth="100%";
			this.rowHeight=22;
			this.items=[];
			this.multiselect=false;
			this.icon="";
			this.onafteritemselected="";
			
			this.buildElement=function(){
				var f={css:{},attr:{}};
				with(this.styles){
					f.attr["class"]=frameStyle;
				}
				if(this.style)f.attr["style"]=this.style;
				this.frameObj=$("<ul>").attr(f.attr).css(f.css);
				this.setWidth(this.width);
			};
			this.clear=function(){
				this.frameObj.empty();
				this.items=[];
			};
			this.dataBinding=function(data){
				if(Δ.isJsonData(data)){			//外部传入的数据源
					this.codetable = Δ.ctrl.dao.fn.createCodeTable(data);
				}
				this.clear();
				var size = this.codetable.size();
				for(var i=0;i<size;i++){
					var item = new δ.item(this,i);
					item.buildElement();
					this.items.push(item);
					this.frameObj.append(item.frameObj);
				}
				if(this.value)this.selectByValue(this.value);
			};
			this.getItemByIndex=function(itemIndex){
				return this.items[itemIndex];
			};
			this.setValue=function(){
				
			};
			this.getValue=function(){
				var value = "";
				for(var i=0;i<this.items.length;i++){
					var item = this.items[i];
					if(item.isSelected()){
						var val = (this.codetable)?this.codetable.getValue(i):"";
						value+=(value)?","+val:val;
					}
				}
				return value;
			};
			this.getText=function(){
				var text = "";
				for(var i=0;i<this.items.length;i++){
					var item = this.items[i];
					if(item.isSelected()){
						var val = (this.codetable)?this.codetable.getText(i):"";
						text+=(text)?","+val:val;
					}
				}
				return text;
			};
			this.clearSelected=function(){				//清除选中项
				for(var i=0;i<this.items.length;i++){
					this.items[i].setSelected(false);
				}
			};
			this.selectByValue=function(value){
				var item,val;
				if(this.codetable){
					this.clearSelected();
					var vs = (typeof value == "string")?value.split(","):[value];
					for(var i=0;i<this.items.length;i++){
						item=this.items[i];
						val = this.codetable.getValue(item.index);
						for(var j=0;j<vs.length;j++){
							if(vs[j]==val)item.setSelected(true);
						}
					}
				}
			};
			this.propertiesInitialized=function(){
				if(this.data)this.codetable = Δ.ctrl.dao.fn.createCodeTable(this.data);
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
				if(ctrl.design){
					var frame = Δ.design.frame.fn.create(ctrl.frameObj);
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
				ctrl.frameObj.find("li").each(function(i){
					if(elem==this || $(this).find(elem).length){
						var item = ctrl.getItemByIndex(i);
						if(item && !item.isSelected())item.setItemStyle("over");
					}
				});
			}
			,mouseOut:function(ctrl,e){
				var elem=e.srcElement || e.target;
				ctrl.frameObj.find("li").each(function(i){
					if(elem==this || $(this).find(elem).length){
						var item = ctrl.getItemByIndex(i);
						if(item && !item.isSelected())item.setItemStyle("normal");
					}
				});
			}
			,boxClick:function(ctrl,e){
				var elem=e.srcElement || e.target;
				ctrl.frameObj.find("li").each(function(i){
					if(elem==this || $(this).find(elem).length){
						var item = ctrl.getItemByIndex(i);
						if(item){
							item.setSelected(!item.isSelected());
							if(ctrl.onafteritemselected)Δ.raise(ctrl.onafteritemselected,{"ctrl":ctrl,"value":item.getValue(),"text":item.getText(),"item":item});
						}
					}
				});
			}
		}
	}
})(jQuery,tptps);