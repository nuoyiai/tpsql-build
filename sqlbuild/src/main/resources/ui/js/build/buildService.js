//生成数量访问代表码
function buildDao(tables,module){
	var table,field,pk,className,interfaceName,entityName,paramName;
	var fileJson = [];
	
	for(var tableName in tables){
		var code="";
		table = tables[tableName];
		className = getLower(tableName);
		interfaceName = "I"+getLower(tableName);
		entityName = getLower(tableName);
		paramName = getFirstLower(tableName);
		pk = getPKField(table);
		
		code+="package banger.dao.impl;\r\n";
		code+="\r\n";
		code+="import java.util.List;\r\n";
		code+="import java.util.Map;\r\n";
		code+="import org.springframework.stereotype.Repository;\r\n";
		code+="\r\n";
		code+="import banger.framework.pagesize.IPageList;\r\n";
		code+="import banger.framework.pagesize.IPageSize;\r\n";
		code+="import banger.framework.dao.PageSizeDao;\r\n";
		code+="import banger.dao.intf."+interfaceName+"Dao;\r\n";
		if(module)code+="import banger.domain."+module+"."+entityName+";\r\n";
		code+="\r\n";
		
		code+="/**\r\n";
		code+=" * "+table.remark+"数据访问类\r\n";
		code+=" */\r\n";
		code+="@Repository\r\n";
		code+="public class "+className+"Dao extends PageSizeDao<"+entityName+"> implements "+interfaceName+"Dao {\r\n";
		code+="\r\n";
		
		code+="\t/**\r\n";
		code+="\t * 新增"+table.remark+"\r\n";
		code+="\t * @param "+paramName+" 实体对像\r\n";
		code+="\t */\r\n";
		code+="\t@Override\r\n";
		code+="\tpublic void insert"+className+"("+entityName+" "+paramName+"){\r\n";
		if(pk){
			if(getValueType(pk.type)=="Integer")code+="\t\t"+paramName+".set"+getLower(pk.name)+"(this.newId().intValue());\r\n";
			else if(getValueType(pk.type)=="Long")code+="\t\t"+paramName+".set"+getLower(pk.name)+"(this.newId());\r\n";
		}
		code+="\t\tthis.execute(\"insert"+className+"\","+paramName+");\r\n";
		code+="\t}\r\n";
		code+="\r\n";
		
		code+="\t/**\r\n";
		code+="\t *修改"+table.remark+"\r\n";
		code+="\t * @param "+paramName+" 实体对像\r\n";
		code+="\t */\r\n";
		code+="\t@Override\r\n";
		code+="\tpublic void update"+className+"("+entityName+" "+paramName+"){\r\n";
		code+="\t\tthis.execute(\"update"+className+"\","+paramName+");\r\n";
		code+="\t}\r\n";
		code+="\r\n";
		
		if(pk){
			code+="\t/**\r\n";
			code+="\t * 通过主键删除"+table.remark+"\r\n";
			code+="\t * @param "+getFirstLower(pk.name)+" 主键Id\r\n";
			code+="\t */\r\n";
			code+="\t@Override\r\n";
			code+="\tpublic void delete"+className+"ById("+getValueType(pk.type)+" "+getFirstLower(pk.name)+"){\r\n";
			code+="\t\tthis.execute(\"delete"+className+"ById\","+getFirstLower(pk.name)+");\r\n";
			code+="\t}\r\n";
			code+="\r\n";
			
			code+="\t/**\r\n";
			code+="\t * 通过主键得到"+table.remark+"\r\n";
			code+="\t * @param "+getFirstLower(pk.name)+" 主键Id\r\n";
			code+="\t */\r\n";
			code+="\t@Override\r\n";
			code+="\tpublic "+entityName+" get"+className+"ById("+getValueType(pk.type)+" "+getFirstLower(pk.name)+"){\r\n";
			code+="\t\treturn ("+entityName+")this.queryEntity(\"get"+className+"ById\","+getFirstLower(pk.name)+");\r\n";
			code+="\t}\r\n";
			code+="\r\n";
		}
		
		code+="\t/**\r\n";
		code+="\t * 查询"+table.remark+"\r\n";
		code+="\t * @param condition 查询条件\r\n";
		code+="\t * @return\r\n";
		code+="\t */\r\n";
		code+="\t@SuppressWarnings(\"unchecked\")\r\n";
		code+="\t@Override\r\n";
		code+="\tpublic List<"+entityName+"> query"+className+"List(Map<String,Object> condition){\r\n";
		code+="\t\treturn (List<"+entityName+">)this.queryEntities(\"query"+className+"List\", condition);\r\n";
		code+="\t}\r\n";
		code+="\r\n";
		
		code+="\t/**\r\n";
		code+="\t * 分页查询"+table.remark+"\r\n";
		code+="\t * @param condition 查询条件\r\n";
		code+="\t * @param page 分页对像\r\n";
		code+="\t * @return\r\n";
		code+="\t */\r\n";
		code+="\t@SuppressWarnings(\"unchecked\")\r\n";
		code+="\t@Override\r\n";
		code+="\tpublic IPageList<"+entityName+"> query"+className+"List(Map<String,Object> condition,IPageSize page){\r\n";
		code+="\t\treturn (IPageList<"+entityName+">)this.queryEntities(\"query"+className+"List\", page, condition);\r\n";
		code+="\t}\r\n";
		code+="\r\n";
		
		code+="}\r\n";
		
		fileJson.push({"path":"src\\main\\java\\banger\\dao\\impl","filename":className+"Dao.java","content":code});
		
	}
	
	for(var tableName in tables){
		var code="";
		table = tables[tableName];
		interfaceName = "I"+getLower(tableName);
		className = getLower(tableName);
		entityName = getLower(tableName);
		paramName = getFirstLowerNoPre(tableName);
		pk = getPKField(table);
		
		code+="package banger.dao.intf;\r\n";
		code+="\r\n";
		code+="import java.util.List;\r\n";
		code+="import java.util.Map;\r\n";
		code+="\r\n";
		code+="import banger.framework.pagesize.IPageList;\r\n";
		code+="import banger.framework.pagesize.IPageSize;\r\n";
		if(module)code+="import banger.domain."+module+"."+entityName+";\r\n";
		code+="\r\n";
		
		code+="/**\r\n";
		code+=" * "+table.remark+"数据访问接口\r\n";
		code+=" */\r\n";
		code+="public interface "+interfaceName+"Dao {\r\n";
		code+="\r\n";
		
		code+="\t/**\r\n";
		code+="\t * 新增"+table.remark+"\r\n";
		code+="\t * @param "+paramName+" 实体对像\r\n";
		code+="\t */\r\n";
		code+="\tvoid insert"+className+"("+entityName+" "+paramName+");\r\n";
		code+="\r\n";
		
		code+="\t/**\r\n";
		code+="\t *修改"+table.remark+"\r\n";
		code+="\t * @param "+paramName+" 实体对像\r\n";
		code+="\t */\r\n";
		code+="\tvoid update"+className+"("+entityName+" "+paramName+");\r\n";
		code+="\r\n";
		
		if(pk){
			code+="\t/**\r\n";
			code+="\t * 通过主键删除"+table.remark+"\r\n";
			code+="\t * @param "+getFirstLower(pk.name)+" 主键Id\r\n";
			code+="\t */\r\n";
			code+="\tvoid delete"+className+"ById("+getValueType(pk.type)+" "+getFirstLower(pk.name)+");\r\n";
			code+="\r\n";
			
			code+="\t/**\r\n";
			code+="\t * 通过主键得到"+table.remark+"\r\n";
			code+="\t * @param "+getFirstLower(pk.name)+" 主键Id\r\n";
			code+="\t */\r\n";
			code+="\t"+entityName+" get"+className+"ById("+getValueType(pk.type)+" "+getFirstLower(pk.name)+");\r\n";
			code+="\r\n";
		}
		
		code+="\t/**\r\n";
		code+="\t * 查询"+table.remark+"\r\n";
		code+="\t * @param condition 查询条件\r\n";
		code+="\t * @return\r\n";
		code+="\t */\r\n";
		code+="\tList<"+entityName+"> query"+className+"List(Map<String,Object> condition);\r\n";
		code+="\r\n";
		
		code+="\t/**\r\n";
		code+="\t * 分页查询"+table.remark+"\r\n";
		code+="\t * @param condition 查询条件\r\n";
		code+="\t * @param page 分页对像\r\n";
		code+="\t * @return\r\n";
		code+="\t */\r\n";
		code+="\tIPageList<"+entityName+"> query"+className+"List(Map<String,Object> condition,IPageSize page);\r\n";
		code+="\r\n";
		
		code+="}\r\n";
		
		fileJson.push({"path":"src\\main\\java\\banger\\dao\\intf","filename":interfaceName+"Dao.java","content":code});
		
	}
	
	return fileJson;
}

