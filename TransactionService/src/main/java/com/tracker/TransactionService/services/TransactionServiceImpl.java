package com.tracker.TransactionService.services;

import com.tracker.TransactionService.models.DTO.MonthSummaryDTO;
import com.tracker.TransactionService.models.Transaction;
import com.tracker.TransactionService.models.DTO.UserBalanceDTO;
import com.tracker.TransactionService.models.enums.Type;
import com.tracker.TransactionService.repository.TransactionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.YearMonth;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

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
    public List<Transaction> assignedUsersTransactions(Long userId) {

        List<Transaction> allTransactions = transactionRepository.findByUserId(userId);

        return allTransactions;
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

    @Override
    public UserBalanceDTO getBalance(Long userId) {
        List<Transaction> transactions = assignedUsersTransactions(userId);

        double income = transactions.stream()
                .filter(t -> t.getType() == Type.INCOME)
                .mapToDouble(Transaction::getAmount)
                .sum();

        double expenses = transactions.stream()
                .filter(t -> t.getType() == Type.EXPENSE)
                .mapToDouble(Transaction::getAmount)
                .sum();

        double balance = income - expenses;

        return new UserBalanceDTO(balance, income, expenses);
    }

    @Override
    public List<MonthSummaryDTO> getMonthlyIncomeAndExpenses(Long userId) {
        List<Transaction> userTransactions = assignedUsersTransactions(userId);

        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd.MM.yyyy");

        Map<YearMonth, List<Transaction>> groupedByMonth = userTransactions.stream()
                .filter(t -> isValidDate(t.getTransactionDate(), formatter)) // Перевірка, чи дата валідна
                .collect(Collectors.groupingBy(t -> {
                    LocalDate date = LocalDate.parse(t.getTransactionDate(), formatter);
                    return YearMonth.from(date);
                }));

        List<MonthSummaryDTO> summaryList = groupedByMonth.entrySet().stream()
                .map(entry -> {
                    YearMonth month = entry.getKey();
                    List<Transaction> transactions = entry.getValue();

                    double income = transactions.stream()
                            .filter(t -> t.getType() == Type.INCOME)
                            .mapToDouble(Transaction::getAmount)
                            .sum();

                    double expense = transactions.stream()
                            .filter(t -> t.getType() == Type.EXPENSE)
                            .mapToDouble(Transaction::getAmount)
                            .sum();

                    return new MonthSummaryDTO(month.toString(), income, expense);
                })
                .sorted(Comparator.comparing(MonthSummaryDTO::getMonth))
                .collect(Collectors.toList());

        return summaryList;
    }

    private boolean isValidDate(String dateStr, DateTimeFormatter formatter) {
        try {
            LocalDate.parse(dateStr, formatter);
            return true;
        } catch (DateTimeParseException e) {
            return false;
        }
    }

}
