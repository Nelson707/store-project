package com.store.Store.config;

import com.store.Store.models.AppUser;
import com.store.Store.models.Role;
import com.store.Store.repositories.AppUserRepository;
import com.store.Store.repositories.RoleRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.HashSet;

@Component
public class DataInitializer implements CommandLineRunner {

    private final AppUserRepository appUserRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${DEFAULT_ADMIN_EMAIL:admin@store.com}")
    private String adminEmail;

    @Value("${DEFAULT_ADMIN_PASSWORD:admin123}")
    private String adminPassword;

    public DataInitializer(
            AppUserRepository appUserRepository,
            RoleRepository roleRepository,
            PasswordEncoder passwordEncoder
    ) {
        this.appUserRepository = appUserRepository;
        this.roleRepository = roleRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {

        // Create ADMIN role if it does not exist
        Role adminRole = roleRepository.findByName(Role.ADMIN)
                .orElseGet(() -> {
                    Role role = new Role();
                    role.setName(Role.ADMIN);
                    return roleRepository.save(role);
                });

        // Create USER role if it does not exist
        roleRepository.findByName(Role.USER)
                .orElseGet(() -> {
                    Role role = new Role();
                    role.setName(Role.USER);
                    return roleRepository.save(role);
                });

        // Create default admin user if it does not exist
        if (!appUserRepository.existsByEmail(adminEmail)) {

            AppUser admin = new AppUser();

            admin.setName("Administrator");
            admin.setEmail(adminEmail);
            admin.setPassword(passwordEncoder.encode(adminPassword));
            admin.setPhoneNumber("");
            admin.setRoles(new HashSet<>());
            admin.getRoles().add(adminRole);
            admin.setEnabled(true);

            appUserRepository.save(admin);

            System.out.println("========================================");
            System.out.println("Default admin user created:");
            System.out.println("Email: " + adminEmail);
            System.out.println("========================================");

        } else {
            System.out.println("Default admin user already exists: " + adminEmail);
        }
    }
}
