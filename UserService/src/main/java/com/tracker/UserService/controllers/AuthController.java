package com.tracker.UserService.controllers;

import com.tracker.UserService.config.JwtProvider;
import com.tracker.UserService.models.User;
import com.tracker.UserService.repository.UserRepository;
import com.tracker.UserService.requests.LoginRequest;
import com.tracker.UserService.responses.AuthResponse;
import com.tracker.UserService.services.CustomerUserServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "http://localhost:3000/", allowCredentials = "true")
public class AuthController {

    @Autowired
    private UserRepository userRepository;
    @Autowired
    private PasswordEncoder passwordEncoder;
    @Autowired
    private CustomerUserServiceImpl customerUserDetails;

    @PostMapping("/signup")
    public ResponseEntity<AuthResponse> createUser(
            @RequestBody User user) throws Exception {

        String email = user.getEmail();
        String password = user.getPassword();
        String name = user.getName();

        User isEmailExist = userRepository.findByEmail(email);
        if(isEmailExist != null){
            throw new Exception("Incorrect email or password");
        }

        User createdUser = new User();
        createdUser.setEmail(email);
        createdUser.setName(name);
        createdUser.setCreationDate(LocalDateTime.now());
        createdUser.setRole("USER");
        createdUser.setPassword(passwordEncoder.encode(password));

        User savedUser = userRepository.save(createdUser);

        UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(email, password);
        SecurityContextHolder.getContext().setAuthentication(authentication);

        String token = JwtProvider.generateToken(authentication);

        AuthResponse authResponse = new AuthResponse();
        authResponse.setJwt(token);
        authResponse.setMessage("Register success");
        authResponse.setStatus(true);

        return new ResponseEntity<AuthResponse>(authResponse, HttpStatus.OK);
    }
    @PostMapping("/signin")
    public ResponseEntity<?> signIn(@RequestBody LoginRequest loginRequest) {
        String username = loginRequest.getEmail();
        String password = loginRequest.getPassword();

        Authentication authentication = authenticate(username, password);
        SecurityContextHolder.getContext().setAuthentication(authentication);

        String token = JwtProvider.generateToken(authentication);

        User user = userRepository.findByEmail(username);

        Map<String, Object> response = new HashMap<>();
        response.put("jwt", token);
        response.put("user", Map.of(
                "id", user.getId(),
                "name", user.getName(),
                "email", user.getEmail()
        ));

        return new ResponseEntity<>(response, HttpStatus.OK);
    }


    private Authentication authenticate(String username, String password) {
        UserDetails userDetails = customerUserDetails.loadUserByUsername(username);

        System.out.println("Sign in userDetails - " + userDetails);

        if(userDetails == null) {
            System.out.println("Sign in userDetails - null " + userDetails);
            throw new BadCredentialsException("Invalid username or password");
        }
        if(!passwordEncoder.matches(password, userDetails.getPassword())) {
            System.out.println("Sign in userDetails - password not match " + userDetails);
            throw new BadCredentialsException("Invalid username or password");
        }
        return new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
    }

}
