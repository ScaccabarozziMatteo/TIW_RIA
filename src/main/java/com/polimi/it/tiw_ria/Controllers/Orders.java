package com.polimi.it.tiw_ria.Controllers;

import com.google.gson.Gson;
import com.polimi.it.tiw_ria.Beans.Order;

import com.polimi.it.tiw_ria.Beans.Product;
import com.polimi.it.tiw_ria.DAO.OrderDAO;

import org.json.JSONArray;
import org.json.JSONObject;

import javax.servlet.*;
import javax.servlet.http.*;
import javax.servlet.annotation.*;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

@WebServlet(name = "Orders", value = "/Orders")
public class Orders extends HttpServlet {

    private Connection connection;

    public Orders() {super();}

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

                response.setStatus(HttpServletResponse.SC_OK);
                response.setContentType("application/json");
                response.setCharacterEncoding("UTF-8");
                response.getWriter().println(tempString);
            } catch (SQLException e) {
                e.printStackTrace();
            }
        } else {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.sendError(HttpServletResponse.SC_UNAUTHORIZED);
            response.getWriter().println("Non sei autenticato!");
        }
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {

        HttpSession session = request.getSession();
        String strLogin = (String) session.getAttribute("emailCustomer");

        if (strLogin != null) {

            OrderDAO orderDAO = new OrderDAO(connection);
            Order order;
            List<Product> products = new ArrayList<>();
            int quantity;
            int codeProd;

            String supplierCode;

            String JSONString;
            BufferedReader br = new BufferedReader(new InputStreamReader(request.getInputStream()));

            JSONString = br.readLine();
            System.out.println(JSONString);

            JSONObject JSONObj = new JSONObject(JSONString);
            JSONArray JSONArr;

            try {
                supplierCode = JSONObj.getJSONObject("supplier").getString("code");
                JSONArr = JSONObj.getJSONArray("product");

                if (!supplierCode.isEmpty()) {
                    order = new Order(supplierCode);

                    for (int i = 0; i < JSONArr.length(); i++) {
                        quantity = JSONArr.getJSONObject(i).getInt("quantity");
                        codeProd = JSONArr.getJSONObject(i).getInt("code");

                        if (quantity > 0 && codeProd > 0) {

                            products.add(new Product(codeProd, quantity));


                            response.setStatus(HttpServletResponse.SC_OK);

                        } else {
                            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                            response.getWriter().println("Parametri non validi!");
                        }
                    }
                } else {
                    response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                    response.getWriter().println("Parametri non validi!");
                }
            } catch (org.json.JSONException e) {
                response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                response.getWriter().println("Parametri non validi!");
            }


        } else {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.getWriter().println("Non sei autenticato!");
        }
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
