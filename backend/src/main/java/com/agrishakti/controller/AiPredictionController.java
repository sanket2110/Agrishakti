package com.agrishakti.controller;

import com.agrishakti.service.AiPredictionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/ai")
public class AiPredictionController {

    @Autowired
    private AiPredictionService aiPredictionService;

    @PostMapping("/predict")
    @PreAuthorize("hasRole('FARMER') or hasRole('ADMIN')")
    public ResponseEntity<String> predictDisease(@RequestParam("file") MultipartFile file) {
        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body("Please upload a valid image file.");
        }
        
        String result = aiPredictionService.predictDisease(file);
        return ResponseEntity.ok(result);
    }
}
