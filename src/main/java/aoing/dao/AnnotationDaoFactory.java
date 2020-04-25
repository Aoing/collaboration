package aoing.dao;

import java.io.InputStream;
import java.util.Properties;

/**
 * @author Aoing
 * @Description
 * @create 2020-04-25 11:56:46
 * @since v1.0.0
 */
public class AnnotationDaoFactory {
    private static AnnotationDao annotationDao;

    static{
        try{
            InputStream resourceAsStream = Thread.currentThread().getContextClassLoader().getResourceAsStream("dao.properties");

            Properties prop = new Properties();

            prop.load(resourceAsStream);

            String className = prop.getProperty("aoing.dao.AnnotationDao");

            Class clazz = Class.forName(className);

            annotationDao = (AnnotationDao)clazz.newInstance();
        }catch (Exception e){
            throw new RuntimeException(e);
        }
    }

    public static AnnotationDao getAnnotationDao(){
        return annotationDao;
    }
}
