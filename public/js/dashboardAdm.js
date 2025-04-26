document.addEventListener('DOMContentLoaded', function() {
    // Elementos do DOM que serão manipulados
    const userTableBody = document.getElementById('userTableBody');
    const insertForm = document.getElementById('insertForm');
    const editModal = document.getElementById('editModal');
    const editForm = document.getElementById('editForm');
    const closeButton = document.querySelector('.close-button');

    // Campos do formulário de inserção
    const newIdInput = document.getElementById('newId');
    const newNameInput = document.getElementById('newName');
    const newPhoneInput = document.getElementById('newPhone');
    const newEmailInput = document.getElementById('newEmail');
    const newPassWordInput = document.getElementById('newPassWord');
    const newDateNascInput = document.getElementById('newDataNasc');
    const newStatusInput = document.getElementById('newStatus');



    // Campos do formulário de edição
    const editIdInput = document.getElementById('editId');
    const editNameInput = document.getElementById('editName');
    const editPhoneInput = document.getElementById('editPhone');
    const editEmailInput = document.getElementById('editEmail');
    const editPropSelect = document.getElementById('prop'); // Adicionado para pegar a propriedade a ser editada

    let usersData = []; // Array para armazenar os dados dos usuários vindos do servidor

    // Função para renderizar a tabela de usuários
    function renderUserTable(data) {
        usersData = data; // Atualiza o array local com os dados do servidor
        userTableBody.innerHTML = ''; // Limpa a tabela antes de renderizar

        data.forEach(user => {
            const row = userTableBody.insertRow();
            const idCell = row.insertCell();
            const nameCell = row.insertCell();
            const phoneCell = row.insertCell();
            const emailCell = row.insertCell();
            const actionsCell = row.insertCell();

            idCell.textContent = user.id;
            nameCell.textContent = user.nome;
            phoneCell.textContent = user.telefone || '-';
            emailCell.textContent = user.email || '-';

            const editButton = document.createElement('button');
            editButton.textContent = 'Editar';
            editButton.classList.add('edit-button');
            editButton.addEventListener('click', () => openEditModal(user.id));

            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Deletar';
            deleteButton.classList.add('delete-button');
            deleteButton.addEventListener('click', () => deleteUser(user.id));

            const actionsDiv = document.createElement('div');
            actionsDiv.classList.add('action-buttons');
            actionsDiv.appendChild(editButton);
            actionsDiv.appendChild(deleteButton);
            actionsCell.appendChild(actionsDiv);
        });
    }

    // Função para adicionar um novo usuário
    insertForm.addEventListener('submit', async function(event) {
        event.preventDefault();

        const newName = newNameInput.value;
        const newPhone = newPhoneInput.value;
        const newEmail = newEmailInput.value;
        const newPassWord = newPassWordInput.value;
        const newDataNasc = newDateNascInput.value;
        const newStatus = newStatusInput.value

        const newUser = {
            nome: newName,
            telefone: newPhone,
            email: newEmail,
            data_nascimento: newDataNasc,
            senha: newPassWord,
            status: newStatus
        };

        try {
            const response = await fetch('/user/add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newUser)
            });

            if (response.ok || response.status) {
                // Recarrega os dados para atualizar a tabela
                fetchUsers();
                insertForm.reset();
            } else {
                const error = await response.json();
                console.error('Erro ao adicionar usuário:', error);
                alert(`Erro ao adicionar usuário: ${error.msg || 'Erro desconhecido'}`);
            }
        } catch (error) {
            console.error('Erro ao enviar dados para adicionar usuário:', error);
            alert('Erro ao enviar dados para adicionar usuário.');
        }
    });

    // Função para deletar um usuário
    async function deleteUser(id) {
        try {
            const response = await fetch(`/users/delete/${id}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                // Recarrega os dados para atualizar a tabela
                fetchUsers();
            } else {
                const error = await response.json();
                console.error('Erro ao deletar usuário:', error);
                alert(`Erro ao deletar usuário: ${error.msg || 'Erro desconhecido'}`);
            }
        } catch (error) {
            console.error('Erro ao enviar requisição para deletar usuário:', error);
            alert('Erro ao enviar requisição para deletar usuário.');
        }
    }

    // Função para abrir o modal de edição
    function openEditModal(id) {
        if (id) {
            editIdInput.value = id;
            editModal.style.display = 'block';
        }
    }

    // Função para fechar o modal de edição
    closeButton.addEventListener('click', function() {
        editModal.style.display = 'none';
    });

    // Fecha o modal se o usuário clicar fora dele
    window.addEventListener('click', function(event) {
        if (event.target === editModal) {
            editModal.style.display = 'none';
        }
    });

    // Função para salvar as alterações do usuário
    editForm.addEventListener('submit', async function(event) {
        event.preventDefault();

        const userId = parseInt(editIdInput.value);
        const updatedValue = editNameInput.value; // 'editNameInput' agora representa o novo valor
        const propertyToUpdate = editPropSelect.value; // Pega a propriedade selecionada

        const updatedUser = {
            id: userId,
            novo: updatedValue,
            propriedade: propertyToUpdate
        };

        try {
            const response = await fetch('/users/update', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedUser)
            });

            if (response.ok) {
                fetchUsers(); // Recarrega os dados para atualizar a tabela
                editModal.style.display = 'none';
            } else {
                const error = await response.json();
                console.error('Erro ao atualizar usuário:', error);
                alert(`Erro ao atualizar usuário: ${error.msg || 'Erro desconhecido'}`);
            }
        } catch (error) {
            console.error('Erro ao enviar dados para atualizar usuário:', error);
            alert('Erro ao enviar dados para atualizar usuário.');
        }
    });

    // Função para buscar os usuários do servidor
    function fetchUsers() {
        fetch('/users/all')
            .then(response => response.json())
            .then(data => renderUserTable(data))
            .catch(error => console.error('Erro ao buscar dados:', error));
    }

    // Renderiza a tabela inicial de usuários ao carregar a página
    fetchUsers();
});