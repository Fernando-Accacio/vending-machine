package com.ibeus.Comanda.Digital.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.ibeus.Comanda.Digital.model.Dish;
import com.ibeus.Comanda.Digital.repository.DishRepository;

import java.util.List;
import java.util.stream.Collectors; // Removível, pois não usaremos mais streams para findAll()

@Service
public class DishService {

    @Autowired
    private DishRepository dishRepository;

    // --- CORREÇÃO 1: FILTRAR APENAS PRATOS ATIVOS ---
    public List<Dish> findAll() {
        // Agora usamos o método otimizado do repositório para filtrar no SQL
        return dishRepository.findByIsActiveTrue(); 
    }

    public Dish findById(Long id) {
        // Encontra o prato
        return dishRepository.findById(id).orElseThrow(() -> new RuntimeException("Dish not found"));
    }

    public Dish create(Dish dish) {
        // Garante que o prato recém-criado está ativo
        dish.setActive(true);
        return dishRepository.save(dish);
    }

    public Dish update(Long id, Dish dishDetails) {
        Dish dish = findById(id);
        dish.setName(dishDetails.getName());
        dish.setDescription(dishDetails.getDescription());
        dish.setCusto(dishDetails.getCusto());
        
        // Se a entidade Dish tiver o is_active, ela deve ser mantida,
        // a menos que o formulário de edição permita reativar/inativar
        // dish.setActive(dishDetails.isActive()); 
        
        return dishRepository.save(dish);
    }

    // --- CORREÇÃO 2: IMPLEMENTAÇÃO DO SOFT DELETE ---
    public void delete(Long id) {
        Dish dish = findById(id);
        dish.setActive(false); // Marca o prato como inativo (Soft Delete)
        dishRepository.save(dish);
    }
}