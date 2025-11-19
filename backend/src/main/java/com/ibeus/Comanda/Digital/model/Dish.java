package com.ibeus.Comanda.Digital.model;

import jakarta.persistence.*;

@Entity
@Table(name = "dishes")
public class Dish {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    private String description;

    @Column(name = "custo")
    private Double custo;

    @Column(name = "tempo_reposicao_min")
    private Integer tempoReposicao;
    
    // --- Bloqueio Lógico (Soft Delete) ---
    @Column(name = "is_active", nullable = false)
    private boolean isActive = true; // Por padrão, o prato é ativo

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Double getCusto() {
        return custo;
    }

    public void setCusto(Double custo) {
        this.custo = custo;
    }

    public Integer getTempoReposicao() {
        return tempoReposicao;
    }

    public void setTempoReposicao(Integer tempoReposicao) {
        this.tempoReposicao = tempoReposicao;
    }
    
    // --- Getters e Setters para isActive ---
    public boolean isActive() {
        return isActive;
    }

    public void setActive(boolean isActive) {
        this.isActive = isActive;
    }
}