package com.ibeus.Comanda.Digital.controller;

import com.ibeus.Comanda.Digital.model.User;
import com.ibeus.Comanda.Digital.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.HttpStatus;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/users")
@CrossOrigin(origins = "http://localhost:4200")
public class UserController {

    @Autowired
    private UserService userService;

    // DTO
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

    // --- DTO para desativar conta ---
    public static class DeactivateAccountRequest {
        private String password;

        public String getPassword() { return password; }
        public void setPassword(String password) { this.password = password; }
    }

    @PostMapping("/change-password")
    public ResponseEntity<?> changePassword(Principal principal, @RequestBody ChangePasswordRequest request) {
        try {
            String userEmail = principal.getName();
            userService.changeCredentials(userEmail, request.getOldPassword(), request.getNewPassword(), request.getNewUsername());
            return ResponseEntity.ok().body("Credenciais alteradas com sucesso. Por favor, faça login novamente.");
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @GetMapping("/all")
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(userService.findAllUsers());
    }

    @PutMapping("/{id}/toggle-status")
    public ResponseEntity<?> toggleUserStatus(@PathVariable Long id) {
        try {
            User updatedUser = userService.toggleUserStatus(id);
            return ResponseEntity.ok(updatedUser);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Usuário não encontrado.");
        }
    }

    // --- Recebe a senha para confirmar ---
    @PostMapping("/deactivate-my-account")
    public ResponseEntity<?> deactivateMyAccount(Principal principal, @RequestBody DeactivateAccountRequest request) {
        try {
            String email = principal.getName();
            userService.deactivateMyAccount(email, request.getPassword()); 
            return ResponseEntity.ok("Conta desativada com sucesso.");
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage()); // Retorna erro se senha incorreta
        }
    }
}