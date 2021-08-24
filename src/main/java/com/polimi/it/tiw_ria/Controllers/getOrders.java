package com.polimi.it.tiw_ria.Controllers;

import com.google.gson.Gson;
import com.polimi.it.tiw_ria.Beans.Order;
import com.polimi.it.tiw_ria.Beans.ShipmentPolicy;
import com.polimi.it.tiw_ria.Beans.Supplier;
import com.polimi.it.tiw_ria.DAO.OrderDAO;
import com.polimi.it.tiw_ria.DAO.ShipmentPolicyDAO;
import com.polimi.it.tiw_ria.DAO.SupplierDAO;

import javax.servlet.*;
import javax.servlet.http.*;
import javax.servlet.annotation.*;
import java.io.IOException;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.util.List;

@WebServlet(name = "getOrders", value = "/getOrders")
public class getOrders extends HttpServlet {

    private Connection connection;

    public getOrders() {super();}

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

            OrderDAO orderDAO = new OrderDAO(connection);
            try {
                List<Order> orders = orderDAO.getOrders(strLogin);

                StringBuilder toSendBuilder = new StringBuilder("[");
                String tempString;

                Gson gson = new Gson();

                for (Order order : orders) {
                    tempString = gson.toJson(order);
                    toSendBuilder.append(tempString);
                    toSendBuilder.append(",");
                }

                toSendBuilder.delete(toSendBuilder.length() - 1, toSendBuilder.length());
                toSendBuilder.append("]");

                tempString = toSendBuilder.toString();

                System.out.println(tempString);

                response.setStatus(HttpServletResponse.SC_OK);
                response.setContentType("application/json");
                response.setCharacterEncoding("UTF-8");
                response.getWriter().println(tempString);
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
