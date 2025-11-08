package com.ibeus.Comanda.Digital.repository;

import com.ibeus.Comanda.Digital.model.Dish;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface DishRepository extends JpaRepository<Dish, Long> {
    // Este método buscará apenas os pratos que têm o campo 'is_active' como TRUE.
    List<Dish> findByIsActiveTrue();
}