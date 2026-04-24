package com.agrishakti.controller;

import com.agrishakti.dto.MessageResponse;
import com.agrishakti.dto.ProductRequest;
import com.agrishakti.dto.ProductResponse;
import com.agrishakti.entity.Product;
import com.agrishakti.entity.User;
import com.agrishakti.repository.ProductRepository;
import com.agrishakti.repository.UserRepository;
import com.agrishakti.security.services.UserDetailsImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.web.multipart.MultipartFile;
import org.springframework.util.StringUtils;
import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;
import java.math.BigDecimal;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/products")
public class ProductController {

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private UserRepository userRepository;

    @GetMapping
    public ResponseEntity<List<ProductResponse>> getAllProducts() {
        List<Product> products = productRepository.findAll();
        
        List<ProductResponse> responses = products.stream().map(p -> {
            ProductResponse resp = new ProductResponse();
            resp.setId(p.getId());
            resp.setTitle(p.getTitle());
            resp.setDescription(p.getDescription());
            resp.setPricePerKg(p.getPricePerKg());
            resp.setQuantityAvailable(p.getQuantityAvailable());
            resp.setImageUrl(p.getImageUrl());
            if (p.getFarmer() != null) {
                resp.setFarmerName(p.getFarmer().getUsername());
                resp.setFarmerUpiId(p.getFarmer().getUpiId());
            } else {
                resp.setFarmerName("Unknown Farmer");
            }
            return resp;
        }).collect(Collectors.toList());

        return ResponseEntity.ok(responses);
    }

    @PostMapping(consumes = {"multipart/form-data"})
    @PreAuthorize("hasRole('FARMER')")
    public ResponseEntity<?> createProduct(
            @RequestParam("title") String title,
            @RequestParam("description") String description,
            @RequestParam("pricePerKg") BigDecimal pricePerKg,
            @RequestParam("quantityAvailable") Double quantityAvailable,
            @RequestParam(value = "image", required = false) MultipartFile multipartFile) throws IOException {
            
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        
        User farmer = userRepository.findById(userDetails.getId())
                .orElseThrow(() -> new RuntimeException("Error: User is not found."));

        Product product = new Product();
        product.setTitle(title);
        product.setDescription(description);
        product.setPricePerKg(pricePerKg);
        product.setQuantityAvailable(quantityAvailable);
        product.setFarmer(farmer);

        // Handle File Upload
        if (multipartFile != null && !multipartFile.isEmpty()) {
            String fileName = StringUtils.cleanPath(multipartFile.getOriginalFilename());
            String uniqueFileName = UUID.randomUUID().toString() + "_" + fileName;
            
            Path uploadDir = Paths.get("uploads");
            if (!Files.exists(uploadDir)) {
                Files.createDirectories(uploadDir);
            }
            
            try (InputStream inputStream = multipartFile.getInputStream()) {
                Path filePath = uploadDir.resolve(uniqueFileName);
                Files.copy(inputStream, filePath, StandardCopyOption.REPLACE_EXISTING);
                
                // Set the URL path for the frontend
                product.setImageUrl("http://localhost:8080/uploads/" + uniqueFileName);
            } catch (IOException ioe) {
                throw new IOException("Could not save image file: " + fileName, ioe);
            }
        } else {
            // Default image if none provided
            product.setImageUrl("https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=500&q=80");
        }

        productRepository.save(product);

        return ResponseEntity.ok(new MessageResponse("Product listed successfully with image!"));
    }
}
