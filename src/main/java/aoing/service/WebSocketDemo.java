package aoing.service;

import aoing.bean.Annotation;
import aoing.dao.AnnotationDao;
import aoing.dao.AnnotationDaoFactory;
import aoing.utils.CommonUtils;
import aoing.utils.JackSonUtils;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

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

    private static int onlineCount=1;
    private Session session;

    public static final Logger LOGGER = LogManager.getLogger(CommonUtils.class);

    private static AnnotationDao annotationDao = AnnotationDaoFactory.getAnnotationDao();

    private static final CopyOnWriteArraySet<WebSocketDemo> set=new CopyOnWriteArraySet();

    @OnOpen
    public void open(Session session){
        this.session = session;
        LOGGER.info("===========>打开websocket");
        set.add(this);
        add();

        for(WebSocketDemo item:set){
            try {
                LOGGER.info("连接建立，向客户端发送数据");
                item.sendMessage();
            }catch (Exception e){
                LOGGER.error(e);
                continue;
            }
        }
    }

    @OnClose
    public void close(){
        set.remove(this);
        del();
        LOGGER.info("===>关闭websocket=======");
    }

    @OnMessage
    public void onMessage(String message,Session session){

        LOGGER.info("从客户端接收的消息：{}", message);

        String[] split = message.split("::");

        Annotation[] annotationArr = null;
        if (split[1] != null) {
            annotationArr = JackSonUtils.jsonArrToBeanArr(split[1], Annotation[].class);
        }

        //遍历转互换后的数组，并且保存到数据库
        for (Annotation annotation : annotationArr) {
            LOGGER.info("switch 传入参数：{}",split[0]);
            switch (split[0]){
                case "save":
                    //遍历转互换后的数组，并且保存到数据库
                    annotationDao.add(annotation);
                    break;

                case "delete":
                    annotationDao.del(annotation.getId());
                    break;

                case "modify":
                    annotationDao.mod(annotation);
                    break;

                default:
                    LOGGER.error("switch 传入参数不匹配");
                    break;
            }
        }

        for(WebSocketDemo item:set){
            try {
                item.sendMessage(message);
            }catch (Exception e){
                LOGGER.error(e);
                continue;
            }
        }
    }

    //服务端向客户端发送消息
    public void sendMessage(String message) throws IOException {
        //this.session.getBasicRemote().sendText(message);
    }

    //一建立连接时就将查询的数据库信息发送到客户端
    public void sendMessage() throws IOException {
        Annotation[] annotationArr = annotationDao.findAllArr();

        String json = JackSonUtils.beanToJson(annotationArr);

        LOGGER.info("将查询到的数据库数据转换成 JSON 后：{}",json);

        this.session.getBasicRemote().sendText(json);

    }



    public static synchronized void add(){
        WebSocketDemo.onlineCount++;
    }

    public static synchronized void del(){
        WebSocketDemo.onlineCount--;
    }

}
