package com.tracker.TransactionService.models.DTO;

public class UserBalanceDTO {
    private double balance;
    private double income;
    private double expenses;

    public UserBalanceDTO() {}

    public UserBalanceDTO(double balance, double income, double expenses) {
        this.balance = balance;
        this.income = income;
        this.expenses = expenses;
    }

    public double getBalance() {
        return balance;
    }

    public void setBalance(double balance) {
        this.balance = balance;
    }

    public double getIncome() {
        return income;
    }

    public void setIncome(double income) {
        this.income = income;
    }

    public double getExpenses() {
        return expenses;
    }

    public void setExpenses(double expenses) {
        this.expenses = expenses;
    }

    @Override
    public String toString() {
        return "UserBalanceDTO{" +
                "balance=" + balance +
                ", income=" + income +
                ", expenses=" + expenses +
                '}';
    }
}

