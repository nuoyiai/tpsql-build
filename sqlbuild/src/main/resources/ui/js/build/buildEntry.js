//生成实体和映射文件
function buildEntry(tables,pagckage){
	var table,field,remark;
	var fileJson = [];
	var swaggerFlag = false;
	for(var tableName in tables){
		var code="";
		table = tables[tableName];
		code+="package "+pagckage+";\r\n";
		code+="\r\n";
		code+="import java.io.Serializable;\r\n";
		if(hasDateType(table))code+="import java.util.Date;\r\n";
		if(hasDecimalType(table))code+="import java.math.BigDecimal;\r\n";
		if(swaggerFlag){
			code+="import io.swagger.annotations.ApiModelProperty;\r\n";
			code+="\r\n";
        }
		code+="\r\n";
		code+="/**\r\n";
		code+=" * "+table.remark+"\r\n";
		code+=" */\r\n";
		code+="public class "+getLower(tableName)+" implements Serializable {\r\n";
		code+="\tprivate static final long serialVersionUID = "+randomSerialNum(19)+"L;\r\n";
		for(var i=0;i<table.fields.length;i++){
			field=table.fields[i];
			code+="\t/* "+field.desc+" */\r\n";
            if(swaggerFlag) {
                code+="\t@ApiModelProperty(\""+field.desc+"\")\r\n";
            }
			code+="\tprivate "+getValueType(field.type)+" "+getFirstLower(field.name)+";\r\n";
		}
		code+="\r\n";
		
		for(var i=0;i<table.fields.length;i++){
			field=table.fields[i];
			code+="\tpublic "+getValueType(field.type)+" get"+getLower(field.name)+"(){\r\n";
			code+="\t\treturn this."+getFirstLower(field.name)+";\r\n";
			code+="\t}\r\n";
			code+="\r\n";
			code+="\tpublic void set"+getLower(field.name)+"("+getValueType(field.type)+" "+getFirstLower(field.name)+"){\r\n";
			code+="\t\tthis."+getFirstLower(field.name)+"="+getFirstLower(field.name)+";\r\n";
			code+="\t}\r\n";
			code+="\r\n";
		}
		
		code+="}";
		
		fileJson.push({"path":"src\\main\\java\\"+pagckage,"filename":getLower(tableName)+".java","content":code});
	}
	
	for(var tableName in tables){
		var xml="";
		table = tables[tableName];
		
		xml+="<?xml version=\"1.0\" encoding=\"utf-8\" ?>\r\n";
		xml+="<mapping>\r\n";
		xml+="\t<class name=\""+pagckage+"."+getLower(tableName)+"\" table=\""+tableName+"\" >\r\n";
		for(var i=0;i<table.fields.length;i++){
			field=table.fields[i];
			if(field.pk){
				xml+="\t\t<id name=\""+getFirstLower(field.name)+"\" type=\""+getFieldType(field.type)+"\" >\r\n";
			}else{
				xml+="\t\t<property name=\""+getFirstLower(field.name)+"\" type=\""+getFieldType(field.type)+"\" >\r\n";
			}
			var length = (field.length)?" length=\""+field.length+"\"":"";
			var precision = (field.precision)?" precision=\""+field.precision+"\"":"";
			var scale = (field.scale)?" scale=\""+field.scale+"\"":"";
			xml+="\t\t\t<column name=\""+field.name+"\""+length+precision+scale+" />\r\n";
			if(field.pk){
				xml+="\t\t</id>\r\n";
			}else{
				xml+="\t\t</property>\r\n";
			}
		}
		xml+="\t</class>\r\n";
		xml+="</mapping>";
		xml+="\r\n";
		
		fileJson.push({"path":"src\\main\\resources\\"+pagckage,"filename":getLower(tableName)+".sqlMap.xml","content":xml});
	}
	
	return fileJson;
}

