package com.polimi.it.tiw_ria.DAO;

import com.polimi.it.tiw_ria.Beans.ShipmentPolicy;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

public class ShipmentPolicyDAO {
    private Connection connection;

    public ShipmentPolicyDAO(Connection connection) {
        this.connection = connection;
    }

    public List<ShipmentPolicy> shipmentPolicyList(String supplier) throws SQLException {
        List<ShipmentPolicy> shipmentPolicies = new ArrayList<>();

        String SQLQuery = "SELECT * FROM dbtest.shipment_policy WHERE supplier LIKE ? ORDER BY min_articles";

        try (PreparedStatement statement = connection.prepareStatement(SQLQuery)) {
            statement.setString(1, supplier);
            ResultSet resultSet = statement.executeQuery();

            while (resultSet.next()) {
                ShipmentPolicy shipmentPolicy = new ShipmentPolicy(resultSet.getInt("id"), resultSet.getInt("min_articles"), resultSet.getInt("max_articles"), resultSet.getString("supplier"), resultSet.getFloat("cost_shipment"), resultSet.getFloat("free_shipment"));
                shipmentPolicies.add(shipmentPolicy);
            }
        }
        if (shipmentPolicies.isEmpty())
            return null;

        return shipmentPolicies;
    }

    public List<ShipmentPolicy> shipmentPoliciesProduct(int prodCode) throws SQLException {
        List<ShipmentPolicy> shipmentPolicies = new ArrayList<>();

        String SQLQuery = "SELECT * FROM dbtest.shipment_policy INNER JOIN supplier_catalogue sc on shipment_policy.supplier = sc.supplier WHERE product LIKE ? ORDER BY sc.supplier, min_articles";

        try (PreparedStatement statement = connection.prepareStatement(SQLQuery)) {
            statement.setInt(1, prodCode);
            ResultSet resultSet = statement.executeQuery();

            while (resultSet.next()) {
                ShipmentPolicy shipmentPolicy = new ShipmentPolicy(resultSet.getInt("id"), resultSet.getInt("min_articles"), resultSet.getInt("max_articles"), resultSet.getString("sc.supplier"), resultSet.getInt("cost_shipment"), resultSet.getInt("free_shipment"));
                shipmentPolicies.add(shipmentPolicy);
            }
        }

        return shipmentPolicies;
    }

    public float getShipmentFeeCost(String supplierCode, int quantity, float totalCost) throws SQLException{

        float fees = 0;
        List<ShipmentPolicy> policyList = shipmentPolicyList(supplierCode);

        for (ShipmentPolicy shipPolicy: policyList) {
            if (shipPolicy.getMin_articles() == 999999999 && shipPolicy.getFreeShipment() <= totalCost) {
                fees = 0;
                return fees;
            }
            else if (quantity >= shipPolicy.getMin_articles() && quantity <= shipPolicy.getMax_articles()) {
                fees = shipPolicy.getCostShipment();
            }
        }

        return fees;
    }


}