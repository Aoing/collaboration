package aoing.utils;

import java.io.IOException;
import java.io.InputStream;
import java.sql.Connection;
import java.sql.DriverManager;
import java.util.Properties;

/**
 * @author Aoing
 * @Description JdbcUtils类，让它从配置文件中读取配置参数，然后创建连接对象。
 * @create 2020-04-25 11:13:35
 * @since v1.0.0
 */
public class JdbcUtils {

    //配置文件路径
    private static final String dbConfig = "dbConfig.properties";

    //加载配置文件
    private static Properties prop = new Properties();

    /**
     * 2020-4-25 11:18:54
     * 把配置文件内容加载到prop对象中。
     * 因为是放到static块中完成的加载操作，所以加载操作只会在JdbcUtils类被加载时完成对配置文件的加载。
     */
    static{
        try {
            InputStream resourceAsStream = Thread.currentThread().getContextClassLoader().getResourceAsStream(dbConfig);

            prop.load(resourceAsStream);

            Class.forName(prop.getProperty("driverClassName"));
        }catch (Exception e){
            throw new RuntimeException(e);
        }
    }

    /**
     * 2020-4-25 11:20:49
     * 从配置文件获取连接对象
     * @return
     */
    public static Connection getConnection(){
        try{
            return DriverManager.getConnection(prop.getProperty("url"),
                    prop.getProperty("username"),
                    prop.getProperty("password"));
        }catch (Exception e){
            throw new RuntimeException(e);
        }
    }
}
