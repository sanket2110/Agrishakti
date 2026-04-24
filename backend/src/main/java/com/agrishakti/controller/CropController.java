package com.agrishakti.controller;

import com.agrishakti.entity.Crop;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/crops")
public class CropController {

    @GetMapping
    @PreAuthorize("hasRole('FARMER')")
    public ResponseEntity<List<Crop>> getMyCrops() {
        // Return mock data for the demo
        Crop c1 = new Crop();
        c1.setId(1L);
        c1.setName("Basmati Paddy");
        c1.setSeason("Kharif");
        c1.setAreaAcres(5.5);
        c1.setSowingDate(LocalDate.now().minusMonths(1));
        c1.setExpectedHarvestDate(LocalDate.now().plusMonths(3));

        return ResponseEntity.ok(Arrays.asList(c1));
    }

    @PostMapping
    @PreAuthorize("hasRole('FARMER')")
    public ResponseEntity<?> addCrop(@RequestBody Crop crop) {
        // Here we would normally set the farmer to the currently authenticated user
        return ResponseEntity.ok("Crop added successfully!");
    }
}
