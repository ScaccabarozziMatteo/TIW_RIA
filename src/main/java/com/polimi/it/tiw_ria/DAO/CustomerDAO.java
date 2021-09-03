package com.polimi.it.tiw_ria.DAO;

import com.polimi.it.tiw_ria.Beans.Customer;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

public class CustomerDAO {

    private Connection connection;

    public CustomerDAO(Connection connection) {
        this.connection = connection;
    }

    public List<Customer> list() throws SQLException {
        List<Customer> customers = new ArrayList<>();

        String SQLQuery = "SELECT * FROM dbtest.customers";

        try (PreparedStatement statement = connection.prepareStatement(SQLQuery);
             ResultSet resultSet = statement.executeQuery();
        ) {
            while (resultSet.next()) {
                Customer customer = new Customer(resultSet.getString("name"), resultSet.getString("surname"), resultSet.getString("email"), resultSet.getString("address"), resultSet.getString("password"), resultSet.getString("sex"));
                customers.add(customer);
            }
        }

        return customers;
    }

    public Customer getCustomer(String email, String password) throws SQLException {
        String Query = "SELECT * FROM dbtest.customers WHERE customers.email LIKE ? AND customers.password LIKE ?";
        Customer customer = null;

        try (PreparedStatement statement = connection.prepareStatement(Query);) {

            statement.setString(1, email);
            statement.setString(2, password);
            ResultSet resultSet = statement.executeQuery();

            while (resultSet.next())
                if (email.equals(resultSet.getString("email")) && password.equals(resultSet.getString("password")))
                    customer = new Customer(resultSet.getString("name"), resultSet.getString("surname"), resultSet.getString("email"), resultSet.getString("address"), resultSet.getString("password"), resultSet.getString("sex"));
        }
        return customer;
    }

}