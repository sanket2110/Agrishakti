package com.agrishakti.entity;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "crops")
public class Crop {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name; // e.g., Paddy (Basmati)
    private String season;
    private Double areaAcres;
    
    private LocalDate sowingDate;
    private LocalDate expectedHarvestDate;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "farmer_id", nullable = false)
    private User farmer;

    public Crop() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    
    public String getSeason() { return season; }
    public void setSeason(String season) { this.season = season; }
    
    public Double getAreaAcres() { return areaAcres; }
    public void setAreaAcres(Double areaAcres) { this.areaAcres = areaAcres; }
    
    public LocalDate getSowingDate() { return sowingDate; }
    public void setSowingDate(LocalDate sowingDate) { this.sowingDate = sowingDate; }
    
    public LocalDate getExpectedHarvestDate() { return expectedHarvestDate; }
    public void setExpectedHarvestDate(LocalDate expectedHarvestDate) { this.expectedHarvestDate = expectedHarvestDate; }
    
    public User getFarmer() { return farmer; }
    public void setFarmer(User farmer) { this.farmer = farmer; }
}
