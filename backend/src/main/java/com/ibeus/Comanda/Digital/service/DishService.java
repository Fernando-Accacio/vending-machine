package com.ibeus.Comanda.Digital.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException; // IMPORTANTE
import org.springframework.stereotype.Service;
import com.ibeus.Comanda.Digital.model.Dish;
import com.ibeus.Comanda.Digital.repository.DishRepository;

import java.util.List;

@Service
public class DishService {

    @Autowired
    private DishRepository dishRepository;

    public List<Dish> findAll() {
        return dishRepository.findByIsActiveTrue(); 
    }

    public Dish findById(Long id) {
        return dishRepository.findById(id).orElseThrow(() -> new RuntimeException("Dish not found"));
    }

    public Dish create(Dish dish) {
        dish.setActive(true);
        return dishRepository.save(dish);
    }

    public Dish update(Long id, Dish dishDetails) {
        Dish dish = findById(id);
        
        dish.setName(dishDetails.getName());
        dish.setDescription(dishDetails.getDescription());
        dish.setCusto(dishDetails.getCusto());
        dish.setTempoReposicao(dishDetails.getTempoReposicao());
        
        // Se houver lógica de imagem, ela já foi tratada no Controller antes de chegar aqui, 
        // ou você pode adicionar aqui se estiver passando o objeto completo.
        if(dishDetails.getImageUrl() != null) {
            dish.setImageUrl(dishDetails.getImageUrl());
        }
        
        return dishRepository.save(dish);
    }

    // --- AQUI ESTÁ A MUDANÇA MÁGICA ---
    public void delete(Long id) {
        if (!dishRepository.existsById(id)) {
            throw new RuntimeException("Dish not found");
        }

        try {
            // Tenta apagar fisicamente do banco (Hard Delete)
            dishRepository.deleteById(id);
        } catch (DataIntegrityViolationException e) {
            // Se der erro porque o item já tem histórico (está amarrado a pedidos),
            // nós fazemos o Soft Delete (apenas inativamos)
            Dish dish = findById(id);
            dish.setActive(false);
            dishRepository.save(dish);
        }
    }
}