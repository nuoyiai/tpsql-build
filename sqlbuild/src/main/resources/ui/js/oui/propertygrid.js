(function($,Δ,δ){
	Δ.ctrl.propertygrid=δ={
		/* 控件样式配置 */
		styles:function(){
			this.frameStyle="property-frameStyle";
			this.tableStyle="property-tableStyle";
			this.rowStyle="property-rowStyle";
			
			this.headRowStyle="property-head-rowStyle";
			this.catalogRowStyle="property-catalog-rowStyle";
			
			this.cellStyle="property-cellStyle";
			this.iconCellStyle="property-icon-cellStyle";
			this.nameCellStyle="property-name-cellStyle";
			this.catalogCellStyle="property-catalog-cellStyle";
			
			this.itemboxStyle="property-itembox-frameStyle";
		}
		/* 表头对像 */
		,head:function(ctrl){
			this.frameObj=null;
			
			this.buildElement=function(){
				
			};
		}
		/* 分类 */
		,catalog:function(ctrl,name){
			this.ctrl=ctrl;
			this.nodes=[];					//子节集合
			this.name=name;
			this.extended=true;				//展开的
			
			this.buildElement=function(){
				var f={css:{},attr:{}},n={attr:{}},i={attr:{}};
				with(this.ctrl){
					f.attr["class"]=styles.rowStyle;
					f.css["height"]=rowHeight;
					i.attr["class"]=styles.iconCellStyle;
					n.attr["class"]=styles.catalogCellStyle;
				}
				this.frameObj = $("<tr>").attr(f.attr).css(f.css);
				var iconTd = $("<td>").attr(i.attr);
				var nameTd = $("<td colspan=\"2\" >").attr(n.attr);
				nameTd.text(name);
				this.frameObj.append(iconTd);
				this.frameObj.append(nameTd);
			};
			/* 展开分类 */
			this.extend=function(){
				for(var i=0;i<this.nodes.length;i++){
					this.nodes[i].show();
				}
			};
			/* 收拢分类 */
			this.retract=function(){
				for(var i=0;i<this.nodes.length;i++){
					this.nodes[i].hide();
				}
			};
		}
		/* 属性节点 */
		,node:function(ctrl,index,dataIndex,pNode){
			this.ctrl=ctrl;
			this.frameObj=null;
			this.iconObj=null;
			this.cellObj=null;
			this.children=[];					//子节点
			this.index=index;					//节点索引
			this.dataIndex=dataIndex;			//节点数据索引
			this.parentNode=pNode;				//父节点对像
			this.extended=false;
			
			this.buildElement=function(){
				var f={css:{},attr:{}},i={attr:{}},c={attr:{}},n={attr:{}};
				with(this.ctrl){
					f.attr["class"]=styles.rowStyle;	
					f.css["height"]=rowHeight;
					c.attr["class"]=styles.cellStyle;
					n.attr["class"]=styles.nameCellStyle;
					i.attr["class"]=styles.iconCellStyle;
				}
				this.frameObj = $("<tr>").attr(f.attr).css(f.css);
				var iconTd = $("<td>").attr(i.attr);
				var nameTd = $("<td>").attr(n.attr);
				this.cellObj = $("<td>").attr(c.attr);
				
				var node = this.getNode();
				nameTd.append("<label>"+node.name+"</label>");

				if(node.editor){
					var propVal = this.ctrl.dao.getValue(node);
					if(node.readonly){
						this.cellObj.append("<label>"+propVal+"</label>");
					}else{
						var ctrl = δ.fn.createControl(this.ctrl,this,node);
						if(ctrl){
							ctrl.setValue(propVal);
							this.cellObj.append(ctrl.frameObj);
							if(this.ctrl.onlostfocus){
								var onlostfocus = this.ctrl.onlostfocus;
								ctrl.onlostfocus=function(args){
									args["node"]=node;
									Δ.raise(onlostfocus,args);
								}
							}
						}
					}
				}
				
				if(node.children && node.children.length>0){
					this.iconObj = Δ.widget.graph.getElement("plusMinus","plus","<span>");
					iconTd.append(this.iconObj);
				}
				
				this.frameObj.append(iconTd);
				this.frameObj.append(nameTd);
				this.frameObj.append(this.cellObj);
				this.buildChildren();
			};
			/* 构造子节点 */
			this.buildChildren=function(){
				var children = this.ctrl.dao.getNodeChildren(this.getDataIndexs());
				if(children && children.length>0){
					for(var i=0;i<children.length;i++){
						var node = new δ.node(this.ctrl,i,i,this);
						node.buildElement();
						this.children.push(node);
					}
				}
			};
			/* 展开节点 */
			this.extend=function(){
				this.extended=true;
				for(var i=0;i<this.children.length;i++){
					this.children[i].show();
				}
			};
			/* 收拢子节点 */
			this.retract=function(){
				this.extended=false;
				for(var i=0;i<this.children.length;i++){
					this.children[i].hide();
				}
			};
			/* 得到节点 */
			this.getNode=function(){
				var node = this.ctrl.dao.getNode(this.getDataIndexs());
				return node;
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
			/* 显示节点 */
			this.show=function(){
				this.frameObj.show();
				if(this.extended)this.extend();
			};
			/* 隐藏节点 */
			this.hide=function(){
				this.frameObj.hide();
				if(this.extended){
					for(var i=0;i<this.children.length;i++)this.children[i].hide();
				}
			};
			/* 设置属性的值 */
			this.setValue=function(value){
				var node = this.getNode();
				var propVal = this.ctrl.dao.getValue(node)+"";
				if(propVal!=value)this.ctrl.dao.setValue(node,value);
			};
			this.format=function(){
				
			};
		}
		/* 控件对像 */
		,control:function(){
			Δ.ctrl.base.control.call(this);
			this.styles=new δ.styles();
			this.width="100%";
			this.rowHeight=22;
			this.catalogs=[];
			this.nodes=[];
			this.head=null;
			this.tableObj=null;
			this.target=null;				//当前设置控件对像
			this.onlostfocus="";
			
			this.buildElement=function(){
				var f={css:{},attr:{}},t={css:{},attr:{}};
				with(this.styles){
					f.attr["class"]=frameStyle;
					t.attr["class"]=tableStyle;
					if(this.id)f.attr["id"]=this.id;
				}
				if(this.style)f.attr["style"]=this.style;
				this.frameObj=$("<span>").attr(f.attr).css(f.css);
				this.frameObj.ctrl(this);
				this.tableObj=$("<table cellpadding=\"0\" cellspacing=\"1\" >").attr(t.attr).css(t.css);
				this.frameObj.append(this.tableObj);
				this.setWidth(this.width);
			};
			this.clear=function(){
				this.tableObj.empty();
				this.nodes=[];
				this.catalogs=[];
			};
			this.dataBinding=function(data){
				this.clear();
				if(Δ.isJsonData(data)){			//外部传入的数据源
					this.dao = Δ.ctrl.dao.fn.createPropertyTree(data);
				}
				if(this.dao){
					var tree = this.dao.getTree();
					var catalogMap = {};
					if(tree && tree.constructor==Array){
						for(var i=0;i<tree.length;i++){
							var cname = tree[i].catalog;
							if(cname && !catalogMap[cname]){
								var catalog = new δ.catalog(this,cname);
								catalog.buildElement();
								this.catalogs.push(catalog);
								this.tableObj.append(catalog.frameObj);
								catalogMap[cname] = catalog;
							}
							var node = new δ.node(this,i,i);
							node.buildElement();
							this.nodes.push(node);
							this.tableObj.append(node.frameObj);
							if(cname)catalogMap[cname].nodes.push(node);
						}
					}
				}
			};
			this.propertiesInitialized=function(){
				if(this.data)this.dao = Δ.ctrl.dao.fn.createPropertyTree(this.data);
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
				return ctrl;
			}
			,createControl:function(ctrl,node,setting){
				var editor;
				setting["width"]="100%";
				setting["design"]="false";
				var context = {"setting":setting};
				switch(setting.editor){
					case "combobox":
						editor=Δ.ctrl.combobox.fn.create(context);
						break;
					case "textbox":
						editor=Δ.ctrl.textbox.fn.create(context);
						editor.onlostfocus=function(args){
							node.setValue(args.text);
						};
						break;
					case "numspin":
						editor=Δ.ctrl.numspin.fn.create(context);
						editor.onlostfocus=function(args){
							node.setValue(args.text);
						};
						break;
					case "datebox":
						editor=Δ.ctrl.datebox.fn.create(context);
						break;
					case "checkbox":
						editor=Δ.ctrl.checkbox.fn.create(context);
						break;
					case "items":
						editor=Δ.ctrl.itemsbox.fn.create(context);
						editor.onok=function(args){
							node.setValue(args.data);
						};
						break;
						
				}
				if(editor)editor.frameObj.css("border","0");
				return editor;
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
						δ.fn.boxClick(ctrl,e)
					}
				});
			}
			,boxClick:function(ctrl,e){

			}
		}
	}
})(jQuery,tptps);

