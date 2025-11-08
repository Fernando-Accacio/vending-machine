package com.ibeus.Comanda.Digital.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import com.ibeus.Comanda.Digital.model.Withdrawal;
import com.ibeus.Comanda.Digital.service.WithdrawalService;

import java.util.List;

@RestController
@RequestMapping("/withdrawals") 
@CrossOrigin(origins = "http://localhost:4200") 
public class WithdrawalController {

    @Autowired
    private WithdrawalService withdrawalService;

    // --- DTOs (Data Transfer Objects) ---
    
    public static class CartItemDto {
        private Long dishId;
        private int quantity;
        
        public Long getDishId() { return dishId; }
        public void setDishId(Long dishId) { this.dishId = dishId; }
        public int getQuantity() { return quantity; }
        public void setQuantity(int quantity) { this.quantity = quantity; }
    }

    public static class WithdrawalRequest {
        private String email; 
        private List<CartItemDto> cart; 
        
        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
        public List<CartItemDto> getCart() { return cart; }
        public void setCart(List<CartItemDto> cart) { this.cart = cart; }
    }

    // --- ENDPOINTS ---

    /**
     * Endpoint para CRIAR uma nova retirada (POST - Cliente)
     */
    @PostMapping
    public ResponseEntity<Withdrawal> createWithdrawal(@RequestBody WithdrawalRequest request) {
        try {
            Withdrawal savedWithdrawal = withdrawalService.createWithdrawal(request);
            return ResponseEntity.ok(savedWithdrawal);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(null);
        }
    }

    /**
     * Endpoint para BUSCAR todas as retiradas (GET - Gerente)
     */
    @GetMapping
    public ResponseEntity<List<Withdrawal>> getAllWithdrawals() {
        try {
            // Requer permissão GERENTE no SecurityConfig
            List<Withdrawal> withdrawals = withdrawalService.findAll();
            return ResponseEntity.ok(withdrawals);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(null); 
        }
    }
    
    /**
     * Endpoint para BUSCAR o histórico de retiradas do usuário logado (GET - Cliente)
     */
    @GetMapping("/history")
    public ResponseEntity<List<Withdrawal>> getMyWithdrawalsHistory() {
        try {
            // Obtém o email do token (Spring Security Principal)
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String email = authentication.getName(); // O email é o Subject do JWT
            
            if (email == null) {
                return ResponseEntity.status(401).body(null); // Não autenticado
            }
            
            // Requer que você implemente este método no WithdrawalService:
            List<Withdrawal> history = withdrawalService.findByEmail(email); 
            return ResponseEntity.ok(history);
            
        } catch (Exception e) {
            return ResponseEntity.status(500).body(null);
        }
    }
}