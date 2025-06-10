// configuracoes.js - Script para gerenciar a página de configurações

document.addEventListener('DOMContentLoaded', function() {
    // Verificar login
    verificarLogin();
    
    // Inicializar componentes
    inicializarComponentes();
    
    // Carregar dados iniciais
    carregarDadosIniciais();
    
    // Adicionar eventos
    adicionarEventos();
});

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

// Função para carregar dados iniciais
function carregarDadosIniciais() {
    // Carregar configurações do localStorage
    carregarConfiguracoesPerfil();
    carregarConfiguracoesEmpresa();
    carregarConfiguracoesSistema();
    carregarConfiguracoesNotificacoes();
    carregarConfiguracoesBackup();
    
    // Carregar lista de usuários
    carregarUsuarios();
}

// Função para adicionar eventos
function adicionarEventos() {
    // Eventos para salvar configurações
    document.getElementById('btnSalvarPerfil').addEventListener('click', salvarConfiguracoesPerfil);
    document.getElementById('btnSalvarEmpresa').addEventListener('click', salvarConfiguracoesEmpresa);
    document.getElementById('btnSalvarSistema').addEventListener('click', salvarConfiguracoesSistema);
    document.getElementById('btnSalvarNotificacoes').addEventListener('click', salvarConfiguracoesNotificacoes);
    document.getElementById('btnSalvarBackup').addEventListener('click', salvarConfiguracoesBackup);
    document.getElementById('btnSalvarConfiguracoes').addEventListener('click', salvarTodasConfiguracoes);
    
    // Evento para restaurar configurações padrão
    document.getElementById('btnRestaurarPadrao').addEventListener('click', restaurarConfiguracoesPadrao);
    
    // Eventos para backup e restauração
    document.getElementById('btnGerarBackup').addEventListener('click', gerarBackup);
    document.getElementById('btnRestaurarBackup').addEventListener('click', restaurarBackup);
    
    // Evento para novo usuário
    document.getElementById('btnSalvarNovoUsuario').addEventListener('click', salvarNovoUsuario);
    
    // Evento para alternar tema
    document.getElementById('tema').addEventListener('change', alternarTema);
    
    // Evento para alterar cor primária
    document.getElementById('corPrimaria').addEventListener('change', alterarCorPrimaria);
    
    // Evento para alterar foto de perfil
    document.getElementById('btnAlterarFoto').addEventListener('click', alterarFotoPerfil);
    
    // Evento para remover logo
    document.getElementById('btnRemoverLogo').addEventListener('click', removerLogoEmpresa);
    
    // Eventos para botões de editar e excluir usuários
    document.querySelectorAll('#tabelaUsuarios button').forEach(btn => {
        if (btn.title === 'Editar') {
            btn.addEventListener('click', editarUsuario);
        } else if (btn.title === 'Excluir') {
            btn.addEventListener('click', excluirUsuario);
        }
    });
}

// Função para carregar configurações de perfil
function carregarConfiguracoesPerfil() {
    // Carregar dados do localStorage ou usar valores padrão
    const perfil = JSON.parse(localStorage.getItem('configPerfil')) || {
        nomeCompleto: 'Administrador do Sistema',
        email: 'admin@logitech.com.br',
        telefone: '(11) 99999-9999',
        cargo: 'Gerente'
    };
    
    // Preencher formulário
    document.getElementById('nomeCompleto').value = perfil.nomeCompleto;
    document.getElementById('email').value = perfil.email;
    document.getElementById('telefone').value = perfil.telefone;
    document.getElementById('cargo').value = perfil.cargo;
    
    // Atualizar nome e cargo exibidos
    document.getElementById('nomeUsuarioAtual').textContent = perfil.nomeCompleto;
    document.getElementById('cargoUsuarioAtual').textContent = perfil.cargo;
}

