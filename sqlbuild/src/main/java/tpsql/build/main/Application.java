package tpsql.build.main;

import org.springframework.context.ApplicationContext;
import org.springframework.context.support.FileSystemXmlApplicationContext;
import tpsql.httpserver.IHttpServer;
import tpsql.httpserver.netty.SpringMVCNettyServer;
import tpsql.util.StringUtil;

public class Application {

    public static void main(String[] args){
        Integer port = 1109;
        if(args!=null && args.length>0){
            if(StringUtil.isNotEmpty(args[0])){
                port = Integer.parseInt(args[0]);
            }
        }
        startServer(port);
    }

    private static void startServer(Integer port){
        ApplicationContext ctx = new FileSystemXmlApplicationContext("classpath*:/cfg/tpsql.build.xml");
        IHttpServer netServer = new SpringMVCNettyServer(ctx);
        System.out.println("http://localhost:1109/ui/html/build/index.htm");
        netServer.start(port);
    }

}
