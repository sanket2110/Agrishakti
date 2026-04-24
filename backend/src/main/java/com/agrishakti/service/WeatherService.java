package com.agrishakti.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class WeatherService {

    @Value("${weather.api.key}")
    private String apiKey;

    @Value("${weather.api.url}")
    private String apiUrl;

    public String getWeatherForLocation(String lat, String lon) {
        // Example with OpenWeatherMap
        // In a real application, you'd map this to a DTO rather than returning raw JSON String
        String url = String.format("%s?lat=%s&lon=%s&appid=%s&units=metric", apiUrl, lat, lon, apiKey);
        
        try {
            RestTemplate restTemplate = new RestTemplate();
            return restTemplate.getForObject(url, String.class);
        } catch (Exception e) {
            // Mock data fallback if API key is invalid
            return "{ \"coord\": {\"lon\": " + lon + ", \"lat\": " + lat + "}, \"weather\": [{\"main\": \"Clear\", \"description\": \"clear sky\"}], \"main\": {\"temp\": 28.5, \"humidity\": 65}, \"wind\": {\"speed\": 3.5} }";
        }
    }
}
