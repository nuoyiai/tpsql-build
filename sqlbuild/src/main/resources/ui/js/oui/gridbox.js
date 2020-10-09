//////////////////////////////////////////////////////
/////   Author: Zhu Sheng Wei (Nov-9th 1980)       ///
////    Nff WebUI Javascript Control GridBox	  ////
//////////////////////////////////////////////////////

(function($,Δ,δ){
	Δ.ctrl.gridbox=δ={
		/* 控件样式配置 */
		styles:function(){
			this.frameStyle="gridbox-frameStyle";
			this.tableStyle="gridbox-tableStyle";
			this.rowStyle={"normal":"gridbox-rowStyle-normal","over":"gridbox-rowStyle-over","select":"gridbox-rowStyle-select","interval":"gridbox-rowStyle-interval"};
			this.headRowStyle="gridbox-head-rowStyle";
			this.headCellStyle="gridbox-head-cellStyle";
			this.titleRowStyle="gridbox-title-rowStyle";
			this.titleCellStyle="gridbox-title-cellStyle";
			this.bodyCellStyle="gridbox-body-cellStyle";
			this.checkCellStyle="gridbox-check-cellStyle";
			this.checkStyle="gridbox-checkStyle";
		}
		,cell:function(ctrl,row,index,dataIndex){
			this.frameObj=null;
			this.ctrl=ctrl;
			this.row=row;
			this.index=index;
			this.colSpan=1;
			this.dataIndex=dataIndex;
			this.cellType="head";
			this.checkObj=null;
			
			this.buildElement=function(){
				with(this.ctrl){
					var c={css:{},attr:{}};
					switch(this.cellType){
						case "title":
							this.frameObj = $("<td>");
							c.attr["class"]=styles.titleCellStyle;
							c.attr["colSpan"]=this.colSpan;
							this.frameObj.attr(c.attr);
							this.frameObj.text(headline);
							break;
						case "head":
							this.frameObj = $("<td>");
							c.attr["class"]=styles.headCellStyle;
							this.frameObj.attr(c.attr);
							var columnName = datatable.getFieldName(this.dataIndex);
							this.frameObj.text(columnName);
							break;
						case "data":
							this.frameObj = $("<td>");
							c.attr["class"]=styles.bodyCellStyle;
							this.frameObj.attr(c.attr);
							var field = datatable.getField(this.dataIndex);
							var cellValue = datatable.getFieldValue(this.row.dataIndex,field);
							this.frameObj.text(cellValue);
							break;
						case "check":
							this.frameObj = $("<td>");
							c.attr["class"]=(this.row.rowType=="body")?styles.bodyCellStyle:styles.headCellStyle;
							this.frameObj.attr(c.attr);
							this.frameObj.addClass(styles.checkCellStyle);
							this.checkObj=Δ.widget.graph.getElement("check","normal","<input type=button >");
							this.checkObj.attr({"class":styles.checkStyle});
							this.frameObj.append(this.checkObj);
					}
				}
			};
		}
		,row:function(ctrl,index,dataIndex){
			this.frameObj=null;
			this.cells=[];
			this.ctrl=ctrl;
			this.rowType="body";
			this.index=index;
			this.dataIndex=dataIndex;
			this.checkCell=null;
			
			this.buildElement=function(){
				with(this.ctrl){
					var r={css:{},attr:{}};
					r.css["height"]=rowHeight+"px";
					this.frameObj=$("<tr>").css(r.css);
					this.setRowStyle("normal");
				}
			};
			this.clear=function(){
				this.frameObj.empty();
				this.cells=[];
			};
			this.dataBinding=function(){
				var fieldNames,fields,cell,j;
				if(this.rowType=="title"){
					cell = new δ.cell(this.ctrl,this);
					cell.cellType="title";
					cell.colSpan=this.getColumnSize();
					cell.buildElement();
					this.cells.push(cell);
					this.frameObj.append(cell.frameObj);
				}else{
					if(this.ctrl.check){
						cell = new δ.cell(this.ctrl,this,0);
						cell.cellType="check";
						cell.buildElement();
						this.cells.push(cell);
						this.frameObj.append(cell.frameObj);
						this.checkCell=cell;
					}
					if(this.rowType=="head"){
						fieldNames = this.ctrl.datatable.getFieldNames();
						for(var i=0;i<fieldNames.length;i++){
							j=(this.ctrl.check)?i+1:i;
							cell = new δ.cell(this.ctrl,this,j,i);
							cell.cellType="head";
							cell.buildElement();
							this.cells.push(cell);
							this.frameObj.append(cell.frameObj);
						}
					}else if(this.rowType=="body"){
						fields = this.ctrl.datatable.getFields();
						for(var i=0;i<fields.length;i++){
							j=(this.ctrl.check)?i+1:i;
							cell = new δ.cell(this.ctrl,this,j,i);
							cell.cellType="data";
							cell.buildElement();
							this.cells.push(cell);
							this.frameObj.append(cell.frameObj);
						}
					}
				}
			};
			/* 得到行数据 */
			this.getData=function(){
				if(this.ctrl.datatable){
					return this.ctrl.datatable.getDataRow(this.dataIndex);
				}
			};
			this.getColumnSize=function(){
				var fields = this.ctrl.datatable.getFields();
				if(fields){
					return this.ctrl.check?fields.length+1:fields.length;
				}else return 0;
			};
			this.isSelected=function(){
				return this.frameObj.attr("class")==this.ctrl.styles.rowStyle.select;
			};
			this.setSelected=function(flag){
				with(this.ctrl){
					if(flag)this.setRowStyle("select");
					else this.setRowStyle("normal");
					if(!multiselect){			//是否为多选,单选情况下，清除其他选中项
						for(var i=0;i<rows.length;i++){
							if(rows[i].rowType=="body" && rows[i]!=this){
								rows[i].setRowStyle("normal");
							}
						}
					}
				}
			};
			this.setRowStyle=function(state){
				with(this.ctrl){
					switch(state){
						case "normal":
							if(this.rowType=="head"){
								this.frameObj.attr({"class":styles.headRowStyle})
							}else if(this.rowType=="title"){
								this.frameObj.attr({"class":styles.titleRowStyle})
							}else{
								if(this.index%2==0){
									Δ.dynamic.setToInterval(this.frameObj,styles.rowStyle);
								}
								else{
									Δ.dynamic.setToNormal(this.frameObj,styles.rowStyle);
								}
							}
							if(this.checkCell)Δ.widget.graph.setElement("check","normal",this.checkCell.checkObj);
							break;
						case "select":
							Δ.dynamic.setToSelect(this.frameObj,styles.rowStyle);
							if(this.checkCell)Δ.widget.graph.setElement("check","select",this.checkCell.checkObj);
							break;
						case "over":
							Δ.dynamic.setToOver(this.frameObj,styles.rowStyle);
							if(this.checkCell)Δ.widget.graph.setElement("check","over",this.checkCell.checkObj);
							break;
					}
				}
			};
		}
		,control:function(){
			Δ.ctrl.base.control.call(this);
			this.datatable=null;
			this.styles=new δ.styles();
			this.width="100%";
			this.rowHeight=22;
			this.rows=[];
			this.multiselect=false;
			this.tableObj=null;
			this.headline=null;
			this.check=false;
			this.onafterrowselected="";
			
			this.buildElement=function(){
				var f={css:{},attr:{}},t={css:{},attr:{}};
				with(this.styles){
					f.attr["class"]=frameStyle;
					t.attr["class"]=tableStyle;
				}
				if(this.style)f.attr["style"]=this.style;
				this.frameObj=$("<span>").attr(f.attr).css(f.css);
				this.tableObj=$("<table cellpadding=\"0\" cellspacing=\"0\" >").attr(t.attr).css(t.css);
				this.frameObj.append(this.tableObj);
				this.setWidth(this.width);
			};
			this.clear=function(){
				this.rows=[];
				this.tableObj.empty();
			};
			this.dataBinding=function(){
				this.clear();
				var s=0;				//起始行
				if(this.headline){
					var row = new δ.row(this,s);
					row.rowType="title";
					row.buildElement();
					row.dataBinding();
					this.rows.push(row);
					this.tableObj.append(row.frameObj);
					s++;			//有标题起始行加一
				}
				if(this.datatable){
					if(this.datatable.getFieldNames().length){
						var row = new δ.row(this,s);
						row.rowType="head";
						row.buildElement();
						row.dataBinding();
						this.rows.push(row);
						this.tableObj.append(row.frameObj);
					}
					var size = this.datatable.rowSize();
					for(var i=0;i<size;i++){
						var row = new δ.row(this,i+s,i);
						row.buildElement();
						row.dataBinding();
						this.rows.push(row);
						this.tableObj.append(row.frameObj);
					}
				}
			};
			this.render=function(){
				
			};
			this.selectByElement=function(elem){
				var row = this.getRowByElement(elem);
				if(row && row.rowType=="body"){
					row.setSelected(!row.isSelected());
					value = (this.datatable)?this.datatable.getValue(row.dataIndex):null;
					text = (this.datatable)?this.datatable.getText(row.dataIndex):null;
					dataRow = (this.datatable)?this.datatable.getDataRow(row.dataIndex):null;
					if(this.onafterrowselected)Δ.raise(this.onafterrowselected,{"ctrl":this,"value":value,"text":text,"row":dataRow});
				}
			};
			this.clearSelected=function(){				//清除选中项
				for(var i=0;i<this.rows.length;i++){
					if(this.rows[i].rowType=="body")this.rows[i].setSelected(false);
				}
			};
			this.selectByValue=function(value){
				var row,val;
				if(this.datatable){
					this.clearSelected();
					var vs = (typeof value == "string")?value.split(","):[];
					for(var i=0;i<this.rows.length;i++){
						row=this.rows[i];
						if(row.rowType=="body"){
							val = this.datatable.getValue(row.dataIndex);
							for(var j=0;j<vs.length;j++){
								if(vs[j]==val)row.setSelected(true);
							}
						}
					}
				}
			};
			this.setSelectedAll=function(flag){
				var row;
				for(var i=0;i<this.rows.length;i++){
					row=this.rows[i];
					if(row.rowType=="body"){
						if(flag)row.setRowStyle("select");
						else row.setRowStyle("normal");
					}else if(row.rowType=="head"){
						if(row.checkCell)Δ.widget.graph.setElement("check",(flag)?"select":"over",row.checkCell.checkObj);
					}
				}
			};
			this.selectAllByElement=function(elem){
				var cell = this.getCellByElement(elem);
				if(cell && cell.row.rowType=="head" && cell.cellType=="check"){
					var flag = cell.checkObj.attr("state")=="select";
					this.setSelectedAll(!flag);
					Δ.widget.graph.setElement("check",flag?"normal":"select",cell.checkObj);
				}
			};
			this.getSelectRowData=function(){			//得到选中的行数据
				var data=[];
				for(var i=0;i<this.rows.length;i++){
					var row = this.rows[i];
					if(row.rowType=="body" && row.isSelected() && this.datatable){
						data.push(this.datatable.getDataRow(row.dataIndex));
					}
				}
				return data;
			};
			this.getRowByElement=function(elem){
				for(var i=0;i<this.rows.length;i++){
					if(this.rows[i].frameObj[0]==elem || this.rows[i].frameObj.find(elem).length)return this.rows[i];
				}
				return null;
			};
			this.getCellByElement=function(elem){
				var row,cell;
				for(var i=0;i<this.rows.length;i++){
					row=this.rows[i];
					for(var j=0;j<row.cells.length;j++){
						cell=row.cells[j];
						if(cell.frameObj[0]==elem || cell.frameObj.find(elem).length)return cell;
					}
				}
				return null;
			};
			this.getValue=function(){
				var value = "";
				for(var i=0;i<this.rows.length;i++){
					var row = this.rows[i];
					if(row.isSelected()){
						var val = (this.datatable)?this.datatable.getValue(row.dataIndex):"";
						value+=(value)?","+val:val;
					}
				}
				return value;
			};
			this.setValue=function(){
				
			};
			this.getText=function(){
				var text = "";
				for(var i=0;i<this.rows.length;i++){
					var row = this.rows[i];
					if(row.isSelected()){
						var val = (this.datatable)?this.datatable.getText(row.dataIndex):"";
						text+=(text)?","+val:val;
					}
				}
				return text;
			};
			this.propertiesInitialized=function(){
				if(this.data)this.datatable = Δ.ctrl.dao.fn.createDataTable(this.data,this.fields,this.columns);
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
				var row = ctrl.getRowByElement(elem);
				if(row && row.rowType=="body" && !row.isSelected())row.setRowStyle("over");
			}
			,mouseOut:function(ctrl,e){
				var elem=e.srcElement || e.target;
				var row = ctrl.getRowByElement(elem);
				if(row && row.rowType=="body" && !row.isSelected())row.setRowStyle("normal");
			}
			,boxClick:function(ctrl,e){
				var elem=e.srcElement || e.target;
				ctrl.selectAllByElement(elem);
				ctrl.selectByElement(elem);
			}
		}
	}
})(jQuery,tptps);