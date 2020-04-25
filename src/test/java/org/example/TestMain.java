package org.example;

import aoing.bean.Annotation;
import aoing.utils.JackSonUtils;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.io.IOException;

/**
 * @author Aoing
 * @Description
 * @create 2020-04-25 14:17:42
 * @since v1.0.0
 */
public class TestMain {
    public static void main(String[] args) throws IOException {
        String json = "[{\"name\": \"Aoing\", \"age\": 12, \"id\": 0},{\"name\": \"xioaming\", \"age\": 22, \"id\": 3}]";
//        String json = "{\"name\": \"Aoing\", \"age\": 12, \"id\": 0}";
        String json1 = "{\"xStart\":0,\"yStart\":0,\"width\":100,\"height\":100,\"xEnd\":100,\"yEnd\":100,\"position\":\"bottomRight\",\"mark\":\"1\",\"lineWidth\":1,\"borderColor\":\"blue\",\"isSelected\":false,\"author\":\"author\",\"date\":\"20200424\",\"id\":0}";
        String json2 = "[{\"xStart\":0,\"yStart\":0,\"width\":100,\"height\":100,\"xEnd\":100,\"yEnd\":100,\"position\":\"bottomRight\",\"mark\":\"1\",\"lineWidth\":1,\"borderColor\":\"blue\",\"isSelected\":false,\"author\":\"author\",\"date\":\"20200424\",\"id\":0},{\"xStart\":211,\"yStart\":36,\"width\":998,\"height\":479,\"xEnd\":1209,\"yEnd\":515,\"mark\":2,\"position\":\"bottomRight\",\"lineWidth\":1,\"isSelected\":false,\"data\":\"2020/4/25 上午9:38:44\"},{\"xStart\":43,\"yStart\":161,\"width\":402,\"height\":423,\"xEnd\":445,\"yEnd\":584,\"mark\":3,\"position\":\"bottomRight\",\"lineWidth\":1,\"isSelected\":false,\"date\":\"2020/4/25 下午6:48:35\"}]";
        //User[] userArr = JackSonUtils.jsonArrToBeanArr(json, User[].class);

        //ObjectMapper objectMapper = new ObjectMapper();

        //Class<User[]> aClass = User[].class;
        //User[] user = objectMapper.readValue(json, User[].class);


        Annotation[] annotationArr = JackSonUtils.jsonToBean(json2, Annotation[].class);
        //    System.out.println(annotation);
       System.out.println(annotationArr);
    }
}
