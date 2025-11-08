package com.ibeus.Comanda.Digital.repository;

import com.ibeus.Comanda.Digital.model.Withdrawal;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface WithdrawalRepository extends JpaRepository<Withdrawal, Long> {
    
    // --- MÉTODO NOVO ADICIONADO ---
    //
    // Esta query customizada "força" o Hibernate a buscar tudo de uma vez.
    // "JOIN FETCH" significa "vá buscar os dados relacionados na mesma viagem"
    @Query("SELECT w FROM Withdrawal w " +
           "LEFT JOIN FETCH w.user " +
           "LEFT JOIN FETCH w.items i " +
           "LEFT JOIN FETCH i.dish " +
           "ORDER BY w.withdrawalDate DESC")
    List<Withdrawal> findAllWithDetails();
}