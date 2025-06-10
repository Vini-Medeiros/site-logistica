// login.js - Script para gerenciar autenticação e login

document.addEventListener('DOMContentLoaded', function() {
    // Limpar qualquer sessão anterior ao carregar a página de login
    // Isso garante que o usuário precise fazer login novamente
    if (window.location.pathname.includes('index.html') || window.location.pathname.endsWith('/')) {
        localStorage.removeItem('logado');
        localStorage.removeItem('usuario');
    }
    
    // Adicionar evento ao formulário de login
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            realizarLogin();
        });
    }
    
    // Adicionar evento ao botão de login
    const loginButton = document.getElementById('loginButton');
    if (loginButton) {
        loginButton.addEventListener('click', function(e) {
            e.preventDefault();
            realizarLogin();
        });
    }
});

// Função para realizar login
function realizarLogin() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    // Validar campos
    if (!username || !password) {
        mostrarNotificacao('Por favor, preencha todos os campos.', 'warning');
        return;
    }
    
    // Verificar credenciais (simulado)
    if (username === 'admin' && password === 'admin123') {
        // Salvar estado de login
        localStorage.setItem('logado', 'true');
        localStorage.setItem('usuario', username);
        localStorage.setItem('ultimoLogin', new Date().toISOString());
        
        // Redirecionar para dashboard
        window.location.href = 'dashboard.html';
    } else {
        mostrarNotificacao('Credenciais inválidas. Tente novamente.', 'danger');
    }
}

// Função para mostrar notificação
function mostrarNotificacao(mensagem, tipo) {
    // Criar elemento de notificação
    const notificacao = document.createElement('div');
    notificacao.className = `alert alert-${tipo} alert-dismissible fade show`;
    notificacao.role = 'alert';
    notificacao.innerHTML = `
        ${mensagem}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Fechar"></button>
    `;
    
    // Adicionar ao container de notificações
    const container = document.querySelector('.container') || document.body;
    container.insertBefore(notificacao, container.firstChild);
    
    // Remover após 5 segundos
    setTimeout(() => {
        notificacao.classList.remove('show');
        setTimeout(() => {
            notificacao.remove();
        }, 300);
    }, 5000);
}
