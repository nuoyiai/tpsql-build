package tpsql.httpserver.netty;

import org.springframework.context.ApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;
import org.springframework.mock.web.MockServletConfig;
import org.springframework.mock.web.MockServletContext;
import org.springframework.web.context.support.XmlWebApplicationContext;
import org.springframework.web.servlet.DispatcherServlet;
import tpsql.httpserver.IHttpServer;

import javax.servlet.ServletException;

public class SpringMVCNettyServer implements IHttpServer {
    protected IHttpServer netServer;
    protected ApplicationContext ctx;
    protected DispatcherServlet servlet;

    public SpringMVCNettyServer(ApplicationContext ctx){
        this.ctx = ctx;
        servlet = getDispatcherServlet(ctx);
    }

    public void start(int port){
        netServer = new NettyServletServer(servlet);
        netServer.start(port);
    }

    public void stop(){
        netServer.stop();
    }

    protected static DispatcherServlet getDispatcherServlet(ApplicationContext ctx){
        XmlWebApplicationContext mvcContext = new XmlWebApplicationContext();
        mvcContext.setConfigLocation("classpath*:/cfg/spring-servlet.xml");
        mvcContext.setParent(ctx);

        MockServletContext servletContext = new MockServletContext();
        MockServletConfig servletConfig = new MockServletConfig(servletContext);

        mvcContext.setServletConfig(servletConfig);
        mvcContext.setServletContext(servletContext);
        mvcContext.refresh();
        DispatcherServlet dispatcherServlet = new DispatcherServlet(mvcContext);
        try {
            dispatcherServlet.init(servletConfig);
        } catch (ServletException e) {
            e.printStackTrace();
        }
        return dispatcherServlet;
    }


}
