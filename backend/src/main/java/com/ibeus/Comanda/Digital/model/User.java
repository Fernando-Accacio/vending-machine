package com.ibeus.Comanda.Digital.model;

import jakarta.persistence.*;

@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    private String email;

    private String password;

    private String role; // "cliente", "gerente"

    @Column(name = "phone_number")
    private String phoneNumber;

    @Column(unique = true) 
    private String documento;

    // NOVO CAMPO: Define se a conta está ativa ou bloqueada
    private boolean active = true;

    // --- Getters e Setters ---

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public String getPhoneNumber() { return phoneNumber; }
    public void setPhoneNumber(String phoneNumber) { this.phoneNumber = phoneNumber; }

    public String getDocumento() { return documento; }
    public void setDocumento(String documento) { this.documento = documento; }

    // Novos Getters/Setters para active
    public boolean isActive() { return active; }
    public void setActive(boolean active) { this.active = active; }
}