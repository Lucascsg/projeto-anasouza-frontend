# Projeto Ana Souza - E-commerce Artesanal (Front-End)

Este repositório contém a interface do usuário (Front-End) da loja virtual "Ana Souza", um projeto Full-Stack de e-commerce que simula uma boutique online de moda artesanal.

O design foi focado em criar uma experiência de usuário elegante, calorosa e premium, refletindo a qualidade e a natureza pessoal dos produtos feitos à mão. O site evoluiu de um protótipo estático para uma aplicação web dinâmica e responsiva.

Este Front-End é "agnóstico" (não tem lógica de negócio) e é 100% alimentado pela nossa API Back-End Java.

➡️ **Link para o Repositório do Back-End:** [projeto-anasouza-backend](https://github.com/Lucascsg/projeto-anasouza-frontend.git) 

---

## 🎨 Sobre o Design e a Experiência

O objetivo não era apenas ter uma loja funcional, mas uma que contasse uma história. A identidade visual foi construída sobre:
* **Paleta de Cores:** Tons terrosos (telha, marrom) para calor, um verde escuro para sofisticação, e um fundo bege claro para dar textura e suavidade.
* **Tipografia:** `Playfair Display` para títulos elegantes e `Montserrat` para textos limpos e modernos, criando um contraste profissional.
* **Layout:** O uso de "cards" flutuantes sobre um fundo texturizado cria profundidade. As páginas de Login/Cadastro usam um layout "split-screen" para uma experiência de autenticação imersiva e focada na marca.

---

## ✨ Funcionalidades Principais (Visão do Usuário)

* **Catálogo Dinâmico:** As páginas de produtos (Home e Catálogo) são carregadas dinamicamente a partir da API Back-End.
* **Filtro e Ordenação:** A página de catálogo permite filtrar produtos por categoria (Bolsas, Acessórios) e ordenar por preço.
* **Personalização de Produto:** A página de detalhes do produto exibe as variações de cores disponíveis (carregadas da API).
* **Carrinho Inteligente:** O carrinho de compras diferencia produtos por variação de cor (ex: "Bolsa Bege" é diferente de "Bolsa Preta").
* **Fluxo de Autenticação Real:** O usuário pode se cadastrar e fazer login. A API valida se o e-mail já existe e se a senha está correta.
* **Checkout Protegido:** O usuário só pode finalizar a compra se estiver logado.
* **Histórico de Pedidos:** Após o login, o usuário pode ver uma lista de todas as compras anteriores, que são buscadas do banco de dados.
* **Blog e Contato:** Seções dinâmicas para engajamento, também conectadas ao Back-End.

---

## 🛠️ Tecnologias (Front-End)

* **HTML5** (Semântico)
* **CSS3** (Estilização avançada, Flexbox, Grid)
* **JavaScript (ES6+)** (Manipulação do DOM, `fetch` para consumo de API, lógica do carrinho)
* **Bootstrap 5** (Para layout responsivo e componentes UI)
* **AOS (Animate On Scroll)** (Para animações de surgimento suave)
* **VS Code Live Server** (Para desenvolvimento local)

---

## 🚀 Como Rodar

Para que este Front-End funcione, o Back-End **precisa** estar rodando simultaneamente.

1.  **Inicie o Back-End:** Siga as instruções no [README do Back-End](https://github.com/SEU-USUARIO/projeto-anasouza-backend) para iniciar o servidor Java na porta `8080`.
2.  **Inicie o Front-End:**
    * Abra esta pasta no VS Code.
    * Instale a extensão "Live Server".
    * Clique com o botão direito no `index.html` e selecione "Open with Live Server".
    * O site abrirá em `http://127.0.0.1:5500` (ou similar) e se conectará automaticamente à API.

---

## 🧑‍💻 Autor

**[Lucas Casagrande Silva]**
* GitHub: `[Lucascsg]`
* LinkedIn: `[Lucas Casagrande Silva]`
