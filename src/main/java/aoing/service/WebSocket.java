
package aoing.service;

import aoing.utils.CommonUtils;

import javax.websocket.*;
import javax.websocket.server.PathParam;
import javax.websocket.server.ServerEndpoint;
import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicInteger;

/**
 * @author Aoing
 * @Description
 * @create 2020-04-24 21:07:17
 * @since v1.0.0
 */

@ServerEndpoint("/websocket/test")    // 注解是一个类层次的注解，它的功能主要是将目前的类定义成一个 websocket 服务器端, 注解的值将被用于监听用户连接的终端访问 URL 地址,客户端可以通过这个 URL 来连接到 WebSocket 服务器端
public class WebSocket {
    // 静态变量，用来记录当前在线连接数。应该把它设计成线程安全的。
    private static AtomicInteger onlineCount = new AtomicInteger(0);

/* concurrent包的线程安全Set，用来存放每个客户端对应的MyWebSocket对象。
    若要实现服务端与单一客户端通信的话，可以使用Map来存放，其中Key可以为用户标识
     private static CopyOnWriteArraySet<WebSocket> webSocketSet = new
     CopyOnWriteArraySet<WebSocket>();
     与某个客户端的连接会话，需要通过它来给客户端发送数据
    记录每个客户端的实例变量, 现在拿下面的全局map记录
    private Session session;*/


    private static Map<String, Session> webSocketMap = new ConcurrentHashMap<String, Session>();

    /**
     * 连接建立成功调用的方法
     *
     * @param session 可选的参数。session为与某个客户端的连接会话，需要通过它来给客户端发送数据
     */

    @OnOpen
    public void onOpen(@PathParam("clientId") String clientId, Session session) {
        // 用登录用户编号和 sessionId 的拼接来做 webSocket 通信的唯一标识
        String key = getWebSocketMapKey(clientId, session);
        webSocketMap.put(key, session);
        addOnlineCount(); // 在线数加1
        CommonUtils.LOGGER.info("WebSocket有新连接加入！当前在线人数为{}" , getOnlineCount());
    }

    /**
     * 连接关闭调用的方法
     */

    @OnClose
    public void onClose(@PathParam("clientId") String clientId, Session session, CloseReason closeReason) {
        String key = getWebSocketMapKey(clientId, session);
        webSocketMap.remove(key, session);
        subOnlineCount(); // 在线数减1
        CommonUtils.LOGGER.info("WebSocket有一连接关闭！当前在线人数为{}" ,  getOnlineCount());
    }

    /**
     * 收到客户端消息后调用的方法
     *
     * @param message 客户端发送过来的消息
     * @param session 可选的参数
     */

    @OnMessage
    public void onMessage(@PathParam("clientId") String clientId, String message, Session session) {
        CommonUtils.LOGGER.info("WebSocket收到来自客户端的消息: {}" , message);
        sendMessageByClientId(clientId, message);
    }

    /**
     * 获取webSocketMap集合的Key
     *
     * @param clientId 用户编号
     * @param session  webSocket的Session
     * @return
     */

    private String getWebSocketMapKey(String clientId, Session session) {
        if (clientId == null ) {
            return session.getId();

        } else {
            return clientId + "_" + session.getId();
        }
    }

    /**
     * 发生错误时调用
     *
     * @param session
     * @param error
     */

    @OnError
    public void onError(Session session, Throwable error) {
        CommonUtils.LOGGER.error("WebSocket发生错误");
    }

    // 群发消息
    public static void doSend(String message) {
        if (webSocketMap.size() > 0) {
            for (Map.Entry<String, Session> entry : webSocketMap.entrySet()) {
                try {
                    sendMessage(entry.getValue(), message);
                } catch (IOException e) {
                    CommonUtils.LOGGER.error("WebSocket doSend is error:");
                    continue;
                }
            }
        }
    }

    public static void sendMessage(Session session, String message) throws IOException {
        session.getBasicRemote().sendText(message);
    }

    public static int sendMessageByClientIdList(List<String> clientIdList, String message) {
        int status = 0;
        for (String clientId : clientIdList) {
            status = sendMessageByClientId(clientId, message);
        }
        return status;
    }

    /**
     * 通过用户的编号来发送webSocket消息
     *
     * @param clientId
     * @param message
     */

    public static int sendMessageByClientId(String clientId, String message) {
        int status = 0;
        if (webSocketMap.size() > 0) {
            for (Map.Entry<String, Session> entry : webSocketMap.entrySet()) {
                try {
                    String key = entry.getKey();
                    // 判断 webSocketMap 中的 clientId 和发送的 clientId 是否相同
                    // 若相同则进行发送消息
                    String key1 = key.substring(0, key.lastIndexOf("_"));
                    if (key1.equals(clientId)) {
                        sendMessage(entry.getValue(), message);
                        status = 200;
                    }
                } catch (IOException e) {
                    CommonUtils.LOGGER.error("WebSocket doSend is error:");
                    continue;
                }
            }
        }
        return status;
    }

    public static void sendSpeechMessageByClientId(String clientId, String message) {
        if (webSocketMap.size() > 0) {
            for (Map.Entry<String, Session> entry : webSocketMap.entrySet()) {
                try {
                    String key = entry.getKey();
                    // 判断webSocketMap中的clientId和发送的clientId是否相同
                    // 若相同则进行发送消息
                    String key1 = key.substring(0, key.lastIndexOf("_"));
                    if (key1.equals(clientId)) {
                        sendMessage(entry.getValue(), message);
                    }
                } catch (IOException e) {
                    CommonUtils.LOGGER.error("WebSocket doSend is error:");
                    continue;
                }
            }
        }
    }

    public static synchronized AtomicInteger getOnlineCount() {
        return onlineCount;
    }

    public static synchronized void addOnlineCount() {
        WebSocket.onlineCount.getAndIncrement();
    }

    public static synchronized void subOnlineCount() {
        WebSocket.onlineCount.getAndDecrement();
    }
}

