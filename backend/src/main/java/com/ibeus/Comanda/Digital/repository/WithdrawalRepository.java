package com.ibeus.Comanda.Digital.repository;

import com.ibeus.Comanda.Digital.model.Withdrawal;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface WithdrawalRepository extends JpaRepository<Withdrawal, Long> {
    
    // NOVO: Busca retiradas pelo email do usuário (Spring Data JPA Magic)
    // Assume que a entidade Withdrawal tem um campo User e User tem um campo email
    List<Withdrawal> findByUserEmail(String email); 
    
    // --- MÉTODO ANTIGO ADICIONADO ---
    @Query("SELECT w FROM Withdrawal w " +
            "LEFT JOIN FETCH w.user " +
            "LEFT JOIN FETCH w.items i " +
            "LEFT JOIN FETCH i.dish " +
            "ORDER BY w.withdrawalDate DESC")
    List<Withdrawal> findAllWithDetails();
}