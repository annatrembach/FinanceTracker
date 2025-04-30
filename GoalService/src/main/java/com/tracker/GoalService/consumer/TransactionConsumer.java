package com.tracker.GoalService.consumer;

import com.tracker.GoalService.models.Goal;
import com.tracker.GoalService.models.TransactionDTO;
import com.tracker.GoalService.models.enums.Status;
import com.tracker.GoalService.repository.GoalRepository;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Component
public class TransactionConsumer {

    @Autowired
    private GoalRepository goalRepository;

    @RabbitListener(queues = "transaction-queue")
    public void handleTransaction(TransactionDTO transaction) {
        try {
            System.out.println("Entered handleTransaction method");
            System.out.println("Received transaction: " + transaction);

            if (transaction.getUserId() == null || transaction.getAmount() == null || transaction.getType() == null)
                return;

            if (transaction.getGoalId() != null) {
                Optional<Goal> optionalGoal = goalRepository.findById(transaction.getGoalId());

                if (optionalGoal.isPresent()) {
                    Goal goal = optionalGoal.get();

                    System.out.println("Goal userId: " + goal.getUserId() + ", Transaction userId: " + transaction.getUserId());

                    if (!goal.getUserId().equals(transaction.getUserId())) {
                        return;
                    }

                    if ("INCOME".equalsIgnoreCase(transaction.getType())) {
                        double updatedAmount = goal.getCurrentAmount() + transaction.getAmount();
                        goal.setCurrentAmount(updatedAmount);

                        if (updatedAmount >= goal.getTargetAmount() && goal.getStatus() != Status.COMPLETED) {
                            goal.setStatus(Status.COMPLETED);
                            goalRepository.save(goal);
                        }

                        goalRepository.save(goal);
                    }
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

}

