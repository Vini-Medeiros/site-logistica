// main.js - Script principal para o sistema de logística

document.addEventListener('DOMContentLoaded', function() {
    // Verificar login
    verificarLogin();
    
    // Inicializar componentes
    inicializarComponentes();
    
    // Adicionar eventos para responsividade em dispositivos móveis
    adicionarEventosMobile();
    
    // Adicionar evento de logout ao botão Sair
    configurarLogout();
});

// Função para verificar se o usuário está logado
function verificarLogin() {
    // Verificar se está na página de login
    if (window.location.pathname.includes('index.html') || window.location.pathname === '/' || window.location.pathname.endsWith('/')) {
        return;
    }
    
    // Verificar se o usuário está logado
    const usuarioLogado = localStorage.getItem('logado');
    if (usuarioLogado !== 'true') {
        // Redirecionar para a página de login
        window.location.href = 'index.html';
    }
}

// Função para configurar o logout
function configurarLogout() {
    const logoutButton = document.getElementById('logoutButton');
    if (logoutButton) {
        logoutButton.addEventListener('click', function(e) {
            e.preventDefault();
            realizarLogout();
        });
    }
}

// Função para realizar logout
function realizarLogout() {
    // Limpar dados de sessão
    localStorage.removeItem('logado');
    localStorage.removeItem('usuario');
    localStorage.removeItem('ultimoLogin');
    
    // Redirecionar para a página de login
    window.location.href = 'index.html';
}

// Função para inicializar componentes
function inicializarComponentes() {
    // Inicializar tooltips
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });
    
    // Inicializar popovers
    const popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'));
    popoverTriggerList.map(function (popoverTriggerEl) {
        return new bootstrap.Popover(popoverTriggerEl);
    });
}

// Função para adicionar eventos para responsividade em dispositivos móveis
function adicionarEventosMobile() {
    // Adicionar toggle para sidebar em dispositivos móveis
    const sidebarToggle = document.getElementById('sidebarToggle');
    const sidebar = document.getElementById('sidebar');
    const sidebarBackdrop = document.querySelector('.sidebar-backdrop');
    
    if (sidebarToggle && sidebar) {
        sidebarToggle.addEventListener('click', function() {
            sidebar.classList.toggle('show');
            
            // Criar backdrop se não existir
            if (!sidebarBackdrop) {
                const backdrop = document.createElement('div');
                backdrop.classList.add('sidebar-backdrop');
                document.body.appendChild(backdrop);
                
                backdrop.addEventListener('click', function() {
                    sidebar.classList.remove('show');
                    backdrop.classList.remove('show');
                });
            }
            
            // Mostrar backdrop
            if (sidebarBackdrop) {
                sidebarBackdrop.classList.toggle('show');
            }
        });
    }
    
    // Fechar sidebar ao clicar em um link (em dispositivos móveis)
    const sidebarLinks = document.querySelectorAll('#sidebar .nav-link');
    sidebarLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (window.innerWidth < 768) {
                sidebar.classList.remove('show');
                if (sidebarBackdrop) {
                    sidebarBackdrop.classList.remove('show');
                }
            }
        });
    });
}

// Função para formatar data
function formatarData(dataString) {
    if (!dataString) return '';
    
    const data = new Date(dataString);
    return data.toLocaleDateString('pt-BR');
}

// Função para mostrar notificação
function mostrarNotificacao(mensagem, tipo = 'success') {
    // Criar elemento de notificação
    const notificacao = document.createElement('div');
    notificacao.classList.add('notification', 'toast', 'align-items-center', 'text-white', `bg-${tipo}`);
    notificacao.setAttribute('role', 'alert');
    notificacao.setAttribute('aria-live', 'assertive');
    notificacao.setAttribute('aria-atomic', 'true');
    
    // Conteúdo da notificação
    notificacao.innerHTML = `
        <div class="d-flex">
            <div class="toast-body">
                ${mensagem}
            </div>
            <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Fechar"></button>
        </div>
    `;
    
    // Adicionar ao corpo do documento
    document.body.appendChild(notificacao);
    
    // Mostrar notificação
    notificacao.classList.add('show');
    
    // Remover após 3 segundos
    setTimeout(() => {
        notificacao.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(notificacao);
        }, 300);
    }, 3000);
}

