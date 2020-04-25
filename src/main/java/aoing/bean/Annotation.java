package aoing.bean;

/**
 * @author Aoing
 * @Description
 * @create 2020-04-25 10:42:47
 * @since v1.0.0
 */
public class Annotation {

    private int id;

    private int xStart;

    private int yStart;

    private int width;

    private int height;

    private int xEnd;

    private int yEnd;

    private String position;

    private String mark;

    private int lineWidth;

    private String borderColor;

    private boolean isSelected;

    private String author;

    private String date;

    public Annotation() {
    }

    public int getId() {
        return id;
    }

    public int getxStart() {
        return xStart;
    }

    public void setxStart(int xStart) {
        this.xStart = xStart;
    }

    public int getyStart() {
        return yStart;
    }

    public void setyStart(int yStart) {
        this.yStart = yStart;
    }

    public int getWidth() {
        return width;
    }

    public void setWidth(int width) {
        this.width = width;
    }

    public int getHeight() {
        return height;
    }

    public void setHeight(int height) {
        this.height = height;
    }

    public int getxEnd() {
        return xEnd;
    }

    public void setxEnd(int xEnd) {
        this.xEnd = xEnd;
    }

    public int getyEnd() {
        return yEnd;
    }

    public void setyEnd(int yEnd) {
        this.yEnd = yEnd;
    }

    public String getPosition() {
        return position;
    }

    public void setPosition(String position) {
        this.position = position;
    }

    public String getMark() {
        return mark;
    }

    public void setMark(String mark) {
        this.mark = mark;
    }

    public int getLineWidth() {
        return lineWidth;
    }

    public void setLineWidth(int lineWidth) {
        this.lineWidth = lineWidth;
    }

    public String getBorderColor() {
        return borderColor;
    }

    public void setBorderColor(String borderColor) {
        this.borderColor = borderColor;
    }

    public boolean getIsSelected() {
        return isSelected;
    }

    public void setIsSelected(boolean selected) {
        isSelected = selected;
    }

    public String getAuthor() {
        return author;
    }

    public void setAuthor(String author) {
        this.author = author;
    }

    public String getDate() {
        return date;
    }

    public void setDate(String date) {
        this.date = date;
    }

    public Annotation(int id, int xStart, int yStart, int width, int height, int xEnd, int yEnd, String position, String mark, int lineWidth, String borderColor, boolean isSelected, String author, String date) {
        this.id = id;
        this.xStart = xStart;
        this.yStart = yStart;
        this.width = width;
        this.height = height;
        this.xEnd = xEnd;
        this.yEnd = yEnd;
        this.position = position;
        this.mark = mark;
        this.lineWidth = lineWidth;
        this.borderColor = borderColor;
        this.isSelected = isSelected;
        this.author = author;
        this.date = date;
    }

    @Override
    public String toString() {
        return "Annotation{" +
                "id='" + id + '\'' +
                ", xStart=" + xStart +
                ", yStart=" + yStart +
                ", width=" + width +
                ", height=" + height +
                ", xEnd=" + xEnd +
                ", yEnd=" + yEnd +
                ", position='" + position + '\'' +
                ", mark='" + mark + '\'' +
                ", lineWidth='" + lineWidth + '\'' +
                ", borderColor='" + borderColor + '\'' +
                ", isSelected=" + isSelected +
                ", author='" + author + '\'' +
                ", date='" + date + '\'' +
                '}';
    }
}
