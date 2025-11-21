package com.ibeus.Comanda.Digital.controller;

import com.ibeus.Comanda.Digital.model.Withdrawal;
import com.ibeus.Comanda.Digital.service.WithdrawalService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/withdrawals")
public class WithdrawalController {

    @Autowired
    private WithdrawalService withdrawalService;

    // --- DTOs ---
    public static class CartItemDto {
        private Long dishId;
        private Integer quantity;
        
        public Long getDishId() { return dishId; }
        public void setDishId(Long dishId) { this.dishId = dishId; }
        public Integer getQuantity() { return quantity; }
        public void setQuantity(Integer quantity) { this.quantity = quantity; }
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

    @PostMapping
    public ResponseEntity<Withdrawal> createWithdrawal(@RequestBody WithdrawalRequest request) {
        Withdrawal withdrawal = withdrawalService.createWithdrawal(request);
        return ResponseEntity.ok(withdrawal);
    }

    // Endpoint para o Gerente (Relatório Geral)
    @GetMapping
    public ResponseEntity<List<Withdrawal>> getAllWithdrawals() {
        return ResponseEntity.ok(withdrawalService.findAll());
    }

    // Endpoint para o Cliente Logado (Meus Pedidos)
    @GetMapping("/my-withdrawals") // Ajustado para diferenciar do get all
    public ResponseEntity<List<Withdrawal>> getMyWithdrawals(Principal principal) {
        String email = principal.getName();
        return ResponseEntity.ok(withdrawalService.findByEmail(email));
    }

    // Endpoint antigo de histórico (manter para compatibilidade se necessário, ou redirecionar)
    @GetMapping("/history")
    public ResponseEntity<List<Withdrawal>> getHistory(Principal principal) {
        return getMyWithdrawals(principal);
    }

    // --- NOVO ENDPOINT: HISTÓRICO POR ID (Para o Admin ver o histórico de um user específico) ---
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Withdrawal>> getWithdrawalsByUserId(@PathVariable Long userId) {
        return ResponseEntity.ok(withdrawalService.findByUserId(userId));
    }
}