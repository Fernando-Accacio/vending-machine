package com.ibeus.Comanda.Digital.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import com.ibeus.Comanda.Digital.service.JwtAuthenticationFilter;

import java.util.Arrays;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;
    
    @Autowired
    public SecurityConfig(JwtAuthenticationFilter jwtAuthenticationFilter) {
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .csrf(csrf -> csrf.disable())
            .sessionManagement(session -> session
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            
            .authorizeHttpRequests(authorize -> authorize
                // --- ROTAS PÚBLICAS GERAIS ---
                .requestMatchers(
                    "/",                        
                    "/error",                   
                    "/api-docs/**",             
                    "/swagger-ui/**",           
                    "/swagger-ui.html"          
                ).permitAll()
                
                // Endpoints públicos (login e registro)
                .requestMatchers("/auth/**").permitAll()
                // Cardápio (GET /dishes) é público
                .requestMatchers(HttpMethod.GET, "/dishes").permitAll() 
                
                // Rotas que exigem autenticação
                .requestMatchers("/users/change-password").authenticated() 
                .requestMatchers(HttpMethod.POST, "/withdrawals").authenticated()
                .requestMatchers(HttpMethod.GET, "/withdrawals").hasAuthority("GERENTE")
                
                // Todo o resto precisa de autenticação (token JWT)
                .anyRequest().authenticated() 
            );
        
        http.addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);
        
        return http.build();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration) throws Exception {
        return authenticationConfiguration.getAuthenticationManager();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        
        // CORREÇÃO: DOMÍNIOS ESPECÍFICOS E ALLOW_CREDENTIALS
        configuration.setAllowedOrigins(Arrays.asList(
            "https://vending-social.vercel.app", 
            "http://localhost:4200" 
        )); 
        
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(Arrays.asList("Authorization", "Content-Type"));
        configuration.setAllowCredentials(true); 
        configuration.setExposedHeaders(Arrays.asList("Authorization", "Content-Type")); // Mantido do seu código original
        
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}