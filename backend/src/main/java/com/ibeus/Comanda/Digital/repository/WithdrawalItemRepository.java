package com.ibeus.Comanda.Digital.repository;

import com.ibeus.Comanda.Digital.model.WithdrawalItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface WithdrawalItemRepository extends JpaRepository<WithdrawalItem, Long> {
    // O Spring Data JPA cria os métodos findById, save, etc.
}