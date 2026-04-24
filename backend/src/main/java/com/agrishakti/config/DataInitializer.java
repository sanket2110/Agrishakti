package com.agrishakti.config;

import com.agrishakti.entity.ERole;
import com.agrishakti.entity.Role;
import com.agrishakti.repository.RoleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private RoleRepository roleRepository;

    @Override
    public void run(String... args) throws Exception {
        // Automatically insert roles into the H2 database if they don't exist
        if (roleRepository.count() == 0) {
            roleRepository.save(new Role(ERole.ROLE_FARMER));
            roleRepository.save(new Role(ERole.ROLE_BUYER));
            roleRepository.save(new Role(ERole.ROLE_ADMIN));
            System.out.println("Default roles (FARMER, BUYER, ADMIN) initialized in database.");
        }
    }
}
