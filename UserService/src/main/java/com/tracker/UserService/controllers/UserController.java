package com.tracker.UserService.controllers;

import com.tracker.UserService.repository.UserRepository;
import jakarta.servlet.http.HttpServletRequest;
import com.tracker.UserService.models.User;
import com.tracker.UserService.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:3000/", allowCredentials = "true")
public class UserController {

    @Autowired
    private UserService userService;

    @Autowired
    private UserRepository userRepository;

    @GetMapping("/profile")
    public ResponseEntity<User> getUserProfile(@RequestHeader("Authorization") String jwt) {

        User user = userService.getUserProfile(jwt);
        return new ResponseEntity<>(user, HttpStatus.OK);
    }

    @GetMapping("/")
    public ResponseEntity<List<User>> getUsers(@RequestHeader("Authorization") String jwt) {
        System.out.println("Received JWT: " + jwt);
        List<User> users = userService.getAllUsers();
        System.out.println("Users: " + users);
        return new ResponseEntity<>(users, HttpStatus.OK);
    }

}
