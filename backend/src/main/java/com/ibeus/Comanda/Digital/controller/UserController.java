package com.ibeus.Comanda.Digital.controller;

import com.ibeus.Comanda.Digital.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.HttpStatus;

import java.security.Principal;

@RestController
@RequestMapping("/users")
@CrossOrigin(origins = "http://localhost:4200")
public class UserController {

    @Autowired
    private UserService userService;

    // --- DTO (Molde) para a Requisição de Mudar Senha/Credenciais ---
    public static class ChangePasswordRequest {
        private String oldPassword;
        private String newPassword;
        private String newUsername;

        // Getters e Setters...
        public String getOldPassword() { return oldPassword; }
        public String getNewPassword() { return newPassword; }
        public String getNewUsername() { return newUsername; }
        
        public void setOldPassword(String oldPassword) { this.oldPassword = oldPassword; }
        public void setNewPassword(String newPassword) { this.newPassword = newPassword; }
        public void setNewUsername(String newUsername) { this.newUsername = newUsername; }
    }

    // --- ENDPOINT COM STATUS HTTP ---
    @PostMapping("/change-password")
    public ResponseEntity<?> changePassword(
            Principal principal,
            @RequestBody ChangePasswordRequest request
    ) {
        try {
            String userEmail = principal.getName();
            
            userService.changeCredentials(
                userEmail, 
                request.getOldPassword(), 
                request.getNewPassword(),
                request.getNewUsername()
            );
            
            // Caso de SUCESSO
            return ResponseEntity.ok().body("Credenciais alteradas com sucesso. Por favor, faça login novamente.");
            
        } catch (RuntimeException e) {
            // Caso de ERRO DE VALIDAÇÃO (Senha Antiga Incorreta, Nova Senha = Antiga, etc.)
            // RETORNA 400 BAD REQUEST, que o Frontend entende como erro.
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }
}