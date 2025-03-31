package com.tracker.TransactionService.repository;

import com.tracker.TransactionService.models.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TransactionRepository extends JpaRepository<Transaction, Long> {

    public List<Transaction> findByUserId(Long userId);

}
