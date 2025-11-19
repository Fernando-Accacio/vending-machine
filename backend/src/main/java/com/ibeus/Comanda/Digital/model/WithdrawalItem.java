package com.ibeus.Comanda.Digital.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

@Entity
@Table(name = "withdrawal_items") 
public class WithdrawalItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // A qual retirada este item pertence
    @ManyToOne
    @JoinColumn(name = "withdrawal_id", nullable = false)
    @JsonIgnore // (Impede o loop infinito do JSON)
    private Withdrawal withdrawal;

    // Qual produto (Dish) foi retirado
    @ManyToOne
    @JoinColumn(name = "dish_id", nullable = false)
    private Dish dish;

    // Quantos foram retirados
    @Column(nullable = false)
    private Integer quantity;

    // Qual era o custo unitário no momento da retirada
    @Column(name = "cost_at_time")
    private Double costAtTime;

    // --- Getters e Setters ---

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Withdrawal getWithdrawal() {
        return withdrawal;
    }

    public void setWithdrawal(Withdrawal withdrawal) {
        this.withdrawal = withdrawal;
    }

    public Dish getDish() {
        return dish;
    }

    public void setDish(Dish dish) {
        this.dish = dish;
    }

    public Integer getQuantity() {
        return quantity;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }

    public Double getCostAtTime() {
        return costAtTime;
    }

    public void setCostAtTime(Double costAtTime) {
        this.costAtTime = costAtTime;
    }
}