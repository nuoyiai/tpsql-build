package tpsql.build.util;

import tpsql.sql.config.DriverDbConfig;
import tpsql.util.PropertiesUtil;

import java.util.Map;

public class DbConfigUtil {

    public static DriverDbConfig getDbConfig(){
        Map map = PropertiesUtil.loadPropertyMapByResource("/cfg/dbconfig/dbconfig.properties");
        String url = (String)map.get("jdbc.url");
        String driverClassName = (String)map.get("jdbc.driverClassName");
        String username = (String)map.get("jdbc.username");
        String password = (String)map.get("jdbc.password");
        String dbType = getDbType(url);
        String dialectClass = getDialectClassByDbType(dbType);
        DriverDbConfig dbConfig = new DriverDbConfig();
        dbConfig.setDbType(dbType);
        dbConfig.setDialectClass(dialectClass);
        dbConfig.setUrl(url);
        dbConfig.setDriverClass(driverClassName);
        dbConfig.setUsername(username);
        dbConfig.setPassword(password);
        return dbConfig;
    }

    protected static String getDialectClassByDbType(String dbType){
        if(dbType.contains("mysql"))
            return "tpsql.sql.dialect.MySqlDialect";
        else if(dbType.contains("db2"))
            return "tpsql.sql.dialect.DB2Dialect";
        else if(dbType.contains("oracle"))
            return "tpsql.sql.dialect.OracleDialect";
        else if(dbType.contains("sqlite"))
            return "tpsql.sql.dialect.SqliteDialect";
        return "";
    }

    protected static String getDbType(String jdbcUrl){
        if(jdbcUrl.indexOf("db2")>-1){
            return "db2";
        }else if(jdbcUrl.indexOf("oracle")>-1){
            return "oracle";
        }else if(jdbcUrl.indexOf("mysql")>-1){
            return "mysql";
        }else if(jdbcUrl.indexOf("sqlite")>-1){
            return "sqlite";
        }
        return "";
    }

}
