package tpsql.httpserver.netty.handler;

import io.netty.buffer.ByteBuf;
import io.netty.buffer.Unpooled;
import io.netty.channel.ChannelFuture;
import io.netty.channel.ChannelFutureListener;
import io.netty.channel.ChannelHandlerContext;
import io.netty.channel.SimpleChannelInboundHandler;
import io.netty.handler.codec.http.*;
import io.netty.handler.codec.http.cookie.DefaultCookie;
import io.netty.handler.codec.http.cookie.ServerCookieEncoder;
import io.netty.handler.codec.http.multipart.DefaultHttpDataFactory;
import io.netty.handler.codec.http.multipart.HttpPostRequestDecoder;
import io.netty.handler.codec.http.multipart.InterfaceHttpData;
import io.netty.handler.codec.http.multipart.InterfaceHttpData.HttpDataType;
import io.netty.handler.codec.http.multipart.MemoryAttribute;
import io.netty.util.CharsetUtil;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.mock.web.MockHttpServletResponse;
import org.springframework.web.servlet.DispatcherServlet;
import org.springframework.web.util.UriComponents;
import org.springframework.web.util.UriComponentsBuilder;
import org.springframework.web.util.UriUtils;
import tpsql.httpserver.servlet.ServletContextHolder;
import tpsql.util.FileUtil;
import tpsql.util.StringUtil;

import javax.servlet.ServletContext;
import java.io.*;
import java.net.URL;
import java.net.URLDecoder;
import java.text.SimpleDateFormat;
import java.util.*;
import java.util.Map.Entry;
import java.util.jar.JarFile;
import java.util.zip.ZipEntry;

public class HttpRequestHandler extends SimpleChannelInboundHandler<FullHttpRequest> {
    //private static final long OTHER_EXPIRES_TIME_SECOND = 300;
    //private static final long OTHER_EXPIRES_TIME_MILLISECOND = OTHER_EXPIRES_TIME_SECOND * 1000;
    private static final long IMAGE_EXPIRES_TIME_SECOND = 30 * 24 * 3600;
    private static final long IMAGE_EXPIRES_TIME_MILLISECOND = IMAGE_EXPIRES_TIME_SECOND * 1000;
    private static final SimpleDateFormat GMT_DATE_FORMAT = new SimpleDateFormat("EEE, dd MMM yyyy HH:mm:ss 'GMT'",Locale.US);
    private static final Map<String,Long> lastModifiedMap = new HashMap<String, Long>();
    private static final Map<String,JarFile> jarFileMap = new HashMap<String, JarFile>();

    public HttpRequestHandler(DispatcherServlet servlet) {
        this.servlet = servlet;
        this.servletContext = servlet.getServletConfig().getServletContext();
    }

    @Override
    public void exceptionCaught(ChannelHandlerContext ctx, Throwable e) throws Exception {
        ctx.close();
    }

