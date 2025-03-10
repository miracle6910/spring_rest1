document.addEventListener('DOMContentLoaded', () => {
    fetchUsers(); // Fetch users when the page loads
    setupModalHandlers(); // Setup event listeners for modal buttons
    fetchRoles(); // Fetch roles for Add/Edit modals
});

function fetchUsers() {
    fetch('/api/admin/users')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(users => {
            populateTable(users);
        })
        .catch(error => {
            console.error('Error fetching users:', error);
            displayError('Failed to load users.');
        });
}

function populateTable(users) {
    const tableBody = document.getElementById('users-table-body');
    tableBody.innerHTML = ''; // Clear existing table rows

    users.forEach(user => {
        const row = document.createElement('tr');

        row.innerHTML = `
            <td>${user.id}</td>
            <td>${user.username}</td>
            <td>${user.name}</td>
            <td>${user.lastName}</td>
            <td>${user.age}</td>
            <td>${user.roles.map(role => role.name).join(', ')}</td>
            <td>
                <button type="button" class="btn btn-info btn-sm view-user" data-user-id="${user.id}" data-toggle="modal" data-target="#viewUserModal">View</button>
                <button type="button" class="btn btn-warning btn-sm edit-user" data-user-id="${user.id}" data-toggle="modal" data-target="#editUserModal">Edit</button>
                <button type="button" class="btn btn-danger btn-sm delete-user" data-user-id="${user.id}" data-toggle="modal" data-target="#deleteUserModal">Delete</button>
            </td>
        `;

        tableBody.appendChild(row);
    });
}
function fetchRoles() {
    fetch('/api/admin/roles')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(roles => {
            populateRoleCheckboxes(roles, 'roleContainer');
            populateRoleCheckboxes(roles, 'editRoleContainer');
        })
        .catch(error => {
            console.error('Error fetching roles:', error);
            displayError('Failed to load roles.');
        });
}

function populateRoleCheckboxes(roles, containerId) {
    const roleContainer = document.getElementById(containerId);
    roleContainer.innerHTML = '';

    roles.forEach(role => {
        const div = document.createElement('div');
        div.className = 'form-check';

        const input = document.createElement('input');
        input.className = 'form-check-input';
        input.type = 'checkbox';
        input.value = role.id;
        input.id = `role-${role.id}-${containerId}`;

        const label = document.createElement('label');
        label.className = 'form-check-label';
        label.htmlFor = `role-${role.id}-${containerId}`;
        label.textContent = role.name;

        div.appendChild(input);
        div.appendChild(label);
        roleContainer.appendChild(div);
    });
}

