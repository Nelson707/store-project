package com.store.Store.controllers.api;

import com.store.Store.dto.AuthResponseDto;
import com.store.Store.dto.LoginDto;
import com.store.Store.dto.RegisterDto;
import com.store.Store.models.*;
import com.store.Store.repositories.AppUserRepository;
import com.store.Store.repositories.RoleRepository;
import com.store.Store.security.JwtUtil;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;


import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    private final AppUserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;

    @Autowired
    private JwtUtil jwtUtil;

    public AuthController(
            AppUserRepository userRepository,
            RoleRepository roleRepository,
            PasswordEncoder passwordEncoder,
            AuthenticationManager authenticationManager
    ) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterDto dto) {

        // 1. Email uniqueness check
        if (userRepository.findByEmail(dto.getEmail()).isPresent()) {
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body("Email already registered");
        }

        // 2. Password confirmation check
        if (!dto.getPassword().equals(dto.getConfirmPassword())) {
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body("Passwords do not match");
        }

        // 3. Assign role (DEFAULT = USER)
        Role role = roleRepository.findByName(Role.USER)
                .orElseThrow(() -> new RuntimeException("Default role not found"));

        // 4. Create user
        AppUser user = new AppUser();
        user.setName(dto.getName());
        user.setEmail(dto.getEmail());
        user.setPhoneNumber(dto.getPhoneNumber());
        user.setPassword(passwordEncoder.encode(dto.getPassword()));
        user.setRoles(Collections.singleton(role));
        user.setEnabled(true); // set false if you plan email verification

        // 5. Save
        userRepository.save(user);

        // Generate token and return auth response just like login
        String token = jwtUtil.generateToken(user.getEmail());

        AuthResponseDto response = new AuthResponseDto(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getPhoneNumber(),
                user.getRoles().stream().map(Role::getName).collect(Collectors.toSet()),
                token
        );

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PostMapping("/users/create-admin")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> createAdminUser(@Valid @RequestBody RegisterDto request ) {

        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body("Email already registered");
        }

        Role adminRole = roleRepository.findByName(Role.ADMIN)
                .orElseThrow(() -> new RuntimeException("Admin role not found"));

        AppUser user = new AppUser();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPhoneNumber(request.getPhoneNumber());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRoles(Collections.singleton(adminRole));
        user.setEnabled(true);

        userRepository.save(user);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body("Admin user created successfully");
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginDto dto) {

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        dto.getEmail(),
                        dto.getPassword()
                )
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);

        // Generate JWT token
        String token = jwtUtil.generateToken(dto.getEmail());

        String email = authentication.getName();
        AppUser user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        AuthResponseDto response = new AuthResponseDto(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getPhoneNumber(),
                user.getRoles()
                        .stream()
                        .map(Role::getName)
                        .collect(Collectors.toSet()),
                token  // Include JWT token in response
        );

        return ResponseEntity.ok(response);
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout() {
        // JWT is stateless — no server-side session to invalidate.
        // The client is responsible for discarding the token.
        SecurityContextHolder.clearContext();
        return ResponseEntity.ok(Map.of("message", "Logged out successfully"));
    }

    @GetMapping("/me")
    public ResponseEntity<?> me(Authentication authentication) {

        // email is used as username
        String email = authentication.getName();

        AppUser user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return ResponseEntity.ok(
                Map.of(
                        "id", user.getId(),
                        "name", user.getName(),
                        "email", user.getEmail(),
                        "phoneNumber", user.getPhoneNumber(),
                        "roles", user.getRoles()
                                .stream()
                                .map(role -> role.getName())
                                .toList()
                )
        );
    }

    @GetMapping("/users")
    public ResponseEntity<?> getAllUsers() {
        List<AppUser> users = userRepository.findAll();

        List<Map<String, Object>> userList = users.stream()
                .map(user -> Map.of(
                        "id", user.getId(),
                        "name", user.getName(),
                        "email", user.getEmail(),
                        "phoneNumber", user.getPhoneNumber(),
                        "enabled", user.isEnabled(),
//                        "created_at", user.getCreatedAt(),
                        "roles", user.getRoles()
                                .stream()
                                .map(role -> role.getName())
                                .collect(Collectors.toSet())
                ))
                .collect(Collectors.toList());

        return ResponseEntity.ok(userList);
    }

    /**
     * ENDPOINT 1: Get all admin users
     * Access: Only accessible by ADMIN users
     */
    @GetMapping("/users/admins")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getAdminUsers() {
        // Find the ADMIN role
        Role adminRole = roleRepository.findByName(Role.ADMIN)
                .orElseThrow(() -> new RuntimeException("Admin role not found"));

        // Get all users with ADMIN role
        List<AppUser> adminUsers = userRepository.findAll().stream()
                .filter(user -> user.getRoles().contains(adminRole))
                .collect(Collectors.toList());

        List<Map<String, Object>> adminList = adminUsers.stream()
                .map(user -> Map.of(
                        "id", user.getId(),
                        "name", user.getName(),
                        "email", user.getEmail(),
                        "phoneNumber", user.getPhoneNumber(),
                        "enabled", user.isEnabled(),
                        "roles", user.getRoles()
                                .stream()
                                .map(Role::getName)
                                .collect(Collectors.toSet())
                ))
                .collect(Collectors.toList());

        return ResponseEntity.ok(Map.of(
                "totalAdmins", adminList.size(),
                "admins", adminList
        ));
    }

    /**
     * ENDPOINT 2: Get all regular users (non-admin)
     * Access: Only accessible by ADMIN users
     */
    @GetMapping("/users/regular")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getRegularUsers() {
        // Find the ADMIN role
        Role adminRole = roleRepository.findByName(Role.ADMIN)
                .orElseThrow(() -> new RuntimeException("Admin role not found"));

        // Get all users without ADMIN role (only USER role)
        List<AppUser> regularUsers = userRepository.findAll().stream()
                .filter(user -> !user.getRoles().contains(adminRole))
                .collect(Collectors.toList());

        List<Map<String, Object>> regularList = regularUsers.stream()
                .map(user -> Map.of(
                        "id", user.getId(),
                        "name", user.getName(),
                        "email", user.getEmail(),
                        "phoneNumber", user.getPhoneNumber(),
                        "enabled", user.isEnabled(),
                        "roles", user.getRoles()
                                .stream()
                                .map(Role::getName)
                                .collect(Collectors.toSet())
                ))
                .collect(Collectors.toList());

        return ResponseEntity.ok(Map.of(
                "totalRegularUsers", regularList.size(),
                "users", regularList
        ));
    }

    // Edit user
    @PutMapping("/users/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> updateUser(@PathVariable Long id, @RequestBody Map<String, String> updates) {
        AppUser user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (updates.containsKey("name")) user.setName(updates.get("name"));
        if (updates.containsKey("email")) user.setEmail(updates.get("email"));
        if (updates.containsKey("phoneNumber")) user.setPhoneNumber(updates.get("phoneNumber"));

        userRepository.save(user);

        return ResponseEntity.ok(Map.of(
                "message", "User updated successfully",
                "user", Map.of(
                        "id", user.getId(),
                        "name", user.getName(),
                        "email", user.getEmail(),
                        "phoneNumber", user.getPhoneNumber()
                )
        ));
    }

    // Update own profile
    @PutMapping("/me/update")
    public ResponseEntity<?> updateProfile(@RequestBody Map<String, String> updates, Authentication authentication) {
        AppUser user = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (updates.containsKey("name")) user.setName(updates.get("name"));
        if (updates.containsKey("email")) user.setEmail(updates.get("email"));
        if (updates.containsKey("phoneNumber")) user.setPhoneNumber(updates.get("phoneNumber"));

        userRepository.save(user);

        return ResponseEntity.ok(Map.of("message", "Profile updated successfully"));
    }

    // Change own password
    @PutMapping("/me/change-password")
    public ResponseEntity<?> changePassword(@RequestBody Map<String, String> body, Authentication authentication) {
        AppUser user = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!passwordEncoder.matches(body.get("currentPassword"), user.getPassword())) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Current password is incorrect");
        }

        if (!body.get("newPassword").equals(body.get("confirmPassword"))) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Passwords do not match");
        }

        user.setPassword(passwordEncoder.encode(body.get("newPassword")));
        userRepository.save(user);

        return ResponseEntity.ok(Map.of("message", "Password changed successfully"));
    }

    // Delete user
    @DeleteMapping("/users/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        AppUser user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        userRepository.delete(user);

        return ResponseEntity.ok(Map.of("message", "User deleted successfully"));
    }


}
