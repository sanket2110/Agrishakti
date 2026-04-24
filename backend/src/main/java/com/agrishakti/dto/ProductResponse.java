package com.agrishakti.dto;

import java.math.BigDecimal;

public class ProductResponse {
    private Long id;
    private String title;
    private String description;
    private BigDecimal pricePerKg;
    private Double quantityAvailable;
    private String imageUrl;
    private String farmerName;

    public ProductResponse() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public BigDecimal getPricePerKg() { return pricePerKg; }
    public void setPricePerKg(BigDecimal pricePerKg) { this.pricePerKg = pricePerKg; }

    public Double getQuantityAvailable() { return quantityAvailable; }
    public void setQuantityAvailable(Double quantityAvailable) { this.quantityAvailable = quantityAvailable; }

    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }

    public String getFarmerName() { return farmerName; }
    public void setFarmerName(String farmerName) { this.farmerName = farmerName; }
    
    private String farmerUpiId;
    public String getFarmerUpiId() { return farmerUpiId; }
    public void setFarmerUpiId(String farmerUpiId) { this.farmerUpiId = farmerUpiId; }
}
