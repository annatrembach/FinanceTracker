package com.tracker.GoalService.services;

import com.tracker.GoalService.models.Goal;
import com.tracker.GoalService.models.enums.Status;

import java.util.List;

public interface GoalService {

    //crud
    Goal createGoal(Goal goal) throws Exception;

    Goal getGoalById(Long id) throws Throwable;

    List<Goal> getAllGoals(Status goalStatus);

    Goal updateGoal(Long id, Goal updatedGoal, Long userId) throws Throwable;

    List<Goal> assignedUsersGoals(Long userId, Status goalStatus);

    void deleteGoal(Long id);

    Goal completeGoal(Long id) throws Throwable;

}