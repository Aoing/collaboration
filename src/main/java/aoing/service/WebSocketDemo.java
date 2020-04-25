package aoing.service;

import aoing.bean.Annotation;
import aoing.dao.AnnotationDao;
import aoing.dao.AnnotationDaoFactory;
import aoing.utils.CommonUtils;
import aoing.utils.JackSonUtils;

import javax.json.Json;
import javax.websocket.OnClose;
import javax.websocket.OnMessage;
import javax.websocket.OnOpen;
import javax.websocket.Session;
import javax.websocket.server.ServerEndpoint;
import java.io.IOException;
import java.util.List;
import java.util.concurrent.CopyOnWriteArraySet;

/**
 * @author Aoing
 * @Description
 * @create 2020-03-25 18:28:12
 * @since v1.0.0
 */

@ServerEndpoint("/websocket")
public class WebSocketDemo {

    private static  int onlineCount=1;
    private Session session;


    private static final CopyOnWriteArraySet<WebSocketDemo> set=new CopyOnWriteArraySet();

    @OnOpen
    public void open(Session session){
        this.session = session;
        CommonUtils.LOGGER.info(this.session.getBasicRemote() + "===========>打开websocket");
        set.add(this);
        add();

        for(WebSocketDemo item:set){
            try {
                item.sendMessage("[{\"xStart\":0,\"yStart\":0,\"width\":100,\"height\":100,\"xEnd\":100,\"yEnd\":100,\"position\":\"bottomRight\",\"mark\":\"1\",\"lineWidth\":1,\"borderColor\":\"blue\",\"isSelected\":false,\"author\":\"author\",\"date\":\"20200424\",\"id\":0},{\"xStart\":211,\"yStart\":36,\"width\":998,\"height\":479,\"xEnd\":1209,\"yEnd\":515,\"mark\":2,\"position\":\"bottomRight\",\"lineWidth\":1,\"isSelected\":false,\"date\":\"2020/4/25 上午9:38:44\"}]");
            }catch (Exception e){
                CommonUtils.LOGGER.error(e);
                continue;
            }
        }
    }

    @OnClose
    public void close(){
        set.remove(this);
        del();
        CommonUtils.LOGGER.info("===>关闭websocket=======");
    }

    @OnMessage
    public void onMessage(String message,Session session){

        CommonUtils.LOGGER.info("从客户端接收的消息 message：{}", message);

        Annotation[] annotationArr = JackSonUtils.jsonArrToBeanArr(message, Annotation[].class);

        CommonUtils.LOGGER.info("从服务器端获取的数据：{}", annotationArr.length);

        //将收到的客户端消息保存到数据库
        AnnotationDao annotationDao = AnnotationDaoFactory.getAnnotationDao();

        for (Annotation annotation : annotationArr) {
            annotationDao.add(annotation);
        }


        for(WebSocketDemo item:set){
            try {
                item.sendMessage(message);
                CommonUtils.LOGGER.info("接收到消息:{}", message);
            }catch (Exception e){
                CommonUtils.LOGGER.error(e);
                continue;
            }
        }
    }

    //服务端向客户端发送消息
    public void sendMessage(String message) throws IOException {
        this.session.getBasicRemote().sendText(message);
    }

    public static synchronized void add(){
        WebSocketDemo.onlineCount++;
    }

    public static synchronized void del(){
        WebSocketDemo.onlineCount--;
    }

}
