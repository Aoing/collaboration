package aoing.service.config;

import javax.websocket.Endpoint;
import javax.websocket.server.ServerApplicationConfig;
import javax.websocket.server.ServerEndpointConfig;
import java.util.Set;

/**
 * @author Aoing
 * @Description
 * @create 2020-03-25 18:38:32
 * @since v1.0.0
 */
public class WebSocketConfig implements ServerApplicationConfig {

    /**
     * 基于注解的开启方式
     */
    @Override
    public Set<Class<?>> getAnnotatedEndpointClasses(Set<Class<?>> scanedSockets) {
        System.out.println("=========================");
        System.out.println("  WebSocket装载配置...");
        System.out.println("=========================");
        return scanedSockets;
    }

    /**
     * 结余接口的开启方式
     */
    @Override
    public Set<ServerEndpointConfig> getEndpointConfigs(Set<Class<? extends Endpoint>> arg0) {
        return null;
    }

}
