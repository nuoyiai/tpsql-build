//小写
function getLower(str){
	var ss = str.split("_");
	var newStr="";
	for(var i=0;i<ss.length;i++){
		var s=ss[i];
		newStr+=s.charAt(0)+s.substr(1,s.length-1).toLowerCase();
	}
	return newStr;
}

//小写,不带前缀
function getLowerNoPre(str){
	var ss = str.split("_");
	var newStr="";
	for(var i=1;i<ss.length;i++){
		var s=ss[i];
		newStr+=s.charAt(0)+s.substr(1,s.length-1).toLowerCase();
	}
	return newStr;
}

function removeComment(str){
	var ss = str.split(" ");
	if(ss.length>1)return ss[0];
	return str;
}

//首字母小写
function getFirstLower(str){
	var ss = str.split("_");
	var newStr="";
	for(var i=0;i<ss.length;i++){
		var s=ss[i];
		if(i==0){
			newStr+=s.toLowerCase()
		}else{
			newStr+=s.charAt(0)+s.substr(1,s.length-1).toLowerCase();
		}
	}
	return newStr;
}

//首字母小写,不带前缀
function getFirstLowerNoPre(str){
	var ss = str.split("_");
	var newStr="";
	for(var i=1;i<ss.length;i++){
		var s=ss[i];
		if(i==1){
			newStr+=s.toLowerCase()
		}else{
			newStr+=s.charAt(0)+s.substr(1,s.length-1).toLowerCase();
		}
	}
	return newStr;
}

//得到值类型
function getValueType(type){
	switch(type){
		case "VARCHAR":
		case "VARCHAR2":
			return "String";
		case "DATE":
		case "TIMESTAMP":
			return "Date";
		case "INT":
		case "INTEGER":
			return "Integer";
		case "DOUBLE":
			return "Double";
		case "DECIMAL":
			return "BigDecimal";
		case "BIT":
			return "Boolean";
		case "BIGINT":
			return "Long";
	}
	return "";
}

//得到字段类型
function getFieldType(type){
	switch(type){
		case "VARCHAR":
		case "VARCHAR2":
			return "java.lang.String";
		case "DATE":
		case "TIMESTAMP":
			return "java.util.Date";
		case "INT":
		case "INTEGER":
			return "java.lang.Integer";
		case "DOUBLE":
			return "java.lang.Double";
		case "DECIMAL":
			return "java.math.BigDecimal";
		case "BIT":
			return "java.lang.Boolean";
		case "BIGINT":
			return "java.lang.Long";
	}
	return "";
}

//生成表单控件
function getEditControl(type){
	switch(type){
		case "String":
			return "TextBox";
		case "Date":
			return "DateBox";
		case "Integer":
			return "NumSpin";
		case "DOUBLE":
			return "NumSpin";
		case "DECIMAL":
			return "NumSpin";
		case "Boolean":
			return "CheckBox";
	}
	return "";
}

function getQueryControl(type){
	switch(type){
	case "String":
		return "TextBox";
	case "Date":
		return "DateSpan";
	case "Integer":
		return "NumSpan";
	case "DOUBLE":
		return "NumSpan";
	case "DECIMAL":
		return "NumSpan";
	case "Boolean":
		return "CheckBox";
}
return "";
}

//生成新增sql语句时,的空处理
function getNvlValue(type){
	if(type=="String"){
		return "''";
	}else if(type=="Integer"){
		return "0";
	}else if(type=="Date"){
		return "NULL";
	}else if(type=="Double"){
		return "NULL";
	}else if(type=="BigDecimal"){
		return "NULL";
	}else if(type=="Boolean"){
		return "NULL";
	}else{
		return "";
	}
}

//是否有日期类型
function hasDateType(table){
	for(var i=0;i<table.fields.length;i++){
		var field = table.fields[i];
		if(field.type=="DATE" || field.type=="TIMESTAMP")return true;
	}
	return false;
}

//是否有金额类型
function hasDecimalType(table){
	for(var i=0;i<table.fields.length;i++){
		var field = table.fields[i];
		if(field.type=="DECIMAL")return true;
	}
	return false;
}

//得到主要字段
function getPKField(table){
	for(var i=0;i<table.fields.length;i++){
		var field = table.fields[i];
		if(field.pk)return field;
	}
	return null;
}

//得到伪删除字段
function getIsDelField(table){
	for(var i=0;i<table.fields.length;i++){
		var field = table.fields[i];
		if(field.name.indexOf("ISDEL")>-1 || field.name.indexOf("IS_DEL")>-1)return field;
	}
	return null;
}

//得到创建用户字段
function getCreateUserField(table){
	for(var i=0;i<table.fields.length;i++){
		var field = table.fields[i];
		if(field.name.indexOf("CREATE_USER")>-1)return field;
	}
	return null;
}

