package aoing.service;

import aoing.bean.User;

import java.util.ArrayList;
import java.util.List;

/**
 * @author Aoing
 * @Description
 * @create 2020-04-21 17:24:51
 * @since v1.0.0
 */
public class LoginServiceImpl implements LoginService{
    private List<User> list;

    public boolean verify(User user) {
        List<User> list = getList();
        for (int i = 0; i < list.size(); i++){
            if (user.getName().equals(list.get(i).getName()) && user.getPassword().equals(list.get(i).getPassword())){
                return true;
            }
        }
        return false;
    }

    public List<User> getList(){
        List<User> userList = new ArrayList();

        User a = new User("a", 12, "a");
        User b = new User("b", 12, "b");
        userList.add(a);
        userList.add(b);
        return userList;
    }
}
