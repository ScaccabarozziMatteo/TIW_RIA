package com.polimi.it.tiw_ria.Beans;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

public class Order implements Serializable {
    private static final long serialVersionUID = 8726474585097L;

    private List<Product> products;
    private String supplierCode;
    private String supplierName;
    private int totQuantity;
    private float shipmentFees;
    private float total;
    private int numOrder;

    public int getNumOrder() {
        return numOrder;
    }

    public void setNumOrder(int numOrder) {
        this.numOrder = numOrder;
    }

    public Order (String supplierCode, float shipmentFees, float total, int numOrder) {
        this.supplierCode = supplierCode;
        this.shipmentFees = shipmentFees;
        this.total = total;
        this.numOrder = numOrder;
    }

    public float getTotal() {
        return total;
    }

    public void setTotal(float total) {
        this.total = total;
    }

    public int getTotQuantity() {
        return totQuantity;
    }

    public void setTotQuantity(int totQuantity) {
        this.totQuantity = totQuantity;
    }

    public float getShipmentFees() {
        return shipmentFees;
    }

    public void setShipmentFees(float shipmentFees) {
        this.shipmentFees = shipmentFees;
    }

    public Order(String supplierCode) {
        this.products = new ArrayList<>();
        this.supplierCode = supplierCode;
    }

    public void setProducts(List<Product> products) {
        this.products = products;
    }

    public void setSupplierCode(String supplierCode) {
        this.supplierCode = supplierCode;
    }

    public void setSupplierName(String supplierName) {
        this.supplierName = supplierName;
    }

    public List<Product> getProducts() {
        return products;
    }

    public String getSupplierCode() {
        return supplierCode;
    }

    public String getSupplierName() {
        return supplierName;
    }
}