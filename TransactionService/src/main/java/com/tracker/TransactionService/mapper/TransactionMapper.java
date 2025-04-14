package com.tracker.TransactionService.mapper;

import com.tracker.TransactionService.models.Transaction;
import com.tracker.TransactionService.models.TransactionDTO;

public class TransactionMapper {

    public static TransactionDTO convertToDTO(Transaction transaction) {
        if (transaction == null) {
            return null;
        }

        TransactionDTO dto = new TransactionDTO();
        dto.setId(transaction.getId());
        dto.setAmount(transaction.getAmount());
        dto.setType(transaction.getType().name());
        dto.setDescription(transaction.getDescription());
        dto.setTransactionDate(transaction.getTransactionDate());
        dto.setCreationDate(transaction.getCreationDate());
        dto.setGoalId(transaction.getGoalId());
        dto.setUserId(transaction.getUserId());

        return dto;
    }
}
