package com.tracker.TransactionService.services;

import com.tracker.TransactionService.models.DTO.MonthSummaryDTO;
import com.tracker.TransactionService.models.Transaction;
import com.tracker.TransactionService.models.DTO.UserBalanceDTO;

import java.util.List;

public interface TransactionService {

    //crud
    Transaction createTransaction(Transaction transaction, String requestRole) throws Exception;

    Transaction getTransactionById(Long id) throws Exception;

    List<Transaction> getAllTransactions();

    Transaction updateTransaction(Long id, Transaction updatedTransaction, Long userId) throws Exception;

    void deleteTransaction(Long id);

    Transaction assignToUser(Long userId, Long id) throws Exception;

    List<Transaction> assignedUsersTransactions(Long userId);

    //sort and filter
    List<Transaction> getFilteredTransactions(String type, String category, String sortBy);

    //dashboard
    UserBalanceDTO getBalance(Long userId);

    List<MonthSummaryDTO> getMonthlyIncomeAndExpenses(Long userId);
}