    protected void channelRead0(ChannelHandlerContext ctx, FullHttpRequest fullHttpRequest) throws Exception {
        String uri = fullHttpRequest.uri();
        String fix = FileUtil.getFileFix(uri);
        if(StringUtil.isNotEmpty(fix) && isStaticFix(fix) && HttpMethod.GET.equals(fullHttpRequest.method())) {
            String mimeType = getMimeTypeByFix(fix);
            String modifiedSince = fullHttpRequest.headers().get("If-Modified-Since");
            String source = uri;
            long lastModified = getlastModified(source);
            boolean notModified = isEqualModified(lastModified,modifiedSince);
            if(notModified){
                FullHttpResponse response = new DefaultFullHttpResponse(HttpVersion.HTTP_1_1, HttpResponseStatus.NOT_MODIFIED);
                ChannelFuture writeFuture = ctx.writeAndFlush(response);
                writeFuture.addListener(ChannelFutureListener.CLOSE);
            }else if(lastModified > 0) {
                Date nowDate = new Date();
                Date modifiedDate = new Date(lastModified);
                String modifiedDateStr = GMT_DATE_FORMAT.format(modifiedDate);
                FullHttpResponse response = new DefaultFullHttpResponse(HttpVersion.HTTP_1_1, HttpResponseStatus.OK);
                response.headers().set("Content-Type", mimeType);
                response.headers().set("Last-Modified", modifiedDateStr);
                if (isImageFix(fix)) {
                    Date expiresDate = new Date(nowDate.getTime() + IMAGE_EXPIRES_TIME_MILLISECOND);
                    response.headers().set("Cache-Control", "max-age=" + IMAGE_EXPIRES_TIME_SECOND);
                    response.headers().set("Date", nowDate);
                    response.headers().set("Expires", expiresDate);
                } else {
                    //Date expiresDate = new Date(nowDate.getTime()+OTHER_EXPIRES_TIME_MILLISECOND);
                    //response.headers().set("Cache-Control", "max-age="+OTHER_EXPIRES_TIME_SECOND);
                    response.headers().set("Date", nowDate);
                    //response.headers().set("Expires", expiresDate);
                }
                //response.headers().set("Content-Encoding","gzip");
                byte[] buffer = new byte[4096];
                InputStream inputStream = getClass().getResourceAsStream(source);
                BufferedInputStream bufferedInputStream = new BufferedInputStream(inputStream);
                int len = bufferedInputStream.read(buffer);
                while (len != -1) {
                    response.content().writeBytes(buffer, 0, len);
                    len = bufferedInputStream.read(buffer);
                }

                ChannelFuture writeFuture = ctx.writeAndFlush(response);
                writeFuture.addListener(ChannelFutureListener.CLOSE);
                //System.out.println(uri);
            }
        }else {
            boolean flag = HttpMethod.POST.equals(fullHttpRequest.method())
                    || HttpMethod.GET.equals(fullHttpRequest.method());

            Map<String, String> parammap = getRequestParams(ctx, fullHttpRequest);
            if (flag && ctx.channel().isActive()) {
                //HTTP请求、GET/POST
                MockHttpServletResponse servletResponse = new MockHttpServletResponse();
                MockHttpServletRequest servletRequest = new MockHttpServletRequest(servletContext);
                // headers
                for (String name : fullHttpRequest.headers().names()) {
                    if("cookie".equalsIgnoreCase(name)){
                        try {
                            String cookieStr = fullHttpRequest.headers().get(name);
                            List<javax.servlet.http.Cookie> cookies = new ArrayList<javax.servlet.http.Cookie>();
                            String[] cookieParts = cookieStr.split(";", -1);
                            for (String cookiePart : cookieParts) {
                                String[] part = cookiePart.split("=");
                                cookies.add(new javax.servlet.http.Cookie(part[0].trim(), part[1].trim()));
                            }
                            servletRequest.setCookies(cookies.toArray(new javax.servlet.http.Cookie[0]));
                        }catch (Exception e){
                            e.printStackTrace();
                        }
                    }else {
                        for (String value : fullHttpRequest.headers().getAll(name)) {
                            servletRequest.addHeader(name, value);
                        }
                    }
                }
                uri = new String(uri.getBytes("ISO8859-1"), "UTF-8");
                uri = URLDecoder.decode(uri, "UTF-8");
                UriComponents uriComponents = UriComponentsBuilder.fromUriString(uri).build();
                String path = uriComponents.getPath();
                path = URLDecoder.decode(path, "UTF-8");
                servletRequest.setRequestURI(path);
                servletRequest.setServletPath(path);
                servletRequest.setMethod(fullHttpRequest.getMethod().name());

                if (uriComponents.getScheme() != null) {
                    servletRequest.setScheme(uriComponents.getScheme());
                }
                if (uriComponents.getHost() != null) {
                    servletRequest.setServerName(uriComponents.getHost());
                }
                if (uriComponents.getPort() != -1) {
                    servletRequest.setServerPort(uriComponents.getPort());
                }

                ByteBuf content = fullHttpRequest.content();
                content.readerIndex(0);
                byte[] data = new byte[content.readableBytes()];
                content.readBytes(data);
                servletRequest.setContent(data);

                try {
                    if (uriComponents.getQuery() != null) {
                        String query = UriUtils.decode(uriComponents.getQuery(), "UTF-8");
                        servletRequest.setQueryString(query);
                    }
                    if (parammap != null && parammap.size() > 0) {
                        for (String key : parammap.keySet()) {
                            servletRequest.addParameter(UriUtils.decode(key, "UTF-8"), UriUtils.decode(parammap.get(key) == null ? "" : parammap.get(key), "UTF-8"));
                        }
                    }

                } catch (UnsupportedEncodingException ex) {
                    ex.printStackTrace();
                }

                ServletContextHolder.prepare(servletRequest, servletResponse);

                try {
                    this.servlet.service(servletRequest, servletResponse);
                } catch (Exception e) {
                    System.out.println(e.getMessage());
                    //e.printStackTrace();
                }

                HttpResponseStatus status = HttpResponseStatus.valueOf(servletResponse.getStatus());
                //String result = servletResponse.getContentAsString();servletResponse.g
                //result = StringUtil.isEmpty(result) ? "" : result;
                FullHttpResponse response = new DefaultFullHttpResponse(HttpVersion.HTTP_1_1, status);

                byte[] buffer = new byte[4096];
                ByteArrayInputStream bufferedInputStream = new ByteArrayInputStream(servletResponse.getContentAsByteArray());
                int len = bufferedInputStream.read(buffer);
                while (len != -1) {
                    response.content().writeBytes(buffer, 0, len);
                    len = bufferedInputStream.read(buffer);
                }

                response.headers().set("Access-Control-Allow-Origin", "*");
                response.headers().set("Access-Control-Allow-Headers", "Content-Type,Content-Length, Authorization, Accept,X-Requested-With,X-File-Name");
                response.headers().set("Access-Control-Allow-Methods", "POST,GET");
                response.headers().set("Content-Length", Integer.valueOf(response.content().readableBytes()));
                response.headers().set("Connection", "keep-alive");
                for (Iterator iter = servletResponse.getHeaderNames().iterator(); iter.hasNext();) {
                    String headName = (String)iter.next();
                    Object headValue = servletResponse.getHeader(headName);
                    response.headers().set(headName,headValue);
                }

                javax.servlet.http.Cookie[] cookies = servletResponse.getCookies();
                if(cookies.length>0) {
                    for (javax.servlet.http.Cookie cookie : cookies) {
                        DefaultCookie defaultCookie = new DefaultCookie(cookie.getName(), cookie.getValue());
                        defaultCookie.setPath(cookie.getPath());
                        defaultCookie.setDomain(cookie.getDomain());
                        defaultCookie.setMaxAge(cookie.getMaxAge());
                        defaultCookie.setSecure(cookie.getSecure());
                        String cookieStr = ServerCookieEncoder.LAX.encode(defaultCookie);
                        response.headers().set(HttpHeaders.Names.SET_COOKIE, cookieStr);
                    }
                }

                ChannelFuture writeFuture = ctx.writeAndFlush(response);
                writeFuture.addListener(ChannelFutureListener.CLOSE);
            }
        }
    }

