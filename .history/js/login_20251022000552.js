document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');

    if (loginForm) {
        loginForm.addEventListener('submit', (event) => {
            event.preventDefault(); // Impede o envio real do formulário

            const email = document.getElementById('email').value;
            // Em um sistema real, aqui você enviaria email/senha para o back-end
            
            // --- SIMULAÇÃO DE LOGIN BEM-SUCEDIDO ---
            console.log("Simulando login para:", email);
            // Salva uma informação simples indicando que o usuário está logado
            sessionStorage.setItem('usuarioLogado', JSON.stringify({ email: email })); 

            // --- REDIRECIONAMENTO ---
            // Verifica se há uma página salva para onde voltar
            const redirectUrl = sessionStorage.getItem('redirectAfterLogin');

            if (redirectUrl) {
                // Se houver, remove a informação e redireciona para lá
                sessionStorage.removeItem('redirectAfterLogin');
                window.location.href = redirectUrl;
            } else {
                // Se não houver, redireciona para a página inicial
                window.location.href = 'index.html';
            }
        });
    }
});