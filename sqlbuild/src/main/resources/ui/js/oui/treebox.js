//////////////////////////////////////////////////////
/////   Author: Zhu Sheng Wei (Nov-9th 1980)       ///
////    Nff WebUI Javascript Control TreeBox	  ////
//////////////////////////////////////////////////////

(function($,Δ,δ){
	Δ.ctrl.treebox=δ={
		/* 控件样式配置 */
		styles:function(){
			this.frameStyle="treebox-frameStyle";			//外框样式
			this.nodeStyle="treebox-nodeStyle";				//节点样式
			this.nodeTextStyle={"normal":"treebox-node-textStyle-normal","over":"treebox-node-textStyle-over","select":"treebox-node-textStyle-select"};			//节点文本样式
			this.childrenStyle="treebox-childrenStyle";		//子节点外框样式
			this.iconStyle="treebox-iconStyle";				//节点图标样式
			this.checkStyle="treebox-checkStyle";			//节点选择框样式
			this.lineStyle="treebox-lineStyle";				//父节点背景线样式
		}
		/* 树型节点 */
		,node:function(ctrl,index,dataIndex,pNode){				//构造参数 ctrl控件对像 index节点索引 dataIndex数据索引 pNode父节点
			Δ.ctrl.base.drag.call(this);		//继承拖动方法
			this.frameObj=null;					//外框标签
			this.ctrl=ctrl;						//控件对像
			this.children=null;					//子节点对像集合
			this.childrenObj=null;				//子节点标签集合
			this.textObj=null;					//节点文本标签
			this.imageObj=null;					//节点图标标签
			this.checkObj=null;					//节点选择框标签
			this.iconObj=null;					//图标
			this.index=index;					//节点索引
			this.dataIndex=dataIndex;			//节点数据索引
			this.parentNode=pNode;				//父节点对像
			this.isRoot=false;					//是否为根节点
			this.extended=false;				//节点是否展开
			
			/* 构选节点标签 */
			this.buildElement=function(){
				with(this.ctrl){
					var n={attr:{}},i={attr:{}},c={attr:{}};
					n.attr["class"]=styles.nodeStyle;
					i.attr["class"]=styles.iconStyle;
					c.attr["class"]=styles.checkStyle;
					n.attr["indexs"]=this.getIndexs().join(",");
					this.frameObj=$("<li>").attr(n.attr);
					var index =  this.getImageIndex();
					
					this.imageObj = Δ.widget.graph.getElement("treeBranch",images[index],$("<input type=button >").attr(i.attr));
					this.frameObj.append(this.imageObj);
					if(!showline)this.hideLine();
					
					this.iconObj=Δ.widget.graph.getElement("folder","close",$("<input type=button >").attr(i.attr));
					this.frameObj.append(this.iconObj);
					if(!showicon)this.hideIcon();
					
					this.checkObj=Δ.widget.graph.getElement("check","normal",$("<input type=button >").attr(c.attr));
					this.frameObj.append(this.checkObj);
					if(!multiselect)this.checkObj.hide();
					
					
					var text = dao.getNodeText(this.getDataIndexs());
					this.textObj = $("<label>");
					this.textObj.text(text);
					this.frameObj.append(this.textObj);
					var node = dao.getNode(this.getDataIndexs());
					if(node){
						if(node.extended)this.extended=true;
					}
					this.setNodeStyle("normal");
				}
			};
			/* 展开节点 当参数flag为真时,会同时展开子节点 */
			this.extend=function(flag){
				with(this.ctrl){
					var nodeChildren = dao.getNodeChildren(this.getDataIndexs());
					if(this.size() && nodeChildren){
						if(this.children==null)this.children=[];
						if(this.childrenObj==null){
							this.childrenObj = $("<ul>").addClass(styles.childrenStyle);
							if(showline)this.showLine();
							this.frameObj.append(this.childrenObj);
						}
						
						for(var i=0;i<nodeChildren.length;i++){
							var childNode = new δ.node(this.ctrl,i,i,this);
							childNode.buildElement();
							this.children.push(childNode);
							this.childrenObj.append(childNode.frameObj);
							if(flag)childNode.extend(flag);
						}
						this.extended=true;
						this.resetImage();
						this.setIconStyle();
					}
				}
			};
			/* 收拢子节点 */
			this.retract=function(){
				if(this.size() && this.children){
					for(var i=0;i<this.children.length;i++){
						var n=this.children[i];
						if(n && n.extended)n.retract();
					}
					this.childrenObj.remove();
					this.childrenObj=null;
					this.children=null;
					this.extended=false;
					this.resetImage();
					this.setIconStyle();
				}
			};
			/* 得到子节点的个数 */
			this.size=function(){
				var nodeChildren = this.ctrl.dao.getNodeChildren(this.getDataIndexs());
				var n = (nodeChildren)?nodeChildren.length:0;
				var m = (this.children)?this.children.length:0;
				return (n>m)?n:m;
			};
			/* 得到节点的值 */
			this.getValue=function(){
				var value = this.ctrl.dao.getNodeValue(this.getDataIndexs());
				return value;
			};
			/* 得到节点的文本 */
			this.getText=function(){
				var text = this.ctrl.dao.getNodeText(this.getDataIndexs());
				return text;
			};
			/* 得到节点的数据对像 */
			this.getData=function(){
				var node = this.ctrl.dao.getNode(this.getDataIndexs());
				return node;
			};
			/* 得到节点图标的索引 */
			this.getImageIndex=function(){
				var position = this.getPosition();
				var index = -1;
				switch(position){
					case "top":
						if(this.size()>0)index=(this.extended)?11:7;
						else index=3;
						break;
					case "middle":
						if(this.size()>0)index=(this.extended)?9:5;
						else index=1;
						break;
					case "bottom":
						if(this.size()>0)index=(this.extended)?10:6;
						else index=2;
						break;
				}
				return index;
			};
			/* 当展开或收拢子节点时刷新图标 */
			this.resetImage=function(){
				var index =  this.getImageIndex();
				Δ.widget.graph.setElement("treeBranch",this.ctrl.images[index],this.imageObj);
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
			/* 得到节点的位置 */
			this.getPosition=function(){
				if(this.parentNode){
					if(this.index<(this.parentNode.size()-1))return "middle";
					else return "bottom";
				}
				else{
					if(this.isRoot)return "top";
					else{
						if(this.index==0)return "top";
						else if(this.index==(this.ctrl.nodes.length-1))return "bottom";
						else return "middle";
					}
				}
			};
			/* 是否为叶子节点 */
			this.isLeaf=function(){
				var node = this.getData();
				if(node){
					if(node.children && node.children.length)return false;
					else return true;
				}
				return false;
			};
			/* 节点是否选中 */
			this.isSelected=function(){
				return this.textObj.attr("class")==this.ctrl.styles.nodeTextStyle.select;
			};
			/* 是否勾选 */
			this.isChecked=function(){
				if(this.checkObj){
					var state = this.checkObj.attr("state");
					return state=="select";
				}
			};
			/* 显示勾选框 */
			this.showCheck=function(){
				if(this.checkObj)this.checkObj.show();
			};
			/* 隐藏勾选框 */
			this.hideCheck=function(){
				if(this.checkObj)this.checkObj.hide();
			};
			/* 显示图标 */
			this.showIcon=function(){
				if(this.iconObj)this.iconObj.show();
			};
			/* 隐藏图标 */
			this.hideIcon=function(){
				if(this.iconObj)this.iconObj.hide();
			};
			/* 显示线 */
			this.showLine=function(){
				if(this.childrenObj){
					if(this.getPosition()!="bottom")this.childrenObj.addClass(this.ctrl.styles.lineStyle);
				}
				if(this.imageObj){
					var index =  this.getImageIndex();
					Δ.widget.graph.setElement("treeBranch",this.ctrl.images[index],this.imageObj);
				}
			};
			/* 隐藏线 */
			this.hideLine=function(){
				if(this.childrenObj)this.childrenObj.removeClass(this.ctrl.styles.lineStyle);
				if(this.imageObj){
					var index =  this.getImageIndex();
					if(index<4)Δ.widget.graph.setElement("treeBranch",this.ctrl.images[3],this.imageObj);
				}
			};
			/* 选中节点 参数flag为真时表示选中，为非时表示取消选中 */
			this.setSelected=function(flag){
				ctrl.foreachNodes(ctrl.nodes,function(n){
					n.setTextStyle("normal");
				})
				if(flag)this.setTextStyle("select");
				else this.setTextStyle("normal");
			};
			this.setChecked=function(flag){
				ctrl.foreachNodes(ctrl.nodes,function(n){
					if(!n.ctrl.multiselect)n.setCheckStyle("normal",true);			//是否为多选,单选情况下，清除其他选中项
				})
				if(flag)this.setCheckStyle("select");
				else this.setCheckStyle("normal");
			};
			this.setNodeStyle=function(state){
				this.setTextStyle(state);
				this.setCheckStyle(state);
				this.setIconStyle();
			};
			/* 设置节点样式 */
			this.setTextStyle=function(state){
				with(this.ctrl){
					switch(state){
						case "normal":
							Δ.dynamic.setToNormal(this.textObj,styles.nodeTextStyle);
							break;
						case "select":
							Δ.dynamic.setToSelect(this.textObj,styles.nodeTextStyle);
							break;
						case "over":
							Δ.dynamic.setToOver(this.textObj,styles.nodeTextStyle);
							break;
					}
				}
			};
			/* 设置复选框样式 */
			this.setCheckStyle=function(state,flag){
				with(this.ctrl){
					switch(state){
						case "normal":
							if(this.checkObj)Δ.widget.graph.setElement("check","normal",this.checkObj);
							break;
						case "select":
							if(this.checkObj)Δ.widget.graph.setElement("check","select",this.checkObj);
							break;
						case "over":
							if(this.checkObj)Δ.widget.graph.setElement("check","over",this.checkObj);
							break;
					}
				}
				if(flag && this.children){
					for(var i=0;i<this.children.length;i++){this.children[i].setCheckStyle(state,flag);}
				}
			};
			this.setIconStyle=function(){
				if(this.iconObj){
					if(this.isLeaf())Δ.widget.graph.setElement("folder","file",this.iconObj);
					else if(this.extended)Δ.widget.graph.setElement("folder","open",this.iconObj);
					else Δ.widget.graph.setElement("folder","close",this.iconObj);
				}
			};
		}
		/* 控件主体对像 */
		,control:function(){
			Δ.ctrl.base.control.call(this);			//从基类继承属性和方法
			this.dao=null;						//数据访对像
			this.styles=new δ.styles();
			this.width="100%";
			this.height=-1;
			this.rowHeight=20;						//行高
			this.nodes=[];							
			this.check=false;						//是否多选
			this.allowselect=true;					//是否可以选中节点
			this.multiselect=false;
			this.showicon=true;
			this.showline=true;
			this.extendMode="branch";
			this.extendnode="all";					//展开所有节点
			this.images=["treeF","treeT","treeL","treeWhite","treeFplus","treeMplus","treeLplus","treeOplus","treeFminus","treeMminus","treeLminus","treeOminus"];
			this.nodedrag=false;					//节点是否可以拖动		
			this.onbeforenodedrag="";				//节点拖动前触发事件
			this.onafternodedrag="";				//节点拖动后触发事件
			this.onbeforenodeselected="";			//节点选中前触发事件
			this.onafternodeselected="";			//节点选点后触发事件
			
			/* 构造控件Dom标记 */
			this.buildElement=function(){
				var f={css:{},attr:{}};
				with(this.styles){
					f.attr["class"]=frameStyle;
					if(this.id)f.attr["id"]=this.id;
				}
				if(this.style)f.attr["style"]=this.style;
				this.frameObj=$("<ul>").attr(f.attr).css(f.css);
				this.frameObj.ctrl(this);
				this.setWidth(this.width);
				if(this.height>0)this.setHeight(this.height);
			};
			/* 清除节点及Dom标记 */
			this.clear=function(){
				this.frameObj.empty();
				this.nodes=[];
			};
			/* 绑定数据 */
			this.dataBinding=function(){
				this.clear();
				if(this.dao){
					this.dao.rebuildData();
					var tree = this.dao.getTree();
					if(tree){
						if(tree.constructor==Array){
							for(var i=0;i<tree.length;i++){
								var node = new δ.node(this,i,i);
								node.buildElement();
								if(tree.length==1)node.isRoot=true;
								this.nodes.push(node);
								this.frameObj.append(node.frameObj);
							}
						}else{
							var node = new δ.node(this,0,0);
							node.isRoot=true;
							node.buildElement();
							if(this.extendnode!="none")node.extend(true);
							this.nodes.push(node);
							this.frameObj.append(node.frameObj);
						}
						if(this.extendnode=="first" && this.nodes[0].isRoot)this.nodes[0].extend(false);
						else{
							if(this.extendnode=="all"){
								for(var i=0;i<this.nodes.length;i++)this.nodes[i].extend(true);
							}
						}
					}
				}
				if(this.value)this.selectByValue(this.value);
			};
			/* 得到节点索引得到节点 */
			this.getNodeByIndexs=function(indexs){
				var node = null,index=0;
				for(var i=0;i<indexs.length;i++){
					index = indexs[i];
					node = (i==0)?this.nodes[index]:node.children[index];
				}
				return node;
			};
			/* 得到勾选中的节点集合 */
			this.getCheckedNodes=function(){
				var nodes = this.findNodes(this.nodes,function(n){return n.isChecked();});
				return nodes;
			};
			/* 得到选中节点 */
			this.getSelectedNode=function(){
				var nodes = this.findNodes(this.nodes,function(n){return n.isSelected();});
				if(nodes.length)return nodes[0];
			};
			/* 得到选中节点的值，多个值用逗号分隔 */
			this.getValue=function(){
				var value = "";
				var fn = function(n,f){
					var v=(n.isSelected())?n.getValue():"";
					if(n.children){
						var cv="";
						for(var i=0;i<n.children.length;i++){
							cv=f(n.children[i],f);
							if(cv)v+=(v)?","+cv:cv;
						}
					}
					return v;
				};
				for(var i=0;i<this.nodes.length;i++){
					var val = fn(this.nodes[i],fn);
					if(val)value+=(value)?","+val:val;
				}
				return value;
			};
			/* 得到选中节点的名称，多个名称用逗号分隔 */
			this.getText=function(){
				var text = "";
				var fn = function(n,f){
					var v=(n.isSelected())?n.getText():"";
					if(n.children){
						var cv="";
						for(var i=0;i<n.children.length;i++){
							cv=f(n.children[i],f);
							if(cv)v+=(v)?","+cv:cv;
						}
					}
					return v;
				};
				for(var i=0;i<this.nodes.length;i++){
					var val = fn(this.nodes[i],fn);
					if(val)text+=(text)?","+val:val;
				}
				return text;
			};
			/* 查找节点的值是否相等并选中 */
			this.selectByValue=function(value){
				var node,val;
				if(this.dao){
					var vs = (typeof value == "string")?value.split(","):[];
					var fn = function(n,vs,f){
						val = n.getValue();
						for(var j=0;j<vs.length;j++){
							if(vs[j]==val)n.setSelected(true);
						}
						if(n.children){
							for(var i=0;i<n.children.length;i++){
								f(n.children[i],vs,f);
							}
						}
					};
					for(var i=0;i<this.nodes.length;i++){
						fn(this.nodes[i],vs,fn);
					}
				}
			};
			this.render=function(){
				if(!this.dao && this.url){
					Δ.ctrl.loadSrc(this.url,function(data,ctrl){
						if(data){
							var json = Δ.assert.get(function(){return Δ.parseJson(data);},"1301",data);
							ctrl.dao = Δ.ctrl.dao.fn.createDataTree(json);
							ctrl.dataBinding();
						}
					},this);
				}
			};
			this.allowSelect=function(flag){				//是否可以选中节点
				if(arguments.length){
					this.allowselect=flag;
				}else{
					return this.allowselect;
				}
			};
			this.multiSelect=function(flag){
				if(arguments.length){
					this.multiselect=flag;
					if(flag)this.foreachNodes(this.nodes,function(n){n.showCheck();});
					else this.foreachNodes(this.nodes,function(n){n.hideCheck();});
				}else{
					return this.multiselect;
				}
			};
			this.showIcon=function(flag){
				if(arguments.length){
					this.showicon=flag;
					if(flag)this.foreachNodes(this.nodes,function(n){n.showIcon();});
					else this.foreachNodes(this.nodes,function(n){n.hideIcon();});
				}else{
					return this.showicon;
				}
			};
			this.showLine=function(flag){
				if(arguments.length){
					this.showline=flag;
					if(flag)this.foreachNodes(this.nodes,function(n){n.showLine();});
					else this.foreachNodes(this.nodes,function(n){n.hideLine();});
				}else{
					return this.showline;
				}
			};
			this.foreachNodes=function(nodes,fn){				//遍历所有节点，执行操作
				var n;
				if(nodes && nodes.length && fn){
					for(var i=0;i<nodes.length;i++){
						n=nodes[i];
						fn(n);
						if(n.children)this.foreachNodes(n.children,fn);
					}
				}
			};
			this.findNodes=function(nodes,fn){
				var n,ns,list=[];
				if(nodes && nodes.length && fn){
					for(var i=0;i<nodes.length;i++){
						n=nodes[i];
						if(fn(n))list.push(n);
						if(n.children){
							ns=this.findNodes(n.children,fn);
							if(ns.length)for(var j=0;j<ns.length;j++)list.push(ns[i]);
						}
					}
				}
				return list;
			};
			/* 控件赋完初始值后做额外的初始化工作 */
			this.propertiesInitialized=function(){
				if(this.data)this.dao = Δ.ctrl.dao.fn.createDataTree(this.data);			//创建数据操作类
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
			,addEvents:function(ctrl){
				$("body").bind({
					"mouseup":function(e){
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
						δ.fn.mouseDown(ctrl,e)
					}
					,"click":function(e){
						δ.fn.boxClick(ctrl,e)
					}
				});
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
				if(node){
					if(!node.isSelected())node.setTextStyle("over");
					if(!node.isChecked())node.setCheckStyle("over");
				}
			}
			,mouseOut:function(ctrl,e){
				var node = this.getEventNode(ctrl,e);
				if(node){
					if(!node.isSelected())node.setTextStyle("normal");
					if(!node.isChecked())node.setCheckStyle("normal");
				}
			}
			,mouseDown:function(ctrl,e){
				if(ctrl.nodedrag){
					if(Δ.mouse.getButton(e)==0 && ctrl.dragNode==null){
						var node = this.getEventNode(ctrl,e);
						if(node){
							ctrl.dragNode = node;
							node.beginDrag(e.pageX,e.pageY);
						}
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
					if(ctrl.onafternodedrag)Δ.raise(ctrl.onafternodedrag,{"node":node.getNode(),"target":elem});
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
					if(node.checkObj && elem==node.checkObj[0]){
						var cFlag = node.isChecked();
						node.setChecked(!cFlag);
					}else if(elem==node.textObj[0]){
						var cFlag = node.isChecked();
						node.setChecked(!cFlag);
						if(ctrl.allowselect){
							var sFlag = node.isSelected();
							if(!sFlag){
								node.setSelected(true);
								if(ctrl.onafternodeselected)Δ.raise(ctrl.onafternodeselected,{"ctrl":ctrl,"node":node,"value":node.getValue(),"text":node.getText(),"data":node.getData()});
							}
						}
					}else{
						if(node.extended)node.retract();
						else node.extend();
					}
				}
			}
		}
	}
})(jQuery,tptps);