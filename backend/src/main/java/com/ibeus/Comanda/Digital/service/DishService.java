package com.ibeus.Comanda.Digital.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.ibeus.Comanda.Digital.model.Dish;
import com.ibeus.Comanda.Digital.repository.DishRepository;

import java.util.List;

@Service
public class DishService {

    @Autowired
    private DishRepository dishRepository;

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
        
        // --- CORREÇÃO DA EDIÇÃO ---
        dish.setName(dishDetails.getName());
        dish.setDescription(dishDetails.getDescription());
        dish.setCusto(dishDetails.getCusto());
        
        // ESSENCIAL: Adicionar o Setter para o Tempo de Reposição
        dish.setTempoReposicao(dishDetails.getTempoReposicao());
        // --------------------------
        
        // Mantém o status ativo atual (se o formulário de edição permite essa alteração)
        // Se o formulário tiver a checkbox de inativar:
        // dish.setActive(dishDetails.isActive()); 
        
        return dishRepository.save(dish);
    }

    public void delete(Long id) {
        Dish dish = findById(id);
        dish.setActive(false); // Marca o prato como inativo (Soft Delete)
        dishRepository.save(dish);
    }
}