package com.agrishakti.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.util.Set;

public class SignupRequest {
    @NotBlank
    @Size(min = 3, max = 20)
    private String username;

    @NotBlank
    @Size(max = 50)
    @Email
    private String email;

    private Set<String> role;

    @NotBlank
    @Size(min = 6, max = 40)
    private String password;

    public SignupRequest() {}

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }
    
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    
    public Set<String> getRole() { return role; }
    public void setRole(Set<String> role) { this.role = role; }
    
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
    
    private String upiId;
    private String bankAccountNumber;
    private String bankIfscCode;
    private String bankName;
    
    public String getUpiId() { return upiId; }
    public void setUpiId(String upiId) { this.upiId = upiId; }
    public String getBankAccountNumber() { return bankAccountNumber; }
    public void setBankAccountNumber(String bankAccountNumber) { this.bankAccountNumber = bankAccountNumber; }
    public String getBankIfscCode() { return bankIfscCode; }
    public void setBankIfscCode(String bankIfscCode) { this.bankIfscCode = bankIfscCode; }
    public String getBankName() { return bankName; }
    public void setBankName(String bankName) { this.bankName = bankName; }
}
