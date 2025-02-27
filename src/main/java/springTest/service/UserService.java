package springTest.service;
import org.springframework.security.core.userdetails.UserDetailsService;
import springTest.model.User;


import java.util.List;

public interface UserService extends UserDetailsService {
    List<User> getAllUsers();
    User getUserById(Long id);
    void saveUser(User user);
    void deleteUser(Long id);
    User findByUsername(String username);

    void updateUser(Long id, User user, List<Long> roleId);
}