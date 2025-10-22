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
        loginForm.addEventListener('submit', (event) => {
            event.preventDefault(); // Impede o envio real

            const emailInput = document.getElementById('email');
            const senhaInput = document.getElementById('senha');
            const email = emailInput.value.trim(); // .trim() remove espaços em branco
            const senha = senhaInput.value.trim();

            // 1. Validação Simples: Campos Vazios
            if (email === '' || senha === '') {
                showAlert('Por favor, preencha todos os campos.', 'warning');
                return; // Interrompe se houver erro
            }

            // 2. Simulação de Login (já que não temos back-end)
            // Em um sistema real, aqui você enviaria email/senha para o back-end
            console.log("Simulando login para:", email);
            
            // Sucesso Simulado:
            showAlert('Login realizado com sucesso! Redirecionando...', 'success');
            sessionStorage.setItem('usuarioLogado', JSON.stringify({ email: email })); 

            // Redireciona após um pequeno delay para o usuário ver a mensagem
            setTimeout(() => {
                const redirectUrl = sessionStorage.getItem('redirectAfterLogin');
                if (redirectUrl) {
                    sessionStorage.removeItem('redirectAfterLogin');
                    window.location.href = redirectUrl;
                } else {
                    window.location.href = 'index.html';
                }
            }, 1500); // Espera 1.5 segundos
        });
    }
});