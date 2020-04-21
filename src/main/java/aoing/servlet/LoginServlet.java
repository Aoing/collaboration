package aoing.servlet;

import aoing.bean.User;
import aoing.service.LoginServiceImpl;
import aoing.utils.Utils;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.OutputStreamWriter;
import java.io.PrintWriter;

/**
 * @author Aoing
 * @Description
 * @create 2020-04-21 15:02:38
 * @since v1.0.0
 */
@WebServlet("/login")
public class LoginServlet  extends HttpServlet {
    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        doPost(req, resp);
    }

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {

        String username = (String) req.getParameter("username");
        String password = (String) req.getParameter("password");

        Utils.LOGGER.info("username: "+ username + ", password: " + password);

        LoginServiceImpl loginService = new LoginServiceImpl();
        boolean verify = loginService.verify(new User(username, password));

        if (verify){
            req.getRequestDispatcher("/draw.html").forward(req,resp);
        }else{
            PrintWriter writer = resp.getWriter();

            writer.println("<script>alert(\"用户名或密码错误\")</script>");
            req.getRequestDispatcher("/login").forward(req,resp);
        }


    }
}
