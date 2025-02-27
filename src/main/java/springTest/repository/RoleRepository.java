package springTest.repository;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import springTest.model.Role;

@Repository
public interface RoleRepository extends JpaRepository<Role, Long> {

}