package com.agrishakti.repository;

import com.agrishakti.entity.Product;
import com.agrishakti.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    @Transactional
    void deleteByFarmer(User farmer);
}
