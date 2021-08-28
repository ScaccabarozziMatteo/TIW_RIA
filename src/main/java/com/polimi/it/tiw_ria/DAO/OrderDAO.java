package com.polimi.it.tiw_ria.DAO;

import com.polimi.it.tiw_ria.Beans.Order;
import com.polimi.it.tiw_ria.Beans.Product;

import java.io.IOException;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

public class OrderDAO {

    private Connection connection;

    public OrderDAO(Connection connection) {
        this.connection = connection;
    }

    public void sentOrder(Order order, String emailCustomer) throws SQLException {
        String addressQuery = "SELECT address FROM customers WHERE email LIKE ?";
        String query = "INSERT into dbtest.orders (supplier, customer, costShipment, subtotal, address, dateOrder) VALUES(?, ?, ?, ?, ?, CURRENT_TIMESTAMP)";
        String query3 = "SELECT LAST_INSERT_ID()";
        String query2 = "INSERT into dbtest.products_order (product, orderID, quantity, price) VALUES (?, ?, ?, ?)";

        String address = null;
        int id = 0;
        try (PreparedStatement pstatementAddress = connection.prepareStatement(addressQuery);PreparedStatement pstatement = connection.prepareStatement(query);PreparedStatement pstatement3 = connection.prepareStatement(query3)) {
            pstatementAddress.setString(1, emailCustomer);

            ResultSet resultSetAdd = pstatementAddress.executeQuery();
            while (resultSetAdd.next())
                address = resultSetAdd.getString("address");

            pstatement.setString(1, order.getSupplierCode());
            pstatement.setString(2, emailCustomer);
            pstatement.setFloat(3, order.getShipmentFees());
            pstatement.setFloat(4, order.getTotal());
            pstatement.setString(5, address);
            pstatement.executeUpdate();

            ResultSet resultSet = pstatement3.executeQuery();
            while (resultSet.next())
                id = resultSet.getInt(1);
        }

        for (Product product : order.getProducts()) {
            try (PreparedStatement pstatement3 = connection.prepareStatement(query2)) {
                pstatement3.setInt(1, product.getCode());
                pstatement3.setInt(2, id);
                pstatement3.setInt(3, product.getQuantity());
                pstatement3.setFloat(4, product.getPrice());
                pstatement3.executeUpdate();

            }
        }

    }

    public List<Order> getOrders(String customer) throws SQLException, IOException {
        List<Order> orders = new ArrayList<>();
        ProductDAO productDAO = new ProductDAO(connection);
        SupplierDAO supplierDAO = new SupplierDAO(connection);
        int orderID = 0;

        String query = "SELECT * FROM orders WHERE customer LIKE ?";
        String query2 = "SELECT * FROM dbtest.products_order WHERE orderID LIKE ?";

        try (PreparedStatement pstatement = connection.prepareStatement(query)) {
            pstatement.setString(1, customer);
            ResultSet resultSet = pstatement.executeQuery();

            while (resultSet.next()) {
                Order order = new Order(resultSet.getString("supplier"), resultSet.getFloat("costShipment"), resultSet.getFloat("subtotal"), resultSet.getInt("id"), resultSet.getDate("dateOrder"));
                List<Product> products = new ArrayList<>();

                PreparedStatement pstatement2 = connection.prepareStatement(query2);
                orderID = resultSet.getInt("id");
                pstatement2.setInt(1, orderID);
                ResultSet resultSet2 = pstatement2.executeQuery();
                while (resultSet2.next()) {
                    Product product = productDAO.getInfoProduct(resultSet2.getInt("product"));
                    product.setQuantity(resultSet2.getInt("quantity"));
                    product.setPrice(resultSet2.getFloat("price"));
                    products.add(product);

                    order.setProducts(products);
                }
                order.setSupplierName(supplierDAO.getSupplierName(order.getSupplierCode()));
                orders.add(order);
            }
        }

        return orders;
    }
}