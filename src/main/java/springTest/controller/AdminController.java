package springTest.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import springTest.model.User;
import springTest.service.RoleService;
import springTest.service.UserService;


import java.util.List;

@Controller
@RequestMapping("/admin")
public class AdminController {

    private final UserService userService;
    private final RoleService roleService;

    public AdminController(UserService userService, RoleService roleService) {
        this.userService = userService;
        this.roleService = roleService;
    }

    @GetMapping
    public String getAllUsers(Model model) {
        model.addAttribute("users", userService.getAllUsers());
        model.addAttribute("allRoles", roleService.getAllRoles());
        model.addAttribute("newUser", new User());
        return "admin/users";
    }

    @GetMapping("/{id}")
    public String getUserById(@PathVariable("id") Long id, Model model) {
        model.addAttribute("user", userService.getUserById(id));
        return "admin/user-details";
    }

    @GetMapping("/new")
    public String createUserForm(Model model) {
        model.addAttribute("user", new User());
        model.addAttribute("allRoles", roleService.getAllRoles());
        return "admin/users-form";
    }

    @PostMapping("/new")
    public String createUser(@ModelAttribute("newUser") User user) {
        userService.saveUser(user);
        return "redirect:/admin";
    }

    @PostMapping("/edit/{id}")
    public String updateUser(@PathVariable("id") Long id,
                             @ModelAttribute("user") User user,
                             @RequestParam(value = "selectedRoles", required = false) List<Long> selectedRoleIds) {
        userService.updateUser(id, user, selectedRoleIds);
        return "redirect:/admin";
    }


    @GetMapping("/delete/{id}")
    public String deleteUser(@PathVariable("id") Long id) {
        userService.deleteUser(id);
        return "redirect:/admin";
    }

    @GetMapping("/logout")
    public String logout() {
        return "logout";
    }
    @ModelAttribute("editUser")
    public User prePopulateEditUser(){
        return new User();
    }
}
