package springTest.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import springTest.model.User;
import springTest.service.UserService;

@RestController
@RequestMapping("/api/user")
public class UserRestController {

    private final UserService userService;

    public UserRestController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping
    public ResponseEntity<User> getUserPage(@AuthenticationPrincipal User currentUser) {

        if (currentUser == null) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }
        return new ResponseEntity<>(currentUser, HttpStatus.OK);
    }

}