package com.ibeus.Comanda.Digital.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import com.ibeus.Comanda.Digital.model.User;
import com.ibeus.Comanda.Digital.repository.UserRepository;
import com.ibeus.Comanda.Digital.controller.AuthController.RegisterRequest;

import java.util.List;
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
        user.setActive(true); // Garante que nasce ativo

        return userRepository.save(user);
    }

    // --- MÉTODO DE LOGIN ATUALIZADO ---
    public User authenticateUser(String documento, String password) {
        Optional<User> userOptional = userRepository.findByDocumento(documento);

        if (userOptional.isPresent()) {
            User user = userOptional.get();
            
            // 1. VERIFICA SE ESTÁ ATIVO ANTES DE TUDO
            // Assim, o bloqueio tem prioridade sobre a senha.
            if (!user.isActive()) {
                throw new RuntimeException("Conta bloqueada. Contate o gerente.");
            }

            // 2. DEPOIS VERIFICA A SENHA
            if (passwordEncoder.matches(password, user.getPassword())) {
                return user;
            }
        }
        // Retorna null se usuário não existe ou senha errada
        return null; 
    }

    // --- Novos Métodos para o ADMIN ---

    public List<User> findAllUsers() {
        return userRepository.findAll();
    }

    public User toggleUserStatus(Long id) {
        User user = findById(id);
        // Inverte o status (se true vira false, se false vira true)
        user.setActive(!user.isActive());
        return userRepository.save(user);
    }

    // --- Método para o Cliente se Auto-Desativar ---
    public void deactivateMyAccount(String email) {
        User user = findByEmail(email);
        if (user != null) {
            user.setActive(false);
            userRepository.save(user);
        }
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

    // --- ALTERAÇÃO DE CREDENCIAIS ---
    @org.springframework.transaction.annotation.Transactional
    public void changeCredentials(String userEmail, String oldPassword, String newPassword, String newUsername) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado."));

        if (!passwordEncoder.matches(oldPassword, user.getPassword())) {
            throw new RuntimeException("A senha atual está incorreta.");
        }
        
        if (newUsername != null && !newUsername.trim().isEmpty()) {
            user.setName(newUsername.trim());
        }

        if (newPassword != null && !newPassword.trim().isEmpty()) {
             if (passwordEncoder.matches(newPassword, user.getPassword())) {
                 throw new RuntimeException("A nova senha não pode ser igual à antiga.");
             }
            user.setPassword(passwordEncoder.encode(newPassword));
        } else if ((newUsername == null || newUsername.trim().isEmpty())) {
             throw new RuntimeException("Nenhuma credencial para alterar.");
        }
        
        userRepository.save(user);
    }
}