// Função para carregar configurações da empresa
function carregarConfiguracoesEmpresa() {
    // Carregar dados do localStorage ou usar valores padrão
    const empresa = JSON.parse(localStorage.getItem('configEmpresa')) || {
        nomeEmpresa: 'LogiTech Transportes Ltda.',
        cnpj: '12.345.678/0001-90',
        telefoneEmpresa: '(11) 3333-4444',
        emailEmpresa: 'contato@logitech.com.br',
        endereco: 'Av. Paulista, 1000',
        cep: '01310-100',
        cidade: 'São Paulo',
        estado: 'SP',
        website: 'https://www.logitech.com.br'
    };
    
    // Preencher formulário
    document.getElementById('nomeEmpresa').value = empresa.nomeEmpresa;
    document.getElementById('cnpj').value = empresa.cnpj;
    document.getElementById('telefoneEmpresa').value = empresa.telefoneEmpresa;
    document.getElementById('emailEmpresa').value = empresa.emailEmpresa;
    document.getElementById('endereco').value = empresa.endereco;
    document.getElementById('cep').value = empresa.cep;
    document.getElementById('cidade').value = empresa.cidade;
    document.getElementById('estado').value = empresa.estado;
    document.getElementById('website').value = empresa.website;
}

// Função para carregar configurações do sistema
function carregarConfiguracoesSistema() {
    // Carregar dados do localStorage ou usar valores padrão
    const sistema = JSON.parse(localStorage.getItem('configSistema')) || {
        tema: 'claro',
        corPrimaria: '#0d6efd',
        idioma: 'pt-BR',
        fusoHorario: 'America/Sao_Paulo',
        formatoData: 'DD/MM/YYYY',
        formatoMoeda: 'BRL',
        autenticacaoDoisFatores: false,
        tempoSessao: 30,
        registroAtividades: true,
        tipoArmazenamento: 'local',
        limparCacheAoSair: false
    };
    
    // Preencher formulário
    document.getElementById('tema').value = sistema.tema;
    document.getElementById('corPrimaria').value = sistema.corPrimaria;
    document.getElementById('idioma').value = sistema.idioma;
    document.getElementById('fusoHorario').value = sistema.fusoHorario;
    document.getElementById('formatoData').value = sistema.formatoData;
    document.getElementById('formatoMoeda').value = sistema.formatoMoeda;
    document.getElementById('autenticacaoDoisFatores').checked = sistema.autenticacaoDoisFatores;
    document.getElementById('tempoSessao').value = sistema.tempoSessao;
    document.getElementById('registroAtividades').checked = sistema.registroAtividades;
    document.getElementById('tipoArmazenamento').value = sistema.tipoArmazenamento;
    document.getElementById('limparCacheAoSair').checked = sistema.limparCacheAoSair;
    
    // Aplicar tema
    aplicarTema(sistema.tema);
    
    // Aplicar cor primária
    aplicarCorPrimaria(sistema.corPrimaria);
}

// Função para carregar configurações de notificações
function carregarConfiguracoesNotificacoes() {
    // Carregar dados do localStorage ou usar valores padrão
    const notificacoes = JSON.parse(localStorage.getItem('configNotificacoes')) || {
        notificacoesAtivadas: true,
        notifNovasEntregas: true,
        notifStatusEntregas: true,
        notifManutencaoVeiculos: true,
        notifAtrasos: true,
        notifSistema: true,
        notifEmail: true,
        notifSMS: false,
        frequenciaResumos: 'semanal'
    };
    
    // Preencher formulário
    document.getElementById('notificacoesAtivadas').checked = notificacoes.notificacoesAtivadas;
    document.getElementById('notifNovasEntregas').checked = notificacoes.notifNovasEntregas;
    document.getElementById('notifStatusEntregas').checked = notificacoes.notifStatusEntregas;
    document.getElementById('notifManutencaoVeiculos').checked = notificacoes.notifManutencaoVeiculos;
    document.getElementById('notifAtrasos').checked = notificacoes.notifAtrasos;
    document.getElementById('notifSistema').checked = notificacoes.notifSistema;
    document.getElementById('notifEmail').checked = notificacoes.notifEmail;
    document.getElementById('notifSMS').checked = notificacoes.notifSMS;
    document.getElementById('frequenciaResumos').value = notificacoes.frequenciaResumos;
}

