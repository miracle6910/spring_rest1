package springTest.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import springTest.model.Role;

import java.util.Set;
import java.util.List;
@Repository
public interface RoleRepository extends JpaRepository<Role, Long> {
    Set<Role> findByIdIn(List<Long> roleIds);
}