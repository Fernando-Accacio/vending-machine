package com.ibeus.Comanda.Digital.model;

import com.fasterxml.jackson.annotation.JsonFormat; // <-- 1. IMPORTAÇÃO NOVA
import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "withdrawals") 
public class Withdrawal {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @OneToMany(mappedBy = "withdrawal", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<WithdrawalItem> items;
    
    @Column(name = "total_cost")
    private Double totalCost;

    // --- CORREÇÃO DA DATA ---
    @Column(name = "withdrawal_date")
    // 2. ANOTAÇÃO NOVA: Força o Java a enviar a data como "2025-11-07T18:42:42"
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime withdrawalDate;
    
    // --- Getters e Setters (Manuais) ---

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public List<WithdrawalItem> getItems() {
        return items;
    }

    public void setItems(List<WithdrawalItem> items) {
        this.items = items;
    }

    public Double getTotalCost() {
        return totalCost;
    }

    public void setTotalCost(Double totalCost) {
        this.totalCost = totalCost;
    }

    public LocalDateTime getWithdrawalDate() {
        return withdrawalDate;
    }

    public void setWithdrawalDate(LocalDateTime withdrawalDate) {
        this.withdrawalDate = withdrawalDate;
    }
}