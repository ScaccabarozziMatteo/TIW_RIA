package com.polimi.it.tiw_ria.Controllers;

import javax.servlet.annotation.WebServlet;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

@WebServlet("/logout")

public class Logout extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {

        Cookie[] cookies = request.getCookies();

        if (cookies != null) {
            for (Cookie aCookie : cookies) {
                aCookie.setMaxAge(0);
                response.addCookie(aCookie);
            }
        }
            request.getSession().invalidate();
            response.setStatus(HttpServletResponse.SC_OK);
    }
}
