package com.tracker.TransactionService.services;

import com.tracker.TransactionService.models.Transaction;
import com.tracker.TransactionService.models.UserDTO;
import com.tracker.TransactionService.repository.TransactionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.List;

@Service
public class TransactionServiceImpl implements TransactionService{

    @Autowired
    private TransactionRepository transactionRepository;

    @Override
    public Transaction createTransaction(Transaction transaction, String requestRole) throws Exception {
        transaction.setCreationDate(LocalDateTime.now());
        return transactionRepository.save(transaction);
    }

    @Override
    public Transaction getTransactionById(Long id)throws Exception {
        return transactionRepository.findById(id).orElseThrow(()->new Exception("Transaction not found"));
    }

    @Override
    public List<Transaction> getAllTransactions() {
        List<Transaction> allTransaction = transactionRepository.findAll();
        return allTransaction;
    }

    @Override
    public Transaction updateTransaction(Long id, Transaction updatedTransaction, Long userId) throws Exception {
        Transaction existingTransaction = getTransactionById(id);

        if(updatedTransaction.getAmount()!=null) {
            existingTransaction.setAmount(updatedTransaction.getAmount());
        }
        if(updatedTransaction.getUserId()!=null) {
            existingTransaction.setUserId(updatedTransaction.getUserId());
        }
        if(updatedTransaction.getCategory()!=null) {
            existingTransaction.setCategory(updatedTransaction.getCategory());
        }
        if(updatedTransaction.getDescription()!=null) {
            existingTransaction.setDescription(updatedTransaction.getDescription());
        }
        if(updatedTransaction.getType()!=null) {
            existingTransaction.setType(updatedTransaction.getType());
        }
        if(updatedTransaction.getTransactionDate()!=null) {
            existingTransaction.setTransactionDate(updatedTransaction.getTransactionDate());
        }

        return transactionRepository.save(existingTransaction);
    }

    @Override
    public void deleteTransaction(Long id) {
        transactionRepository.deleteById(id);
    }

    @Override
    public Transaction assignToUser(Long userId, Long id) throws Exception {
        Transaction transaction = getTransactionById(id);
        transaction.setUserId(userId);
        return transactionRepository.save(transaction);
    }

    @Override
    public List<Transaction> getFilteredTransactions(String type, String category, String sortBy) {
        List<Transaction> transactions = transactionRepository.findAll();

        if (type != null) {
            transactions = transactions.stream()
                    .filter(t -> t.getType().name().equalsIgnoreCase(type))
                    .toList();
        }

        if (category != null) {
            transactions = transactions.stream()
                    .filter(t -> t.getCategory().getName().equalsIgnoreCase(category))
                    .toList();
        }

        if (sortBy != null) {
            switch (sortBy.toLowerCase()) {
                case "amount":
                    transactions = transactions.stream()
                            .sorted(Comparator.comparing(Transaction::getAmount))
                            .toList();
                    break;
                case "date":
                    transactions = transactions.stream()
                            .sorted(Comparator.comparing(Transaction::getTransactionDate))
                            .toList();
                    break;
            }
        }

        return transactions;
    }


}
