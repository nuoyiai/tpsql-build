package tpsql.build.controller;

import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import tpsql.build.util.DbConfigUtil;
import tpsql.collection.DataRow;
import tpsql.collection.DataTable;
import tpsql.json.*;
import tpsql.reader.Reader;
import tpsql.sql.command.IDataReader;
import tpsql.sql.config.IDbConfig;
import tpsql.sql.driver.IDataProvider;
import tpsql.sql.driver.SqlDataProvider;
import tpsql.sql.util.ISqlHelper;
import tpsql.sql.util.SqlHelper;
import tpsql.util.FileUtil;
import tpsql.util.StringUtil;

import javax.servlet.http.HttpServletResponse;
import java.io.*;
import java.util.Map;
import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;

@Controller
@Scope("prototype")
@RequestMapping(value="/build")
public class DbTableMetaController extends BaseController {

    @ResponseBody
    @RequestMapping(value="/getTableTree",method=RequestMethod.POST)
    public void getTableTree() {
        String tableJson = getDbTreeJson();
        this.renderText(tableJson);
    }

    @ResponseBody
    @RequestMapping(value="/getTableJson",method=RequestMethod.POST)
    public void getTableJson() {
        String tableName = this.getParameter("tableName");
        String tableJson = getTableInfoJson(tableName);
        this.renderText(tableJson);
    }

