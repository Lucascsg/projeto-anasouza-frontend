document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const alertPlaceholder = document.getElementById('alert-placeholder-login');

    // Função para mostrar alertas
    const showAlert = (message, type) => {
        alertPlaceholder.innerHTML = 
            `<div class="alert alert-${type} alert-dismissible fade show" role="alert">
               ${message}
               <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>`;
    }

    if (loginForm) {
        loginForm.addEventListener('submit', async (event) => { // Tornamos a função async
            event.preventDefault(); 
            alertPlaceholder.innerHTML = ''; // Limpa alertas

            const emailInput = document.getElementById('email');
            const senhaInput = document.getElementById('senha');
            const email = emailInput.value.trim(); 
            const senha = senhaInput.value.trim();

            // Validação Front-End (campos vazios)
            if (email === '' || senha === '') {
                showAlert('Por favor, preencha e-mail e senha.', 'warning');
                return; 
            }

            // --- CONEXÃO COM O BACK-END ---
            try {
                console.log("Enviando dados de login para a API..."); // Log
                const response = await fetch('http://localhost:8080/api/auth/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json', 
                    },
                    // Envia email e senha como JSON
                    body: JSON.stringify({ 
                        email: email, 
                        senha: senha 
                    }),
                });
                console.log("Resposta da API recebida. Status:", response.status); // Log

                const data = await response.json().catch(() => ({})); // Pega JSON ou objeto vazio

                if (response.ok) { // Status 200 OK
                    // Login BEM-SUCEDIDO!
                    showAlert('Login realizado com sucesso! Redirecionando...', 'success');
                    
                    // Salva os dados do usuário retornado pela API na sessionStorage
                    // (O backend retorna o usuário SEM a senha)
                    sessionStorage.setItem('usuarioLogado', JSON.stringify(data)); 

                    // Redireciona após delay
                    setTimeout(() => {
                        const redirectUrl = sessionStorage.getItem('redirectAfterLogin');
                        if (redirectUrl) {
                            sessionStorage.removeItem('redirectAfterLogin');
                            window.location.href = redirectUrl;
                        } else {
                            window.location.href = 'index.html';
                        }
                    }, 1500); 
                } else {
                    // Erro no login (401 Unauthorized ou outro erro)
                    showAlert(data.message || `Erro ${response.status}: Não foi possível fazer login.`, 'danger');
                    // Limpa o campo de senha em caso de erro
                    senhaInput.value = '';
                }

            } catch (error) {
                // Erro de rede
                console.error('Erro CRÍTICO ao tentar fazer login:', error); // Log
                showAlert('Erro de conexão. Não foi possível conectar ao servidor. Tente novamente mais tarde.', 'danger');
            }
            // --- FIM DA CONEXÃO ---
        });
    }
});