// Função para confirmar ação
function confirmarAcao(mensagem, callback) {
    // Verificar se já existe um modal de confirmação
    let modalConfirmacao = document.getElementById('modalConfirmacao');
    
    // Se não existir, criar um novo
    if (!modalConfirmacao) {
        modalConfirmacao = document.createElement('div');
        modalConfirmacao.id = 'modalConfirmacao';
        modalConfirmacao.classList.add('modal', 'fade');
        modalConfirmacao.setAttribute('tabindex', '-1');
        modalConfirmacao.setAttribute('aria-labelledby', 'modalConfirmacaoLabel');
        modalConfirmacao.setAttribute('aria-hidden', 'true');
        
        modalConfirmacao.innerHTML = `
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="modalConfirmacaoLabel">Confirmação</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Fechar"></button>
                    </div>
                    <div class="modal-body">
                        <p id="mensagemConfirmacao"></p>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                        <button type="button" class="btn btn-danger" id="btnConfirmar">Confirmar</button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modalConfirmacao);
    }
    
    // Definir mensagem
    document.getElementById('mensagemConfirmacao').textContent = mensagem;
    
    // Criar instância do modal
    const modal = new bootstrap.Modal(modalConfirmacao);
    
    // Adicionar evento ao botão de confirmar
    const btnConfirmar = document.getElementById('btnConfirmar');
    
    // Remover eventos anteriores
    const novoBtn = btnConfirmar.cloneNode(true);
    btnConfirmar.parentNode.replaceChild(novoBtn, btnConfirmar);
    
    // Adicionar novo evento
    novoBtn.addEventListener('click', function() {
        modal.hide();
        if (typeof callback === 'function') {
            callback();
        }
    });
    
    // Mostrar modal
    modal.show();
}

// Função para detectar dispositivo móvel
function isMobile() {
    return window.innerWidth < 768;
}

// Função para ajustar layout com base no dispositivo
function ajustarLayout() {
    const isMobileDevice = isMobile();
    const sidebar = document.getElementById('sidebar');
    const main = document.querySelector('main');
    
    if (isMobileDevice) {
        // Adicionar navbar mobile se não existir
        if (!document.querySelector('.mobile-nav')) {
            const mobileNav = document.createElement('div');
            mobileNav.classList.add('mobile-nav');
            mobileNav.innerHTML = `
                <div class="navbar-brand">
                    <i class="fas fa-truck me-2"></i>LogiTech
                </div>
                <button id="sidebarToggle" class="navbar-toggler" type="button">
                    <i class="fas fa-bars"></i>
                </button>
            `;
            
            document.body.insertBefore(mobileNav, document.body.firstChild);
            
            // Adicionar evento ao botão de toggle
            adicionarEventosMobile();
        }
        
        // Ajustar sidebar
        if (sidebar) {
            sidebar.classList.remove('d-md-block');
            sidebar.classList.add('d-none');
        }
        
        // Ajustar conteúdo principal
        if (main) {
            main.classList.remove('ms-sm-auto', 'col-lg-10', 'px-md-4');
            main.classList.add('px-3');
        }
    } else {
        // Remover navbar mobile se existir
        const mobileNav = document.querySelector('.mobile-nav');
        if (mobileNav) {
            document.body.removeChild(mobileNav);
        }
        
        // Ajustar sidebar
        if (sidebar) {
            sidebar.classList.add('d-md-block');
            sidebar.classList.remove('d-none', 'show');
        }
        
        // Ajustar conteúdo principal
        if (main) {
            main.classList.add('ms-sm-auto', 'col-lg-10', 'px-md-4');
            main.classList.remove('px-3');
        }
        
        // Remover backdrop se existir
        const backdrop = document.querySelector('.sidebar-backdrop');
        if (backdrop) {
            backdrop.classList.remove('show');
        }
    }
}

// Adicionar evento de redimensionamento
window.addEventListener('resize', ajustarLayout);

// Chamar ajustarLayout na inicialização
document.addEventListener('DOMContentLoaded', function() {
    ajustarLayout();
});
