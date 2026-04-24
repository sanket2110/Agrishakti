package com.agrishakti.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/satellite")
public class SatelliteController {

    @GetMapping("/ndvi")
    @PreAuthorize("hasRole('FARMER') or hasRole('ADMIN')")
    public ResponseEntity<String> getMockNdviData(@RequestParam String lat, @RequestParam String lon) {
        // Mocking NDVI (Normalized Difference Vegetation Index) data
        String mockData = "{" +
                "\"location\": {\"lat\": " + lat + ", \"lon\": " + lon + "}," +
                "\"ndvi_score\": 0.72," +
                "\"health_status\": \"Good\"," +
                "\"recommendation\": \"Crop health is optimal. Continue current irrigation schedule.\"" +
                "}";
        return ResponseEntity.ok(mockData);
    }
}
