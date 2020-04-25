package org.example;

/**
 * @author Aoing
 * @Description
 * @create 2020-04-25 14:16:42
 * @since v1.0.0
 */
public class User {
    private String id;
    private int age;
    private String name;

    public String getId() {
        return id;
    }

    public int getAge() {
        return age;
    }

    public void setAge(int age) {
        this.age = age;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    @Override
    public String toString() {
        return "User{" +
                "id='" + id + '\'' +
                ", age=" + age +
                ", name='" + name + '\'' +
                '}';
    }

    public User() {
    }

    public User(int age, String name) {
        this.age = age;
        this.name = name;
    }
}
