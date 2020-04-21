package aoing.filter;

import com.sun.deploy.net.HttpResponse;

import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpServletResponseWrapper;
import java.io.IOException;
import java.io.PrintWriter;
import java.io.UnsupportedEncodingException;

/**
 * @author Aoing
 * @Description
 * @create 2020-04-21 17:40:08
 * @since v1.0.0
 */
public class EncodingResponse extends HttpServletResponseWrapper {

    private HttpServletResponse resp;
    private String charset;

    public EncodingResponse(HttpServletResponse response) {
        super(response);
        this.resp = response;
    }

    @Override
    public PrintWriter getWriter() throws IOException {
        //设置响应编码
        resp.setContentType("text/html;charset=GB2312");
        return resp.getWriter();
    }
}
