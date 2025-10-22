document.addEventListener('DOMContentLoaded', () => {
    const cadastroForm = document.getElementById('cadastro-form');
    const alertPlaceholder = document.getElementById('alert-placeholder-cadastro');

    // Função para mostrar alertas (igual à do login.js)
    const showAlert = (message, type) => {
        alertPlaceholder.innerHTML = 
            `<div class="alert alert-${type} alert-dismissible fade show" role="alert">
               ${message}
               <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>`;
    }

    if (cadastroForm) {
        cadastroForm.addEventListener('submit', (event) => {
            event.preventDefault(); // Impede o envio real

            const nomeInput = document.getElementById('nome');
            const emailInput = document.getElementById('email');
            const senhaInput = document.getElementById('senha');
            const confirmarSenhaInput = document.getElementById('confirmar-senha');

            const nome = nomeInput.value.trim();
            const email = emailInput.value.trim();
            const senha = senhaInput.value.trim();
            const confirmarSenha = confirmarSenhaInput.value.trim();

            // 1. Validação: Campos Vazios
            if (nome === '' || email === '' || senha === '' || confirmarSenha === '') {
                showAlert('Por favor, preencha todos los campos.', 'warning');
                return;
            }

            // 2. Validação: Senhas Coincidem
            if (senha !== confirmarSenha) {
                showAlert('As senhas não coincidem.', 'danger');
                // Limpa os campos de senha
                senhaInput.value = '';
                confirmarSenhaInput.value = '';
                return;
            }

            // 3. Simulação de Cadastro Bem-Sucedido
            // Em um sistema real, aqui você enviaria os dados para o back-end
            console.log("Simulando cadastro para:", nome, email);

            showAlert('Cadastro realizado com sucesso! Redirecionando para o login...', 'success');

            // Limpa o formulário
            cadastroForm.reset(); 

            // Redireciona para a página de login após um delay
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 2000); // Espera 2 segundos
        });
    }
});