package com.ibeus.Comanda.Digital.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.ibeus.Comanda.Digital.model.Dish;
import com.ibeus.Comanda.Digital.repository.DishRepository;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class DishService {

    @Autowired
    private DishRepository dishRepository;

    // --- CORREÇÃO 1: FILTRAR APENAS PRATOS ATIVOS ---
    public List<Dish> findAll() {
        return dishRepository.findAll().stream()
               .filter(Dish::isActive) // Filtra para incluir apenas pratos ativos
               .collect(Collectors.toList());
    }

    public Dish findById(Long id) {
        // Encontra o prato, mas a validação de 'ativo' deve ser feita no Controller/Frontend
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
        // Mantenha o estado 'isActive' ao atualizar, a menos que o formulário o mude
        // Se o formulário tiver um campo para reativar, você deve incluir:
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