function setupModalHandlers() {
    // View User Modal
    $('#viewUserModal').on('show.bs.modal', function (event) {
        const button = $(event.relatedTarget);
        const userId = button.data('user-id');

        fetch(`/api/admin/users/${userId}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(user => {
                setTimeout(() => {  // Добавить небольшую задержку
                    $(this).find('#viewUserId').text(user.id);
                    $(this).find('#viewUsername').text(user.username);
                    $(this).find('#viewName').text(user.name);
                    $(this).find('#viewLastName').text(user.lastName);
                    $(this).find('#viewAge').text(user.age);
                    $(this).find('#viewRoles').text(user.roles.map(role => role.name).join(', '));
                }, 50); // Отрегулируйте задержку, если необходимо
            })
            .catch(error => {
                console.error('Ошибка при получении сведений о пользователе:', error);
                displayError('Не удалось загрузить сведения о пользователе.');
                $(this).modal('hide');
            });
    });

    $('#viewUserModal').on('hidden.bs.modal', function () {
        $(this).find('span').text(''); // Clear all span elements
    });

    // Edit User Modal
    $('#editUserModal').on('show.bs.modal', function (event) {
        const button = $(event.relatedTarget);
        const userId = button.data('user-id');

        fetch(`/api/admin/users/${userId}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(user => {
                // Populate form fields
                $(this).find('#editId').val(user.id);
                $(this).find('#editUsername').val(user.username);
                $(this).find('#editName').val(user.name);
                $(this).find('#editLastName').val(user.lastName);
                $(this).find('#editAge').val(user.age);

                // Check the roles
                const roleIds = user.roles.map(role => role.id);
                $(this).find('#editRoleContainer input[type="checkbox"]').each(function() {
                    this.checked = roleIds.includes(Number(this.value));
                });
            })
            .catch(error => {
                console.error('Error fetching user details:', error);
                displayError('Failed to load user details.');
                $(this).modal('hide');
            });
    });
    // Delete User Modal
    $('#deleteUserModal').on('show.bs.modal', function (event) {
        const button = $(event.relatedTarget);
        const userId = button.data('user-id');
        $(this).data('user-id', userId); // Store user ID in the modal

        fetch(`/api/admin/users/${userId}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(user => {
                $(this).find('#deleteUsername').text(user.username);
                $(this).find('#deleteName').text(user.name);
                $(this).find('#deleteLastName').text(user.lastName);
                $(this).find('#deleteAge').text(user.age);
            })
            .catch(error => {
                console.error('Error fetching user details:', error);
                displayError('Failed to load user details.');
                $(this).modal('hide');
            });
    });

    $('#deleteUserModal').on('hidden.bs.modal', function () {
        $(this).removeData('user-id'); // Clear the stored user ID
    });
}

function displayError(message) {
    const errorMessageDiv = document.getElementById('error-message');
    if (errorMessageDiv) { // Проверьте, существует ли элемент
        errorMessageDiv.textContent = message;
        errorMessageDiv.style.display = 'block';
    } else {
        console.warn("Ошибка: элемент 'error-message' не найден в DOM.");
    }
}
function displaySuccess(message) {
    const successMessageDiv = document.getElementById('success-message');
    successMessageDiv.textContent = message;  // Строка 199 - Здесь происходит ошибка
    successMessageDiv.style.display = 'block';
    setTimeout(() => {
        successMessageDiv.style.display = 'none';
    }, 3000);
}
function addUser() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const name = document.getElementById('name').value;
    const lastName = document.getElementById('lastName').value;
    const age = document.getElementById('age').value;

    const roles = [];
    document.querySelectorAll('#roleContainer input[type="checkbox"]:checked').forEach((checkbox) => {
        roles.push({ id: checkbox.value });

    });
    console.log("Roles being sent:", roles); // Add this line

    const newUser = {
        username: username,
        password: password,
        name: name,
        lastName: lastName,
        age: age,
        roles: roles
    };

    fetch('/api/admin/users', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(newUser)
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log('User added:', data);
            $('#addUserModal').modal('hide');
            fetchUsers(); // Refresh user list
            displaySuccess('User added successfully.'); // Уведомить об успехе
        })
        .catch(error => {
            console.error('Error adding user:', error);
            displayError('Failed to add user.');
        });
}
function editUser() {
    const id = document.getElementById('editId').value;
    const username = document.getElementById('editUsername').value;
    const name = document.getElementById('editName').value;
    const lastName = document.getElementById('editLastName').value;
    const age = document.getElementById('editAge').value;

    const roles = [];
    document.querySelectorAll('#editRoleContainer input[type="checkbox"]:checked').forEach((checkbox) => {
        roles.push({ id: checkbox.value });
    });

    const updatedUser = {
        id: id,
        username: username,
        name: name,
        lastName: lastName,
        age: age,
        roles: roles
    };

    console.log('Updated user data:', updatedUser); // Проверьте, что именно отправляется

    fetch(`/api/admin/users/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedUser)
    })
        .then(response => {
            if (!response.ok) {
                return response.json().then(err => {
                    throw new Error(err.message || 'Network response was not ok');
                });
            }
            return response.json();
        })
        .then(data => {
            console.log('User updated:', data);
            $('#editUserModal').modal('hide');
            fetchUsers(); // Refresh the user list
            displaySuccess('User updated successfully.'); // Уведомить об успехе
        })
        .catch(error => {
            console.error('Error updating user:', error);
            displayError(`Failed to update user: ${error.message}`);
        });
}

function deleteUser() {
    const modal = $('#deleteUserModal');
    const userId = modal.data('user-id');

    fetch(`/api/admin/users/${userId}`, {
        method: 'DELETE'
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(() => {
            console.log('User deleted.');
            modal.modal('hide');
            fetchUsers(); // Refresh the user list
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
            displayError('Failed to delete user.');
        });
}
$('#addUserModal').on('hidden.bs.modal', function () {
    $(this).find('input').val(''); // Очистить все поля ввода
});