// Função para carregar configurações de backup
function carregarConfiguracoesBackup() {
    // Carregar dados do localStorage ou usar valores padrão
    const backup = JSON.parse(localStorage.getItem('configBackup')) || {
        backupAutomatico: true,
        frequenciaBackup: 'semanal',
        retencaoBackup: '5',
        backupVeiculos: true,
        backupRotas: true,
        backupEntregas: true,
        backupMotoristas: true,
        backupConfiguracoes: true
    };
    
    // Preencher formulário
    document.getElementById('backupAutomatico').checked = backup.backupAutomatico;
    document.getElementById('frequenciaBackup').value = backup.frequenciaBackup;
    document.getElementById('retencaoBackup').value = backup.retencaoBackup;
    document.getElementById('backupVeiculos').checked = backup.backupVeiculos;
    document.getElementById('backupRotas').checked = backup.backupRotas;
    document.getElementById('backupEntregas').checked = backup.backupEntregas;
    document.getElementById('backupMotoristas').checked = backup.backupMotoristas;
    document.getElementById('backupConfiguracoes').checked = backup.backupConfiguracoes;
}

// Função para carregar lista de usuários
function carregarUsuarios() {
    // Carregar dados do localStorage ou usar valores padrão
    const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [
        {
            id: 1,
            nome: 'Administrador',
            email: 'admin@logitech.com.br',
            cargo: 'Gerente',
            perfil: 'Administrador',
            status: 'Ativo',
            ultimoAcesso: 'Agora'
        },
        {
            id: 2,
            nome: 'João Silva',
            email: 'joao@logitech.com.br',
            cargo: 'Motorista',
            perfil: 'Operacional',
            status: 'Ativo',
            ultimoAcesso: 'Ontem'
        },
        {
            id: 3,
            nome: 'Maria Oliveira',
            email: 'maria@logitech.com.br',
            cargo: 'Analista',
            perfil: 'Gerencial',
            status: 'Ativo',
            ultimoAcesso: 'Há 3 dias'
        }
    ];
    
    // Salvar no localStorage se não existir
    if (!localStorage.getItem('usuarios')) {
        localStorage.setItem('usuarios', JSON.stringify(usuarios));
    }
}

// Função para salvar configurações de perfil
function salvarConfiguracoesPerfil() {
    // Obter valores do formulário
    const perfil = {
        nomeCompleto: document.getElementById('nomeCompleto').value,
        email: document.getElementById('email').value,
        telefone: document.getElementById('telefone').value,
        cargo: document.getElementById('cargo').value
    };
    
    // Validar campos obrigatórios
    if (!perfil.nomeCompleto || !perfil.email) {
        mostrarNotificacao('Por favor, preencha todos os campos obrigatórios.', 'warning');
        return;
    }
    
    // Validar formato de e-mail
    if (!validarEmail(perfil.email)) {
        mostrarNotificacao('Por favor, insira um e-mail válido.', 'warning');
        return;
    }
    
    // Verificar se há alteração de senha
    const senhaAtual = document.getElementById('senhaAtual').value;
    const novaSenha = document.getElementById('novaSenha').value;
    const confirmarSenha = document.getElementById('confirmarSenha').value;
    
    if (senhaAtual && novaSenha && confirmarSenha) {
        // Validar senha atual (simulado)
        if (senhaAtual !== 'admin123') {
            mostrarNotificacao('Senha atual incorreta.', 'danger');
            return;
        }
        
        // Validar nova senha
        if (novaSenha !== confirmarSenha) {
            mostrarNotificacao('As senhas não coincidem.', 'warning');
            return;
        }
        
        // Salvar nova senha
        localStorage.setItem('senha', novaSenha);
        
        // Limpar campos de senha
        document.getElementById('senhaAtual').value = '';
        document.getElementById('novaSenha').value = '';
        document.getElementById('confirmarSenha').value = '';
    }
    
    // Salvar no localStorage
    localStorage.setItem('configPerfil', JSON.stringify(perfil));
    
    // Atualizar nome e cargo exibidos
    document.getElementById('nomeUsuarioAtual').textContent = perfil.nomeCompleto;
    document.getElementById('cargoUsuarioAtual').textContent = perfil.cargo;
    
    // Mostrar notificação de sucesso
    mostrarNotificacao('Perfil atualizado com sucesso!', 'success');
}

