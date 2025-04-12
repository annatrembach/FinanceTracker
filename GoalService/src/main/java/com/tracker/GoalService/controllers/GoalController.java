package com.tracker.GoalService.controllers;

import com.tracker.GoalService.models.Goal;
import com.tracker.GoalService.models.UserDTO;
import com.tracker.GoalService.models.enums.Status;
import com.tracker.GoalService.services.GoalService;
import com.tracker.GoalService.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Objects;

@RestController
@RequestMapping("/api/goals")
public class GoalController {

    @Autowired
    private GoalService goalService;

    @Autowired
    private UserService userService;

    @PostMapping("/create")
    public ResponseEntity<Goal> createGoal(@RequestBody Goal goal) throws Exception {
        Goal createdGoal = goalService.createGoal(goal);
        return new ResponseEntity<>(createdGoal, HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Goal> getGoalById(@PathVariable Long id) throws Throwable {
        Goal goal = goalService.getGoalById(id);
        return new ResponseEntity<>(goal, HttpStatus.OK);
    }

    @GetMapping("/")
    public ResponseEntity<List<Goal>> getAllGoals(
            @RequestParam(required = false) Status goalStatus) throws Exception {

        List<Goal> goals = goalService.getAllGoals(goalStatus);

        return new ResponseEntity<>(goals, HttpStatus.OK);
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<Goal> updateGoal(
            @PathVariable Long id,
            @RequestBody Goal goal,
            @RequestHeader("Authorization") String jwt ) throws Throwable {
        UserDTO user = userService.getUserProfile(jwt);

        Goal editedGoal = goalService.updateGoal(id, goal, user.getId());

        return new ResponseEntity<>(editedGoal, HttpStatus.OK);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Goal>> getAssignedUsersGoals(
            @RequestParam(required = false) Status goalStatus,
            @PathVariable Long userId) throws Exception {

        List<Goal>goals = goalService.assignedUsersGoals(userId, goalStatus);

        return new ResponseEntity<>(goals, HttpStatus.OK);
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> deleteGoal(
            @PathVariable Long id) throws Exception {
        goalService.deleteGoal(id);

        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @PutMapping("/{id}/complete")
    public ResponseEntity<Goal> completeGoal(
            @PathVariable Long id) throws Throwable {
        Goal goal = goalService.completeGoal(id);
        return new ResponseEntity<>(goal, HttpStatus.OK);
    }

}
