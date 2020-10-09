//////////////////////////////////////////////////////
/////   Author: Zhu Sheng Wei (Nov-9th 1980)       ///
////    Nff WebUI Javascript Control Popup Menu	  ////
//////////////////////////////////////////////////////

(function($,Δ,δ){
	Δ.ctrl.menu=δ={
		/* 控件样式配置 */
		styles:function(){
			this.frameStyle="menu-frameStyle";			//外框样式
			this.nodeCellStyle={"head":"menu-node-headStyle","body":"menu-node-bodyStyle","foot":"menu-node-footStyle"};
			this.nodeStyle={"normal":"menu-nodeStyle-normal","over":"menu-nodeStyle-over"};			//节点样式
			this.nodeTextStyle="menu-node-textStyle";			//节点文本样式
			this.iconStyle="menu-iconStyle";			//节点图标样式式
			this.checkStyle="menu-checkStyle";
			this.splitLineStyle="menu-splitLineStyle";
			this.triangleStyle="menu-triangleStyle";
		}
		/* 树型节点 */
		,node:function(menu,index,dataIndex,pNode){
			this.frameObj=null;					//外框标签
			this.menu=menu;						//控件对像
			this.children=null;					//子节点对像集合
			this.textObj=null;					//节点文本标签
			this.imageObj=null;					//图片标签
			this.checkObj=null;
			this.triangleObj=null;
			this.index=index;					//节点索引
			this.dataIndex=dataIndex;			//节点数据索引
			this.parentNode=pNode;				//父节点对像
			this.extended=false;				//节点是否展开
			this.popup=null;
			this.childrenObj=null;
			
			/* 构选节点标签 */
			this.buildElement=function(){
				with(this.menu){
					var n={css:{},attr:{}},i={css:{},attr:{}},t={css:{},attr:{}};
					i.attr["class"]=styles.iconStyle;
					t.attr["class"]=styles.nodeTextStyle;
					n.attr["indexs"]=this.getIndexs().join(",");
					this.frameObj=$("<tr>").attr(n.attr).css(n.css);
					var icon = datamenu.getNodeIcon(this.getDataIndexs());
					if(icon){
						this.imageObj=Δ.widget.graph.getIcon(icon);
						this.imageObj.attr(i.attr);
						this.frameObj.append(this.imageObj);
					}
					var td1 = $("<td>").attr("class",styles.nodeCellStyle.head);
					var td2 = $("<td>").attr("class",styles.nodeCellStyle.body);
					var td3 = $("<td>").attr("class",styles.nodeCellStyle.foot);
					var check = datamenu.getCheckValue(this.getDataIndexs());
					if(check!=null){
						this.checkObj=Δ.widget.graph.getElement("check","normal","<input type=button >");
						this.checkObj.attr({"class":styles.checkStyle});
						td2.append(this.checkObj);
						this.setChecked(check);
					}
					var text = datamenu.getNodeText(this.getDataIndexs());
					this.textObj = $("<label>").attr(t.attr);
					this.textObj.text(text);
					td2.append(this.textObj);
					this.triangleObj=$("<input type=button >").attr({"class":styles.triangleStyle});
					if(this.size()){
						td3.append(this.triangleObj);
					}
					this.setNodeStyle("normal");
					this.frameObj.append(td1);
					this.frameObj.append(td2);
					this.frameObj.append(td3);
				}
			};
			/* 展开节点 当参数flag为真时,会同时展开子节点 */
			this.extend=function(){
				with(this.menu){
					if(this.extended)return;
					var nodeChildren = datamenu.getNodeChildren(this.getDataIndexs());
					if(this.size() && nodeChildren){
						if(this.children==null)this.children=[];
						if(this.popup==null){
							this.popup = new Δ.widget.popup();
							this.popup.buildElement();
							this.popup.frameObj.addClass("shadow-radius");
							$("body").append(this.popup.frameObj);
						}
						if(this.childrenObj==null){
							var c={css:{},attr:{}};
							c.attr["class"]=styles.frameStyle;
							this.childrenObj = $("<table cellpadding=\"0\" cellspacing=\"0\" >").attr(c.attr).css(c.css);
							δ.fn.addEvents(this.menu,this.childrenObj);
							this.popup.frameObj.append(this.childrenObj);
						}
						
						for(var i=0;i<nodeChildren.length;i++){
							var childNode = new δ.node(this.menu,i,i,this);
							childNode.buildElement();
							this.children.push(childNode);
							this.childrenObj.append(childNode.frameObj);
						}
						this.extended=true;
						
						var x = this.frameObj.width()+this.frameObj.offset().left;
						var y = this.frameObj.offset().top;
						this.popup.show(x,y,this.popup.frameObj.width());
					}
					
					var pchildren = (this.parentNode)?this.parentNode.children:this.menu.nodes;
					if(pchildren){
						for(var i=0;i<pchildren.length;i++){
							var n=pchildren[i];
							if(n!=this && n.extended)n.retract();
						}
					}
				}
			};
			/* 收拢子节点 */
			this.retract=function(){
				if(!this.extended)return;
				if(this.size() && this.children){
					for(var i=0;i<this.children.length;i++){
						var n=this.children[i];
						if(n && n.extended)n.retract();
					}
					this.childrenObj.unbind();
					this.childrenObj.empty();
					this.childrenObj.remove();
					this.childrenObj=null;
					this.popup.frameObj.empty();
					this.popup.frameObj.remove();
					this.popup=null;
					this.children=null;
					this.extended=false;
				}
			};
			/* 得到子节点的个数 */
			this.size=function(){
				var nodeChildren = this.menu.datamenu.getNodeChildren(this.getDataIndexs());
				var n = (nodeChildren)?nodeChildren.length:0;
				var m = (this.children)?this.children.length:0;
				return (n>m)?n:m;
			};
			/* 得到节点的值 */
			this.getValue=function(){
				var value = this.menu.datamenu.getNodeValue(this.getDataIndexs());
				return value;
			};
			this.getNode=function(){
				var node = this.menu.datamenu.getNode(this.getDataIndexs());
				return node;
			};
			/* 得到节点的文本 */
			this.getText=function(){
				var text = this.menu.datamenu.getNodeText(this.getDataIndexs());
				return text;
			};
			/* 得到节点的分组 */
			this.getGroup=function(){
				var group = this.menu.datamenu.getNodeGroup(this.getDataIndexs());
				return group;
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
			this.setChecked=function(checked){
				if(this.checkObj){
					Δ.widget.graph.setElement("check",checked?"select":"normal",this.checkObj);
					this.menu.datamenu.setCheckValue(this.getDataIndexs(),checked);
				}
			};
			this.getChecked=function(){
				if(this.checkObj){
					return this.checkObj.attr("state")=="select";
				}
				return false;
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
			this.isChildrenOver=function(){
				if(this.children){
					for(var i=0;i<this.children.length;i++){
						var n=this.children[i];
						if(n.isOver())return true;
					}
				}
				return false;
			};
			this.isOver=function(){
				return this.frameObj.attr("class")==this.menu.styles.nodeStyle.over;
			};
			/* 节点是否选中 */
			this.isSelected=function(){
				
			};
			/* 选中节点 参数flag为真时表示选中，为非时表示取消选中 */
			this.setSelected=function(flag){

			};
			/* 设置节点样式 */
			this.setNodeStyle=function(state,flag){
				with(this.menu){
					switch(state){
						case "normal":
							Δ.dynamic.setToNormal(this.frameObj,styles.nodeStyle);
							break;
						case "select":
							Δ.dynamic.setToSelect(this.frameObj,styles.nodeStyle);
							break;
						case "over":
							Δ.dynamic.setToOver(this.frameObj,styles.nodeStyle);
							break;
					}
				}
			};
		}
		,control:function(){
			Δ.ctrl.base.control.call(this);
			this.datamenu=null;
			this.styles=new δ.styles();
			this.width="auto";
			this.rowHeight=20;
			this.nodes=[];
			this.splitObjs=[];
			this.multiselect=false;
			this.onafternodeselected="";
			
			this.buildElement=function(){
				var f={css:{},attr:{}};
				with(this.styles){
					f.attr["class"]=frameStyle;
				}
				if(this.id)f.attr["id"]=this.id;
				this.frameObj=$("<table cellpadding=\"0\" cellspacing=\"0\" >").css(f.css).attr(f.attr);
				this.frameObj.ctrl(this);
				this.setWidth(this.width);
			};
			this.dataBinding=function(){
				this.nodes=[];
				this.frameObj.empty();
				var tree = this.datamenu.getTree();
				if(tree.constructor==Array){
					for(var i=0;i<tree.length;i++){
						var node = new δ.node(this,i,i);
						node.buildElement();
						if(tree.length==1)node.isRoot=true;
						this.nodes.push(node);
						if(node.getGroup() && i>0 && node.getGroup()!=this.nodes[i-1].getGroup()){
							var l={css:{},attr:{}};
							var lineObj = $("<div>").attr({"class":this.styles.splitLineStyle});
							this.frameObj.append(lineObj);
						}
						this.frameObj.append(node.frameObj);
					}
				}
			};
			this.show=function(){
				if(this.popup)this.popup.show();
				else this.frameObj.show();
			};
			this.hide=function(){
				if(this.popup)this.popup.hide();
				else this.frameObj.hide();
			};
			this.retractNode=function(){
				for(var i=0;i<this.nodes.length;i++)this.nodes[i].retract();
			};
			this.getNodeByIndexs=function(indexs){
				var node = null,index=0;
				for(var i=0;i<indexs.length;i++){
					index = indexs[i];
					node = (i==0)?this.nodes[index]:node.children[index];
				}
				return node;
			};
			this.getSelectNodes=function(){

			};
			this.getValue=function(){

			};
			this.getText=function(){

			};
			this.propertiesInitialized=function(){
				if(this.data)this.datamenu = Δ.ctrl.dao.fn.createDataMenu(this.data,this.valuefield,this.textfield,this.parentfield,this.groupfield,this.iconfield);
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
					ctrl.styles.itemStyle=Δ.dynamic.assign(ctrl.styles.itemStyle);
				}
			}
			,addEvents:function(ctrl,target){
				var elem = target || ctrl.frameObj;
				elem.bind({
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
			,getEventNode:function(ctrl,e){
				var elem=e.srcElement || e.target;
				var nodeElement = (elem.tagName=="TR")?$(elem):$(elem).parents("tr");
				if(nodeElement.length){
					var indexs = nodeElement.attr("indexs").split(",");
					var node = ctrl.getNodeByIndexs(indexs);
					return node;
				}
			}
			,mouseOver:function(ctrl,e){
				var node = this.getEventNode(ctrl,e);
				if(node){
					node.setNodeStyle("over");
					if(node.size())node.extend();
				}
			}
			,mouseOut:function(ctrl,e){
				var x = e.pageX;
				var y = e.pageY;
				var elem=e.srcElement || e.target;
				var node = this.getEventNode(ctrl,e);
				if(node){
					node.setNodeStyle("normal");
					if(node.size() && !node.frameObj._mourseOver(x,y)){
						if(node.popup){
							if(!node.popup.frameObj._mourseOver(x,y))node.retract();
						}
						else{
							node.retract();
						}
					}
				}
			}
			,boxClick:function(ctrl,e){
				var node = this.getEventNode(ctrl,e);
				if(node){
					if(node.checkObj){
						var flag = node.getChecked();
						node.setChecked(!flag);
					}
					if(ctrl.onafternodeselected)Δ.raise(ctrl.onafternodeselected,{"ctrl":ctrl,"node":node,"value":node.getValue(),"text":node.getText()});
				}
			}
		}
	}
})(jQuery,tptps);

(function($,Δ,δ){
	Δ.ctrl.mousemenu=δ={
		control:function(){
			Δ.ctrl.menu.control.call(this);
			this.popup=new Δ.widget.popup();
			
			this.getElement=function(){
				return this.popup.frameObj[0];
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
				Δ.ctrl.menu.fn.addEvents(ctrl);
				this.addEvents(ctrl);
				ctrl.dataBinding();
				return ctrl;
			}
			,addEvents:function(ctrl){
				$("body").bind({
					"mousedown":function(e){
						δ.fn.mouseClick(ctrl,e);
					}
				});
				$(document).bind("selectstart",function(){return false;});
				$(document).bind("contextmenu",function(){return false;});
			}
			,setPropertys:function(ctrl){		//设置控件属性
				if (ctrl.ctrlSet!=null){
					Δ.setPropertiesRecursive(ctrl,ctrl.ctrlSet,false);
					ctrl.buildElement();
					ctrl.popup.buildElement();
					ctrl.popup.frameObj.append(ctrl.frameObj);
					ctrl.styles.itemStyle=Δ.dynamic.assign(ctrl.styles.itemStyle);
				}
			}
			,mouseClick:function(ctrl,e){
				if(e.button==2){
					var y = e.pageY;
					var x = e.pageX;
					var h = ctrl.frameObj.height();
					var w = ctrl.frameObj.width();
					ctrl.popup.show(x,y,w,h);
				}
			}
		}
	}
})(jQuery,tptps);