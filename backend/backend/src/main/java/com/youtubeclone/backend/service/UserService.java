package com.youtubeclone.backend.service;

import java.util.Optional;

import org.springframework.stereotype.Service;

import com.youtubeclone.backend.model.User;
import com.youtubeclone.backend.repository.UserRepository;

@Service
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    // Register a new user
    public User register(User user) {
        return userRepository.save(user);
    }

    // Login user
    public Optional<User> login(String email, String password) {
        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isPresent() && userOpt.get().getPassword().equals(password)) {
            return userOpt;
        }
        return Optional.empty();
    }
}
