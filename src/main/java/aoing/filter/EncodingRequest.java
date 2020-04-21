package aoing.filter;

import javax.servlet.RequestDispatcher;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletRequestWrapper;
import java.io.UnsupportedEncodingException;

/**
 * @author Aoing
 * @Description 装饰 Request
 * @create 2020-04-21 16:44:24
 * @since v1.0.0
 */
public class EncodingRequest  extends HttpServletRequestWrapper {

    private HttpServletRequest req;

    private String charset;

    public EncodingRequest(HttpServletRequest request, String charset) {
        super(request);
        this.req = request;
        this.charset = charset;
    }

    /**
     * 统一处理请求的编码
     * @param name
     * @return
     */
    public String getParameter(String name){

        String method = req.getMethod().toLowerCase();

        if ("post".equals(method)){
            try {
                req.setCharacterEncoding(charset);
            } catch (UnsupportedEncodingException e) {
                throw new RuntimeException(e);
            }
        }else if ("get".equals(method)){
            String value = req.getParameter(name);
            try {
                value = new String(value.getBytes("iso-8859-1"),"utf-8");
            } catch (UnsupportedEncodingException e) {
                throw new RuntimeException(e);
            }
            return value;
        }
        return req.getParameter(name);
    }
}
