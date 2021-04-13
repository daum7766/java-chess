package chess.dao;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.Objects;

public abstract class AbstractDAO {

    private static final String SERVER = "localhost:13306";
    private static final String DATABASE = "db_name";
    private static final String OPTION = "?useSSL=false&serverTimezone=UTC&useUnicode=true&characterEncoding=utf8";
    private static final String USERNAME = "root";
    private static final String PASSWORD = "root";

    protected AbstractDAO() {}

    public Connection connection() {

        Connection connection = null;

        try {
            Class.forName("com.mysql.cj.jdbc.Driver");
        } catch (ClassNotFoundException e) {
            System.err.println(" !! JDBC Driver load 오류: " + e.getMessage());
            e.printStackTrace();
        }

        try {
            connection = DriverManager
                .getConnection("jdbc:mysql://" + SERVER + "/" + DATABASE + OPTION, USERNAME,
                    PASSWORD);
        } catch (SQLException e) {
            System.err.println("연결 오류:" + e.getMessage());
            e.printStackTrace();
        }

        return connection;
    }

    public void closeConnection(Connection connection) {
        try {
            if (connection != null) {
                connection.close();
            }
        } catch (SQLException e) {
            System.err.println("con 오류:" + e.getMessage());
        }
    }

    protected void disconnect(PreparedStatement preparedStatement, ResultSet resultSet) throws SQLException {
        if (!Objects.isNull(preparedStatement)) {
            preparedStatement.close();
        }
        if (!Objects.isNull(resultSet)) {
            resultSet.close();
        }
    }
}