// Função para salvar configurações da empresa
function salvarConfiguracoesEmpresa() {
    // Obter valores do formulário
    const empresa = {
        nomeEmpresa: document.getElementById('nomeEmpresa').value,
        cnpj: document.getElementById('cnpj').value,
        telefoneEmpresa: document.getElementById('telefoneEmpresa').value,
        emailEmpresa: document.getElementById('emailEmpresa').value,
        endereco: document.getElementById('endereco').value,
        cep: document.getElementById('cep').value,
        cidade: document.getElementById('cidade').value,
        estado: document.getElementById('estado').value,
        website: document.getElementById('website').value
    };
    
    // Validar campos obrigatórios
    if (!empresa.nomeEmpresa || !empresa.cnpj) {
        mostrarNotificacao('Por favor, preencha todos os campos obrigatórios.', 'warning');
        return;
    }
    
    // Validar formato de e-mail
    if (empresa.emailEmpresa && !validarEmail(empresa.emailEmpresa)) {
        mostrarNotificacao('Por favor, insira um e-mail válido.', 'warning');
        return;
    }
    
    // Salvar no localStorage
    localStorage.setItem('configEmpresa', JSON.stringify(empresa));
    
    // Mostrar notificação de sucesso
    mostrarNotificacao('Dados da empresa atualizados com sucesso!', 'success');
}

// Função para salvar configurações do sistema
function salvarConfiguracoesSistema() {
    // Obter valores do formulário
    const sistema = {
        tema: document.getElementById('tema').value,
        corPrimaria: document.getElementById('corPrimaria').value,
        idioma: document.getElementById('idioma').value,
        fusoHorario: document.getElementById('fusoHorario').value,
        formatoData: document.getElementById('formatoData').value,
        formatoMoeda: document.getElementById('formatoMoeda').value,
        autenticacaoDoisFatores: document.getElementById('autenticacaoDoisFatores').checked,
        tempoSessao: document.getElementById('tempoSessao').value,
        registroAtividades: document.getElementById('registroAtividades').checked,
        tipoArmazenamento: document.getElementById('tipoArmazenamento').value,
        limparCacheAoSair: document.getElementById('limparCacheAoSair').checked
    };
    
    // Salvar no localStorage
    localStorage.setItem('configSistema', JSON.stringify(sistema));
    
    // Aplicar tema
    aplicarTema(sistema.tema);
    
    // Aplicar cor primária
    aplicarCorPrimaria(sistema.corPrimaria);
    
    // Mostrar notificação de sucesso
    mostrarNotificacao('Configurações do sistema atualizadas com sucesso!', 'success');
}

