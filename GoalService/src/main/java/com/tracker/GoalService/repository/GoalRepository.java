package com.tracker.GoalService.repository;

import com.tracker.GoalService.models.Goal;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface GoalRepository extends JpaRepository<Goal, Long>{

    public List<Goal> findByUserId(Long userId);

}
