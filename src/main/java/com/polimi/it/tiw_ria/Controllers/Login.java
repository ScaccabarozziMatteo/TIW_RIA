package com.polimi.it.tiw_ria.Controllers;

import com.polimi.it.tiw_ria.Beans.Customer;
import com.polimi.it.tiw_ria.DAO.CustomerDAO;

import javax.servlet.*;
import javax.servlet.http.*;
import javax.servlet.annotation.*;
import java.io.IOException;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

import com.google.gson.Gson;

@WebServlet(name = "Login", value = "/Login")
@MultipartConfig
public class Login extends HttpServlet {

    private Connection connection;

    public Login() {super();}

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

    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        String email;
        String password;
        HttpSession session = request.getSession();

        email = request.getParameter("emailCustomer");
        password = request.getParameter("passwordCustomer");

        if (email != null && !email.equals("") && password != null && !password.equals("")) {
            CustomerDAO customerDAO = new CustomerDAO(connection);

            try {
                Customer customer = customerDAO.getCustomer(email, password);
                if (customer != null) {
                    session.setAttribute("emailCustomer", email);
                    session.setAttribute("name", customer.getName());
                    session.setAttribute("sex", customer.getSex());

                    String user = new Gson().toJson(customerDAO.getCustomer(email, password));
                    response.setStatus(HttpServletResponse.SC_OK);
                    response.setContentType("application/json");
                    response.setCharacterEncoding("UTF-8");
                    response.getWriter().println(user);
                }
                else {
                    response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                    response.getWriter().println("Account inesistente!");
                }
            } catch (SQLException e) {
                e.printStackTrace();
            }
        }
        else {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.getWriter().println("Credenziali non valide!");
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
