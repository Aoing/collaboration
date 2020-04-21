package aoing.filter;

import javax.servlet.*;
import javax.servlet.annotation.WebFilter;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

/**
 * @author Aoing
 * @Description
 * @create 2020-04-21 16:43:07
 * @since v1.0.0
 */
@WebFilter("/*")
public class EncodingFilter implements Filter {

    public void init(FilterConfig filterConfig) throws ServletException {

    }

    public void doFilter(ServletRequest servletRequest, ServletResponse servletResponse, FilterChain filterChain) throws IOException, ServletException {

        //String charset = this.getInitParameters("charset");
        //使用包装类处理请求的编码
        EncodingRequest encodingRequest = new EncodingRequest((HttpServletRequest) servletRequest, "utf-8");

        //使用包装类处理响应的编码
        EncodingResponse encodingResponse = new EncodingResponse((HttpServletResponse) servletResponse);

        //掉包 servletRequest ，使用自定义包装的 servletRequest
        filterChain.doFilter(encodingRequest,encodingResponse);
    }

    public void destroy() {

    }
}
