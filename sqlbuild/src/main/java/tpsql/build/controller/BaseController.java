package tpsql.build.controller;

import tpsql.httpserver.servlet.ServletContextHolder;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.*;

public class BaseController {

    protected String render(String text, String contentType) {
        try {
            HttpServletResponse response = getResponse();
            response.setContentType(contentType);
            response.getWriter().write(text);
        } catch (IOException e) {
        }
        return null;
    }

    public String renderText(String text) {
        return render(text, "text/plain;charset=UTF-8");
    }

    /**
     * 得到Servlet的请求对像
     * @return
     */
    public HttpServletRequest getRequest() {
        return ServletContextHolder.getRequest();
    }

    /**
     * 得到Servlet的响应对像
     * @return
     */
    public HttpServletResponse getResponse() {
        return ServletContextHolder.getResponse();
    }

    /**
     * 获取参数
     * @param parameterName
     * @return
     */
    public String getParameter(String parameterName){
        return this.getRequest().getParameter(parameterName);
    }



}
