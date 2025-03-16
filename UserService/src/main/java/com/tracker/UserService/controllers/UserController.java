package com.tracker.UserService.controllers;

import jakarta.servlet.http.HttpServletRequest;
import com.tracker.UserService.models.User;
import com.tracker.UserService.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService userService;

    @Autowired
    private HttpServletRequest request;

    @GetMapping("/profile")
    public String getUserProfile(HttpServletRequest request) {
        String email = request.getHeader("X-User-Email");
        String role = request.getHeader("X-User-Role");

        return "User Email: " + email + ", Role: " + role;
    }

    @GetMapping("/")
    public ResponseEntity<List<User>> getUsers(@RequestHeader("Authorization") String jwt) {
        System.out.println("Received JWT: " + jwt);
        List<User> users = userService.getAllUsers();
        System.out.println("Users: " + users);
        return new ResponseEntity<>(users, HttpStatus.OK);
    }
}
