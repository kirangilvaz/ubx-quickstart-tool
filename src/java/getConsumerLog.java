/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.PrintWriter;
import java.io.Reader;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 *
 * @author Kiran
 */
public class getConsumerLog extends HttpServlet {

    protected String readFile(String fileName) {
        StringBuilder temp = new StringBuilder("");
        InputStream in = null;
        Reader reader = null;
        try {
            in = new FileInputStream(fileName);
            reader = new InputStreamReader(in, "UTF-8");
            int r;
            while ((r = reader.read()) != -1) {
                char ch = (char) r;
                if (ch == '`') {
                    temp.append("<br/><br/>");
                } else {
                    temp.append(ch);
                }

            }
        } catch (Exception e) {
            try {
                reader.close();
                in.close();
            } catch (Exception ex) {
                return "Error: " + ex.toString();
            }
        } finally {
            try {
                reader.close();
                in.close();
            } catch (Exception ex) {
                return "Error: " + ex.toString();
            }
        }
        return temp.toString();
    }

    protected void processRequest(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        response.setContentType("text/html;charset=UTF-8");
        PrintWriter out = response.getWriter();
        try {
            out.println(readFile(request.getParameter("fileName")));
        } finally {
            out.close();
        }
    }

    // <editor-fold defaultstate="collapsed" desc="HttpServlet methods. Click on the + sign on the left to edit the code.">
    /**
     * Handles the HTTP
     * <code>GET</code> method.
     *
     * @param request servlet request
     * @param response servlet response
     * @throws ServletException if a servlet-specific error occurs
     * @throws IOException if an I/O error occurs
     */
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        processRequest(request, response);
    }

    /**
     * Handles the HTTP
     * <code>POST</code> method.
     *
     * @param request servlet request
     * @param response servlet response
     * @throws ServletException if a servlet-specific error occurs
     * @throws IOException if an I/O error occurs
     */
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        processRequest(request, response);
    }

    /**
     * Returns a short description of the servlet.
     *
     * @return a String containing servlet description
     */
    @Override
    public String getServletInfo() {
        return "Short description";
    }// </editor-fold>
}
