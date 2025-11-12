package com.ibeus.Comanda.Digital.config;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.stereotype.Component;
import java.io.IOException;

@Component
public class JwtAuthEntryPoint implements AuthenticationEntryPoint {

    /**
     * Chamado quando o acesso a um recurso protegido falha por falta de autenticação.
     */
    @Override
    public void commence(
        HttpServletRequest request, 
        HttpServletResponse response, 
        AuthenticationException authException
    ) throws IOException {
        // Define o status HTTP como 401 (Unauthorized)
        response.setContentType("application/json");
        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        
        // Retorna uma mensagem de erro JSON (em vez de um redirecionamento)
        response.getWriter().write("{\"error\": \"Unauthorized\", \"message\": \"Acesso negado. Token expirado ou ausente.\"}");
    }
}