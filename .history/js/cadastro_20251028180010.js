document.addEventListener('DOMContentLoaded', () => {
    const cadastroForm = document.getElementById('cadastro-form');
    const alertPlaceholder = document.getElementById('alert-placeholder-cadastro');

    const showAlert = (message, type) => {
        alertPlaceholder.innerHTML = 
            `<div class="alert alert-${type} alert-dismissible fade show" role="alert">
               ${message}
               <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>`;
    }

    if (cadastroForm) {
        cadastroForm.addEventListener('submit', async (event) => { // Tornamos a função async
            event.preventDefault(); 
            alertPlaceholder.innerHTML = ''; // Limpa alertas anteriores

            const nomeInput = document.getElementById('nome');
            const emailInput = document.getElementById('email');
            const senhaInput = document.getElementById('senha');
            const confirmarSenhaInput = document.getElementById('confirmar-senha');

            const nome = nomeInput.value.trim();
            const email = emailInput.value.trim();
            const senha = senhaInput.value.trim();
            const confirmarSenha = confirmarSenhaInput.value.trim();

            if (nome === '' || email === '' || senha === '' || confirmarSenha === '') {
                showAlert('Por favor, preencha todos os campos.', 'warning');
                return;
            }

            if (senha !== confirmarSenha) {
                showAlert('As senhas não coincidem.', 'danger');
                senhaInput.value = '';
                confirmarSenhaInput.value = '';
                return;
            }

            // --- CONEXÃO COM O BACK-END ---
            try {
                const response = await fetch('http://localhost:8080/api/auth/registrar', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json', // Informa que estamos enviando JSON
                    },
                    // Converte os dados do formulário em uma string JSON
                    body: JSON.stringify({ 
                        nome: nome, 
                        email: email, 
                        senha: senha 
                    }),
                });

                // Pega a resposta do backend (mesmo se for erro)
                const data = await response.json();

                if (response.ok) { // Status 2xx (geralmente 201 Created)
                    showAlert('Cadastro realizado com sucesso! Redirecionando para o login...', 'success');
                    cadastroForm.reset(); 
                    setTimeout(() => {
                        window.location.href = 'login.html';
                    }, 2000);
                } else {
                    // Mostra a mensagem de erro vinda do backend (ex: email já existe)
                    showAlert(data.message || `Erro ${response.status}: Não foi possível realizar o cadastro.`, 'danger');
                    // Limpa apenas o campo de senha se o erro for de email duplicado
                    if (response.status === 409) { // 409 Conflict (Email já existe)
                       senhaInput.value = '';
                       confirmarSenhaInput.value = '';
                    }
                }

            } catch (error) {
                // Erro de rede ou o backend está desligado
                console.error('Erro ao tentar cadastrar:', error);
                showAlert('Erro de conexão. Não foi possível realizar o cadastro. Tente novamente mais tarde.', 'danger');
            }
            // --- FIM DA CONEXÃO ---
        });
    }
});