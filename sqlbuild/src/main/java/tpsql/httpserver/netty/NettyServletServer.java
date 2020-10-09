package tpsql.httpserver.netty;

import io.netty.bootstrap.ServerBootstrap;
import io.netty.channel.ChannelFuture;
import io.netty.channel.ChannelInitializer;
import io.netty.channel.ChannelOption;
import io.netty.channel.EventLoopGroup;
import io.netty.channel.nio.NioEventLoopGroup;
import io.netty.channel.socket.SocketChannel;
import io.netty.channel.socket.nio.NioServerSocketChannel;
import io.netty.handler.codec.http.HttpObjectAggregator;
import io.netty.handler.codec.http.HttpRequestDecoder;
import io.netty.handler.codec.http.HttpResponseEncoder;
import io.netty.handler.stream.ChunkedWriteHandler;
import org.springframework.web.servlet.DispatcherServlet;
import tpsql.httpserver.IHttpServer;
import tpsql.httpserver.netty.handler.HttpRequestHandler;

public class NettyServletServer implements IHttpServer {

    private EventLoopGroup bossGroup;
    private EventLoopGroup workerGroup;
    private DispatcherServlet servlet;

    public NettyServletServer(DispatcherServlet servlet) {
        this.servlet = servlet;
    }

    public void start(int port) {
        bossGroup = new NioEventLoopGroup();
        workerGroup = new NioEventLoopGroup();
        try {
            ServerBootstrap bootstrap = new ServerBootstrap();
            bootstrap.group(bossGroup, workerGroup)
                    .option(ChannelOption.SO_BACKLOG, 1024)
                    .channel(NioServerSocketChannel.class)
                    //.handler(new LoggingHandler(LogLevel.INFO))
                    .childHandler(new ChannelInitializer<SocketChannel>() {

                        @Override
                        protected void initChannel(SocketChannel ch) throws Exception {
                            ch.pipeline().addLast("http-decoder", new HttpRequestDecoder());
                            ch.pipeline().addLast("http-aggregator", new HttpObjectAggregator(2147483647));   //将多个消息转化成一个
                            ch.pipeline().addLast("http-encoder", new HttpResponseEncoder());
                            ch.pipeline().addLast("http-chunked", new ChunkedWriteHandler());        //解决大码流的问题
                            ch.pipeline().addLast("http-server", new HttpRequestHandler(servlet));
                        }
                    });
            ChannelFuture future = bootstrap.bind(port);
            future.channel().closeFuture().sync();
        } catch (InterruptedException e) {
            e.printStackTrace();
        } finally {
            bossGroup.shutdownGracefully();
            workerGroup.shutdownGracefully();
        }
    }

    public void stop() {
        bossGroup.shutdownGracefully();
        workerGroup.shutdownGracefully();
    }

}
