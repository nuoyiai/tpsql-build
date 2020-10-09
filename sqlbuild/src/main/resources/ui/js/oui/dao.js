//////////////////////////////////////////////////////
/////   Author: Zhu Sheng Wei (Nov-9th 1980)       ///
////    Nff WebUI Javascript Component Dao		  ////
//////////////////////////////////////////////////////

(function($,Δ,δ){
	Δ.ctrl.dao=δ={					//控件数据访问接口类
		codetable:function(){
			this.valueField="id";			//
			this.textField="text";
			this.iconField="icon";
			this.dataSourceName="";
			this.data=null;
			
			/* 键值表接口函数,获取键值表的行数 */
			this.size=function(){
				if(this.dataSourceName){
					var data = eval(this.dataSourceName);
					if(data)if(data.length!=null)return data.length;
				}else if(this.data){
					if(this.data)if(this.data.length!=null)return this.data.length;
				}
				return 0;
			};
			/* 键值表接口函数,获数据行的键 */
			this.getValue=function(index){
				var data = this.getDataByIndex(index);
				if(data && this.valueField)return data[this.valueField];
			};
			/* 键值表接口函数,获数据行的值 */
			this.getText=function(index){
				var data = this.getDataByIndex(index);
				if(data && this.textField)return data[this.textField];
			};
			/* 键值表接口函数,获数据行的图标 */
			this.getIcon=function(index){
				var data = this.getDataByIndex(index);
				if(data && this.iconField)return data[this.iconField];
			}
			this.getData=function(){
				if(this.dataSourceName){
					var data = eval(this.dataSourceName);
					return data;
				}else{
					return this.data;
				}
			};
			/* 键值表接口函数,获数据行的值 */
			this.getDataByIndex=function(index){
				var data = this.getData();
				if(data && index<data.length){
					return data[index];
				}
			};
			/* 键值表接口函数,通过值找到对应的文本 */
			this.getTextByValue=function(value,splitChar){
				var row,text="";
				var table = this.getData();
				if(table){
					var cvs = (typeof value == "string")?value.split(","):[];
					var id = this.valueField;
					var name = this.textField;
					for(var i=0;i<table.length;i++){
						row = table[i];
						if(typeof value == "number"){
							if(row[id]==value)text=row[name];
						}else if(typeof value == "boolean"){
							if(row[id]==value)text=row[name];
						}else if(typeof value == "string"){
							for(var j=0;j<cvs.length;j++)
								if(cvs[j]==row[id])text+=(text)?splitChar+row[name]:row[name];
						}
					}
				}
				return text;
			};
		}
		,codemap:function(){
			this.dataSourceName="";
			this.data=null;
			
			/* 键值表接口函数,获取键值表的行数 */
			this.size=function(){
				var data = this.getData();
				if(data){
					var size = 0, key;
					for(key in data){
						if (data.hasOwnProperty(key))size++;
					}
					return size;
				}
				return 0;
			};
			/* 键值表接口函数,获数据行的键 */
			this.getValue=function(index){
				var data = this.getData();
				if(data){
					var size = 0, key;
					for(key in data){
						if (data.hasOwnProperty(key)){
							if(index==size)return key;
							size++;
						}
					}
				}
				return null;
			};
			/* 键值表接口函数,获数据行的值 */
			this.getText=function(index){
				var data = this.getData();
				if(data){
					var size = 0, key;
					for(key in data){
						if (data.hasOwnProperty(key)){
							if(index==size)return data[key];
							size++;
						}
					}
				}
				return null;
			};
			this.getData=function(){
				if(this.dataSourceName){
					var data = eval(this.dataSourceName);
					return data;
				}else{
					return this.data;
				}
			};
			/* 键值表接口函数,通过值找到对应的文本 */
			this.getTextByValue=function(value,splitChar){
				var text="";
				var map = this.getData();
				if(map && value){
					var cvs = (typeof value == "string")?value.split(","):[];
					if(typeof value == "string"){
						for(var i=0;i<cvs.length;i++){
							if(map[cvs[i]]!=null)text+=(text)?splitChar+map[cvs[i]]:map[cvs[i]];
						}
					}else if(typeof value == "number"){
						return map[value.toString()];
					}
				}
				return text;
			};
		}
		,pagesize:function(){
			this.pageNumField="page";
			this.pageSizeField="size";
			this.countField="count";
			this.dataSourceName="";
			this.data=null;
			
			/* 得到每页多少数据 */
			this.getPageSize=function(){
				return this.getFieldValue(this.pageSizeField);
			};
			this.setPageSize=function(pageSize){
				this.setFieldValue(this.pageSizeField,pageSize);
			};
			/* 得到分页数 */ 
			this.getPageNum=function(){
				return this.getFieldValue(this.pageNumField);
			};
			this.setPageNum=function(pageNum){
				this.setFieldValue(this.pageNumField,pageNum);
			};
			/* 得到记录总数 */
			this.getCount=function(){
				return this.getFieldValue(this.countField);
			};
			this.setCount=function(count){
				this.setFieldValue(this.countField,count);
			};
			this.getFieldValue=function(fieldName){
				var obj = this.getObject();
				if(obj && fieldName)return obj[fieldName];
			};
			this.setFieldValue=function(fieldName,fieldValue){
				var obj = this.getObject();
				if(obj && fieldName)return obj[fieldName]=fieldValue;
			};
			/*  */
			this.getObject=function(){
				var data = this.getData();
				if(data instanceof Array){
					if(data.length>0)return data[0];
				}else{
					return data;
				}
			};
			/* 得到行数据 */
			this.getData=function(){
				if(this.dataSourceName){
					var data = eval(this.dataSourceName);
					return data;
				}else{
					return this.data;
				}
			};
		}
		,datatable:function(){
			this.valueField="id";
			this.textField="text";
			this.fields=[];
			this.fieldNames=[];
			this.dataSourceName="";
			this.data=null;
			
			/* 数据表接口函数,获取数据表的行数 */
			this.rowSize=function(){
				var table = this.getTable();
				return (table)?table.length:0;
			};
			/* 得到表数据 */
			this.getTable=function(){
				var table;
				if(this.dataSourceName){
					table = eval(this.dataSourceName);
				}else if(this.data){
					table = this.data;
				}
				if(table){
					if(table instanceof Array)return table;
					else{
						var wrapper = [];
						wrapper.push(table);
						return wrapper;
					}
				}
			};
			/* 数据表接口函数,获取数据表列 */
			this.getField=function(colIndex){
				return this.fields[colIndex];
			};
			/* 数据表接口函数,获取数据表列集合 */
			this.getFields=function(){
				return this.fields;
			};
			/* 数据表接口函数,获取数据表列名集合 */
			this.getFieldName=function(colIndex){
				return this.fieldNames[colIndex];
			};
			/* 数据表接口函数,获取数据表列名集合 */
			this.getFieldNames=function(){
				return this.fieldNames;
			};
			/* 数据表接口函数,获取数据表行的主键值 */
			this.getValue=function(rowIndex){
				var row = this.getDataRow(rowIndex);
				if(row && this.valueField)return row[this.valueField];
			};
			/* 数据表接口函数,获取数据表行的名称 */
			this.getText=function(rowIndex){
				var row = this.getDataRow(rowIndex);
				if(row && this.textField)return row[this.textField];
			};
			/* 数据表接口函数,获取数据表行数据 */
			this.getDataRow=function(rowIndex){
				var table = this.getTable();
				if(table && rowIndex<table.length){
					return table[rowIndex];
				}
			};
			/* 数据表接口函数,获取数据表单击格数据 */
			this.getFieldValue=function(rowIndex,field){
				var row = this.getDataRow(rowIndex);
				if(row && field)return row[field];
			};
			/* 数据表接口函数,设置数据表单击格数据 */
			this.setFieldValue=function(rowIndex,field,value){
				var row = this.getDataRow(rowIndex);
				if(row && field)row[field]=value;
			};
		}
		,datatree:function(){
			this.valueField="id";
			this.textField="text";
			this.parentField="pid";
			this.dataSourceName="";
			this.data=null;
			this.rebuildFlag=false;				//重组标志
			
			this.getNode=function(indexs){
				var tree = this.getTree();
				if(tree){
					var node = null,index=0;
					if(tree.constructor==Array){
						for(var i=0;i<indexs.length;i++){
							index = indexs[i];
							node = (i==0)?tree[index]:node.children[index];
						}
						return node;
					}
					else if(tree.constructor==Object){
						for(var i=0;i<indexs.length;i++){
							index = indexs[i];
							node = (i==0)?tree:node.children[index];
						}
						return node;
					}
				}
			};
			this.getNodeChildren=function(indexs){
				var node = this.getNode(indexs);
				if(node)return node.children;
				else return [];
			};
			this.getNodeValue=function(indexs){
				var node = this.getNode(indexs);
				if(node && this.valueField)return node[this.valueField];
			};
			this.getNodeText=function(indexs){
				var node = this.getNode(indexs);
				if(node && this.textField)return node[this.textField];
			};
			this.getTree=function(){
				if(!this.rebuildFlag)this.rebuildData();
				return (this.data)?this.data:eval(this.dataSourceName);
			};
			this.rebuildData=function(){
				this.rebuildFlag=true;
				var tree = (this.data)?this.data:eval(this.dataSourceName);
				if(tree && tree.constructor==Array && tree.length){
					var pFlag = tree[0].pid!=null;
					if(pFlag && this.parentField!=""){
						var map = {},val=index=pNode=null,newTree=[];
						for(var i=0;i<tree.length;i++){
							val = tree[i][this.valueField]+"";
							if(val)map[val]=i;
						}
						for(var i=0;i<tree.length;i++){
							var pVal = tree[i][this.parentField]+"";
							if(map[pVal]!=null){
								index = map[pVal];
								pNode = tree[index];
								if(!pNode.children)pNode.children=[];
								pNode.children.push(tree[i]);
							}else{
								newTree.push(tree[i]);
							}
						}
						this.data=newTree;
						if(this.dataSourceName)Δ.setJson(this.dataSourceName,newTree);
						return newTree;
					}
				}
				return tree;
			};
			this.getTextByValue=function(value,splitChar){
				var text="";
				var tree = this.getTree();
				if(tree){
					var vs = (typeof value == "string")?value.split(","):[];
					var id = this.valueField;
					var name = this.textField;
					
					var fn = function(n,vs,sc,id,name,f){
						var v="";
						for(var i=0;i<vs.length;i++){
							if(vs[i]==n[id])v=n[name];
						}
						if(n.children){
							var cv="";
							for(var i=0;i<n.children.length;i++){
								cv=f(n.children[i],vs,sc,id,name,f);
								if(cv)v+=(v)?sc+cv:cv;
							}
						}
						return v;
					};
					for(var i=0;i<tree.length;i++){
						var val = fn(tree[i],vs,splitChar,id,name,fn);
						if(val)text+=(text)?","+val:val;
					}
				}
				return text;
			}
		}
		,propertytree:function(){
			Δ.ctrl.dao.datatree.call(this);
			this.catalogField="catalog";
			this.groupField="group";
			this.editorField="editor";
			
			this.getCatalog=function(indexs){
				var node = this.getNode(indexs);
				if(node && this.catalogField)return node[this.catalogField];
			};
			this.getGroup=function(indexs){
				var node = this.getNode(indexs);
				if(node && this.groupField)return node[this.groupField];
			};
			this.getEditor=function(indexs){
				var node = this.getNode(indexs);
				if(node && this.editorField)return node[this.editorField];
			};
			this.getValue=function(node){
				if(node && this.valueField)return node[this.valueField];
			};
			this.setValue=function(node,value){
				if(node && this.valueField)node[this.valueField]=value;
			};
		}
		,datamenu:function(){
			Δ.ctrl.dao.datatree.call(this);
			this.groupField="";
			this.iconField="";
			this.checkField="";
			
			this.getNodeGroup=function(indexs){
				var node = this.getNode(indexs);
				if(node && this.groupField)return node[this.groupField];
			};
			this.getNodeIcon=function(indexs){
				var node = this.getNode(indexs);
				if(node && this.iconField)return node[this.iconField];
			};
			this.getCheckValue=function(indexs){
				var node = this.getNode(indexs);
				if(node && this.checkField)return node[this.checkField];
			};
			this.setCheckValue=function(indexs,val){
				var node = this.getNode(indexs);
				if(node && this.checkField)node[this.checkField]=val;
			};
		}
		,datafield:function(){
			this.dataField="";
			this.index=-1;
			this.dataSourceName="";
			
			this.getValue=function(){
				
			};
			this.setValue=function(){
				
			};
		}
		,fn:{
			createCodeTable:function(data,valueField,textField){
				var dao;
				if(typeof data == "string"){
					if(data.charAt(0)=='['){
						dao = new δ.codetable();
						dao.data=this.parseJson(data);;
					}else if(data.charAt(0)=='{'){
						dao = new δ.codemap();
						dao.data=this.parseJson(data);;
					}else{
						if(eval(data) instanceof Array){
							dao = new δ.codetable();
							dao.dataSourceName=data;
						}else{
							dao = new δ.codemap();
							dao.dataSourceName=data;
						}
					}
				}else if(typeof data == "object"){
					dao = new δ.codemap();
					dao.data=data;
				}else{
					dao = new δ.codetable();
					dao.data=data;
				}
				if(valueField)dao.valueField=valueField;
				if(textField)dao.textField=textField;
				return dao;
			}
			,createPageSize:function(data,pageField,sizeField,countField){
				var dao = new δ.pagesize();
				if(data){
					if(data && typeof data == "string"){
						if(data.charAt(0)=='{' || data.charAt(0)=='['){
							dao.data=this.parseJson(data);;
						}else{
							dao.dataSourceName=data;
						}
					}else{
						dao.data=data;
					}
				}
				if(pageField)dao.pageNumField=pageField;
				if(sizeField)dao.pageSizeField=sizeField;
				if(countField)dao.countField=countField;
				return dao;
			}
			,createDataTable:function(data,fields,columns,valueField,textField){
				var dao = new δ.datatable();
				if(data){
					if(data && typeof data == "string"){
						if(data.charAt(0)=='{' || data.charAt(0)=='['){
							dao.data=this.parseJson(data);;
						}else{
							dao.dataSourceName=data;
						}
					}else{
						dao.data=data;
					}
				}
				if(valueField)dao.valueField=valueField;
				if(textField)dao.textField=textField;
				if(fields)dao.fields=(fields.constructor==Array)?fields:fields.split(",");
				if(columns)dao.fieldNames=(columns.constructor==Array)?columns:columns.split(",");
				return dao;
			}
			,createDataTree:function(data,valueField,textField,parentField){
				var dao = new δ.datatree();
				if(typeof data == "string"){
					if(data.charAt(0)=='{' || data.charAt(0)=='['){
						dao.data=this.parseJson(data);
					}else{
						dao.dataSourceName=data;
					}
				}else{
					dao.data=data;
				}
				if(valueField)dao.valueField=valueField;
				if(textField)dao.textField=textField;
				if(parentField)dao.parentField=parentField;
				return dao;
			}
			,createPropertyTree:function(data,valueField,textField){
				var dao = new δ.propertytree();
				if(typeof data == "string"){
					if(data.charAt(0)=='{' || data.charAt(0)=='['){
						dao.data=this.parseJson(data);;
					}else{
						dao.dataSourceName=data;
					}
				}else{
					dao.data=data;
				}
				if(valueField)dao.valueField=valueField;
				if(textField)dao.textField=textField;
				return dao;
			}
			,createDataMenu:function(data,valueField,textField,parentField,iconField,groupField){
				var dao = new δ.datamenu();
				
				if(typeof data == "string"){
					if(data.charAt(0)=='{' || data.charAt(0)=='['){
						dao.data=this.parseJson(data);;
					}else{
						dao.dataSourceName=data;
					}
				}else{
					dao.data=data;
				}
				if(valueField)dao.valueField=valueField;
				if(textField)dao.textField=textField;
				if(parentField)dao.parentField=parentField;
				if(groupField)dao.groupField=groupField;
				if(iconField)dao.iconField=iconField;
				return dao;
			}
			,createDataField:function(context){
			}
			,parseJson:function(data){
				return Δ.assert.get(function(){return Δ.json.parse(data);},"1110",data);
			}
		}
	};
})(jQuery,tptps);