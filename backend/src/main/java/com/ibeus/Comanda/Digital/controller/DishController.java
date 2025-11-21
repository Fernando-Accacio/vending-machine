package com.ibeus.Comanda.Digital.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile; // Importante
import com.ibeus.Comanda.Digital.model.Dish;
import com.ibeus.Comanda.Digital.service.DishService;
import com.ibeus.Comanda.Digital.service.CloudinaryService;

import java.util.List;

@RestController
@RequestMapping("/dishes")
@CrossOrigin(origins = "*") // Permite acesso geral para evitar erro de CORS no upload
public class DishController {

    @Autowired
    private DishService dishService;

    @Autowired
    private CloudinaryService cloudinaryService;

    @GetMapping
    public List<Dish> getAllDishes() {
        return dishService.findAll();
    }

    @GetMapping("/{id}")
    public Dish getDishById(@PathVariable Long id) {
        return dishService.findById(id);
    }

    // --- POST COM UPLOAD ---
    @PostMapping
    public Dish createDish(
            @RequestParam("name") String name,
            @RequestParam("description") String description,
            @RequestParam("custo") Double custo,
            @RequestParam("tempoReposicao") Integer tempoReposicao,
            @RequestParam(value = "imageUrl", required = false) String imageUrlInput, // Link manual
            @RequestParam(value = "file", required = false) MultipartFile file // Arquivo
    ) {
        Dish dish = new Dish();
        dish.setName(name);
        dish.setDescription(description);
        dish.setCusto(custo);
        dish.setTempoReposicao(tempoReposicao);

        // Lógica: Se tiver arquivo, faz upload. Se não, usa o link de texto.
        if (file != null && !file.isEmpty()) {
            String cloudUrl = cloudinaryService.uploadFile(file);
            dish.setImageUrl(cloudUrl);
        } else {
            dish.setImageUrl(imageUrlInput);
        }

        return dishService.create(dish);
    }

    // --- PUT COM UPLOAD ---
    @PutMapping("/{id}")
    public Dish updateDish(
            @PathVariable Long id,
            @RequestParam("name") String name,
            @RequestParam("description") String description,
            @RequestParam("custo") Double custo,
            @RequestParam("tempoReposicao") Integer tempoReposicao,
            @RequestParam(value = "imageUrl", required = false) String imageUrlInput,
            @RequestParam(value = "file", required = false) MultipartFile file
    ) {
        // Recupera o prato antigo para manter a imagem se nada for enviado
        Dish existingDish = dishService.findById(id);
        
        existingDish.setName(name);
        existingDish.setDescription(description);
        existingDish.setCusto(custo);
        existingDish.setTempoReposicao(tempoReposicao);

        if (file != null && !file.isEmpty()) {
            // Novo arquivo substitui tudo
            String cloudUrl = cloudinaryService.uploadFile(file);
            existingDish.setImageUrl(cloudUrl);
        } else if (imageUrlInput != null && !imageUrlInput.isEmpty()) {
            // Novo link substitui
            existingDish.setImageUrl(imageUrlInput);
        }
        // Se ambos forem nulos, mantém a imagem antiga que já estava no existingDish

        return dishService.update(id, existingDish);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteDish(@PathVariable Long id) {
        dishService.delete(id);
        return ResponseEntity.noContent().build();
    }
}