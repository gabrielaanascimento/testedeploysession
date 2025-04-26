document.addEventListener('DOMContentLoaded', function() {
    const userTableBody = document.getElementById('userTableBody');

    // Simulação de dados dinâmicos (você substituiria isso por uma chamada a uma API)

    function populateTable(data) {
        userTableBody.innerHTML = ''; // Limpa a tabela antes de adicionar os dados

        data.forEach(user => {
            const row = userTableBody.insertRow();
            const idCell = row.insertCell();
            const nameCell = row.insertCell();
            const phoneCell = row.insertCell();
            const emailCell = row.insertCell();

            idCell.textContent = user.id;
            nameCell.textContent = user.nome;
            phoneCell.textContent = user.telefone;
            emailCell.textContent = user.email;
        });
    }
    
    fetch('/users/all')
        .then(response => response.json())
        .then(data => populateTable(data))
        .catch(error => console.error('Erro ao buscar dados:', error));
    
});