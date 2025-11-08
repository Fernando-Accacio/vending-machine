package com.ibeus.Comanda.Digital.service;

// --- NOVOS IMPORTS NECESSÁRIOS ---
import java.util.ArrayList;
import java.util.List;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import io.jsonwebtoken.Claims;
// --- FIM DOS NOVOS IMPORTS ---

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.web.authentication.preauth.PreAuthenticatedAuthenticationToken;
import org.springframework.stereotype.Component;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {
    private final JwtProvider tokenProvider;

    @Autowired
    public JwtAuthenticationFilter(JwtProvider tokenProvider) {
        this.tokenProvider = tokenProvider;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain) {
        String token = extractToken(request);

        if (token != null) {
            try {
                // --- MUDANÇA 1: AGORA RECEBEMOS O OBJETO 'Claims' ---
                Claims claims = tokenProvider.validateToken(token);
                String username = claims.getSubject();
                
                // --- MUDANÇA 2: EXTRAÍMOS A 'role' DE DENTRO DO TOKEN ---
                String role = claims.get("role", String.class);
                
                // --- MUDANÇA 3: CRIAMOS A LISTA DE PERMISSÕES ---
                List<GrantedAuthority> authorities = new ArrayList<>();
                if (role != null) {
                    authorities.add(new SimpleGrantedAuthority(role));
                }

                // --- MUDANÇA 4: ENTREGAMOS AS PERMISSÕES AO SPRING ---
                PreAuthenticatedAuthenticationToken authentication =
                        new PreAuthenticatedAuthenticationToken(username, null, authorities);
                
                SecurityContextHolder.getContext().setAuthentication(authentication);
            } catch (Exception e) {
                SecurityContextHolder.clearContext();
            }
        }

        try {
            chain.doFilter(request, response);
        } catch (Exception ex) {
            throw new RuntimeException("Erro no processamento da requisição", ex);
        }
    }

    private String extractToken(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        if (bearerToken != null && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7);
        }
        return null;
    }
}