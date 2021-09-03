package com.polimi.it.tiw_ria.DAO;

import com.polimi.it.tiw_ria.Beans.Product;

import java.io.IOException;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

public class ProductDAO {
    private Connection connection;

    public ProductDAO(Connection connection) {
        this.connection = connection;
    }

    public List<Product> list() throws SQLException {
        List<Product> products = new ArrayList<>();

        String SQLQuery = "SELECT * FROM dbtest.products";

        try (PreparedStatement statement = connection.prepareStatement(SQLQuery);
             ResultSet resultSet = statement.executeQuery();
        ) {
            while (resultSet.next()) {
                Product product = new Product(resultSet.getInt("code"), resultSet.getString("name"), resultSet.getString("description"), resultSet.getString("category"), resultSet.getString("photo"));
                products.add(product);
            }
        } catch (IOException e) {
            e.printStackTrace();
        }

        return products;
    }

    public List<Product> getProductsFromSearchTab(String nameProduct) throws SQLException, IOException {

        List <Product> products = new ArrayList<>();
        String SQLQuery = "SELECT code, MIN(price), name, description, photo, category, price FROM dbtest.products INNER JOIN dbtest.supplier_catalogue ON products.code = supplier_catalogue.product WHERE UPPER(name) LIKE ? OR UPPER(description) LIKE ? GROUP BY code ORDER BY price";
        try (PreparedStatement statement = connection.prepareStatement(SQLQuery);
        ){
            statement.setString(1, '%' + nameProduct.toUpperCase() + '%');
            statement.setString(2,'%'+ nameProduct.toUpperCase() + '%');
            ResultSet resultSet = statement.executeQuery();

            while(resultSet.next()) {
                Product product = new Product(resultSet.getInt("code"),resultSet.getString("name"),resultSet.getString("description"),resultSet.getString("category"),resultSet.getString("photo"),resultSet.getFloat("MIN(price)"));
                products.add(product);
            }
        }
        return products;
    }

    public Product getInfoProduct(int code) throws SQLException, IOException {
        Product product = null;

        String SQLQuery = "SELECT * FROM dbtest.products INNER JOIN supplier_catalogue sc on products.code = sc.product WHERE products.code LIKE ?";

        try (PreparedStatement statement = connection.prepareStatement(SQLQuery);
        ) {
            statement.setInt(1, code);
            ResultSet resultSet = statement.executeQuery();

            while (resultSet.next()) {
                product = new Product(resultSet.getInt("code"), resultSet.getString("name"), resultSet.getString("description"), resultSet.getString("category"), resultSet.getString("photo"), resultSet.getFloat("price"));
            }
        }

        return product;
    }

    public float getCostProduct(int prodCode, String supplierCode) throws SQLException {
        String query = "SELECT price FROM supplier_catalogue WHERE product LIKE ? AND supplier LIKE ?";
        float price = 0;

        try (PreparedStatement pstatement = connection.prepareStatement(query)) {
            pstatement.setInt(1, prodCode);
            pstatement.setString(2, supplierCode);
            ResultSet resultSet = pstatement.executeQuery();

            while (resultSet.next())
                    price = resultSet.getFloat("price");
        }
        return price;
    }

}