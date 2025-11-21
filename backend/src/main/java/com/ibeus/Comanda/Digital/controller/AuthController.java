package com.ibeus.Comanda.Digital.controller;

import org.springframework.http.HttpStatus; 
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.ibeus.Comanda.Digital.model.User;
import com.ibeus.Comanda.Digital.service.JwtProvider;
import com.ibeus.Comanda.Digital.service.UserService;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final JwtProvider tokenProvider;
    private final UserService userService;

    public AuthController(JwtProvider tokenProvider, UserService userService) {
        this.tokenProvider = tokenProvider;
        this.userService = userService;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        try {
            User user = this.userService.authenticateUser(loginRequest.getDocumento(), loginRequest.getPassword());

            if (user == null) {
                // Retorna erro 401 com JSON manual
                return ResponseEntity.status(401).body(new ErrorResponse("Credenciais inválidas (Senha ou CPF incorretos)"));
            }

            String token = tokenProvider.generateToken(user.getEmail(), user.getRole(), user.getName(), user.getPhoneNumber());
            return ResponseEntity.ok(new LoginResponse(token));
            
        } catch (RuntimeException e) {
            // Retorna erro 403 com JSON manual (Conta bloqueada)
            return ResponseEntity.status(403).body(new ErrorResponse(e.getMessage()));
        }
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest registerRequest) {
        
        // --- VALIDAÇÃO GENÉRICA DE EMAIL ---
        // Regex padrão que aceita formatos como nome@dominio.com, nome@dominio.com.br, etc.
        String emailRegex = "^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$";

        if (registerRequest.getEmail() == null || !registerRequest.getEmail().matches(emailRegex)) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ErrorResponse("Por favor, insira um endereço de email válido."));
        }
        // -----------------------------------

        try {
            User newUser = userService.register(registerRequest);
            return ResponseEntity.status(HttpStatus.CREATED).body(newUser); 
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new ErrorResponse(e.getMessage()));
        }
    }

    // --- CLASSES AUXILIARES (DTOs) ---
    
    public static class ErrorResponse {
        private String message;
        public ErrorResponse(String message) { this.message = message; }
        public String getMessage() { return message; }
        public void setMessage(String message) { this.message = message; }
    }

    public static class LoginRequest {
        private String documento;
        private String password;
        public String getDocumento() { return this.documento; }
        public String getPassword() { return this.password; }
        public void setDocumento(String documento) { this.documento = documento; }
        public void setPassword(String password) { this.password = password; }
    }

    public static class RegisterRequest {
        private String name;
        private String email;
        private String password;
        private String documento;
        private String phoneNumber;
        private String role;

        public String getName() { return name; }
        public String getEmail() { return email; }
        public String getPassword() { return password; }
        public String getDocumento() { return documento; }
        public String getPhoneNumber() { return phoneNumber; }
        public String getRole() { return role; }

        public void setName(String name) { this.name = name; }
        public void setEmail(String email) { this.email = email; }
        public void setPassword(String password) { this.password = password; }
        public void setDocumento(String documento) { this.documento = documento; }
        public void setPhoneNumber(String phoneNumber) { this.phoneNumber = phoneNumber; }
        public void setRole(String role) { this.role = role; }
    }

    public static class LoginResponse {
        private String token;
        public LoginResponse(String token) { this.token = token; }
        public String getToken() { return token; }
        public void setToken(String token) { this.token = token; }
    }
}