    @ResponseBody
    @RequestMapping(value="/buildCodeFiles",method=RequestMethod.POST)
    public void buildCodeFiles(){
        String jsonString = this.getParameter("json");
        JsonArray array = JsonArray.fromObject(jsonString);
        try {
            String path = new File("").getAbsolutePath();
            String zipFile = buildZipFile(FileUtil.contact(path,"sqlbuild/target"),array);
            this.renderText(zipFile);
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    @ResponseBody
    @RequestMapping(value="/downloadBuildFile",method=RequestMethod.GET)
    public void downloadBuildFile(){
        String filename = this.getParameter("filename");
        downloadFile(filename);
    }

    private String getDbTreeJson(){
        try{
            ISqlHelper ish = getSqlHelper();
            Map<String, Object> metaMap = ish.getMetaDataMap();
            String schema = (String)metaMap.get("schema");
            String outJsonString = getTableTreeJson(ish,schema);
            ish.dispose();
            return outJsonString;
        }catch(Exception e){
            e.printStackTrace();
            return null;
        }
    }

    private String getTableInfoJson(String tableName){
        try{
            ISqlHelper ish = getSqlHelper();
            Map<String, Object> metaMap = ish.getMetaDataMap();
            String schema = (String)metaMap.get("schema");
            String outJsonString = outputTableGrid(ish, tableName, schema);
            ish.dispose();
            return outJsonString;
        }catch(Exception e){
            e.printStackTrace();
            return null;
        }
    }

    private ISqlHelper getSqlHelper(){
        IDbConfig dbConfig = DbConfigUtil.getDbConfig();
        IDataProvider dataProvider = new SqlDataProvider(dbConfig);
        ISqlHelper ish = new SqlHelper(dataProvider);
        return ish;
    }

    private String outputTableGrid(ISqlHelper ish, String tableName, String schema)
    {
        StringBuilder sb = new StringBuilder();
        sb.append("[");
        String fieldSqlString = ish.getDialect().getMetaSql().getFieldsSql(tableName);
        DataTable table = ish.getDataTable(fieldSqlString);
        String tableSchema = null;
        boolean firstFlag = true;
        boolean existColumn = table.contains("TABLE_SCHEMA");
        for (DataRow row : table)
        {
            String fieldName = ((String)Reader.stringReader().getValue(row, "FIELD_NAME")).trim();
            String fieldType = (String)Reader.stringReader().getValue(row, "FIELD_TYPE");
            Integer fieldLength = (Integer)Reader.intReader().getValue(row, "FIELD_LENGTH");
            Integer precision = (Integer)Reader.intReader().getValue(row, "FIELD_PRECISION");
            Integer scale = (Integer)Reader.intReader().getValue(row, "FIELD_SCALE");

            if(existColumn)tableSchema = ((String)Reader.stringReader().getValue(row,"TABLE_SCHEMA"));
            if(!StringUtil.isNotEmpty(tableSchema) || schema.equalsIgnoreCase(tableSchema)){
                if (fieldLength == null)
                    fieldLength = Integer.valueOf(0);
                if (precision == null)
                    precision = Integer.valueOf(0);
                if (scale == null)
                    scale = Integer.valueOf(0);
                String remark = (String)Reader.stringReader().getValue(row, "FIELD_REMARK");
                if (remark != null)
                    remark = remark.replaceAll("\n", "").replaceAll("\t", "").trim();
                String nullable = (String)Reader.stringReader().getValue(row, "NULLABLE");
                String pk = (String)Reader.stringReader().getValue(row, "IS_PK");
                String fieldTypeName = StringUtil.isNumber(fieldType) ? ish.getDialect().getMetaSql().getType(Integer.parseInt(fieldType)).toString().toUpperCase() : getAdapterFileTypeName(fieldType, fieldLength, precision, scale).toUpperCase();
                if (!firstFlag)
                    sb.append(",");
                sb.append("{");
                sb.append(StringUtil.format("\"name\":\"{0}\",\"type\":\"{1}\",\"desc\":\"{2}\",\"length\":{3},\"table\":\"{4}\"", new Object[] {
                        fieldName, fieldTypeName, remark, fieldLength ,tableName
                }));
                if (precision != null)
                    sb.append((new StringBuilder(",\"precision\":")).append(precision).toString());
                if (scale != null)
                    sb.append((new StringBuilder(",\"scale\":")).append(scale).toString());
                if ("Y".equals(nullable))
                    sb.append(",\"nullable\":true");
                if ("Y".equals(pk))
                    sb.append(",\"pk\":true");
                sb.append("}");
                firstFlag = false;
            }
        }

        sb.append("]");
        String outJsonString = sb.toString();
        return outJsonString;
    }

    private String getAdapterFileTypeName(String fieldType, Integer fieldLength, Integer precision, Integer scale)
    {
        if ("NUMBER".equals(fieldType))
        {
            if (fieldLength.intValue() == 22 && scale.intValue() == 0)
                return "INTEGER";
            if (fieldLength.intValue() == 22 && scale.intValue() > 0)
                if (precision.intValue() > 15)
                    return "DECIMAL";
                else
                    return "DOUBLE";
        } else
        if ("TIMESTAMP(6)".equals(fieldType))
            return "TIMESTAMP";
        return fieldType;
    }

    private String getTableTreeJson(ISqlHelper ish,String schema)
    {
        String tableSqlString = ish.getDialect().getMetaSql().getTablesSql();
        IDataReader reader = ish.getDataReader(tableSqlString);
        StringBuilder sb = new StringBuilder();
        sb.append("[");
        sb.append("{\"id\":\""+schema+"\",\"type\":\"dbConfig\",\"pid\":\"\",\"text\":\""+schema+"\"}");
        sb.append(",{\"id\":\"tables\",\"type\":\"Tables\",\"pid\":\""+schema+"\",\"text\":\"Tables\"}");
        String tableName;
        String tableRemark;
        String tableSchema = null;

        boolean existColumn = reader.findColumn("TABLE_SCHEMA")!=-1;
        while(reader.read()){
            tableName = ((String)reader.get("TABLE_NAME")).toUpperCase().trim();
            if(existColumn)tableSchema = ((String)reader.get("TABLE_SCHEMA"));
            Object remark = reader.get("TABLE_REMARK");
            if(!StringUtil.isNotEmpty(tableSchema) || schema.equalsIgnoreCase(tableSchema)){
                tableRemark = remark == null ? "" : (String)remark;
                sb.append(StringUtil.format(",{\"id\":\"{0}\",\"type\":\"table\",\"pid\":\"tables\",\"text\":\"{0}\",\"remark\":\"{1}\",\"drag\":true}",tableName, tableRemark.replaceAll("\n", "").trim()));
            }
        }

        sb.append("]");
        return sb.toString();
    }

    private String buildZipFile(String path,JsonArray array) throws IOException
    {
        String zipName = System.currentTimeMillis()+".zip";
        String strZipName = FileUtil.contact(path, zipName);
        ZipOutputStream out = new ZipOutputStream(new FileOutputStream(strZipName));

        for (int i=0;i<array.size();i++){
            JsonObject jo = array.getJsonObject(i);
            //String path = jo.getString("path");
            String filename = jo.getString("filename");
            String content = jo.getString("content").replaceAll("\\\\t", "\t").replaceAll("\\\\n", "\n").replaceAll("\\\\r", "\r").replaceAll("\\\\\"", "\"");
            byte[] buffer = content.getBytes("utf-8");
            out.putNextEntry(new ZipEntry(filename));
            out.write(buffer, 0, buffer.length);
            out.closeEntry();
        }

        out.close();

        return strZipName;
    }

    private void downloadFile(String fileName){
        if (fileName != null) {
            //设置文件路径
            File file = new File(fileName);
            if (file.exists()) {
                try {
                    String name = FileUtil.getFileName(fileName);
                    this.getResponse().setContentType("application/zip");
                    this.getResponse().setHeader("Content-Disposition", "attachment;filename="+new String(name.getBytes("utf-8"),"ISO-8859-1"));
                    this.getResponse().setHeader("Set-Cookie", "fileDownload=true; path=/");
                } catch (UnsupportedEncodingException e) {
                    e.printStackTrace();
                }
                byte[] buffer = new byte[1024];
                FileInputStream fis = null;
                BufferedInputStream bis = null;
                try {
                    fis = new FileInputStream(file);
                    bis = new BufferedInputStream(fis);
                    OutputStream os = this.getResponse().getOutputStream();
                    int i = bis.read(buffer);
                    while (i != -1) {
                        os.write(buffer, 0, i);
                        i = bis.read(buffer);
                    }
                } catch (Exception e) {
                    e.printStackTrace();
                } finally {
                    if (bis != null) {
                        try {
                            bis.close();
                        } catch (IOException e) {
                            e.printStackTrace();
                        }
                    }
                    if (fis != null) {
                        try {
                            fis.close();
                        } catch (IOException e) {
                            e.printStackTrace();
                        }
                    }
                }

                file.delete();
            }
        }
    }

}
