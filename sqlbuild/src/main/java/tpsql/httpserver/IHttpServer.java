package tpsql.httpserver;

/**
 * 网络服务
 */
public interface IHttpServer {

    /**
     * 启动服务
     * @param port
     */
    void start(int port);

    /**
     * 停止服务
     */
    void stop();

}
