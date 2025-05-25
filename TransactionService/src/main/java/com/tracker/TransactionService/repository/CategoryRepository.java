package com.tracker.TransactionService.repository;

import com.tracker.TransactionService.controllers.CategoryController;
import com.tracker.TransactionService.models.Category;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CategoryRepository extends JpaRepository<Category, Long> {
    List<Category> findAll();
}
