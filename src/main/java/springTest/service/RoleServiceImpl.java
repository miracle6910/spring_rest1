package springTest.service;

import org.springframework.stereotype.Service;
import springTest.model.Role;
import springTest.repository.RoleRepository;


import java.util.List;


@Service
public class RoleServiceImpl implements RoleService {

    private final RoleRepository roleRepository;

    public RoleServiceImpl(RoleRepository roleRepository) {
        this.roleRepository = roleRepository;
    }
    @Override
    public List<Role> getAllRoles() {
        return roleRepository.findAll();
    }

}

