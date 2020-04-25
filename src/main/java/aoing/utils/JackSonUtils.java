package aoing.utils;

import aoing.bean.Annotation;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.io.IOException;
import java.util.List;

/**
 * 要求：1、需要类有无参构造
 *      2、所有字段需要 get 和 set方法，不能是 isTrue 等方法句柄
 * @author Aoing
 * @Description Json 数据转换工具类，需要依赖三个 jar 包：jackson-databind、jackson-core、jackson-annotations
 * @create 2020-04-25 12:14:16
 * @since v1.0.0
 */
public class JackSonUtils {
    private static ObjectMapper mapper = new ObjectMapper();

    /**
     * 2020-4-25 16:01:38
     * 将对象转为 json 串
     * @param obj
     * @return
     */
    public static String beanToJson(Object obj){
        try{
            return mapper.writeValueAsString(obj);
        }catch (JsonProcessingException e){
            CommonUtils.LOGGER.error(e);
            return null;
        }
    }

    /**
     * 2020-4-25 16:02:19
     * 将 json 串转为对象
     * @param jsonStr
     * @param objClass
     * @param <T>
     * @return
     */
    public static <T> T jsonToBean(String jsonStr, Class<T> objClass){
        try{
            return mapper.readValue(jsonStr, objClass);
        }catch (IOException e){
            CommonUtils.LOGGER.error(e);
            return null;
        }
    }

    /**
     * 2020-4-25 18:28:47
     * 将 json 数组转成对象数组
     * @param jsonStr
     * @param objClass
     * @param <T>
     * @return
     */
    public static <T> T[] jsonArrToBeanArr(String jsonStr, Class<T[]> objClass){
        try {
            T[] arr = mapper.readValue(jsonStr, objClass);
            return arr;
        } catch (IOException e) {
            CommonUtils.LOGGER.error(e);
            return null;
        }
    }

    /**
     * 2020-4-25 16:22:38
     * 将 json 数组转成 list 对象集合
     * @param jsonStr
     * @param objClass
     * @param <T>
     * @return
     */
    public static <T> List<T> jsonArrToBeanList(String jsonStr, Class<T[]> objClass){
        try {
            List<T> list = (List<T>) mapper.readValue(jsonStr, new TypeReference<T>() {
            });
            return list;
        } catch (IOException e) {
            CommonUtils.LOGGER.error(e);
            return null;
        }
    }
}