// Função para salvar configurações de notificações
function salvarConfiguracoesNotificacoes() {
    // Obter valores do formulário
    const notificacoes = {
        notificacoesAtivadas: document.getElementById('notificacoesAtivadas').checked,
        notifNovasEntregas: document.getElementById('notifNovasEntregas').checked,
        notifStatusEntregas: document.getElementById('notifStatusEntregas').checked,
        notifManutencaoVeiculos: document.getElementById('notifManutencaoVeiculos').checked,
        notifAtrasos: document.getElementById('notifAtrasos').checked,
        notifSistema: document.getElementById('notifSistema').checked,
        notifEmail: document.getElementById('notifEmail').checked,
        notifSMS: document.getElementById('notifSMS').checked,
        frequenciaResumos: document.getElementById('frequenciaResumos').value
    };
    
    // Salvar no localStorage
    localStorage.setItem('configNotificacoes', JSON.stringify(notificacoes));
    
    // Mostrar notificação de sucesso
    mostrarNotificacao('Configurações de notificações atualizadas com sucesso!', 'success');
}

// Função para salvar configurações de backup
function salvarConfiguracoesBackup() {
    // Obter valores do formulário
    const backup = {
        backupAutomatico: document.getElementById('backupAutomatico').checked,
        frequenciaBackup: document.getElementById('frequenciaBackup').value,
        retencaoBackup: document.getElementById('retencaoBackup').value,
        backupVeiculos: document.getElementById('backupVeiculos').checked,
        backupRotas: document.getElementById('backupRotas').checked,
        backupEntregas: document.getElementById('backupEntregas').checked,
        backupMotoristas: document.getElementById('backupMotoristas').checked,
        backupConfiguracoes: document.getElementById('backupConfiguracoes').checked
    };
    
    // Salvar no localStorage
    localStorage.setItem('configBackup', JSON.stringify(backup));
    
    // Mostrar notificação de sucesso
    mostrarNotificacao('Configurações de backup atualizadas com sucesso!', 'success');
}

// Função para salvar todas as configurações
function salvarTodasConfiguracoes() {
    salvarConfiguracoesPerfil();
    salvarConfiguracoesEmpresa();
    salvarConfiguracoesSistema();
    salvarConfiguracoesNotificacoes();
    salvarConfiguracoesBackup();
    
    // Mostrar notificação de sucesso
    mostrarNotificacao('Todas as configurações foram salvas com sucesso!', 'success');
}

// Função para restaurar configurações padrão
function restaurarConfiguracoesPadrao() {
    // Confirmar ação
    if (!confirm('Tem certeza que deseja restaurar todas as configurações para o padrão? Esta ação não pode ser desfeita.')) {
        return;
    }
    
    // Remover configurações do localStorage
    localStorage.removeItem('configSistema');
    
    // Recarregar configurações
    carregarConfiguracoesSistema();
    
    // Mostrar notificação de sucesso
    mostrarNotificacao('Configurações restauradas para o padrão com sucesso!', 'success');
}

