package aoing.dao;

import aoing.bean.Annotation;
import aoing.utils.CommonUtils;
import aoing.utils.JdbcUtils;
import com.sun.org.apache.xml.internal.utils.ThreadControllerWrapper;

import javax.resource.spi.ConnectionEvent;
import javax.resource.spi.RetryableUnavailableException;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.concurrent.ExecutionException;

/**
 * @author Aoing
 * @Description
 * @create 2020-04-25 11:25:32
 * @since v1.0.0
 */
public class AnnotationDaoImpl implements AnnotationDao {
    public void add(Annotation annotation) {
        Connection con = null;

        PreparedStatement pstmt = null;

        try{
            con = JdbcUtils.getConnection();

            String sql = "insert into annotation (xStart, yStart, width, height, xEnd, yEnd, position, mark, lineWidth, borderColor, isSelected, author, date) value (?,?,?,?,?,?,?,?,?,?,?,?,?)";

            if (load(annotation.getId()) == null) {
                CommonUtils.LOGGER.info("要保存的注释 id 在数据库中不存在，即将保存新数据。");

                pstmt = con.prepareStatement(sql);

                pstmt.setInt(1, annotation.getxStart());
                pstmt.setInt(2, annotation.getyStart());
                pstmt.setInt(3, annotation.getWidth());
                pstmt.setInt(4, annotation.getHeight());
                pstmt.setInt(5, annotation.getxEnd());
                pstmt.setInt(6, annotation.getyEnd());
                pstmt.setString(7, annotation.getPosition());
                pstmt.setString(8, annotation.getMark());
                pstmt.setInt(9, annotation.getLineWidth());
                pstmt.setString(10, annotation.getBorderColor());
                pstmt.setBoolean(11, annotation.getIsSelected());
                pstmt.setString(12, annotation.getAuthor());
                pstmt.setString(13, annotation.getDate());

                pstmt.executeUpdate();
            }else{
                CommonUtils.LOGGER.info("要保存的注释 id 在数据库中已存在，取消保存数据。");
            }

        }catch (Exception e){
            throw new RuntimeException(e);
        }finally {
            try {
                if (pstmt != null)
                    pstmt.close();
                if (con != null)
                    con.close();
            }catch (SQLException e){

            }
        }
    }

    public void mod(Annotation annotation) {
        Connection con = null;
        PreparedStatement pstmt = null;
        try {
            con = JdbcUtils.getConnection();

            //判断注释是否存在
            if (load(annotation.getId()) != null){
                String sql = "update annotation set xStart=?, yStart=?,  width=?, height=?, xEnd=?, yEnd=?, position=?, mark=?, lineWidth=?, borderColor=?, isSelected=?, author=?, date=? where id=? ";
                pstmt = con.prepareStatement(sql);
                pstmt.setInt(1, annotation.getxStart());
                pstmt.setInt(2, annotation.getyStart());
                pstmt.setInt(3, annotation.getWidth());
                pstmt.setInt(4, annotation.getHeight());
                pstmt.setInt(5, annotation.getxEnd());
                pstmt.setInt(6, annotation.getyEnd());
                pstmt.setString(7, annotation.getPosition());
                pstmt.setString(8, annotation.getMark());
                pstmt.setInt(9, annotation.getLineWidth());
                pstmt.setString(10, annotation.getBorderColor());
                pstmt.setBoolean(11, annotation.getIsSelected());
                pstmt.setString(12, annotation.getAuthor());
                pstmt.setString(13, annotation.getDate());
                pstmt.setInt(14, annotation.getId());

                pstmt.executeUpdate();
            }

        }catch (Exception e){
            throw new RuntimeException(e);
        }finally {
            try {
                if(pstmt != null)
                    pstmt.close();
                if(con != null)
                    con.close();
            } catch(SQLException e) {}
        }
    }

    public void del(int id) {
        Connection con = null;
        PreparedStatement pstmt = null;
        try {
            con = JdbcUtils.getConnection();
            String sql = "delete from annotation where id=?";
            pstmt = con.prepareStatement(sql);
            pstmt.setInt(1, id);
            pstmt.executeUpdate();
        }catch (Exception e){
            throw new RuntimeException(e);
        }finally {
            try {
                if(pstmt != null)
                    pstmt.close();
                if(con != null)
                    con.close();
            }catch(SQLException e) {}
        }
    }

    public Annotation load(int id) {
        Connection con = null;
        PreparedStatement pstmt = null;
        ResultSet rs = null;
        try {
            con = JdbcUtils.getConnection();
            String sql = "select * from annotation where id=?";
            pstmt = con.prepareStatement(sql);
            pstmt.setInt(1, id);
            rs = pstmt.executeQuery();
            if(rs.next()) {
                return new Annotation(rs.getInt(1), rs.getInt(2), rs.getInt(3), rs.getInt(4),rs.getInt(5),  rs.getInt(6),  rs.getInt(7), rs.getString(8), rs.getString(9), rs.getInt(10), rs.getString(11), rs.getBoolean(12), rs.getString(13), rs.getString(14));
            }
            return null;
        } catch(Exception e) {
            throw new RuntimeException(e);
        } finally {
            try {
                if(pstmt != null)
                    pstmt.close();
                if(con != null)
                    con.close();
            } catch(SQLException e) {}
        }
    }

    public List<Annotation> findAllList() {
        Connection con = null;
        PreparedStatement pstmt = null;
        ResultSet rs = null;
        try {
            con = JdbcUtils.getConnection();
            String sql = "select * from annotation";
            pstmt = con.prepareStatement(sql);
            rs = pstmt.executeQuery();
            List<Annotation> annotationList = new ArrayList<Annotation>();
            while(rs.next()) {
                annotationList.add(new Annotation(rs.getInt(1), rs.getInt(2), rs.getInt(3), rs.getInt(4),rs.getInt(5),  rs.getInt(6),  rs.getInt(7), rs.getString(8), rs.getString(9), rs.getInt(10), rs.getString(11), rs.getBoolean(12), rs.getString(13), rs.getString(14)));
            }
            return annotationList;
        } catch(Exception e) {
            throw new RuntimeException(e);
        } finally {
            try {
                if(pstmt != null) pstmt.close();
                if(con != null) con.close();
            } catch(SQLException e) {}
        }
    }

    public Annotation[] findAllArr() {
        List<Annotation> allList = findAllList();
        
        Annotation[] annotationArr = allList.toArray(new Annotation[allList.size()]);

        return annotationArr;
    }
}
