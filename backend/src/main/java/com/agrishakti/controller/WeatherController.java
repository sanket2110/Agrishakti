package com.agrishakti.controller;

import com.agrishakti.service.WeatherService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/weather")
public class WeatherController {

    @Autowired
    private WeatherService weatherService;

    @GetMapping
    @PreAuthorize("hasRole('FARMER') or hasRole('ADMIN')")
    public ResponseEntity<String> getWeather(@RequestParam String lat, @RequestParam String lon) {
        String weatherData = weatherService.getWeatherForLocation(lat, lon);
        return ResponseEntity.ok(weatherData);
    }
}