// Função para gerar backup
function gerarBackup() {
    // Verificar quais dados serão incluídos no backup
    const incluirVeiculos = document.getElementById('backupVeiculos').checked;
    const incluirRotas = document.getElementById('backupRotas').checked;
    const incluirEntregas = document.getElementById('backupEntregas').checked;
    const incluirMotoristas = document.getElementById('backupMotoristas').checked;
    const incluirConfiguracoes = document.getElementById('backupConfiguracoes').checked;
    
    // Obter dados do localStorage
    const dados = {
        dataBackup: new Date().toISOString(),
        versao: '1.0'
    };
    
    if (incluirVeiculos) {
        dados.veiculos = JSON.parse(localStorage.getItem('veiculos')) || [];
    }
    
    if (incluirRotas) {
        dados.rotas = JSON.parse(localStorage.getItem('rotas')) || [];
    }
    
    if (incluirEntregas) {
        dados.entregas = JSON.parse(localStorage.getItem('entregas')) || [];
    }
    
    if (incluirMotoristas) {
        dados.motoristas = JSON.parse(localStorage.getItem('motoristas')) || [];
    }
    
    if (incluirConfiguracoes) {
        dados.configPerfil = JSON.parse(localStorage.getItem('configPerfil')) || {};
        dados.configEmpresa = JSON.parse(localStorage.getItem('configEmpresa')) || {};
        dados.configSistema = JSON.parse(localStorage.getItem('configSistema')) || {};
        dados.configNotificacoes = JSON.parse(localStorage.getItem('configNotificacoes')) || {};
        dados.configBackup = JSON.parse(localStorage.getItem('configBackup')) || {};
    }
    
    // Converter para JSON
    const jsonDados = JSON.stringify(dados);
    
    // Criar blob e link para download
    const blob = new Blob([jsonDados], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `backup_logitech_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    // Registrar backup no histórico
    registrarBackup(dados);
    
    // Mostrar notificação de sucesso
    mostrarNotificacao('Backup gerado com sucesso!', 'success');
}

// Função para registrar backup no histórico
function registrarBackup(dados) {
    // Obter histórico de backups
    const historico = JSON.parse(localStorage.getItem('historicoBackups')) || [];
    
    // Adicionar novo backup ao histórico
    historico.push({
        data: new Date().toISOString(),
        tamanho: JSON.stringify(dados).length,
        itens: {
            veiculos: dados.veiculos ? dados.veiculos.length : 0,
            rotas: dados.rotas ? dados.rotas.length : 0,
            entregas: dados.entregas ? dados.entregas.length : 0,
            motoristas: dados.motoristas ? dados.motoristas.length : 0,
            configuracoes: dados.configPerfil ? 'Sim' : 'Não'
        }
    });
    
    // Limitar histórico conforme configuração de retenção
    const retencao = parseInt(document.getElementById('retencaoBackup').value);
    if (retencao > 0 && historico.length > retencao) {
        historico.splice(0, historico.length - retencao);
    }
    
    // Salvar histórico atualizado
    localStorage.setItem('historicoBackups', JSON.stringify(historico));
}

// Função para restaurar backup
function restaurarBackup() {
    // Obter arquivo selecionado
    const arquivoInput = document.getElementById('arquivoBackup');
    if (!arquivoInput.files || arquivoInput.files.length === 0) {
        mostrarNotificacao('Por favor, selecione um arquivo de backup.', 'warning');
        return;
    }
    
    // Confirmar ação
    if (!confirm('Tem certeza que deseja restaurar o backup? Os dados atuais serão substituídos.')) {
        return;
    }
    
    // Ler arquivo
    const arquivo = arquivoInput.files[0];
    const leitor = new FileReader();
    
    leitor.onload = function(e) {
        try {
            // Converter conteúdo para objeto
            const dados = JSON.parse(e.target.result);
            
            // Validar formato do backup
            if (!dados.dataBackup || !dados.versao) {
                throw new Error('Formato de backup inválido.');
            }
            
            // Restaurar dados
            if (dados.veiculos) {
                localStorage.setItem('veiculos', JSON.stringify(dados.veiculos));
            }
            
            if (dados.rotas) {
                localStorage.setItem('rotas', JSON.stringify(dados.rotas));
            }
            
            if (dados.entregas) {
                localStorage.setItem('entregas', JSON.stringify(dados.entregas));
            }
            
            if (dados.motoristas) {
                localStorage.setItem('motoristas', JSON.stringify(dados.motoristas));
            }
            
            if (dados.configPerfil) {
                localStorage.setItem('configPerfil', JSON.stringify(dados.configPerfil));
            }
            
            if (dados.configEmpresa) {
                localStorage.setItem('configEmpresa', JSON.stringify(dados.configEmpresa));
            }
            
            if (dados.configSistema) {
                localStorage.setItem('configSistema', JSON.stringify(dados.configSistema));
            }
            
            if (dados.configNotificacoes) {
                localStorage.setItem('configNotificacoes', JSON.stringify(dados.configNotificacoes));
            }
            
            if (dados.configBackup) {
                localStorage.setItem('configBackup', JSON.stringify(dados.configBackup));
            }
            
            // Recarregar dados
            carregarDadosIniciais();
            
            // Mostrar notificação de sucesso
            mostrarNotificacao('Backup restaurado com sucesso! A página será recarregada.', 'success');
            
            // Recarregar página após 2 segundos
            setTimeout(() => {
                window.location.reload();
            }, 2000);
            
        } catch (erro) {
            mostrarNotificacao(`Erro ao restaurar backup: ${erro.message}`, 'danger');
        }
    };
    
    leitor.onerror = function() {
        mostrarNotificacao('Erro ao ler o arquivo de backup.', 'danger');
    };
    
    leitor.readAsText(arquivo);
}

// Função para salvar novo usuário
function salvarNovoUsuario() {
    // Obter valores do formulário
    const nome = document.getElementById('novoNome').value;
    const email = document.getElementById('novoEmail').value;
    const cargo = document.getElementById('novoCargo').value;
    const perfil = document.getElementById('novoPerfil').value;
    const senha = document.getElementById('novaSenha').value;
    const confirmarSenha = document.getElementById('confirmarNovaSenha').value;
    
    // Validar campos obrigatórios
    if (!nome || !email || !cargo || !perfil || !senha || !confirmarSenha) {
        mostrarNotificacao('Por favor, preencha todos os campos obrigatórios.', 'warning');
        return;
    }
    
    // Validar formato de e-mail
    if (!validarEmail(email)) {
        mostrarNotificacao('Por favor, insira um e-mail válido.', 'warning');
        return;
    }
    
    // Validar senha
    if (senha !== confirmarSenha) {
        mostrarNotificacao('As senhas não coincidem.', 'warning');
        return;
    }
    
    // Obter lista de usuários
    const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
    
    // Verificar se e-mail já existe
    if (usuarios.some(u => u.email === email)) {
        mostrarNotificacao('Este e-mail já está em uso.', 'warning');
        return;
    }
    
    // Adicionar novo usuário
    const novoUsuario = {
        id: usuarios.length > 0 ? Math.max(...usuarios.map(u => u.id)) + 1 : 1,
        nome,
        email,
        cargo,
        perfil,
        status: 'Ativo',
        ultimoAcesso: 'Nunca'
    };
    
    usuarios.push(novoUsuario);
    
    // Salvar no localStorage
    localStorage.setItem('usuarios', JSON.stringify(usuarios));
    
    // Adicionar à tabela
    adicionarUsuarioTabela(novoUsuario);
    
    // Fechar modal
    const modalNovoUsuario = bootstrap.Modal.getInstance(document.getElementById('modalNovoUsuario'));
    modalNovoUsuario.hide();
    
    // Limpar formulário
    document.getElementById('formNovoUsuario').reset();
    
    // Mostrar notificação de sucesso
    mostrarNotificacao('Usuário adicionado com sucesso!', 'success');
}

// Função para adicionar usuário à tabela
function adicionarUsuarioTabela(usuario) {
    const tbody = document.getElementById('tabelaUsuarios');
    const tr = document.createElement('tr');
    
    tr.innerHTML = `
        <td>${usuario.nome}</td>
        <td>${usuario.email}</td>
        <td>${usuario.cargo}</td>
        <td><span class="badge ${getBadgeClassForPerfil(usuario.perfil)}">${usuario.perfil}</span></td>
        <td><span class="badge bg-success">${usuario.status}</span></td>
        <td>${usuario.ultimoAcesso}</td>
        <td>
            <button class="btn btn-sm btn-primary me-1" title="Editar" data-id="${usuario.id}">
                <i class="fas fa-edit"></i>
            </button>
            <button class="btn btn-sm btn-danger" title="Excluir" data-id="${usuario.id}">
                <i class="fas fa-trash"></i>
            </button>
        </td>
    `;
    
    // Adicionar eventos aos botões
    const btnEditar = tr.querySelector('button[title="Editar"]');
    const btnExcluir = tr.querySelector('button[title="Excluir"]');
    
    btnEditar.addEventListener('click', editarUsuario);
    btnExcluir.addEventListener('click', excluirUsuario);
    
    tbody.appendChild(tr);
}

// Função para obter classe de badge para perfil
function getBadgeClassForPerfil(perfil) {
    switch (perfil) {
        case 'Administrador':
            return 'bg-danger';
        case 'Gerencial':
            return 'bg-info';
        case 'Operacional':
            return 'bg-primary';
        default:
            return 'bg-secondary';
    }
}

// Função para editar usuário
function editarUsuario(event) {
    // Obter ID do usuário
    const userId = event.currentTarget.getAttribute('data-id');
    
    // Obter lista de usuários
    const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
    
    // Encontrar usuário
    const usuario = usuarios.find(u => u.id === parseInt(userId));
    
    if (!usuario) {
        mostrarNotificacao('Usuário não encontrado.', 'warning');
        return;
    }
    
    // Aqui seria implementada a edição do usuário
    // Como exemplo, vamos apenas mostrar uma notificação
    mostrarNotificacao(`Edição do usuário ${usuario.nome} será implementada em breve.`, 'info');
}

// Função para excluir usuário
function excluirUsuario(event) {
    // Obter ID do usuário
    const userId = event.currentTarget.getAttribute('data-id');
    
    // Obter lista de usuários
    const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
    
    // Encontrar usuário
    const usuario = usuarios.find(u => u.id === parseInt(userId));
    
    if (!usuario) {
        mostrarNotificacao('Usuário não encontrado.', 'warning');
        return;
    }
    
    // Confirmar exclusão
    if (!confirm(`Tem certeza que deseja excluir o usuário ${usuario.nome}?`)) {
        return;
    }
    
    // Remover usuário
    const novaLista = usuarios.filter(u => u.id !== parseInt(userId));
    
    // Salvar no localStorage
    localStorage.setItem('usuarios', JSON.stringify(novaLista));
    
    // Remover linha da tabela
    event.currentTarget.closest('tr').remove();
    
    // Mostrar notificação de sucesso
    mostrarNotificacao('Usuário excluído com sucesso!', 'success');
}

// Função para alternar tema
function alternarTema() {
    const tema = document.getElementById('tema').value;
    aplicarTema(tema);
}

// Função para aplicar tema
function aplicarTema(tema) {
    const body = document.body;
    
    // Remover classes de tema
    body.classList.remove('dark-mode');
    
    // Aplicar tema selecionado
    if (tema === 'escuro') {
        body.classList.add('dark-mode');
    } else if (tema === 'sistema') {
        // Verificar preferência do sistema
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            body.classList.add('dark-mode');
        }
    }
}

// Função para alterar cor primária
function alterarCorPrimaria() {
    const cor = document.getElementById('corPrimaria').value;
    aplicarCorPrimaria(cor);
}

// Função para aplicar cor primária
function aplicarCorPrimaria(cor) {
    // Criar ou atualizar variável CSS personalizada
    document.documentElement.style.setProperty('--primary-color', cor);
    
    // Atualizar estilos de elementos que usam a cor primária
    // Isso seria feito com uma folha de estilo dinâmica em uma implementação real
}

// Função para alterar foto de perfil
function alterarFotoPerfil() {
    // Aqui seria implementado o upload de foto
    // Como exemplo, vamos apenas mostrar uma notificação
    mostrarNotificacao('Upload de foto será implementado em breve.', 'info');
}

// Função para remover logo da empresa
function removerLogoEmpresa() {
    // Aqui seria implementada a remoção da logo
    // Como exemplo, vamos apenas mostrar uma notificação
    mostrarNotificacao('Remoção de logo será implementada em breve.', 'info');
}

// Função para validar e-mail
function validarEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}
