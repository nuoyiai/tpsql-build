(function($,Δ,δ){
	Δ.ctrl.toolbar=δ={
		/* 控件样式配置 */
		styles:function(){
			this.frameStyle="toolbar-frameStyle";			//外框样式
			this.itemStyle={"normal":"toolbar-itemStyle-normal","over":"toolbar-itemStyle-over","select":"toolbar-itemStyle-select"};
			this.iconStyle={"normal":"toolbar-iconStyle-normal","over":"toolbar-iconStyle-over","select":"toolbar-iconStyle-select"};
			this.textStyle={"normal":"toolbox-textStyle-normal","over":"toolbar-textStyle-over","select":"toolbox-textStyle-select"};
		}
		,item:function(ctrl,index){
			this.ctrl=ctrl;
			this.imageObj=null;
			this.textObj=null;
			this.frameObj=null;
			this.index=index;
			
			this.buildElement=function(){
				with(this.ctrl){
					var i={css:{},attr:{}},l={css:{},attr:{}};
					l.attr["class"] = styles.textStyle.normal;
					var text = codetable.getText(this.index);
					this.frameObj=$("<li>").css(i.css);
					this.textObj=$("<span>").attr(l.attr);
					this.textObj.text(text);
					var icon = codetable.getIcon(this.index);
					if(icon){
						//this.imageObj = Δ.widget.graph.getIcon(icon,"<input type=button >");
						//this.imageObj.attr({"class":styles.iconStyle.normal,"title":text});
						//this.frameObj.append(this.imageObj);
						var src = Δ.widget.graph.getImageUrl(icon);
						this.imageObj = $("<image src=\""+src+"\" >").attr({"class":styles.iconStyle.normal,"title":text});
						var lh = this.ctrl.frameObj.css("line-height");
						if(lh){
							this.imageObj.width(lh);
							this.imageObj.height(lh);
						}
						this.frameObj.append(this.imageObj);
					}
					this.frameObj.append(this.textObj);
					this.setItemStyle("normal");
				}
			};
			this.getValue=function(){
				return this.ctrl.codetable.getValue(this.index);
			};
			this.getText=function(){
				return this.ctrl.codetable.getText(this.index);
			};
			this.isSelected=function(){
				return this.frameObj.attr("class")==this.ctrl.styles.itemStyle.select;
			};
			this.setSelected=function(flag){
				with(this.ctrl){
					if(flag)this.setItemStyle("select")
					else this.setItemStyle("normal");
					if(select=="single"){			//是否为多选,单选情况下，清除其他选中项
						for(var i=0;i<items.length;i++){
							if(i!=this.index){
								items[i].setItemStyle("normal");
							}
						}
					}
					
					if(this.ctrl.onafteritemselected)Δ.raise(this.ctrl.onafteritemselected,{"ctrl":this.ctrl});
				}
			};
			this.resetIcon=function(){
				with(this.ctrl){
					if(this.imageObj){
						var icon = codetable.getIcon(this.index);
						if(this.isSelected()) Δ.widget.graph.setElement(icon,"select",this.imageObj);
						else Δ.widget.graph.setElement(icon,"",this.imageObj);
					}
				}
			}
			this.setItemStyle=function(state){
				with(this.ctrl){
					switch(state){
						case "normal":
							Δ.dynamic.setToNormal(this.frameObj,styles.itemStyle);
							Δ.dynamic.setToNormal(this.textObj,styles.textStyle);
							Δ.dynamic.setToNormal(this.imageObj,styles.iconStyle);
							break;
						case "select":
							Δ.dynamic.setToSelect(this.frameObj,styles.itemStyle);
							Δ.dynamic.setToSelect(this.textObj,styles.textStyle);
							break;
						case "over":
							Δ.dynamic.setToOver(this.frameObj,styles.itemStyle);
							break;
					}
				}
				this.resetIcon();
			};
		}
		,control:function(){
			Δ.ctrl.base.control.call(this);
			this.styles=new δ.styles();
			this.codetable=null;
			this.items=[];
			this.width="100%";
			this.select="single";			//single multi unable
			this.onafteritemselected="";
			this.onafteritemclick="";
			
			this.buildElement=function(){
				var f={css:{},attr:{}};
				with(this.styles){
					f.attr["class"]=frameStyle;
				}
				if(this.style)f.attr["style"]=this.style;
				this.frameObj=$("<ul>").css(f.css).attr(f.attr);
				this.setWidth(this.width);
			};
			this.clear=function(){
				this.frameObj.empty();
			};
			this.render=function(){
				
			};
			this.dataBinding=function(){
				this.clear();
				var size = this.codetable.size();
				for(var i=0;i<size;i++){
					var item = new δ.item(this,i);
					item.buildElement();
					this.items.push(item);
					this.frameObj.append(item.frameObj);
				}
			};
			this.getItemByIndex=function(itemIndex){
				return this.items[itemIndex];
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
				if(!Δ.design || !Δ.design.mode)this.addEvents(ctrl);
				ctrl.dataBinding();
				if(Δ.design && Δ.design.mode=="layout"){
					var frame = Δ.design.frame.fn.create(ctrl);
					ctrl.frameObj.append(frame.frameObj);
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
							if(ctrl.select!="unable")item.setSelected(!item.isSelected());
							if(ctrl.events.onItemClick)$.raise(ctrl.events.onItemClick,{"ctrl":this,"value":item.getValue(),"text":item.getText()});
						}
					}
				});
			}
		}
	}
})(jQuery,tptps);