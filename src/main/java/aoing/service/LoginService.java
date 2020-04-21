package aoing.service;

import aoing.bean.User;

/**
 * @author Aoing
 * @Description
 * @create 2020-04-21 17:23:57
 * @since v1.0.0
 */
public interface LoginService {
    public boolean verify(User user);
}