//得到创建时间字段
function getCreateDateField(table){
	for(var i=0;i<table.fields.length;i++){
		var field = table.fields[i];
		if(field.name.indexOf("CREATE_DATE")>-1)return field;
	}
	return null;
}

//得到修改用户字段
function getUpdateUserField(table){
	for(var i=0;i<table.fields.length;i++){
		var field = table.fields[i];
		if(field.name.indexOf("UPDATE_USER")>-1)return field;
	}
	return null;
}

//得到修改用户字段
function getUpdateDateField(table){
	for(var i=0;i<table.fields.length;i++){
		var field = table.fields[i];
		if(field.name.indexOf("UPDATE_DATE")>-1)return field;
	}
	return null;
}

//得到除主键外的字段字符串
function getNoPKColsString(table){
	var colNames = "";
	for(var i=0;i<table.fields.length;i++){
		var field = table.fields[i];
		if(!field.pk){
			colNames+=(colNames!="")?","+getFirstLower(field.name):getFirstLower(field.name);
		}
	}
	return colNames;
}

//得到包的后缀名
function getPackage(namespace){
	if(namespace){
		var ns = namespace.split(".");
		var len = ns.length;
		if(len>0){
			return ns[len-1];
		}
	}
	return null;
}

//产生随机数字,首位不为0于9
function randomSerialNum(bit){
	var nums=["0","1","2","3","4","5","6","7","8","9"];              
	var num= "";  
	for(var i=0;i<bit;i++){
		if(i==0){
			var r=Math.floor(Math.random()*8)+1;
			num+=nums[r];
		}else{
			var r=Math.floor(Math.random()*10);
			num+=nums[r];
		}
	}
	return num;
}


//得到默认控件
function getDefaultQueryControl(type){
	switch(type){
    	case "VARCHAR":
		case "VARCHAR2":
    		return "textbox";
    	case "DATE":
    	case "TIMESTAMP":
    		return "datespan";
    	case "INT":
    	case "INTEGER":
    		return "combobox";
    	case "DOUBLE":
    	case "DECIMAL":
    		return "numspin";
    }
    return "";
}

//得到控件列数
function getQueryControlCols(ctrl){
	switch(ctrl){
		case "timespan":
    	case "textspan":
    	case "datespan":
    	case "numspan":
    		return 2;
    	default:
    		return 1;
    }
}

function getDefaultQueryType(type){
	switch(type){
    	case "VARCHAR":
		case "VARCHAR2":
    		return "equal";
		case "INT":
    	case "INTEGER":
    		return "equal";
    }
    return "";
}

var rows = [],matrix = [],columns=4;
function buildTableCell(cells,column){
	rows = [];
	matrix = [];
	columns = column?column:4;
	var cell,row,pos={"row":0,"col":0};
	//创建表单布局和单元格对像
	for(var i=0;i<cells.length;i++){
		cell=cells[i];
		pos = findEmptyPostion(pos.row,cell);
		fillMatrix(pos,cell);
		row = rows[pos.row];
		if(!row){
			row = [];
			rows.push(row);
		}
		if(cell.label){
			row.push({"type":"head","label":cell.label,"field":cell.field,"ctrl":cell.ctrl,"colspan":1,"rowspan":1});
		}
		var colspan = getColSpan(cell);
		row.push({"type":"content","label":cell.label,"field":cell.field,"ctrl":cell.ctrl,"colspan":colspan,"rowspan":1});
	}
	
	return rows;
}


function fillMatrix(pos,cell){				//填充网格
	var rows = getCellRow(cell);
	var cols = getCellColumn(cell);
	for(var i=0;i<rows;i++){
		if(!matrix[pos.row+i]){
			matrix[pos.row+i]=[];
			for(var j=0;j<columns;j++)matrix[pos.row+i][j]=0;
		}
		for(var j=0;j<cols;j++){
			matrix[pos.row+i][pos.col+j]=1;
		}
	}
}

function findEmptyPostion(row,item){			//查找空白行
	var cols = getCellColumn(item);
	if(matrix.length>0){
		while(row<matrix.length){
			var emptyCount = 0;			//连续空格数量
			for(var i=0;i<columns;i++){
				if(!matrix[row][i])emptyCount++;
				else emptyCount = 0;
				if(emptyCount==cols)return {"row":row,"col":i+1-cols};
			}
			row++;
		}
		return {"row":row,"col":0};
	}
	
	return {"row":0,"col":0};
}

function getColSpan(cell){
	var cols=0;
	if(cell){
		cols = (cell.cols)?cell.cols*2-1:1;
		if(!cell.label)cols++;
		return cols;
	}
	return 1;
}

function getCellColumn(cell){
	var cols = (cell.cols)?parseInt(cell.cols):1;
	return cols>columns?columns:cols;
}

function getCellRow(cell){
	return (cell.rows)?cell.rows:1;
}