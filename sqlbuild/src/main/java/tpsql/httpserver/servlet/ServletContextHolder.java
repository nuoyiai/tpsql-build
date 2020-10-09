package tpsql.httpserver.servlet;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

/**
 * 类解释
 *
 * @Version 1.0 2017/3/28
 * @Author Merlin
 */
public class ServletContextHolder {

    private ServletContextHolder(){}

    private static final ThreadLocal<ServletContext> LOCAL = new ThreadLocal<ServletContext>();

    public static void prepare(HttpServletRequest request, HttpServletResponse response){
        ServletContext context = new ServletContext(request, response);
        LOCAL.set(context);
    }

    public static HttpServletRequest getRequest(){
        return LOCAL.get().getRequest();
    }

    public static HttpServletResponse getResponse(){
        return LOCAL.get().getResponse();
    }

    public static HttpSession getSession(){
        return LOCAL.get().getRequest().getSession();
    }

    public static ServletContext getServletContext(){
        return LOCAL.get();
    }

}