//生成服务代码
function buildService(tables,module){
	
	var table,field,pk,className,interfaceName,entityName,paramName,cu,cd,uu,ud;
	var fileJson = [];
	
	for(var tableName in tables){
		var code="";
		table = tables[tableName];
		className = getLower(tableName);
		interfaceName = "I"+getLower(tableName);
		entityName = getLower(tableName);
		paramName = getFirstLower(tableName);
		daoName = getFirstLower(tableName)+"Dao";
		pk = getPKField(table);
		cu = getCreateUserField(table);
		cd = getCreateDateField(table);
		uu = getUpdateUserField(table);
		ud = getUpdateDateField(table);
		
		code+="package banger.service.impl;\r\n";
		code+="\r\n";
		code+="import java.util.List;\r\n";
		code+="import java.util.Map;\r\n";
		code+="import org.springframework.stereotype.Repository;\r\n";
		code+="import org.springframework.beans.factory.annotation.Autowired;\r\n";
		code+="\r\n";
		code+="import banger.framework.util.DateUtil;\r\n";
		code+="import banger.framework.pagesize.IPageList;\r\n";
		code+="import banger.framework.pagesize.IPageSize;\r\n";
		code+="import banger.dao.intf."+interfaceName+"Dao;\r\n";
		code+="import banger.service.intf."+interfaceName+"Service;\r\n";
		if(module)code+="import banger.domain."+module+"."+entityName+";\r\n";
		code+="\r\n";
		
		code+="/**\r\n";
		code+=" * "+table.remark+"业务访问类\r\n";
		code+=" */\r\n";
		
		code+="@Repository\r\n";
		code+="public class "+className+"Service implements "+interfaceName+"Service {\r\n";
		code+="\r\n";
		code+="\t@Autowired\r\n";
		code+="\tprivate I"+className+"Dao "+daoName+";\r\n";
		code+="\r\n";
		
		code+="\t/**\r\n";
		code+="\t * 新增"+table.remark+"\r\n";
		code+="\t * @param "+paramName+" 实体对像\r\n";
		code+="\t * @param loginUserId 登入用户Id\r\n";
		code+="\t */\r\n";
		code+="\t@Override\r\n";
		code+="\tpublic void insert"+className+"("+entityName+" "+paramName+",Integer loginUserId){\r\n";
		if(cu)code+="\t\t"+paramName+".set"+getLower(cu.name)+"(loginUserId);\r\n";
		if(cd)code+="\t\t"+paramName+".set"+getLower(cd.name)+"(DateUtil.getCurrentDate());\r\n";
		if(uu)code+="\t\t"+paramName+".set"+getLower(uu.name)+"(loginUserId);\r\n";
		if(ud)code+="\t\t"+paramName+".set"+getLower(ud.name)+"(DateUtil.getCurrentDate());\r\n";
		code+="\t\tthis."+daoName+".insert"+className+"("+paramName+");\r\n";
		code+="\t}\r\n";
		code+="\r\n";
		
		code+="\t/**\r\n";
		code+="\t *修改"+table.remark+"\r\n";
		code+="\t * @param "+paramName+" 实体对像\r\n";
		code+="\t * @param loginUserId 登入用户Id\r\n";
		code+="\t */\r\n";
		code+="\t@Override\r\n";
		code+="\tpublic void update"+className+"("+entityName+" "+paramName+",Integer loginUserId){\r\n";
		if(uu)code+="\t\t"+paramName+".set"+getLower(uu.name)+"(loginUserId);\r\n";
		if(ud)code+="\t\t"+paramName+".set"+getLower(ud.name)+"(DateUtil.getCurrentDate());\r\n";
		code+="\t\tthis."+daoName+".update"+className+"("+paramName+");\r\n";
		code+="\t}\r\n";
		code+="\r\n";
		
		if(pk){
			code+="\t/**\r\n";
			code+="\t * 通过主键删除"+table.remark+"\r\n";
			code+="\t * @param "+getFirstLower(pk.name)+" 主键Id\r\n";
			code+="\t */\r\n";
			code+="\t@Override\r\n";
			code+="\tpublic void delete"+className+"ById("+getValueType(pk.type)+" "+getFirstLower(pk.name)+"){\r\n";
			code+="\t\tthis."+daoName+".delete"+className+"ById("+getFirstLower(pk.name)+");\r\n";
			code+="\t}\r\n";
			code+="\r\n";
			
			code+="\t/**\r\n";
			code+="\t * 通过主键得到"+table.remark+"\r\n";
			code+="\t * @param "+getFirstLower(pk.name)+" 主键Id\r\n";
			code+="\t */\r\n";
			code+="\t@Override\r\n";
			code+="\tpublic "+entityName+" get"+className+"ById("+getValueType(pk.type)+" "+getFirstLower(pk.name)+"){\r\n";
			code+="\t\treturn this."+daoName+".get"+className+"ById("+getFirstLower(pk.name)+");\r\n";
			code+="\t}\r\n";
			code+="\r\n";
		}
		
		code+="\t/**\r\n";
		code+="\t * 查询"+table.remark+"\r\n";
		code+="\t * @param condition 查询条件\r\n";
		code+="\t * @return\r\n";
		code+="\t */\r\n";
		code+="\t@Override\r\n";
		code+="\tpublic List<"+entityName+"> query"+className+"List(Map<String,Object> condition){\r\n";
		code+="\t\treturn this."+daoName+".query"+className+"List(condition);\r\n";
		code+="\t}\r\n";
		code+="\r\n";
		
		code+="\t/**\r\n";
		code+="\t * 分页查询"+table.remark+"\r\n";
		code+="\t * @param condition 查询条件\r\n";
		code+="\t * @param page 分页对像\r\n";
		code+="\t * @return\r\n";
		code+="\t */\r\n";
		code+="\t@Override\r\n";
		code+="\tpublic IPageList<"+entityName+"> query"+className+"List(Map<String,Object> condition,IPageSize page){\r\n";
		code+="\t\treturn this."+daoName+".query"+className+"List(condition,page);\r\n";
		code+="\t}\r\n";
		code+="\r\n";
		
		code+="}\r\n";
		
		fileJson.push({"path":"src\\main\\java\\banger\\service\\impl","filename":className+"Service.java","content":code});
		
	}
	
	for(var tableName in tables){
		var code="";
		table = tables[tableName];
		interfaceName = "I"+getLower(tableName);
		className = getLower(tableName);
		entityName = getLower(tableName);
		paramName = getFirstLowerNoPre(tableName);
		pk = getPKField(table);
		
		code+="package banger.service.intf;\r\n";
		code+="\r\n";
		code+="import java.util.List;\r\n";
		code+="import java.util.Map;\r\n";
		code+="\r\n";
		code+="import banger.framework.pagesize.IPageList;\r\n";
		code+="import banger.framework.pagesize.IPageSize;\r\n";
		if(module)code+="import banger.domain."+module+"."+entityName+";\r\n";
		code+="\r\n";
		
		code+="/**\r\n";
		code+=" * "+table.remark+"业务访问接口\r\n";
		code+=" */\r\n";
		code+="public interface "+interfaceName+"Service {\r\n";
		code+="\r\n";
		
		code+="\t/**\r\n";
		code+="\t * 新增"+table.remark+"\r\n";
		code+="\t * @param "+paramName+" 实体对像\r\n";
		code+="\t * @param loginUserId 登入用户Id\r\n";
		code+="\t */\r\n";
		code+="\tvoid insert"+className+"("+entityName+" "+paramName+",Integer loginUserId);\r\n";
		code+="\r\n";
		
		code+="\t/**\r\n";
		code+="\t *修改"+table.remark+"\r\n";
		code+="\t * @param "+paramName+" 实体对像\r\n";
		code+="\t * @param loginUserId 登入用户Id\r\n";
		code+="\t */\r\n";
		code+="\tvoid update"+className+"("+entityName+" "+paramName+",Integer loginUserId);\r\n";
		code+="\r\n";
		
		if(pk){
			code+="\t/**\r\n";
			code+="\t * 通过主键删除"+table.remark+"\r\n";
			code+="\t * @param "+getFirstLower(pk.name)+" 主键Id\r\n";
			code+="\t */\r\n";
			code+="\tvoid delete"+className+"ById("+getValueType(pk.type)+" "+getFirstLower(pk.name)+");\r\n";
			code+="\r\n";
			
			code+="\t/**\r\n";
			code+="\t * 通过主键得到"+table.remark+"\r\n";
			code+="\t * @param "+getFirstLower(pk.name)+" 主键Id\r\n";
			code+="\t */\r\n";
			code+="\t"+entityName+" get"+className+"ById("+getValueType(pk.type)+" "+getFirstLower(pk.name)+");\r\n";
			code+="\r\n";
		}
		
		code+="\t/**\r\n";
		code+="\t * 查询"+table.remark+"\r\n";
		code+="\t * @param condition 查询条件\r\n";
		code+="\t * @return\r\n";
		code+="\t */\r\n";
		code+="\tList<"+entityName+"> query"+className+"List(Map<String,Object> condition);\r\n";
		code+="\r\n";
		
		code+="\t/**\r\n";
		code+="\t * 分页查询"+table.remark+"\r\n";
		code+="\t * @param condition 查询条件\r\n";
		code+="\t * @param page 分页对像\r\n";
		code+="\t * @return\r\n";
		code+="\t */\r\n";
		code+="\tIPageList<"+entityName+"> query"+className+"List(Map<String,Object> condition,IPageSize page);\r\n";
		code+="\r\n";
		
		code+="}\r\n";
		
		fileJson.push({"path":"src\\main\\java\\banger\\service\\intf","filename":interfaceName+"Service.java","content":code});
		
	}
	
	return fileJson;
}
