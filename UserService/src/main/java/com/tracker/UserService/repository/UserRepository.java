package com.tracker.UserService.repository;

import com.tracker.UserService.models.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User,Long> {

    @Autowired
    public User findByEmail(String email);
}
