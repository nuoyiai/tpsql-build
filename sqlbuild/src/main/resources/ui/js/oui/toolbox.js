//////////////////////////////////////////////////////
/////   Author: Zhu Sheng Wei (Nov-9th 1980)       ///
////    Nff WebUI Javascript Control ToolBox	  ////
//////////////////////////////////////////////////////

(function($,Δ,δ){
	Δ.ctrl.toolbox=δ={
		/* 控件事件 */
		events:function(){
			this.onSelectChange="";			//选中节点事件
			this.onDrag="";					//节点拖动事件
		}
		/* 控件样式配置 */
		,styles:function(){
			this.frameStyle="toolbox-frameStyle";
			this.bodyStyle="toolbox-bodyStyle";
			this.childrenStyle="toolbox-childrenStyle";
			this.catalogStyle={"normal":"toolbox-catalogStyle-normal","over":"toolbox-catalogStyle-over","select":"toolbox-catalogStyle-select"};
			this.itemStyle={"normal":"toolbox-itemStyle-normal","over":"toolbox-itemStyle-over","select":"toolbox-itemStyle-select"};
			this.textStyle={"normal":"toolbox-textStyle-normal","select":"toolbox-textStyle-select"};
			this.iconStyle={"normal":"toolbox-iconStyle-normal","select":"toolbox-iconStyle-select"};
		}
		,node:function(ctrl,index,dataIndex,pNode){
			Δ.ctrl.base.drag.call(this);				//继承拖动方法
			this.frameObj=null;
			this.textObj=null;
			this.index=index;
			this.dataIndex=dataIndex;
			this.ctrl=ctrl;
			this.extended=false;
			this.isCatalog=true;
			this.children=null;
			this.parentNode=pNode;
			this.imageObj=null;
			this.nodedrag=false;					//节点是否可以拖动		
			
			this.buildElement=function(){
				with(this.ctrl){
					var i={css:{},attr:{}},l={css:{},attr:{}};
					i.css["line-height"]=rowHeight+"px";
					i.attr["indexs"]=this.getIndexs().join(",");
					this.frameObj=$("<li>").css(i.css).attr(i.attr);
					if(this.isCatalog){
						this.imageObj=$("<input type=button >");
						this.frameObj.append(this.imageObj);
					}
					var text = datatree.getNodeText(this.getDataIndexs());
					this.textObj=$("<label>");
					this.textObj.text(text);
					this.frameObj.append(this.textObj);
					this.setNodeStyle("normal");
				}
			};
			/* 得到节点数据对像 */
			this.getNode=function(){
				return this.ctrl.datatree.getNode(this.getDataIndexs());
			}
			/* 展开节点 当参数flag为真时,会同时展开子节点 */
			this.extend=function(){
				with(this.ctrl){
					if(!this.isCatalog)return;
					var nodeChildren = datatree.getNodeChildren(this.getDataIndexs());
					if(nodeChildren){
						if(this.children==null)this.children=[];
						if(this.childrenObj==null){
							var c={css:{},attr:{}};
							c.attr["class"]=styles.childrenStyle;
							this.childrenObj = $("<ul>").attr(c.attr).css(c.css);
							this.frameObj.append(this.childrenObj);
						}
							
						for(var i=0;i<nodeChildren.length;i++){
							var node = new δ.node(this.ctrl,i,i,this);
							node.isCatalog=false;
							node.buildElement();
							this.children.push(node);
							this.childrenObj.append(node.frameObj);
						}
						this.extended=true;
						this.resetImage();
					}
				}
			};
			/* 收拢子节点 */
			this.retract=function(){
				if(this.children && this.children.length){
					for(var i=0;i<this.children.length;i++){
						var n=this.children[i];
						if(n && n.extended)n.retract();
					}
					this.childrenObj.remove();
					this.childrenObj=null;
					this.children=null;
					this.extended=false;
					this.resetImage();
				}
			};
			/* 节点是否选中 */
			this.isSelected=function(){
				if(this.isCatalog){
					return this.frameObj.attr("class")==this.ctrl.styles.catalogStyle.select;
				}else{
					return this.frameObj.attr("class")==this.ctrl.styles.itemStyle.select;
				}
			};
			/* 选中节点 参数flag为真时表示选中，为非时表示取消选中 */
			this.setSelected=function(flag){
				with(this.ctrl){
					if(!multiselect){			//是否为多选,单选情况下，清除其他选中项
						for(var i=0;i<nodes.length;i++)nodes[i].setNodeStyle("normal",true);
					}
					
					if(flag)this.setNodeStyle("select");
					else this.setNodeStyle("normal");
					
					if(events.onSelectChange)Δ.raise(events.onSelectChange,{"ctrl":this.ctrl});
				}
			};
			/* 得到节点的全路径索引 */
			this.getIndexs=function(){
				var indexs = [];
				if(this.parentNode!=null){
					var pIndexs = this.parentNode.getIndexs();
					for(var i=0;i<pIndexs.length;i++){
						indexs.push(pIndexs[i]);
					}
				}
				indexs.push(this.index);
				return indexs;
			};
			/* 得到节点的全路径数据索引 */
			this.getDataIndexs=function(){
				var indexs = [];
				if(this.parentNode!=null){
					var pIndexs = this.parentNode.getDataIndexs();
					for(var i=0;i<pIndexs.length;i++){
						indexs.push(pIndexs[i]);
					}
				}
				indexs.push(this.dataIndex);
				return indexs;
			};
			this.resetImage=function(){
				if(this.isCatalog){
					if(this.extended){
						if(this.isSelected()) Δ.widget.graph.setElement("rightDownTriangle6","white",this.imageObj);
						else Δ.widget.graph.setElement("rightDownTriangle6","black",this.imageObj);
					}
					else{
						if(this.isSelected()) Δ.widget.graph.setElement("rightHollowTriangle5","white",this.imageObj);
						else Δ.widget.graph.setElement("rightHollowTriangle5","black",this.imageObj);
					}
					if(this.isSelected())Δ.dynamic.setToNormal(this.imageObj,this.ctrl.styles.iconStyle);
					else Δ.dynamic.setToSelect(this.imageObj,this.ctrl.styles.iconStyle);
				}
			};
			this.setNodeStyle=function(state,flag){
				with(this.ctrl){
					var nodeStyle = (this.isCatalog)?styles.catalogStyle:styles.itemStyle;
					switch(state){
						case "normal":
							Δ.dynamic.setToNormal(this.textObj,styles.textStyle);
							Δ.dynamic.setToNormal(this.frameObj,nodeStyle);
							break;
						case "select":
							Δ.dynamic.setToSelect(this.textObj,styles.textStyle);
							Δ.dynamic.setToSelect(this.frameObj,nodeStyle);
							break;
						case "over":
							Δ.dynamic.setToOver(this.frameObj,nodeStyle);
							break;
					}
				}
				this.resetImage();
				if(flag && this.children){
					for(var i=0;i<this.children.length;i++){this.children[i].setNodeStyle(state,flag);}
				}
			};
		}
		,control:function(){
			Δ.ctrl.base.control.call(this);
			this.datatree=null;
			this.events=new δ.events();
			this.styles=new δ.styles();
			this.width="100%";
			this.rowHeight=22;
			this.nodes=[];
			this.multiselect=false;
			this.bodyObj=null;
			
			this.buildElement=function(){
				var f={css:{},attr:{}},b={css:{},attr:{}};
				with(this.styles){
					f.attr["class"]=frameStyle;
					b.attr["class"]=bodyStyle;
				}
				if(this.style)f.attr["style"]=this.style;
				this.frameObj=$("<div onselectstart=\"return false;\" >").attr(f.attr).css(f.css);
				this.bodyObj=$("<ul>").attr(b.attr).css(b.css);
				this.frameObj.append(this.bodyObj);
				this.setWidth(this.width);
			};
			this.clear=function(){
				this.bodyObj.empty();
				this.nodes=[];
			};
			this.dataBinding=function(){
				this.clear();
				var tree = this.datatree.getTree();
				if(tree.constructor==Array){
					for(var i=0;i<tree.length;i++){
						var node = new δ.node(this,i,i);
						node.buildElement();
						node.extend();
						this.nodes.push(node);
						this.bodyObj.append(node.frameObj);
					}
				}
			};
			this.getNodeByIndexs=function(indexs){
				var node = null,index=0;
				for(var i=0;i<indexs.length;i++){
					index = indexs[i];
					node = (i==0)?this.nodes[index]:node.children[index];
				}
				return node;
			};
			this.cannelSelect=function(){
				for(var i=0;i<this.nodes.length;i++){
					this.nodes[i].setSelected(false);
				}
			};
			this.getValue=function(){

			};
			this.getText=function(){

			};
			this.propertiesInitialized=function(){
				if(this.data)this.datatree = Δ.ctrl.dao.fn.createDataTree(this.data);
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
				ctrl.dataBinding();
				return ctrl;
			}
			,setPropertys:function(ctrl){		//设置控件属性
				if (ctrl.ctrlSet!=null){
					Δ.setPropertiesRecursive(ctrl,ctrl.ctrlSet,false);
					ctrl.buildElement();
				}
			}
			,addEvents:function(ctrl){
				$("body").bind({
					"click":function(e){
						δ.fn.bodyClick(ctrl,e)
					}
					,"mouseup":function(e){
						δ.fn.mouseUp(ctrl,e);
					}
					,"mousemove":function(e){
						δ.fn.mouseMove(ctrl,e);
					}
				});
				ctrl.frameObj.bind({
					"mouseover":function(e){
						δ.fn.mouseOver(ctrl,e)
					}
					,"mouseout":function(e){
						δ.fn.mouseOut(ctrl,e)
					}
					,"mousedown":function(e){
						δ.fn.mouseDown(ctrl,e);
					}
					,"click":function(e){
						δ.fn.boxClick(ctrl,e)
					}
				});
			}
			,bodyClick:function(ctrl,e){
				var elem=e.srcElement || e.target;
				if(!ctrl.frameObj.find(elem).length){
					ctrl.cannelSelect();
				}
			}
			,getEventNode:function(ctrl,e){
				var elem=e.srcElement || e.target;
				var nodeElement = (elem.tagName=="LI")?$(elem):$(elem).parent("li");
				if(nodeElement.length){
					var indexs = nodeElement.attr("indexs").split(",");
					var node = ctrl.getNodeByIndexs(indexs);
					return node;
				}
			}
			,mouseOver:function(ctrl,e){
				var node = this.getEventNode(ctrl,e);
				if(node && !node.isSelected())node.setNodeStyle("over");
			}
			,mouseOut:function(ctrl,e){
				var node = this.getEventNode(ctrl,e);
				if(node && !node.isSelected())node.setNodeStyle("normal");
			}
			,mouseDown:function(ctrl,e){
				if(ctrl.nodedrag && Δ.mouse.getButton(e)==0 && ctrl.dragNode==null){
					var node = this.getEventNode(ctrl,e);
					if(node){
						ctrl.dragNode = node;
						node.beginDrag(e.pageX,e.pageY);
					}
				}
			}
			,mouseUp:function(ctrl,e){
				var y = e.pageY;
				var x = e.pageX;
				var node = ctrl.dragNode;
				if(node && node.drag){
					ctrl.dragNode=null;
					node.endDrag();
					var elem = Δ.ctrl.base.fn.getMouseOverElement(x,y);
					if(ctrl.events.onDrag)Δ.raise(ctrl.events.onDrag,{"node":node.getNode(),"target":elem});
				}
			}
			,mouseMove:function(ctrl,e){
				var y = e.pageY;
				var x = e.pageX;
				var node = ctrl.dragNode;
				if(node && node.drag){
					node.draging(x,y);
				}
			}
			,boxClick:function(ctrl,e){
				var elem=e.srcElement || e.target;
				var node = this.getEventNode(ctrl,e);
				if(node){
					if(node.extended)node.retract();
					else node.extend();
					node.setSelected(true);
				}
			}
		}
	}
})(jQuery,tptps);