package com.ibeus.Comanda.Digital.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import com.ibeus.Comanda.Digital.model.User;

public interface UserRepository extends JpaRepository<User, Long> {
    
    Optional<User> findByEmail(String email);
    
    // O Spring Data JPA cria a query "SELECT * FROM users WHERE documento = ?"
    Optional<User> findByDocumento(String documento);
}