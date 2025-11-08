package com.ibeus.Comanda.Digital.controller;

import java.util.Optional;

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
        
        Optional<User> userOptional = this.userService.findByDocumentoAndPassword(loginRequest.getDocumento(), loginRequest.getPassword());

        if (userOptional.isEmpty()) {
            return ResponseEntity.status(401).body("Credenciais inválidas");
        }

        User user = userOptional.get();

        String token = tokenProvider.generateToken(user.getEmail(), user.getRole(), user.getName(), user.getPhoneNumber());
        return ResponseEntity.ok(new LoginResponse(token));
    }

    
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest registerRequest) {
        try {
            User newUser = userService.register(registerRequest);
            // Não retorna o token, força o usuário a logar depois de registrar
            return ResponseEntity.status(HttpStatus.CREATED).body(newUser); 
        } catch (RuntimeException e) {
            // Pega o erro "Usuário já cadastrado" do service
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }


    // --- DTO (Molde) para o Login ---
    // 1. MUDANÇA AQUI (adicionado "public")
    public static class LoginRequest {
        private String documento;
        private String password;

        public String getDocumento() { return this.documento; }
        public String getPassword() { return this.password; }
    }

    // --- DTO (Molde) para o Registro ---
    // 2. MUDANÇA AQUI (adicionado "public")
    public static class RegisterRequest {
        private String name;
        private String email;
        private String password;
        private String documento;
        private String phoneNumber;

        // Getters
        public String getName() { return name; }
        public String getEmail() { return email; }
        public String getPassword() { return password; }
        public String getDocumento() { return documento; }
        public String getPhoneNumber() { return phoneNumber; }
    }

    // --- DTO para a Resposta ---
    // 3. MUDANÇA AQUI (adicionado "public")
    public static class LoginResponse {
        private String token;

        public LoginResponse(String token) {
            this.token = token;
        }

        public String getToken() {
            return token;
        }
    }
}