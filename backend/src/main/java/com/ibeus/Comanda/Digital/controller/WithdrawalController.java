package com.ibeus.Comanda.Digital.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
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
     * Endpoint para CRIAR uma nova retirada (o que já funciona)
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

    //
    // --- ENDPOINT NOVO ADICIONADO AQUI ---
    //
    /**
     * Endpoint para BUSCAR todas as retiradas (para o relatório)
     */
    @GetMapping
    public ResponseEntity<List<Withdrawal>> getAllWithdrawals() {
        try {
            List<Withdrawal> withdrawals = withdrawalService.findAll();
            return ResponseEntity.ok(withdrawals);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(null); // Erro interno do servidor
        }
    }
}