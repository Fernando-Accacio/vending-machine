package com.ibeus.Comanda.Digital.model;

import jakarta.persistence.*;

@Entity
@Table(name = "dishes") // Vamos continuar usando a tabela "dishes" por enquanto
public class Dish {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    private String description;

    // 1. RENOMEAMOS "price" PARA "custo"
    @Column(name = "custo") // O nome no banco de dados será "custo"
    private Double custo;

    // 2. ADICIONAMOS O TEMPO DE REPOSIÇÃO (em minutos, por exemplo)
    @Column(name = "tempo_reposicao_min")
    private Integer tempoReposicao;

    // --- Getters e Setters Gerados Manualmente ---

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

    // Getter e Setter para "custo"
    public Double getCusto() {
        return custo;
    }

    public void setCusto(Double custo) {
        this.custo = custo;
    }

    // Getter e Setter para "tempoReposicao"
    public Integer getTempoReposicao() {
        return tempoReposicao;
    }

    public void setTempoReposicao(Integer tempoReposicao) {
        this.tempoReposicao = tempoReposicao;
    }
}