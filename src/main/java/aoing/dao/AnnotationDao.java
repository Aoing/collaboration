package aoing.dao;

import aoing.bean.Annotation;

import java.util.List;

/**
 * @author Aoing
 * @Description
 * @create 2020-04-25 10:42:35
 * @since v1.0.0
 */
public interface AnnotationDao {
    public void add(Annotation annotation);

    public void mod(Annotation annotation);

    public void del(int id);

    public Annotation load(int id);

    public List<Annotation> findAllList();

    public Annotation[] findAllArr();
}
