package com.ibeus.Comanda.Digital.controller;

import com.ibeus.Comanda.Digital.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal; // Importação para pegar o usuário logado

@RestController
@RequestMapping("/users") // O endpoint base é /users
@CrossOrigin(origins = "http://localhost:4200")
public class UserController {

    @Autowired
    private UserService userService;

    // --- DTO (Molde) para a Requisição de Mudar Senha ---
    public static class ChangePasswordRequest {
        private String oldPassword;
        private String newPassword;
        
        // Getters
        public String getOldPassword() { return oldPassword; }
        public String getNewPassword() { return newPassword; }
    }

    // --- ENDPOINT NOVO ---
    @PostMapping("/change-password")
    public ResponseEntity<?> changePassword(
            Principal principal, // 1. Pega o usuário logado (do token JWT)
            @RequestBody ChangePasswordRequest request
    ) {
        try {
            // 2. O 'principal.getName()' vai conter o EMAIL do usuário (que setamos no JwtProvider)
            String userEmail = principal.getName();
            
            // 3. Chama o serviço para trocar a senha
            userService.changePassword(userEmail, request.getOldPassword(), request.getNewPassword());
            
            return ResponseEntity.ok().body("Senha alterada com sucesso.");
            
        } catch (RuntimeException e) {
            // Pega erros como "A senha antiga está incorreta"
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}