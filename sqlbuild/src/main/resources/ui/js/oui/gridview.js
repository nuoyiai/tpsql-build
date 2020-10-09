//////////////////////////////////////////////////////
/////   Author: Zhu Sheng Wei (Nov-9th 1980)       ///
////    Nff WebUI Javascript Control GridView	  ////
//////////////////////////////////////////////////////

(function($,Δ,δ){
	Δ.ctrl.gridview=δ={
		/* 控件样式配置 */
		styles:function(){
			this.frameStyle="gridview-frameStyle";
			this.headStyle="gridview-headStyle";
			this.headInnerStyle="gridview-head-innerStyle";
			
			this.headColumnStyle="gridview-head-columnStyle";
			this.headColumnTextStyle="gridview-head-column-textStyle";
			this.headColumnDropStyle={"normal":"gridview-head-column-dropStyle-normal","over":"gridview-head-column-dropStyle-over"};
			this.checkColumnStyle="gridview-check-columnStyle";
			
			this.bodyFrameStyle="gridview-body-frameStyle";
			this.bodyStyle="gridview-body-tableStyle";
			this.bodyCellStyle="gridview-body-cellStyle";
			this.bodyCellInnerStyle="gridview-body-cell-innerStyle";
			this.bodyCellTextStyle="gridview-body-cell-textStyle";
			this.bodyRowStyle={"normal":"gridview-body-rowStyle-normal","over":"gridview-body-rowStyle-over","interval":"gridview-body-rowStyle-interval"};
			
			this.lineStyle="gridview-lineStyle";
			this.downStaffStyle="gridview-downStaffStyle";
			
			this.checkStyle="gridview-checkStyle";
			this.checkCellStyle="gridview-check-cellStyle";
			
			this.knobStyle="gridview-knobStyle";
		}
		,column:function(ctrl,head,index){
			Δ.ctrl.base.drag.call(this);				//继承拖动方法
			this.ctrl=ctrl;
			this.head=head;
			this.index=index;
			this.frameObj=null;
			this.textObj=null;
			this.dropObj=null;
			this.item=null;					//配置对像
			this.editor=null;				//编辑控件对像
			this.isHide=false;
			
			this.buildElement=function(){
				with(this.ctrl){
					var f={attr:{},css:{}},t={attr:{},css:{}},d={attr:{}};
					f.attr["class"]=styles.headColumnStyle;
					f.css["width"]=(this.item.width>0)?this.item.width:defaultColumnWidth;
					if(this.item.align)f.css["text-align"]=this.item.align;
					if(this.item.align=="center")t.css["text-indent"]="20";
					t.attr["class"]=styles.headColumnTextStyle;
					t.css["width"]=(this.item.width>0)?this.item.width-20:defaultColumnWidth-20;
					if(this.ctrl.drag)t.css["cursor"]="pointer";
					this.frameObj = $("<div>").attr(f.attr).css(f.css);
					this.textObj = $("<span>").attr(t.attr).css(t.css);
					this.dropObj = $("<div>").attr(d.attr);
					if(this.index==0)this.frameObj.addClass("first");
				}
				
				with(this.item){
					this.textObj.text(title);
					this.frameObj.append(this.textObj);
					this.frameObj.append(this.dropObj);
					if(this.item.hide){
						this.isHide=true;
						this.frameObj.hide();
					}
				}
				
				this.setDropStyle("normal");
			};
			this.getWidth=function(){
				return this.isHide?0:this.frameObj.width();
			};
			this.setWidth=function(width){
				this.frameObj.width(width);
				this.textObj.width(width-20);
				if(this.item.width)this.item.width=width;
				for(var i=0;i<this.ctrl.rows.length;i++){
					var row = this.ctrl.rows[i];
					var cell = row.cells[this.index+this.head.getIndexOffset()];
					cell.setWidth(width);
				}
				this.head.resetInnerWidth();
			};
			this.setDropStyle=function(state){
				with(this.ctrl){
					switch(state){
						case "normal":
							Δ.dynamic.setToNormal(this.dropObj,styles.headColumnDropStyle);
							break;
						case "over":
							Δ.dynamic.setToOver(this.dropObj,styles.headColumnDropStyle);
							break;
					}
				}
			};
			this.dropMenu=function(){
				var l = this.dropObj.position().left;
				var t = this.dropObj.position().top;
				var h = this.dropObj.height();
				this.ctrl.menu.show(l,t+h+1);
			};
			this.show=function(){
				this.frameObj.show();
				for(var i=0;i<this.ctrl.rows.length;i++){
					var row = this.ctrl.rows[i];
					var cell = row.cells[this.index+this.head.getIndexOffset()];
					cell.show();
				}
				this.isHide=false;
			};
			this.hide=function(){
				this.frameObj.hide();
				for(var i=0;i<this.ctrl.rows.length;i++){
					var row = this.ctrl.rows[i];
					var cell = row.cells[this.index+this.head.getIndexOffset()];
					cell.hide();
				}
				this.isHide=true;
			};
		}
		,head:function(ctrl){
			this.ctrl=ctrl;
			this.frameObj=null;
			this.innerObj=null;
			this.columns=[];
			this.checkObj=null;
			
			this.buildElement=function(){
				with(this.ctrl){
					var f={attr:{}},i={attr:{}};
					f.attr["class"]=styles.headStyle;
					i.attr["class"]=styles.headInnerStyle;
					this.frameObj = $("<div>").attr(f.attr);
					this.innerObj = $("<div>").attr(i.attr).addClass("select-none");
					this.frameObj.append(this.innerObj);
					this.frameObj.addClass("clearfix");
				}
				this.buildCheckElement();
				for(var i=0;i<this.ctrl.columns.length;i++){
					var col = new δ.column(this.ctrl,this,i);
					col.item=ctrl.columns[i];
					this.columns.push(col);
					col.buildElement();
					this.innerObj.append(col.frameObj);
				}
				this.resetInnerWidth();
			};
			this.rebuildElement=function(){
				this.columns=[];
				this.innerObj.empty();
				this.buildCheckElement();
				for(var i=0;i<this.ctrl.columns.length;i++){
					var col = new δ.column(this.ctrl,this,i);
					col.item=ctrl.columns[i];
					this.columns.push(col);
					col.buildElement();
					this.innerObj.append(col.frameObj);
				}
				this.resetInnerWidth();
			};
			this.resetInnerWidth=function(){
				var w = 0;
				this.innerObj.children().each(function(i){
					w+=$(this).width()+1;
				})
				this.innerObj.width(w+1+20);
			};
			this.getIndexOffset=function(){
				var offset = 0;
				if(this.ctrl.check)offset++;
				return offset;
			};
			this.buildCheckElement=function(){
				if(this.ctrl.check){
					var colObj = $("<div style=\"width:20px;\">").attr("class",this.ctrl.styles.checkColumnStyle);
					this.checkObj=Δ.widget.graph.getElement("check","normal",$("<input type=button >").attr({"class":this.ctrl.styles.checkStyle}));
					colObj.append(this.checkObj);
					this.innerObj.append(colObj);
				}
			};
			this.getWidth=function(){
				var totalWidth=0;
				for(var i=0;i<this.columns.length;i++){
					totalWidth+=this.columns[i].getWidth();
				}
				return totalWidth;
			};
			this.resetColumn=function(oldPos,newPos){
				var col;
				if(oldPos!=newPos-1){
					var cols = this.columns.splice(oldPos,1);
					var pos = (oldPos>newPos-1)?newPos:newPos-1;
					this.columns.splice(pos,0,cols[0]);
					
					this.innerObj.empty();
					this.buildCheckElement();
					for(var i=0;i<this.columns.length;i++){
						col = this.columns[i];
						col.index = i;
						col.buildElement();
						this.innerObj.append(col.frameObj);
					}
					this.ctrl.dataBinding();
				}
			};
		}
		,line:function(ctrl){
			this.ctrl=ctrl;
			this.frameObj=null;
			this.resize=null;
			this.staff=null;				//拖动标尺对像
			this.drag=null;					//拖动列对像
			
			this.buildElement=function(){
				with(this.ctrl){
					var f={attr:{}};
					f.attr["class"]=styles.lineStyle;
					this.frameObj = $("<div>").attr(f.attr);
				}
				this.frameObj.hide();
				
				this.staff = {};
				this.staff.downObj = $("<div>").attr({"class":this.ctrl.styles.downStaffStyle});
				this.staff.downTextObj = $("<span>");
				this.staff.downObj.append(this.staff.downTextObj);
				this.staff.downObj.hide();
			};
			this.beginResize=function(index,x,y){
				var h = this.ctrl.frameObj.height();
				var col = this.ctrl.getColumnByIndex(index);
				var hl = this.ctrl.head.frameObj.offset().left;
				var cl = col.frameObj.offset().left;
				var r = (Δ._ie6_8)?1:0;
				var cw = col.frameObj.width();
				var ch = col.frameObj.height();
				this.resize={"index":index,"x":x,"y":y,"l":cl-hl,"w":cw+r};
				this.frameObj.css({"height":h,"left":cl+cw-hl-1});
				this.frameObj.show();
				
				this.staff.downObj.css({"width":cw+r*2,"top":ch,"left":cl-hl-1});
				this.staff.downTextObj.text(cw+r);
				this.staff.downObj.show();
			};
			this.resizing=function(x,y){
				var r = (Δ._ie6_8)?1:0;
				var l = this.resize.l + this.resize.w - this.resize.x + x;
				var w = this.resize.w - this.resize.x + x;
				this.frameObj.css({"left":l-1});
				this.staff.downObj.width(w+r*2);
				this.staff.downTextObj.text(w+r);
			};
			this.endResize=function(){
				if(this.resize){
					var r = (Δ._ie6_8)?1:0;
					var col = this.ctrl.getColumnByIndex(this.resize.index);
					if(col){
						var w = this.frameObj.offset().left-col.frameObj.offset().left+1+r;
						col.setWidth(w);
					}
					this.resize=null;
					this.frameObj.hide();
					this.staff.downObj.hide();
				}
			};
			this.show=function(index){
				var h = this.ctrl.frameObj.height();
				var col = this.ctrl.getColumnByIndex(index>0?index-1:0);
				var hl = this.ctrl.head.frameObj.offset().left;
				var cl = col.frameObj.offset().left;
				var cw = col.frameObj.width();
				if(index>0){
					this.frameObj.css({"height":h,"left":cl+cw-hl-1});
				}else{
					this.frameObj.css({"height":h,"left":cl-hl-1});
				}
				this.frameObj.show();
			};
			this.hide=function(){
				this.frameObj.hide();
			};
		}
		,menu:function(ctrl,menu){
			this.ctrl=ctrl;
			this.popup=new Δ.widget.popup();
			this.menu=menu;
			
			this.buildElement=function(){
				this.menu.width=100;
				this.menu.buildElement();
				this.popup.buildElement();
				this.popup.frameObj.addClass("shadow-radius");
				this.popup.frameObj.append(this.menu.frameObj);
				this.ctrl.frameObj.append(this.popup.frameObj);
			};
			this.dataBinding=function(){
				var root = this.getRootNode();
				if(!this.menu.datamenu){
					var dao = new Δ.ctrl.dao.datamenu();
					dao.root=root;
					dao.valueField="id";
					dao.textField="name";
					dao.parentField="pid";
					dao.groupField="group";
					dao.iconField="icon";
					dao.checkField="check";
					this.menu.datamenu=dao;
				}else{
					this.menu.datamenu.root=root;
				}
				menu.dataBinding();
			};
			this.getRootNode=function(){
				var root = []
				if(this.ctrl.order){
					root.push({"id":"ase","pid":"","name":"升序","icon":"skin/images/asc.png","group":1});
					root.push({"id":"desc","pid":"","name":"降序","icon":"skin/images/desc.png","group":1});
				}
				if(this.ctrl.hcol){
					root.push({"id":"cols","pid":"","name":"列","icon":"skin/images/columns.png","group":2});
					for(var i=0;i<this.ctrl.head.columns.length;i++){
						var col=this.ctrl.head.columns[i];
						root.push({"id":col.item.field,"pid":"cols","name":col.item.text,"check":col.isHide?false:true});
					}
				}
				return root;
			};
			this.show=function(x,y){
				this.popup.show(x,y-1);
			};
			this.hide=function(){
				this.popup.hide();
			};
			this.isHide=function(){
				return this.popup.frameObj.is(":hidden");
			};
			this.clickNode=function(node){
				var val = node.getValue();
				switch(val){
					case "ase":
					case "desc":{
						
					}break;
					default:{
						var flag = node.getChecked();
						var col = this.ctrl.getColumnByField(val);
						if(col){
							if(flag)col.show();
							else col.hide();
						}
					}break;
				}
			};
		}
		/* 选择行把手，上移下移拖动 */
		,knob:function(ctrl){
			this.ctrl=ctrl;
			this.frameObj=null;
			this.upObj=null;
			this.downObj=null;
			this.dragObj=null;
			
			this.buildElement=function(){
				var f={attr:{},css:{}};
				with(this.ctrl){
					f.attr["class"]=styles.knobStyle;
				}
				this.frameObj = $("<div>").attr(f.attr);
				this.frameObj.hide();
			};
			this.show=function(x,y){
				
			};
			this.hide=function(){
				this.frameObj.hide();
			};
		}
		,cell:function(ctrl,row,index){
			this.ctrl=ctrl;
			this.row=row;
			this.index=index;
			this.item=null;
			this.innerObj=null;
			this.checkObj=null;
			this.frameObj=null;
			this.cellType="data";
			this.textObj=null;
			
			this.buildElement=function(){
				with(this.ctrl){
					var f={attr:{},css:{}},i={attr:{},css:{}},t={attr:{},css:{}};
					i.attr["class"]=styles.bodyCellInnerStyle;
					t.attr["class"]=styles.bodyCellTextStyle;
					f.attr["class"]=(this.cellType=="check")?styles.checkCellStyle:styles.bodyCellStyle;
					if(this.item){
						if(this.item.align)f.css["text-align"]=this.item.align;
						var w = (this.item.width>0)?this.item.width:defaultColumnWidth;
						f.css["width"]=i.css["width"]=t.css["width"]=w;
					}else if(this.cellType=="check"){
						f.css["width"]=i.css["width"]=20;
					}
					this.frameObj = $("<td>").attr(f.attr).css(f.css);
					switch(this.cellType){
						case "data":
							this.innerObj = $("<div>").attr(i.attr).css(i.css);
							if(this.item.field){
								this.textObj = $("<div>").attr(t.attr).css(t.css);
								this.innerObj.append(this.textObj);
								this.frameObj.append(this.innerObj);
								this.setText();
							}else if(this.item.html){
								var elem = $(this.item.html);
								this.innerObj.append(elem);
								this.frameObj.append(this.innerObj);
							}
							break;
						case "check":
							this.innerObj = $("<div>").attr(i.attr).css(i.css);
							this.checkObj=Δ.widget.graph.getElement("check","normal",$("<input type=button >").attr({"class":styles.checkStyle}));
							this.innerObj.append(this.checkObj);
							this.frameObj.append(this.innerObj);
							break;
					}
				}
			};
			this.setValue=function(value){
				this.ctrl.datatable.setFieldValue(this.row.dataIndex,this.item.field,value);
			};
			this.setText=function(text){
				with(this.ctrl){
					var text = "";
					var value = datatable.getFieldValue(this.row.dataIndex,this.item.field);
					if(value!=undefined){
						if(this.item.data){
							if(!this.item.codetable)this.item.codetable = Δ.ctrl.dao.fn.createCodeTable(this.item.data);
							text = this.item.codetable.getTextByValue(value,"	");
						}else if(this.item.format){
							text = Δ.format(value,this.item.format);
						}else{
							if(value instanceof Date){
								text = Δ.format(value);
							}else{
								text = value;
							}
						}
					}
					
					this.textObj[0].innerText=text;
					this.textObj.attr("title",text);
				}
			};
			this.show=function(){
				this.frameObj.show();
			};
			this.hide=function(){
				this.frameObj.hide();
			};
			this.getWidth=function(){
				return this.frameObj.width();
			};
			this.setWidth=function(width){
				this.frameObj.width(width);
				if(this.textObj)this.textObj.width(width);
				if(this.innerObj)this.innerObj.width(width);
			};
			this.beginEdit=function(){
				if(this.item.editor && !this.editor){
					this.editor = δ.fn.createEditor(this);
					var value = this.ctrl.datatable.getFieldValue(this.row.dataIndex,this.item.field);
					this.editor.setValue(value);
					this.editor.frameObj.css("border",0);
					if(this.editor.setText)this.editor.setText(this.innerObj.text());
					this.editor.setWidth(this.getWidth()-2);
					this.textObj.remove();
					this.innerObj.append(this.editor.frameObj);
					if(this.editor.focus)this.editor.focus();
				}
			};
			this.endEdit=function(){
				if(this.editor){
					this.editor.unload();
					Δ.ctrl.gc.free(this.editor);
					this.editor=null;
					this.innerObj.empty();
					this.innerObj.append(this.textObj);
				}
			};
		}
		,row:function(ctrl,index,dataIndex){
			this.frameObj=null;
			this.cells=[];
			this.ctrl=ctrl;
			this.index=index;
			this.dataIndex=dataIndex;
			
			this.buildElement=function(){
				with(this.ctrl){
					var r={css:{},attr:{}};
					this.frameObj=$("<tr>").css(r.css);
					this.setRowStyle("normal");
				}
			};
			this.clear=function(){
				var cell;
				for(var i=0;i<this.cells.length;i++){
					cell = this.cells[i];
					if(cell.editor){
						var val = cell.editor.getValue();
						var text = cell.editor.getText();
						cell.setValue(val);
						cell.setText(text);
						cell.endEdit();
					}
				}
				this.cells=[];
				this.frameObj.empty();
			};
			this.dataBinding=function(){
				var cell,frag = document.createDocumentFragment();
				if(this.ctrl.check){
					cell = new δ.cell(this.ctrl,this,0);
					cell.cellType="check";
					cell.buildElement();
					this.cells.push(cell);
					this.frameObj.append(cell.frameObj);
					this.checkCell=cell;
				}
				for(var i=0;i<this.ctrl.head.columns.length;i++){
					cell = new δ.cell(this.ctrl,this,i);
					cell.item = this.ctrl.head.columns[i].item;
					cell.buildElement();
					this.cells.push(cell);
					frag.appendChild(cell.frameObj[0]);
					if(this.ctrl.head.columns[i].isHide)cell.hide();
				}
				this.frameObj.append(frag);
			};
			this.refreshText=function(){
				for(var i=0;i<this.cells.length;i++){
					var cell = this.cells[i];
					if(cell.setText)cell.setText();
				}
			};
			this.getChecked=function(){
				for(var i=0;i<this.cells.length;i++){
					if(this.cells[i].cellType=="check")return this.cells[i].checkObj.attr("state")=="select";
				}
			};
			this.setChecked=function(flag){
				for(var i=0;i<this.cells.length;i++){
					if(this.cells[i].cellType=="check")Δ.widget.graph.setElement("check",flag?"normal":"select",this.cells[i].checkObj);
				}
			};
			this.getData=function(){
				if(this.ctrl.datatable){
					return this.ctrl.datatable.getDataRow(this.dataIndex);
				}
				return {};
			};
			this.setRowStyle=function(state){
				with(this.ctrl){
					switch(state){
						case "normal":
							if(this.index%2==1){
								Δ.dynamic.setToInterval(this.frameObj,styles.bodyRowStyle);
							}else{
								Δ.dynamic.setToNormal(this.frameObj,styles.bodyRowStyle);
							}
							break;
						case "over":
							Δ.dynamic.setToOver(this.frameObj,styles.rowStyle);
							break;
					}
				}
			};
		}
		,control:function(){
			Δ.ctrl.base.control.call(this);
			this.datatable=null;
			this.styles=new δ.styles();
			this.width="auto";
			this.rows=[];
			this.head=null;
			this.line=new δ.line(this);
			this.knob=new δ.knob(this);
			this.columns=[];
			this.bodyObj=null;
			this.tableObj=null;
			this.defaultColumnWidth=100;
			this.dragColumn=null;
			this.drag=false;				//是否可以拖放列
			this.check=false;				//是否显示选取列
			this.hcol=false;				//是否可以隐藏列
			this.order=false;				//是否可以排序
			this.onafteritemselected="";
			this.oncolumnsorted="";
			this.onselected="";					//设计选中事件
			this.rended=false;					//是否已
			
			this.buildElement=function(){
				var f={css:{},attr:{}},b={css:{},attr:{}},t={css:{},attr:{}};
				with(this.styles){
					f.attr["class"]=frameStyle;
					t.attr["class"]=bodyStyle;
					b.attr["class"]=bodyFrameStyle;
					if(this.id)f.attr["id"]=this.id;
					f.css["width"]=this.width;
				}
				
				if(this.style){
					f.attr["style"]=this.style;
				}
				this.frameObj=$("<div>").attr(f.attr).css(f.css);
				this.frameObj.ctrl(this);
				this.line.buildElement();
				this.knob.buildElement();
				this.head = new δ.head(this);
				this.head.buildElement();
				this.frameObj.append(this.head.frameObj);
				this.frameObj.append(this.line.frameObj);
				this.frameObj.append(this.line.staff.downObj);
				
				if(!(typeof this.style == "string" && this.style.indexOf("height")>-1)){
					this.frameObj.height("auto");
				}
				
				var fh = this.frameObj.height();
				var hh = this.head.frameObj.height();
				if(fh>0){
					b.attr["style"]="height:"+(fh-24)+"px;";
				}
				
				this.bodyObj=$("<div>").attr(b.attr).css(b.css);
				this.tableObj=$("<table cellpadding=\"0\" cellspacing=\"0\" >").attr(t.attr).css(t.css);
				this.bodyObj.append(this.tableObj);
				this.frameObj.append(this.bodyObj);
				
				if(this.pagesize){
					this.pagesize.frameObj.css({"border-left":0,"border-right":0,"border-bottom":0});
					this.frameObj.append(this.pagesize.frameObj);
				}
			};
			this.clear=function(){
				for(var i=0;i<this.rows.length;i++)this.rows[i].clear();
				this.rows=[];
				this.tableObj.empty();
			};
			this.dataBinding=function(data){
				if(Δ.isJsonData(data)){			//外部传入的数据源
					this.datatable = Δ.ctrl.dao.fn.createDataTable(data);
				}
				this.clear();
				if(this.datatable){
					var size = this.datatable.rowSize();
					var frag = document.createDocumentFragment(); 
					for(var i=0;i<size;i++){
						var row = new δ.row(this,i,i);
						row.buildElement();
						row.dataBinding();
						this.rows.push(row);
						frag.appendChild(row.frameObj[0]);
					}
					this.tableObj.append(frag);
				}
			};
			this.getCheckedRowData=function(){			//得到选中的行数据
				var data=[];
				for(var i=0;i<this.rows.length;i++){
					var row = this.rows[i];
					if(row.getChecked() && this.datatable){
						data.push(this.datatable.getDataRow(row.dataIndex));
					}
				}
				return data;
			};
			this.rebuildElement=function(){				//重新构建控件
				this.head.rebuildElement();
				this.menu.dataBinding();
				this.dataBinding();
			};
			this.getColumnByElement=function(elem){
				var col;
				for(var i=0;i<this.head.columns.length;i++){
					col=this.head.columns[i];
					if(col.frameObj[0]==elem || col.frameObj.find(elem).length)return col;
				}
				return null;
			};
			this.getRowByElement=function(elem){
				var row;
				for(var i=0;i<this.rows.length;i++){
					row=this.rows[i];
					if(row.frameObj[0]==elem || row.frameObj.find(elem).length)return row;
				}
				return null;
			};
			this.getCellByElement=function(elem){
				var row = this.getRowByElement(elem);
				var cell;
				if(row){
					for(var i=0;i<row.cells.length;i++){
						cell=row.cells[i];
						if(cell.frameObj[0]==elem || cell.frameObj.find(elem).length)return cell;
					}
				}
				return null;
			};
			this.getColumnByIndex=function(index){
				if(index<this.head.columns.length){
					return this.head.columns[index];
				}
				return null;
			};
			this.getColumnByField=function(field){
				var col;
				for(var i=0;i<this.head.columns.length;i++){
					col=this.head.columns[i];
					if(col.item.field==field)return col;
				}
				return null;
			};
			this.setSelectedAll=function(flag){
				for(var i=0;i<this.rows.length;i++)this.rows[i].setChecked(flag);
			};
			this.columnCursor=function(x,y){
				var col;
				for(var i=0;i<this.head.columns.length;i++){
					col=this.head.columns[i];
					if(col.frameObj._borderCursor("e-resize",x+1,y,3)){
						if(!col.frameObj[0].style.cursor){			//IE太卡，做个判断
							col.frameObj.css({"cursor":"e-resize"});
							col.dropObj.css({"cursor":"e-resize"});
						}
					}else{
						if(col.frameObj[0].style.cursor){			//IE太卡，做个判断
							col.frameObj.css({"cursor":""});
							col.dropObj.css({"cursor":"pointer"});
						}
					}
				}
			};
			this.columnCursorClick=function(x,y){
				var col,cursor;
				for(var i=0;i<this.head.columns.length;i++){
					col=this.head.columns[i];
					cursor = col.frameObj._borderCursor("e-resize",x+1,y,3);
					if(!this.line.resize){
						if(cursor=="e-resize")this.line.beginResize(i,x,y);
						else if(cursor=="w-resize")this.line.beginResize(i-1,x,y);
					}
				}
			};
			this.columnCursorIndex=function(x,y){				//返回列最终的位置
				var l,w,col;
				var len = this.head.columns.length;
				for(var i=0;i<len;i++){
					col=this.head.columns[i];
					w = col.frameObj.width();
					l = col.frameObj.offset().left;
					if(i==0 && x<l)return 0;
					else if(i==len-1 && x>l+w)return i+1;
					else{
						if(x>=l && x<l+w)return i+1;
					}
				}
			};
			this.beginResize=function(cursor,x,y){
				if(!this.resize){
					var w = this.frameObj.width();
					this.resize={"cursor":cursor,"x":x,"y":y,"w":w};
				}
			};
			this.resizing=function(x,y){
				var w = this.resize.w - this.resize.x + x;
				this.frameObj.width(w);
				this.frameObj.css("cursor",this.resize.cursor);
			};
			this.endResize=function(){
				if(this.resize){
					this.resize=null;
					this.frameObj.css("cursor","default");
				}
			};
			this.unload=function(){
				this.frameObj.remove();
				δ.fn.removeEvents(this);
			};
			this.render=function(pc){
				if(!this.rended){
					if(pc && pc.isHide()){
						δ.fn.addRenderEvent(this,pc.frameObj);
					}else{
						var p = this.frameObj.parents(":hidden");
						if(p.length>0){
							δ.fn.addRenderEvent(this,p);
						}else{
							this.rended=true;
							this.dataBinding();
						}
					}
				}
			};
			this.propertiesInitialized=function(){
				if(this.data){
					this.datatable = Δ.ctrl.dao.fn.createDataTable(this.data);
				}
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
				var cols = [];
				for(var i=0;i<context.children.length;i++){
					var child = context.children[i];
					if(child.tagName.toUpperCase()=="COLUMN"){
						child.setting["html"] = child.elem.innerHTML;
						cols.push(child.setting);
					}else if(child.tagName.toUpperCase()=="PAGESIZE"){
						ctrl.pagesize = this.createPagesize(child,ctrl);
					}
				}
				ctrl["columns"]=cols;
				this.setPropertys(ctrl);
				this.addEvents(ctrl);
				if(Δ.design && Δ.design.mode=="layout" && ctrl.design){
					var frame = Δ.design.frame.fn.create(ctrl);
					ctrl.frameObj.append(frame.frameObj);
					ctrl.head.frameObj.css({"z-index":"1001","position":"absolute"});
					ctrl.line.frameObj.css({"z-index":"1001","position":"absolute"});
					frame.onselected=function(){
						if(ctrl.onselected)Δ.raise(ctrl.onselected,{"ctrl":ctrl});
					}
				}
				if(ctrl.hcol || ctrl.order)this.createMenu(ctrl);
				return ctrl;
			}
			,createMenu:function(ctrl){
				var menu = new Δ.ctrl.menu.control();
				var dropMenu = new δ.menu(ctrl,menu);
				dropMenu.buildElement();
				Δ.ctrl.menu.fn.addEvents(menu);
				dropMenu.dataBinding();
				ctrl.menu=dropMenu;
				menu.onnodeclick=function(args){
					ctrl.menu.clickNode(args.node);
				};
				return dropMenu;
			}
			,createEditor:function(cell){
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
					case "datebox":
						editor=Δ.ctrl.datebox.fn.create(context);
						break;
					case "checkbox":
						editor=Δ.ctrl.checkbox.fn.create(context);
						break;
				}
				if(editor){
					editor.parent=cell;
					editor.onlostfocus=function(args){
						cell.setValue(args.value);
						cell.setText(args.text);
						cell.endEdit();
					};
				}
				return editor;
			}
			,createPagesize:function(context,ctrl){
				var ps = Δ.ctrl.pagesize.fn.create(context);
				return ps;
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
					,"mousedown":function(e){
						δ.fn.mouseDown(ctrl,e);
					}
					,"click":function(e){
						δ.fn.boxClick(ctrl,e)
					}
				});
				ctrl.bodyObj.bind({
					"scroll":function(e){
						δ.fn.bodyScroll(ctrl,e);
					}
				});
				$(document).bind({
					"mouseup":function(e){
						δ.fn.mouseUp(ctrl,e);
					}
					,"mousemove":function(e){
						δ.fn.mouseMove(ctrl,e);
					}
					,"click":function(e){
						δ.fn.bodyClick(ctrl,e)
					}
				});
				
				if(ctrl.datatable && ctrl.datatable.dataSourceName)Δ.json.addListener(ctrl.datatable.dataSourceName,function(){var v=ctrl.version;ctrl.dataBinding();});
			}
			,removeEvents:function(ctrl){
				if(ctrl.datatable && ctrl.datatable.dataSourceName)Δ.json.removeListener(ctrl.datatable.dataSourceName,function(){var v=ctrl.version;ctrl.dataBinding();});
			}
			,mouseOver:function(ctrl,e){
				var elem=e.srcElement || e.target;
				var col = ctrl.getColumnByElement(elem);
				if(col)col.setDropStyle("over");
			}
			,mouseOut:function(ctrl,e){
				var elem=e.srcElement || e.target;
				var col = ctrl.getColumnByElement(elem);
				if(col)col.setDropStyle("normal");
			}
			,mouseMove:function(ctrl,e){
				var x = e.pageX;
				var y = e.pageY;

				if(!ctrl.resize){
					var cursor = ctrl.frameObj._resizeCursor(x,y,3);
					if(cursor && cursor == "e-resize"){
						ctrl.frameObj.css({"cursor":cursor});
					}else{
						if(ctrl.frameObj[0].style.cursor)ctrl.frameObj.css({"cursor":""});
					}
				}else{
					ctrl.resizing(x,y);
				}
				
				if(!ctrl.line.resize)ctrl.columnCursor(x,y);
				else{
					ctrl.line.resizing(x,y);
				}
				
				if(ctrl.dragColumn){
					ctrl.dragColumn.draging(x,y);
					var index = ctrl.columnCursorIndex(x,y);
					ctrl.line.show(index);
				}
			}
			,mouseDown:function(ctrl,e){
				var x = e.pageX;
				var y = e.pageY;
				var elem=e.srcElement || e.target;

				var cursor = ctrl.frameObj._resizeCursor(x,y,3);
				if(cursor && cursor == "e-resize"){
					ctrl.beginResize(cursor,x,y);
				}

				if(Δ.mouse.getButton(e)==0){			//鼠标左键
					ctrl.columnCursorClick(x,y);				//改变列的宽度
					
					if(ctrl.drag && ctrl.dragColumn==null){					//当前拖动列是否为空
						var col = ctrl.getColumnByElement(elem);
						if(col && elem==col.textObj[0]){
							ctrl.dragColumn = col;
							col.beginDrag(e.pageX,e.pageY);
						}
					}
				}
			}
			,mouseUp:function(ctrl,e){
				var x = e.pageX;
				var y = e.pageY;
				
				if(ctrl.resize)ctrl.endResize();
				if(ctrl.line.resize)ctrl.line.endResize();
				var col = ctrl.dragColumn;
				if(col && col.drag){
					col.endDrag();
					ctrl.line.hide();
					ctrl.dragColumn = null;
					var index = ctrl.columnCursorIndex(x,y);
					ctrl.head.resetColumn(col.index,index);
				}
			}
			,bodyScroll:function(ctrl,e){
				var l = ctrl.bodyObj.scrollLeft();
				ctrl.head.frameObj.scrollLeft(l);
			}
			,boxClick:function(ctrl,e){
				var elem=e.srcElement || e.target;
				var x = e.pageX;
				var y = e.pageY;
				var col = ctrl.getColumnByElement(elem);
				if(col && elem==col.dropObj[0]){
					if(!col.frameObj.borderCursor("e-resize",x+1,y,3)){			//不在拖放范围内
						if(ctrl.menu)setTimeout(function(){col.dropMenu();},20);				//bodyClick事件后触发
					}
				}
				var cell = ctrl.getCellByElement(elem);
				if(cell){
					if(cell.cellType=="check"){
						var flag = cell.checkObj.attr("state")=="select";
						Δ.widget.graph.setElement("check",flag?"normal":"select",cell.checkObj);
					}else if(cell.item.editor){
						setTimeout(function(){cell.beginEdit();},20);
					}else if(cell.item.onclick){
						if(cell.item.onclick){
							var id = $(elem).attr("id");
							var row = cell.row;
							var index = cell.row.index;
							Δ.raise(cell.item.onclick,{"ctrl":ctrl,"row":row,"cell":cell,"data":row.getData(),"index":index,"id":id});
						}
					}
				}
				
				if(ctrl.head.checkObj && ctrl.head.checkObj.parent().find(elem).length){
					var flag = ctrl.head.checkObj.attr("state")=="select";
					Δ.widget.graph.setElement("check",flag?"normal":"select",ctrl.head.checkObj);
					ctrl.setSelectedAll(flag);
				}
			}
			,addRenderEvent:function(ctrl,elem){
				elem.bind("render",function(){
					ctrl.render();
				});
			}
			,bodyClick:function(ctrl,e){
				var elem=e.srcElement || e.target;
				if(ctrl.menu && !ctrl.menu.isHide()){
					if(!ctrl.menu.popup.frameObj.find(elem).length){
						ctrl.menu.hide();
						ctrl.menu.menu.retractNode();
					}
				}
			}
		}
	}
})(jQuery,tptps);