package com.ibeus.Comanda.Digital.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ibeus.Comanda.Digital.model.Dish;
import com.ibeus.Comanda.Digital.model.User;
import com.ibeus.Comanda.Digital.model.Withdrawal;
import com.ibeus.Comanda.Digital.model.WithdrawalItem;
import com.ibeus.Comanda.Digital.repository.DishRepository;
import com.ibeus.Comanda.Digital.repository.UserRepository;
import com.ibeus.Comanda.Digital.repository.WithdrawalRepository;
import com.ibeus.Comanda.Digital.controller.WithdrawalController; 

import jakarta.transaction.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.NoSuchElementException;

@Service
public class WithdrawalService {

    @Autowired
    private WithdrawalRepository withdrawalRepository;

    @Autowired
    private DishRepository dishRepository;

    @Autowired
    private UserRepository userRepository;


    @Transactional
    public Withdrawal createWithdrawal(WithdrawalController.WithdrawalRequest request) {

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new NoSuchElementException("Usuário não encontrado com o email: " + request.getEmail()));

        Withdrawal withdrawal = new Withdrawal();
        withdrawal.setUser(user);
        withdrawal.setWithdrawalDate(LocalDateTime.now());

        List<WithdrawalItem> items = new ArrayList<>();
        double totalCost = 0.0;

        for (WithdrawalController.CartItemDto itemDto : request.getCart()) {
            
            Dish dish = dishRepository.findById(itemDto.getDishId())
                    .orElseThrow(() -> new NoSuchElementException("Produto não encontrado: " + itemDto.getDishId()));

            WithdrawalItem newItem = new WithdrawalItem();
            newItem.setDish(dish);
            newItem.setQuantity(itemDto.getQuantity());
            newItem.setCostAtTime(dish.getCusto()); 
            newItem.setWithdrawal(withdrawal); 

            items.add(newItem);
            
            totalCost += (dish.getCusto() * itemDto.getQuantity());
        }

        withdrawal.setItems(items);
        withdrawal.setTotalCost(totalCost);

        return withdrawalRepository.save(withdrawal);
    }
    
    
    /**
     * Busca todas as retiradas do banco, para o relatório (Gerente).
     */
    public List<Withdrawal> findAll() {
        return withdrawalRepository.findAllWithDetails();
    }
    
    /**
     * Busca retiradas por email (Histórico do Cliente).
     */
    public List<Withdrawal> findByEmail(String email) {
        return withdrawalRepository.findByUserEmail(email); 
    }

    // --- NOVO MÉTODO ADICIONADO ---
    /**
     * Busca retiradas por ID do usuário (Histórico Individual do Admin).
     */
    public List<Withdrawal> findByUserId(Long userId) {
        return withdrawalRepository.findByUserId(userId);
    }
}