    private boolean isStaticFix(String fix){
        return ".css".equals(fix) || ".js".equals(fix)
                || ".jpg".equals(fix) || ".png".equals(fix)
                || ".gif".equals(fix) || ".htc".equals(fix)
                || ".htm".equals(fix);
    }

    private boolean isImageFix(String fix){
        return ".jpg".equals(fix) || ".png".equals(fix)
                || ".gif".equals(fix);
    }

    private String getMimeTypeByFix(String fix){
        if(".css".equals(fix))
            return "text/css";
        else if(".js".equals(fix))
            return "application/x-javascript";
        else if(".jpg".equals(fix))
            return "image/jpeg";
        else if(".png".equals(fix))
            return "image/png";
        else if(".gif".equals(fix))
            return "image/gif";
        else if(".htc".equals(fix))
            return "text/x-component";
        return "";
    }

    /**
     * 获取文件的最后修改时间,不存在返回-1
     * @param source
     * @return
     */
    private Long getlastModified(String source){
        if(!lastModifiedMap.containsKey(source)){
            URL url = getClass().getResource(source);
            if(url!=null){
                String str = url.toString();
                if(str.indexOf(".jar")>0){
                    String jarPath = getJarPath(str);
                    String uri = source.substring(1);
                    try {
                        if(!jarFileMap.containsKey(jarPath))
                            jarFileMap.put(jarPath,new JarFile(jarPath));
                        JarFile jarFile = jarFileMap.get(jarPath);
                        ZipEntry zipEntry = jarFile.getEntry(uri);
                        long lastModified = zipEntry.getTime();
                        lastModifiedMap.put(source, lastModified);
                    }catch (Exception e){
                        e.printStackTrace();
                        System.out.println(uri);
                    }
                }else if (new File(url.getPath()).exists()) {
                    long lastModified = new File(url.getPath()).lastModified();
                    lastModifiedMap.put(source, lastModified);
                }
            }else{
                lastModifiedMap.put(source,-1L);
            }
        }
        return lastModifiedMap.get(source);
    }

