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

    // Método de login antigo (findByEmail) - não precisamos mais dele para login
    public Optional<User> findByEmailAndPassword(String email, String password) {
        User user = userRepository.findByEmail(email).orElseThrow(() -> new NoSuchElementException("Usuário não encontrado"));
        // Esta lógica antiga de 'equals' está INSEGURA
        if (password.equals(user.getPassword())) {  
            return Optional.of(user);
        }
        return Optional.empty();
    }
    
    // Método de login seguro
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
    // --- MÉTODO NOVO ADICIONADO AQUI ---
    //
    @org.springframework.transaction.annotation.Transactional
    public void changePassword(String userEmail, String oldPassword, String newPassword) {
        // 1. Busca o usuário pelo email (que veio do token)
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado."));

        // 2. Verifica se a senha antiga está correta
        if (!passwordEncoder.matches(oldPassword, user.getPassword())) {
            throw new RuntimeException("A senha antiga está incorreta.");
        }
        
        // 3. Criptografa e salva a nova senha
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
    }
}