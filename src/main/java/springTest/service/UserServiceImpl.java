package springTest.service;



import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import springTest.model.Role;
import springTest.model.User;
import springTest.repository.UserRepository;

import java.util.List;
import java.util.Set;

import java.util.stream.Collectors;

@Service
public class UserServiceImpl implements UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final RoleService roleService;

    public UserServiceImpl(UserRepository userRepository, RoleService roleService) {
        this.userRepository = userRepository;
        this.passwordEncoder = new BCryptPasswordEncoder();
        this.roleService = roleService;
    }

    @Transactional(readOnly = true)
    @Override
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @Transactional(readOnly = true)
    @Override
    public User getUserById(Long id) {
        return userRepository.findById(id).orElse(null);
    }

    @Transactional
    @Override
    public void saveUser(User user) {
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        userRepository.save(user);
    }

    @Override
    public void updateUser(Long id, User user, List<Long> roleIds) {
        user.setId(id);

        User existingUser = userRepository.findById(id).orElseThrow(() -> new RuntimeException("User not found"));

        if (user.getPassword() == null || user.getPassword().isEmpty()) {
            user.setPassword(existingUser.getPassword());
        } else {

            user.setPassword(passwordEncoder.encode(user.getPassword()));
        }

        Set<Role> roles;
        if (roleIds != null && !roleIds.isEmpty()) {
            roles = roleService.getAllRoles().stream()
                    .filter(role -> roleIds.contains(role.getId()))
                    .collect(Collectors.toSet());
        } else {
            roles = existingUser.getRoles();
        }
        user.setRoles(roles);

        userRepository.save(user);
    }
    @Transactional
    @Override
    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }
    @Transactional(readOnly = true)
    @Override
    public User findByUsername(String username) {
        return userRepository.findByUsername(username);
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = userRepository.findByUsername(username);

        if (user == null) {
            throw new UsernameNotFoundException(String.format("User '%s' not found", username));
        }

        return user;
    }

}