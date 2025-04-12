package com.tracker.GoalService.services;

import com.tracker.GoalService.models.Goal;
import com.tracker.GoalService.models.enums.Status;
import com.tracker.GoalService.repository.GoalRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class GoalServiceImpl implements GoalService {

    @Autowired
    private GoalRepository goalRepository;

    @Override
    public Goal createGoal(Goal goal) throws Exception {
        goal.setStatus(Status.IN_PROGRESS);
        goal.setCreationDate(LocalDateTime.now());
        return goalRepository.save(goal);
    }

    @Override
    public Goal getGoalById(Long id) throws Throwable {
        return goalRepository.findById(id).orElseThrow(()->new Exception("Goal not found"));

    }

    @Override
    public List<Goal> getAllGoals(Status goalStatus) {
        List<Goal> allGoals = goalRepository.findAll();

        List<Goal> filteredGoals = allGoals.stream().filter(
                goal -> goalStatus == null || goal.getStatus().name().equalsIgnoreCase(goalStatus.toString())
        ).collect(Collectors.toList());

        return filteredGoals;
    }

    @Override
    public Goal updateGoal(Long id, Goal updatedGoal, Long userId) throws Throwable {
        Goal existingGoal = getGoalById(id);

        if(updatedGoal.getName()!=null) {
            existingGoal.setName(updatedGoal.getName());
        }
        if(updatedGoal.getStatus()!=null) {
            existingGoal.setStatus(updatedGoal.getStatus());
        }
        if(updatedGoal.getTargetAmount()!=null) {
            existingGoal.setTargetAmount(updatedGoal.getTargetAmount());
        }
        if(updatedGoal.getCurrentAmount()!=null) {
            existingGoal.setCurrentAmount(updatedGoal.getCurrentAmount());
        }
        if(updatedGoal.getDeadline()!=null) {
            existingGoal.setDeadline(updatedGoal.getDeadline());
        }

        return goalRepository.save(existingGoal);
    }

    @Override
    public List<Goal> assignedUsersGoals(Long userId, Status goalStatus) {

        List<Goal> allGoals = goalRepository.findByUserId(userId);

        List<Goal> filteredGoals = allGoals.stream()
                .filter(goal -> goalStatus == null || goal.getStatus().name().equalsIgnoreCase(goalStatus.toString()))
                .collect(Collectors.toList());

        return filteredGoals;
    }

    @Override
    public void deleteGoal(Long id) {
        goalRepository.deleteById(id);
    }

    @Override
    public Goal completeGoal(Long id) throws Throwable {
        Goal goal = getGoalById(id);
        goal.setStatus(Status.COMPLETED);
        return goalRepository.save(goal);
    }
}
