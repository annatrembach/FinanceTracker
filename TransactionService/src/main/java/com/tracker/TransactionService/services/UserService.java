package com.tracker.TransactionService.services;

import com.tracker.TransactionService.models.DTO.UserDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;

@FeignClient(name = "UserService", url = "http://localhost:8081/")
public interface UserService {

    @GetMapping("/api/users/profile")
    UserDTO getUserProfile(@RequestHeader("Authorization") String jwt);
}
