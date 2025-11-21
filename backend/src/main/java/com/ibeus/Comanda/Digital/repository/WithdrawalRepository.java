package com.ibeus.Comanda.Digital.repository;

import com.ibeus.Comanda.Digital.model.Withdrawal;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface WithdrawalRepository extends JpaRepository<Withdrawal, Long> {
    
    // Busca retiradas pelo email do usuário
    List<Withdrawal> findByUserEmail(String email); 

    // --- NOVO MÉTODO ADICIONADO PARA O HISTÓRICO DO ADMIN ---
    // O Spring Data JPA entende automaticamente que deve buscar pelo ID da entidade "User" dentro de "Withdrawal"
    List<Withdrawal> findByUserId(Long userId);
    
    @Query("SELECT w FROM Withdrawal w " +
            "LEFT JOIN FETCH w.user " +
            "LEFT JOIN FETCH w.items i " +
            "LEFT JOIN FETCH i.dish " +
            "ORDER BY w.withdrawalDate DESC")
    List<Withdrawal> findAllWithDetails();
}