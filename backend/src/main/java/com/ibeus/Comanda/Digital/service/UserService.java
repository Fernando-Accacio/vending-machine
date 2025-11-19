package com.ibeus.Comanda.Digital.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import com.ibeus.Comanda.Digital.model.User;
import com.ibeus.Comanda.Digital.repository.UserRepository;
import com.ibeus.Comanda.Digital.controller.AuthController.RegisterRequest;

import java.util.NoSuchElementException;
import java.util.Optional;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Autowired
    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    // --- Método de Registro ---
    @org.springframework.transaction.annotation.Transactional
    public User register(RegisterRequest request) {
        if (userRepository.findByDocumento(request.getDocumento()).isPresent() ||
            userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new RuntimeException("Usuário (documento ou email) já cadastrado.");
        }

        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setDocumento(request.getDocumento());
        user.setPhoneNumber(request.getPhoneNumber());
        
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        
        user.setRole("cliente");

        return userRepository.save(user);
    }

    // --- MÉTODO DE LOGIN (findByDocumentoAndPassword) ---
    public Optional<User> findByDocumentoAndPassword(String documento, String password) {
        Optional<User> userOptional = userRepository.findByDocumento(documento);

        if (userOptional.isPresent()) {
            User user = userOptional.get();
            if (passwordEncoder.matches(password, user.getPassword())) {
                return Optional.of(user);
            }
        }
        
        return Optional.empty();
    }

    // --- Métodos de Busca/CRUD ---
    public User findById(Long id) {
        return userRepository.findById(id).orElseThrow(() -> new RuntimeException("User not found"));
    }

    public User findByEmail(String email) {
        return userRepository.findByEmail(email).orElse(null);
    }
    
    public Optional<User> findByDocumento(String documento) {
        return userRepository.findByDocumento(documento);
    }

    public User create(User user) {
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        return userRepository.save(user);
    }

    public User update(Long id, User userDetails) {
        User user = findById(id);
        user.setName(userDetails.getName());
        user.setEmail(userDetails.getEmail());
        user.setDocumento(userDetails.getDocumento());
        user.setRole(userDetails.getRole());
        user.setPhoneNumber(userDetails.getPhoneNumber());

        if (userDetails.getPassword() != null && !userDetails.getPassword().isEmpty()) {
            user.setPassword(passwordEncoder.encode(userDetails.getPassword()));
        }
        
        return userRepository.save(user);
    }

    public void delete(Long id) {
        User user = findById(id);
        userRepository.delete(user);
    }

    //
    // --- MÉTODO DE ALTERAÇÃO DE CREDENCIAIS ---
    //
    @org.springframework.transaction.annotation.Transactional
    public void changeCredentials(
            String userEmail, 
            String oldPassword, 
            String newPassword,
            String newUsername 
    ) {
        // 1. Busca o usuário pelo email (que veio do token)
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado."));

        // 2. Verifica se a senha antiga está correta (OBRIGATÓRIO para qualquer alteração)
        if (!passwordEncoder.matches(oldPassword, user.getPassword())) {
            throw new RuntimeException("A senha atual está incorreta.");
        }
        
        // 3. Lógica Opcional: Altera o nome de usuário
        if (newUsername != null && !newUsername.trim().isEmpty()) {
            user.setName(newUsername.trim());
        }

        // 4. Lógica Opcional: Altera a senha
        if (newPassword != null && !newPassword.trim().isEmpty()) {
             // 4.1. Validação de Senha
             if (passwordEncoder.matches(newPassword, user.getPassword())) {
                 throw new RuntimeException("A nova senha não pode ser igual à antiga.");
             }
            // 4.2. Criptografa e salva a nova senha
            user.setPassword(passwordEncoder.encode(newPassword));
        } else if ((newUsername == null || newUsername.trim().isEmpty())) {
             // Se não mudou nem senha e nem nome de usuário, cancela
             throw new RuntimeException("Nenhuma credencial para alterar (Nova Senha e Novo Nome de Usuário vazios).");
        }
        
        // 5. Salva o usuário com as alterações feitas
        userRepository.save(user);
    }
}