(function($,Δ,δ){
	Δ.ctrl.itemsbox=δ={
		/* 控件样式配置 */
		styles:function(){
			this.frameStyle={"active":"input-frameStyle-active","normal":"input-frameStyle-normal","over":"input-frameStyle-over"};		//控件外框样式
			this.textStyle="input-textStyle";				//文本框样式
		}
		,control:function(){
			this.frameObj=null;
			this.styles=new δ.styles();
			this.drop=new Δ.widget.icon("prop","normal");
			this.prompt="(集合)";
			this.onok="";
			this.oncannel="";
			
			this.buildElement=function(){
				this.drop.buildElement();
				this.frameObj=$("<div>");
				this.textObj=$("<input type=text disabled />").attr("class",this.styles.textStyle);
				this.textObj.val(this.prompt);
				this.textObj.css("margin-right",22);
				this.frameObj.append(this.textObj);
				this.drop.frameObj.css("margin-right",2);
				this.frameObj.append(this.drop.frameObj);
				this.grid.frameObj.css("border",0);
				this.panel.hide();
			};
			this.setValue=function(value){
				if(!this.grid.datatable){
					this.grid.datatable=Δ.ctrl.dao.fn.createDataTable(value);
				}else{
					with(this.grid.datatable){
						table=items.table;
					}
				}
				this.grid.columns = value.columns;
				this.grid.rebuildElement();
			};
		}
		,construct:function(context){
			var ctrl = this.fn.create(context);
			return ctrl;
		}
		,fn:{
			create:function(context){
				var html="<panel name=\"panel\" width=\"600\" height=\"450\" buttons=\"closeWin\" >";
				html+="<gridview name=\"grid\" design=\"false\" check=\"true\" style=\"margin-top:1px;\" ></gridview>";
				html+="<div style=\"margin-top:5px;text-align:center\">"
				html+="<button name=\"ok\" value=\"确定\" ></button>";
				html+="&nbsp;";
				html+="<button name=\"cancel\" value=\"取消\" ></button>";
				html+="</div>";
				html+="</panel>";
				var ctrl = new δ.control();
				var complex = Δ.ctrl.complex(html);
				for(var nm in complex)ctrl[nm]=complex[nm];
				this.setPropertys(ctrl);
				this.addEvents(ctrl);
				return ctrl;
			}
			,setPropertys:function(ctrl){		//设置控件属性
				ctrl.buildElement();
				ctrl.styles.frameStyle=Δ.dynamic.assign(ctrl.styles.frameStyle,ctrl.frameObj);
			}
			,addEvents:function(ctrl){
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
				ctrl.ok.onclick=function(){
					δ.fn.okClick(ctrl);
				};
				ctrl.cancel.onclick=function(){
					δ.fn.cancelClick(ctrl);
				};
			}
			,dropClick:function(ctrl){
				ctrl.panel.show(300,200);
			}
			,mouseOver:function(ctrl){
				ctrl.styles.frameStyle.setOver();
				ctrl.drop.setState("over");
			}
			,mouseOut:function(ctrl){
				ctrl.styles.frameStyle.setNormal();
				ctrl.drop.setState("normal");
			}
			,okClick:function(ctrl){
				if(ctrl.onok){
					Δ.raise(ctrl.onok,{"ctrl":this,"data":ctrl.grid.datatable.table});
				}
				ctrl.panel.hide();
			}
			,cancelClick:function(ctrl){
				ctrl.panel.hide();
			}
		}
	}
})(jQuery,tptps);