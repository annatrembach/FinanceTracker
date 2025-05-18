package com.tracker.TransactionService.controllers;

import com.tracker.TransactionService.models.DTO.MonthSummaryDTO;
import com.tracker.TransactionService.models.Transaction;
import com.tracker.TransactionService.models.DTO.UserBalanceDTO;
import com.tracker.TransactionService.models.DTO.UserDTO;
import com.tracker.TransactionService.publisher.TransactionProducer;
import com.tracker.TransactionService.services.TransactionService;
import com.tracker.TransactionService.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/transactions")
@CrossOrigin(origins = "http://localhost:3000/", allowCredentials = "true")
public class TransactionController {

    @Autowired
    private TransactionService transactionService;

    @Autowired
    private TransactionProducer transactionProducer;

    @Autowired
    private UserService userService;

    @PostMapping("/create")
    public ResponseEntity<Transaction> createTransaction(@RequestBody Transaction transaction,
                                                         @RequestHeader("Authorization") String jwt ) throws Exception {
        UserDTO user = userService.getUserProfile(jwt);

        Transaction createdTransaction = transactionService.createTransaction(transaction, user.getRole());

        transactionProducer.sendTransactionUpdate(createdTransaction);

        return new ResponseEntity<>(createdTransaction, HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Transaction> getTransactionById(@PathVariable Long id) throws Exception {
        Transaction transaction = transactionService.getTransactionById(id);

        return new ResponseEntity<>(transaction, HttpStatus.OK);
    }

    @GetMapping("/")
    public ResponseEntity<List<Transaction>> getAllTransactions() throws Exception {
        List<Transaction> transactions = transactionService.getAllTransactions();

        return new ResponseEntity<>(transactions, HttpStatus.OK);
    }

    @PutMapping("/{id}/user/{userId}/assigned")
    public ResponseEntity<Transaction> assignedTransactionToUser(
            @PathVariable Long id,
            @PathVariable Long userId) throws Exception {

        Transaction transaction = transactionService.assignToUser(userId, id);

        return new ResponseEntity<>(transaction, HttpStatus.OK);
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<Transaction> updateTransaction(
            @PathVariable Long id,
            @RequestBody Transaction transaction,
            @RequestHeader("Authorization") String jwt ) throws Exception {
        UserDTO user = userService.getUserProfile(jwt);

        Transaction editedTransaction = transactionService.updateTransaction(id, transaction, user.getId());

        return new ResponseEntity<>(editedTransaction, HttpStatus.OK);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Transaction>> getAssignedUsersGoals(
            @PathVariable Long userId) throws Exception {

        List<Transaction> transactions = transactionService.assignedUsersTransactions(userId);

        return new ResponseEntity<>(transactions, HttpStatus.OK);
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> deleteTransaction(
            @PathVariable Long id) throws Exception {
        transactionService.deleteTransaction(id);

        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    //filter

    @GetMapping("/filter")
    public ResponseEntity<List<Transaction>> getFilteredTransactions(
            @RequestParam(required = false) String type,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String sortBy) {

        List<Transaction> transactions = transactionService.getFilteredTransactions(type, category, sortBy);
        return new ResponseEntity<>(transactions, HttpStatus.OK);
    }

    @GetMapping(value = "/balance/{userId}")
    public ResponseEntity<UserBalanceDTO> getSummary(@PathVariable Long userId) {
        System.out.println("Request for userId: " + userId);
        UserBalanceDTO balance = transactionService.getBalance(userId);
        System.out.println("Balance: " + balance.getBalance() + ", Income: " + balance.getIncome() + ", Expenses: " + balance.getExpenses());
        return new ResponseEntity<>(balance, HttpStatus.OK);
    }

    @GetMapping("/monthly-summary/{userId}")
    public ResponseEntity<List<MonthSummaryDTO>> getMonthlySummary(@PathVariable Long userId) {
        List<MonthSummaryDTO> summary = transactionService.getMonthlyIncomeAndExpenses(userId);
        return ResponseEntity.ok(summary);
    }


}
