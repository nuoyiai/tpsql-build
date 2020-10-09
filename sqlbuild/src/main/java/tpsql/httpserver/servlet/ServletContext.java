package tpsql.httpserver.servlet;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 * 类解释
 *
 * @Version 1.0 2017/3/28
 * @Author Merlin
 */
public class ServletContext {

    private final HttpServletRequest request;

    private final HttpServletResponse response;

    public ServletContext(HttpServletRequest request, HttpServletResponse response) {
        this.request = request;
        this.response = response;
    }

    public HttpServletResponse getResponse() {
        return response;
    }

    public HttpServletRequest getRequest() {
        return request;
    }
}
