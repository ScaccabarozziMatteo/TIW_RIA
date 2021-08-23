package com.polimi.it.tiw_ria.Controllers;

import com.google.gson.Gson;
import com.polimi.it.tiw_ria.Beans.ShipmentPolicy;
import com.polimi.it.tiw_ria.DAO.ProductDAO;
import com.polimi.it.tiw_ria.DAO.ShipmentPolicyDAO;

import javax.servlet.*;
import javax.servlet.http.*;
import javax.servlet.annotation.*;
import java.io.IOException;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.util.List;

@WebServlet(name = "getInfoShipmentProduct", value = "/getInfoShipmentProduct")
public class getInfoShipmentProduct extends HttpServlet {

    private Connection connection;

    public getInfoShipmentProduct() {super();}

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
        int codeProduct = -1;
        HttpSession session = request.getSession();
        String strLogin = (String) session.getAttribute("emailCustomer");

        if (strLogin != null) {
            ShipmentPolicyDAO shipmentPolicyDAO = new ShipmentPolicyDAO(connection);
            try {
                List<ShipmentPolicy> shipmentPolicies = shipmentPolicyDAO.shipmentPoliciesProduct(codeProduct);

                String shipmentPoliciesString = new Gson().toJson(shipmentPolicies);
                response.setStatus(HttpServletResponse.SC_OK);
                response.setContentType("application/json");
                response.setCharacterEncoding("UTF-8");
                response.getWriter().println(shipmentPoliciesString);
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
}