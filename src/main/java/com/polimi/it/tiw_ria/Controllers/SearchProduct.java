package com.polimi.it.tiw_ria.Controllers;

import com.google.gson.Gson;
import com.polimi.it.tiw_ria.Beans.Product;
import com.polimi.it.tiw_ria.DAO.ProductDAO;

import javax.servlet.*;
import javax.servlet.http.*;
import javax.servlet.annotation.*;
import java.io.IOException;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.util.List;

@WebServlet(name = "SearchProduct", value = "/SearchProduct")
public class SearchProduct extends HttpServlet {

    private Connection connection = null;

    @Override
    public void init() throws ServletException {

        try {
            ServletContext context = getServletContext();
            String driver = context.getInitParameter("dbDriver");
            String url = context.getInitParameter("dbUrl");
            String user = context.getInitParameter("dbUser");
            String password = context.getInitParameter("dbPassword");
            Class.forName(driver);
            connection = DriverManager.getConnection(url, user, password);

        } catch (ClassNotFoundException e) {
            throw new UnavailableException("Impossibile caricare dbDriver");
        } catch (SQLException e) {
            throw new UnavailableException("Impossibile connettersi");
        }
    }

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        HttpSession session = request.getSession();
        String strLogin = (String) session.getAttribute("emailCustomer");

        if (strLogin != null) {
            String nameProduct = request.getParameter("search");

            if (nameProduct != null && !nameProduct.equals("") && nameProduct.length() < 301) {
                ProductDAO productDAO = new ProductDAO(connection);
                List<Product> products = null;

                try {
                    products = productDAO.getProductsFromSearchTab(nameProduct);
                } catch (SQLException throwables) {
                    throwables.printStackTrace();
                }

                Gson gson = new Gson();
                String productsSerial = gson.toJson(products);
                response.setStatus(HttpServletResponse.SC_OK);
                response.setContentType("application/json");
                response.setCharacterEncoding("UTF-8");
                response.getWriter().println(productsSerial);
            }
        }
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {

    }
}
