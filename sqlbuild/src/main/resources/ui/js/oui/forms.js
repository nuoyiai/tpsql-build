//////////////////////////////////////////////////////
/////   Author: Zhu Sheng Wei (Nov-9th 1980)       ///
////    Nff WebUI Javascript Control Forms		  ////
//////////////////////////////////////////////////////

(function($,Δ,δ){
	Δ.ctrl.forms=δ={
		/* 控件样式配置 */
		styles:function(){
			this.frameStyle="forms-frameStyle";		//控件外框样式
			this.tableStyle="forms-tableStyle";
			this.rowStyle="forms-rowStyle";
			this.cellStyle="forms-cellStyle";
			this.headCellStyle="forms-head-cellStyle";
			this.placeCellStyle="forms-place-cellStyle";
			this.startCellStyle="forms-start-cellStyle";
		}
		,cell:function(ctrl,row){
			this.ctrl=ctrl;
			this.row=row;
			this.item=null;
			this.children=[];
			this.type="";
			this.editor=null;
			this.startObj=null;
			
			this.buildElement=function(){
				var width = this.getWidth()+"%";
				var cols = this.getColSpan();
				var rows = this.getRowSpan();
				var colspan = (cols>1)?"colspan=\""+cols+"\" ":"";
				var rowspan = (rows>1)?"rowspan=\""+rows+"\" ":"";
				this.frameObj=$("<td "+colspan+rowspan+" >").css({"width":width});
				switch(this.type){
					case "head":{
						this.frameObj.addClass(this.ctrl.styles.headCellStyle);
						var label = $("<label>");
						if(this.ctrl.layout=="query"){
							label.text(this.item.title);
						}else{
							label.text(this.item.title+"：");
						}
						if(!this.item.nullable){
							this.startObj = $("<span>*</span>").addClass(this.ctrl.styles.startCellStyle);
							this.frameObj.append(this.startObj);
						}
						this.frameObj.append(label);
					}break;
					case "content":{
						this.frameObj.addClass(this.ctrl.styles.cellStyle);
						if(this.item.editor && !this.isReadonly()){
							this.editor = δ.fn.createControl(this);
							this.frameObj.append(this.editor.frameObj);
						}else{
							if(this.item.html){
								var elem = $("<div>"+this.item.html+"</div>");
								this.frameObj.append(elem);
							}else{
								var value = this.ctrl.datatable.getFieldValue(0,this.item.field);
								if(this.item.data){
									if(!this.item.codetable)this.item.codetable = Δ.ctrl.dao.fn.createCodeTable(this.item.data);
									text = this.item.codetable.getTextByValue(value,"	");
									var elem = $("<div>"+text+"</div>");
									this.frameObj.append(elem);
								}else{
									var elem = $("<div>"+value+"</div>");
									this.frameObj.append(elem);
								}
							}
						}
					}break;
					case "place":{
						this.frameObj.addClass(this.ctrl.styles.placeCellStyle);
					}break;
					case "html":{
						
					}break;
				}
			};
			this.getColSpan=function(){
				var cols=0;
				if(this.item){
					if(this.type=="content"){
						cols = (this.item.cols)?this.item.cols*2-1:1;
						if(!this.item.title)cols++;
						return cols;
					}
				}
				return 1;
			};
			this.isReadonly=function(){
				if(this.field && this.field.readonly){
					return true;
				}else{
					return this.ctrl.readonly;
				}
			};
			this.getRowSpan=function(){
				if(this.item){
					return (this.item.rows)?this.item.rows:1;
				}
				return 1;
			};
			this.setValue=function(value){
				if(this.ctrl.datatable)this.ctrl.datatable.setFieldValue(this.row.dataIndex,this.item.field,value);
			};
			this.setValueEnd=function(value){
				if(this.ctrl.datatable)this.ctrl.datatable.setFieldValue(this.row.dataIndex,this.item.field+"End",value);
			};
			this.getWidth=function(){
				var rate = 100 / this.ctrl.columns;
				switch(this.type){
					case "head":
						return this.ctrl.ratio*rate;
					case "content":
						var cols = (this.item.cols)?this.item.cols:1;
						if(this.item.title){
							return (cols-this.ctrl.ratio)*rate;
						}else{
							return cols*rate;
						}
					case "place":
						return this.cospan*rate;
				}
			};
		}
		,row:function(ctrl,index,dataIndex){
			this.ctrl=ctrl;
			this.index=index;
			this.cells=[];
			this.items=[];
			this.frameObj=null;
			this.dataIndex=dataIndex;
			
			this.buildElement=function(){
				var cell,frag = document.createDocumentFragment();
				this.frameObj=$("<tr>").addClass(this.ctrl.styles.rowStyle);
				this.buildChildren();
				for(var i=0;i<this.cells.length;i++){
					cell = this.cells[i];
					cell.buildElement();
					frag.appendChild(cell.frameObj[0]);
				}
				this.frameObj.append(frag);
			};
			this.buildChildren=function(){
				var item,cell;
				for(var i=0;i<this.items.length;i++){
					item = this.items[i];
					if(item.title){
						cell=new δ.cell(this.ctrl,this);
						cell.type="head";
						cell.item=item;
						this.cells.push(cell);
					}
					cell=new δ.cell(this.ctrl,this);
					cell.type="content";
					cell.item=item;
					this.cells.push(cell);
				}
				this.stuffCell();
			};
			this.allocateSpace=function(){
				
			};
			this.stuffCell=function(){
				var span=this.ctrl.columns-this.getColSpan();
				if(span>0){
					var cell=new δ.cell(this.ctrl,this);
					cell.type="place";
					cell.colspan=span;
					this.cells.push(cell);
				}
				else return null;
			};
			this.getColSpan=function(){
				var cols = 0;
				for(var i=0;i<this.items.length;i++){
					cols+=this.ctrl.getItemColumn(this.items[i]);
				}
				return cols;
			};
			
		}
		,control:function(){
			Δ.ctrl.base.control.call(this);
			this.styles=new δ.styles();
			this.ratio=0.3;		//宽度占比
			this.rows=[];
			this.items=[];
			this.layout="";				//默认布局方式
			this.readonly=false;
			this.columns=4;				//列数
			this.matrix=[];				//网格矩阵
			this.rowIndex=0;
			this.rended=false;
			
			this.buildElement=function(){
				var f={css:{},attr:{}},t={css:{},attr:{}};
				with(this.styles){
					f.attr["class"]=frameStyle;
					t.attr["class"]=tableStyle;
					if(this.id)f.attr["id"]=this.id;
				}
				if(this.style)f.attr["style"]=this.style;
				this.frameObj=$("<div>").attr(f.attr);
				this.frameObj.ctrl(this);
				this.tableObj=$("<table>").attr(t.attr);
				this.frameObj.append(this.tableObj);
			};
			this.buildChildren=function(){
				var item,row,pos={"row":0,"col":0};
				//创建表单布局和单元格对像
				for(var i=0;i<this.items.length;i++){
					item=this.items[i];
					if(item.hide)continue;
					pos = this.findEmptyPostion(pos.row,item);
					this.fillMatrix(pos,item);
					row = this.rows[pos.row];
					if(!row){
						row = new δ.row(this,pos.row,this.rowIndex);
						this.rows.push(row);
					}
					row.items.push(item);
				}
			};
			this.buildRowsElement=function(){
				var row,frag = document.createDocumentFragment();
				for(var i=0;i<this.rows.length;i++){
					row=this.rows[i];
					row.buildElement();
					frag.appendChild(row.frameObj[0]);
				}
				this.tableObj.append(frag);
			};
			this.fillMatrix=function(pos,item){				//填充网格
				var rows = this.getItemRow(item);
				var cols = this.getItemColumn(item);
				for(var i=0;i<rows;i++){
					if(!this.matrix[pos.row+i]){
						this.matrix[pos.row+i]=[];
						for(var j=0;j<this.columns;j++)this.matrix[pos.row+i][j]=0;
					}
					for(var j=0;j<cols;j++){
						this.matrix[pos.row+i][pos.col+j]=1;
					}
				}
			};
			this.findEmptyPostion=function(row,item){			//查找空白行
				var cols = this.getItemColumn(item);
				if(this.matrix.length>0){
					while(row<this.matrix.length){
						var emptyCount = 0;			//连续空格数量
						for(var i=0;i<this.columns;i++){
							if(!this.matrix[row][i])emptyCount++;
							else emptyCount = 0;
							if(emptyCount==cols)return {"row":row,"col":i+1-cols};
						}
						row++;
					}
					return {"row":row,"col":0};
				}
				
				return {"row":0,"col":0};
			};
			this.render=function(pc){				//呈现dom元素后触发  pc父容器控件
				if(!this.rended){
					if(pc && pc.isHide()){
						δ.fn.addRenderEvent(this,pc.frameObj);
					}else{
						var p = this.frameObj.parents(":hidden");
						if(p.length>0){
							δ.fn.addRenderEvent(this,p);
						}else{
							this.rended=true;
							this.buildChildren();
							this.buildRowsElement();
							this.dataBinding();
						}
					}
					if(this.frameObj.bindVerify)this.frameObj.bindVerify();
				}
			};
			this.getItemColumn=function(item){
				var cols = (item.cols)?parseInt(item.cols):1;
				return cols>this.columns?this.columns:cols;
			};
			this.getItemRow=function(item){
				return (item.rows)?item.rows:1;
			};
			this.clear=function(){
				this.rows=[];
				this.matrix=[];
				this.tableObj.empty();
			};
			this.rebuildElement=function(){
				this.clear();
				this.buildChildren();
				for(var i=0;i<this.rows.length;i++){
					this.rows[i].buildElement();
					this.tableObj.append(this.rows[i].frameObj);
				}
			};
			this.dataBinding=function(data){
				if(Δ.isJsonData(data)){			//外部传入的数据源
					this.datatable = Δ.ctrl.dao.fn.createDataTable(data);
				}
				var row,cell;
				for(var i=0;i<this.rows.length;i++){
					row = this.rows[i];
					for(var j=0;j<row.cells.length;j++){
						cell = row.cells[j];
						if(cell.editor){
							if(this.datatable){
								var value = this.datatable.getFieldValue(this.rowIndex,cell.item.field);
								cell.editor.setValue(value);
								if(cell.editor.setValueEnd){			//区间段的组合控件
									var endVal = this.datatable.getFieldValue(this.rowIndex,cell.item.field+"End");
									cell.editor.setValueEnd(endVal);
								}
								if(cell.editor.dataBinding)cell.editor.dataBinding();
							}
						}
					}
				}
			};
			this.unload=function(){
				this.frameObj.remove();
				$("body").off("click."+this.version);
				δ.fn.removeEvents(this);
			};
			this.propertiesInitialized=function(){
				if(this.data)this.datatable = Δ.ctrl.dao.fn.createDataTable(this.data);
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
				var items = [];
				for(var i=0;i<context.children.length;i++){
					var setting = context.children[i].setting;
					setting["html"] = context.children[i].elem.innerHTML;
					if(!setting.hide)setting["hide"] = false;
					else setting["hide"] = true;
					if(setting.nullable=="false")setting["nullable"] = false;
					else setting["nullable"] = true;
					items.push(setting);
				}
				ctrl["items"]=items;
				this.setPropertys(ctrl);
				if(!Δ.design || !Δ.design.mode)this.addEvents(ctrl);
				if(Δ.design && Δ.design.mode=="layout"){
					var frame = Δ.design.frame.fn.create(ctrl);
					ctrl.frameObj.append(frame.frameObj);
					frame.onselected=function(){
						if(ctrl.onselected)Δ.raise(ctrl.onselected,{"ctrl":ctrl});
					}
				}
				return ctrl;
			}
			,createControl:function(cell){
				var editor;
				var context = {"setting":cell.item};
				switch(cell.item.editor){
					case "combobox":
						editor=Δ.ctrl.combobox.fn.create(context);
						break;
					case "textbox":
						editor=Δ.ctrl.textbox.fn.create(context);
						break;
					case "numspin":
						editor=Δ.ctrl.numspin.fn.create(context);
						break;
					case "numspan":
						editor=Δ.ctrl.numspan.fn.create(context);
						break;
					case "datebox":
						editor=Δ.ctrl.datebox.fn.create(context);
						break;
					case "datespan":
						editor=Δ.ctrl.datespan.fn.create(context);
						break;
					case "checkbox":
						editor=Δ.ctrl.checkbox.fn.create(context);
						break;
					case "radio":
						editor=Δ.ctrl.radio.fn.create(context);
						break;
					case "textarea":
						editor=Δ.ctrl.textarea.fn.create(context);
						break;
					case "gridbox":
						editor=Δ.ctrl.gridbox.fn.create(context);
						break;
					case "listbox":
						editor=Δ.ctrl.listbox.fn.create(context);
						break;
				}
				if(editor){
					editor.onlostfocus=function(args){
						if(args.end){
							cell.setValueEnd(args.value);
						}else{
							cell.setValue(args.value);
						}
					};
				}
				return editor;
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
				if(ctrl.datatable && ctrl.datatable.dataSourceName)Δ.json.addListener(ctrl.datatable.dataSourceName,function(){var v=ctrl.version;ctrl.dataBinding();});
			}
			,removeEvents:function(ctrl){
				if(ctrl.datatable && ctrl.datatable.dataSourceName)Δ.json.removeListener(ctrl.datatable.dataSourceName,function(){var v=ctrl.version;ctrl.dataBinding();});
			}
			,addRenderEvent:function(ctrl,elem){
				elem.bind("render",function(){
					ctrl.render();
				});
			}
			,bodyClick:function(ctrl,e){
				var elem=e.srcElement || e.target;
				if(elem!=ctrl.frameObj[0] && !ctrl.frameObj.find(elem).length){
					if(ctrl.onlostfocus)Δ.raise(ctrl.onlostfocus,{"ctrl":ctrl});
				}
			}
		}
	}
})(jQuery,tptps);