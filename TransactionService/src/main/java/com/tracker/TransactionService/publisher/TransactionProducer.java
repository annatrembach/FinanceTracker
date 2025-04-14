package com.tracker.TransactionService.publisher;

import com.tracker.TransactionService.models.Transaction;
import com.tracker.TransactionService.models.TransactionDTO;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
public class TransactionProducer {

    @Value("transaction-exchange")
    private String exchange;

    @Value("transaction.update")
    private String routingJsonKey;

    private static final Logger LOGGER = LoggerFactory.getLogger(Transaction.class);

    private RabbitTemplate rabbitTemplate;

    public TransactionProducer(RabbitTemplate rabbitTemplate) {
        this.rabbitTemplate = rabbitTemplate;
    }

    public void sendTransactionUpdate(Transaction transaction) {
        LOGGER.info(String.format(">>> Sending transaction update:" + transaction.toString()));

        TransactionDTO convertTransaction = convertToDTO(transaction);

        rabbitTemplate.convertAndSend(exchange, routingJsonKey, convertTransaction);

        /*
        TransactionDTO dto = convertToDTO(transaction);

        System.out.println(">>> Sending transaction update: " + dto);

        rabbitTemplate.convertAndSend(exchange, routingJsonKey, dto);
    */}

    private TransactionDTO convertToDTO(Transaction transaction) {
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