    /**
     *
     * @param path
     * @return
     */
    private String getJarPath(String path){
        int n = path.indexOf("file:");
        int m = path.indexOf(".jar");
        return path.substring(n+5,m+4);
    }

    /**
     * 判断客户端和服务器的修改时间是否一致
     * @param lastModified
     * @param modifiedSince
     * @return
     */
    private boolean isEqualModified(Long lastModified,String modifiedSince){
        if(lastModified!=null && lastModified>0 && StringUtil.isNotEmpty(modifiedSince)) {
            Date modifiedDate = new Date(lastModified);
            String modifiedDateStr = GMT_DATE_FORMAT.format(modifiedDate);
            //通过最后修改时间判断静态资源有没有被修改过
            return modifiedDateStr.equals(modifiedSince);
        }
        return false;
    }

    /**
     * 获取post请求、get请求的参数保存到map中
     */
    private Map<String, String> getRequestParams(ChannelHandlerContext ctx, HttpRequest req){
        Map<String, String>requestParams=new HashMap<String, String>();
        // 处理get请求
        if (req.getMethod() == HttpMethod.GET || req.getMethod() == HttpMethod.POST) {
            QueryStringDecoder decoder = new QueryStringDecoder(req.getUri());
            Map<String, List<String>> parame = decoder.parameters();
            Iterator<Entry<String, List<String>>> iterator = parame.entrySet().iterator();
            while (iterator.hasNext()) {
                Entry<String, List<String>> next = iterator.next();
                requestParams.put(next.getKey(), next.getValue().get(0));
            }
        }
        // 处理POST请求
        if (req.getMethod() == HttpMethod.POST) {
            HttpPostRequestDecoder decoder = new HttpPostRequestDecoder(
                    new DefaultHttpDataFactory(false), req);
            List<InterfaceHttpData> postData = decoder.getBodyHttpDatas(); //
            for(InterfaceHttpData data:postData){
                if (data.getHttpDataType() == HttpDataType.Attribute) {
                    MemoryAttribute attribute = (MemoryAttribute) data;
                    requestParams.put(attribute.getName(), attribute.getValue());
                }
            }
        }
        return requestParams;
    }

    private final DispatcherServlet servlet;
    private final ServletContext servletContext;
}