//生成sql语句
function buildSqlMap(tables){
	var table,field,nvl,type;
	var fileJson = [];
	for(var tableName in tables){
		var code="";
		table = tables[tableName];
		pk = getPKField(table);
		del = getIsDelField(table);
		code+="<?xml version=\"1.0\" encoding=\"utf-8\" ?>\r\n";
		code+="<tpsql>\r\n";
		
		code+="\r\n";
		code+="\t<!-- 新增"+table.remark+" -->\r\n";
		code+="\t<sql id=\"insert"+getLower(tableName)+"\" >\r\n";
		code+="\t\tINSERT INTO "+tableName+" (";
		for(var i=0;i<table.fields.length;i++){
			field=table.fields[i];
			if(i==0)code+=field.name;
			else code+=","+field.name;
		}
		code+=") VALUES (";
		
		for(var i=0;i<table.fields.length;i++){
			field=table.fields[i];
			nvl = getNvlValue(getValueType(field.type));
			if(i==0){
				code+="[#"+getFirstLower(field.name)+"]\r\n";
			}else{
				if(nvl!=""){
					code+="\t\t<clause prepend=\",\" nvl=\""+nvl+"\" >[#"+getFirstLower(field.name)+"]</clause>\r\n";
				}else{
					code+="\t\t<clause prepend=\",\" >[#"+getFirstLower(field.name)+"]</clause>\r\n";
				}
			}
		}
		code+="\t\t)\r\n";
		code+="\t</sql>\r\n";
		
		code+="\r\n";
		
		code+="\t<!-- 修改"+table.remark+" -->\r\n";
		code+="\t<sql id=\"update"+getLower(tableName)+"\" >\r\n";
		code+="\t\tUPDATE "+tableName+" \r\n";
		code+="\t\t<set>\r\n";
		for(var i=0;i<table.fields.length;i++){
			field=table.fields[i];
			if(i>0){
				code+="\t\t\t<clause prepend=\",\" assert=\"!isNull(["+getFirstLower(field.name)+"])\" >"+field.name+" = [#"+getFirstLower(field.name)+"]</clause>\r\n";
			}
		}
		code+="\t\t</set>\r\n";
		code+="\t\t<where>\r\n";
		if(pk){
			code+="\t\t\t "+pk.name+" = [#"+getFirstLower(pk.name)+"] \r\n";
		}
		code+="\t\t</where>\r\n";
		code+="\t</sql>\r\n";
		code+="\r\n";
		
		if(pk){
			code+="\t<!-- 通过主键得到"+table.remark+" -->\r\n";
			code+="\t<sql id=\"get"+getLower(tableName)+"ById\" >\r\n";
			code+="\t\tSELECT * FROM "+tableName+" WHERE "+pk.name+" = [0]\r\n";
			code+="\t</sql>\r\n";
			code+="\r\n";
			
			code+="\t<!-- 通过主键删除"+table.remark+" -->\r\n";
			if(del){
				code+="\t<sql id=\"delete"+getLower(tableName)+"ById\" >\r\n";
				code+="\t\tUPDATE "+tableName+" SET "+del.name+" = 1 WHERE "+pk.name+" = [0]\r\n";
				code+="\t</sql>\r\n";
				code+="\r\n";
			}else{
				code+="\t<sql id=\"delete"+getLower(tableName)+"ById\" >\r\n";
				code+="\t\tDELETE FROM "+tableName+" WHERE "+pk.name+" = [0]\r\n";
				code+="\t</sql>\r\n";
				code+="\r\n";
			}
		}
		
		code+="\t<!-- 查询"+table.remark+" -->\r\n";
		code+="\t<sql id=\"query"+getLower(tableName)+"List\" >\r\n";
		code+="\t\tSELECT * FROM "+tableName+" \r\n";
		code+="\t\t<where>\r\n";
		for(var i=0;i<table.fields.length;i++){
			field=table.fields[i];
			type = getValueType(field.type)
			if(i>0){
				switch(type){
					case "String":
						code+="\t\t\t<clause prepend=\"and\" assert=\"!isNullOrEmpty(["+getFirstLower(field.name)+"])\" > "+field.name+" = '["+getFirstLower(field.name)+"]' </clause>\r\n";
						break;
					case "Integer":
						code+="\t\t\t<clause prepend=\"and\" assert=\"!isNull(["+getFirstLower(field.name)+"])\" > "+field.name+" = ["+getFirstLower(field.name)+"] </clause>\r\n";
						break;
					case "Double":
						code+="\t\t\t<clause parent=\"NumberSpan\" params=\""+field.name+","+getFirstLower(field.name)+","+getFirstLower(field.name)+"End\" ></clause>\r\n";
						break;
					case "Date":
						code+="\t\t\t<clause parent=\"DateSpan\" params=\""+field.name+","+getFirstLower(field.name)+","+getFirstLower(field.name)+"End\" ></clause>\r\n";
						break;
				}
			}
		}
		code+="\t\t</where>\r\n";
		code+="\t</sql>\r\n";
		code+="\r\n";
		
		code+="</tpsql>";
		
		fileJson.push({"path":"src\\main\\resources\\sqlMaps","filename":getFirstLower(tableName)+".sqlMap.xml","content":code});
	}
	return fileJson;
}

