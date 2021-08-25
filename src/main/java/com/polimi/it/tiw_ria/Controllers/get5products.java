package com.polimi.it.tiw_ria.Controllers;

import com.google.gson.Gson;
import com.polimi.it.tiw_ria.Beans.Product;
import com.polimi.it.tiw_ria.Beans.ShipmentPolicy;
import com.polimi.it.tiw_ria.Beans.Supplier;
import com.polimi.it.tiw_ria.DAO.ProductDAO;

import javax.servlet.*;
import javax.servlet.http.*;
import javax.servlet.annotation.*;
import java.io.IOException;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

@WebServlet(name = "get5products", value = "/get5products")
public class get5products extends HttpServlet {

    private Connection connection;

    public get5products() {super();}

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

            ProductDAO productDAO = new ProductDAO(connection);

            try {
                List<Product> products = productDAO.list();
                List<Product> fiveProducts = new ArrayList<>();
                Collections.shuffle(products);
                for (int i = 0; i < 5; i++)
                    fiveProducts.add(products.get(i));

                String fiveProductsString = new Gson().toJson(fiveProducts);

                response.setStatus(HttpServletResponse.SC_OK);
                response.setContentType("application/json");
                response.setCharacterEncoding("UTF-8");
                response.getWriter().println(fiveProductsString);
            } catch (SQLException e) {
                e.printStackTrace();
            }
        }
        else {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.getWriter().println("Non sei autenticato!");
        }
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {

    }

    @Override
    public void destroy() {
        try {
            if (connection != null){
                connection.close();
            }
        } catch (SQLException ignored) {

        }
    }
}
