<%--
  Created by IntelliJ IDEA.
  User: Aoing
  Date: 2020/4/21
  Time: 14:55
  To change this template use File | Settings | File Templates.
--%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<html>
<head>
    <title>登录界面</title>
</head>
<body style="text-align: center">
    <div style="border: 2px deepskyblue solid; width: 200px; height: 100px; margin: 0 auto">
        <form id="login_form" action="/collaboration/login" method="post">

            账号：<input name="username">
            <br>
            密码：<input name="password">
            <br>
            <input type="submit">
        </form>
    </div>
</body>
</html>
