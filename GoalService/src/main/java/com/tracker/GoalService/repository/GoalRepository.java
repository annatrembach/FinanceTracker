package com.tracker.GoalService.repository;

import com.tracker.GoalService.models.Goal;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface GoalRepository extends JpaRepository<Goal, Long>{

    public List<Goal> findByUserId(Long userId);

    Optional<Goal> findTopByUserIdOrderByCreationDateDesc(Long userId);
}
