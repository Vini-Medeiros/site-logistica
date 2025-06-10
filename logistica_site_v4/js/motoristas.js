// motoristas.js - Script para gerenciar motoristas no sistema

document.addEventListener('DOMContentLoaded', function() {
    // Inicializar dados de motoristas se não existirem
    inicializarDadosMotoristas();
    
    // Carregar motoristas na tabela
    carregarMotoristas();
    
    // Adicionar evento ao botão de salvar motorista
    const btnSalvarMotorista = document.getElementById('btnSalvarMotorista');
    if (btnSalvarMotorista) {
        btnSalvarMotorista.addEventListener('click', salvarMotorista);
    }
    
    // Adicionar evento ao botão de filtrar
    const btnFiltrar = document.getElementById('btnFiltrar');
    if (btnFiltrar) {
        btnFiltrar.addEventListener('click', filtrarMotoristas);
    }
});

// Função para inicializar dados de motoristas
function inicializarDadosMotoristas() {
    if (!localStorage.getItem('motoristas')) {
        const motoristasIniciais = [
            { 
                id: 1, 
                nome: 'João Silva', 
                cpf: '123.456.789-00', 
                data_nascimento: '1985-05-15', 
                telefone: '(11) 98765-4321', 
                endereco: 'Rua das Palmeiras, 100, São Paulo, SP', 
                numero_cnh: '12345678900', 
                categoria_cnh: 'E', 
                validade_cnh: '2027-05-15', 
                data_admissao: '2020-01-10', 
                status: 'Disponível',
                observacoes: 'Motorista experiente com mais de 10 anos de estrada'
            },
            { 
                id: 2, 
                nome: 'Maria Oliveira', 
                cpf: '987.654.321-00', 
                data_nascimento: '1990-08-22', 
                telefone: '(11) 91234-5678', 
                endereco: 'Av. Paulista, 1500, São Paulo, SP', 
                numero_cnh: '98765432100', 
                categoria_cnh: 'D', 
                validade_cnh: '2026-08-22', 
                data_admissao: '2021-03-15', 
                status: 'Em rota',
                observacoes: 'Especialista em rotas urbanas'
            },
            { 
                id: 3, 
                nome: 'Carlos Santos', 
                cpf: '456.789.123-00', 
                data_nascimento: '1988-11-10', 
                telefone: '(21) 99876-5432', 
                endereco: 'Rua Copacabana, 200, Rio de Janeiro, RJ', 
                numero_cnh: '45678912300', 
                categoria_cnh: 'E', 
                validade_cnh: '2025-11-10', 
                data_admissao: '2019-06-20', 
                status: 'Férias',
                observacoes: 'Especializado em transporte de cargas perigosas'
            }
        ];
        localStorage.setItem('motoristas', JSON.stringify(motoristasIniciais));
    }
}

// Função para carregar motoristas na tabela
function carregarMotoristas(filtros = {}) {
    const tabelaMotoristas = document.getElementById('tabelaMotoristas');
    if (!tabelaMotoristas) return;
    
    // Limpar tabela
    tabelaMotoristas.innerHTML = '';
    
    // Obter motoristas do localStorage
    let motoristas = JSON.parse(localStorage.getItem('motoristas') || '[]');
    
    // Aplicar filtros se existirem
    if (filtros.status && filtros.status !== '') {
        motoristas = motoristas.filter(m => m.status === filtros.status);
    }
    
    if (filtros.categoria && filtros.categoria !== '') {
        motoristas = motoristas.filter(m => m.categoria_cnh === filtros.categoria);
    }
    
    if (filtros.busca && filtros.busca !== '') {
        const termoBusca = filtros.busca.toLowerCase();
        motoristas = motoristas.filter(m => 
            m.nome.toLowerCase().includes(termoBusca) || 
            m.cpf.toLowerCase().includes(termoBusca)
        );
    }
    
    // Preencher tabela com os motoristas
    motoristas.forEach(motorista => {
        const tr = document.createElement('tr');
        
        // Definir classe de acordo com o status
        if (motorista.status === 'Em rota') {
            tr.classList.add('table-warning');
        } else if (motorista.status === 'Férias') {
            tr.classList.add('table-info');
        } else if (motorista.status === 'Afastado') {
            tr.classList.add('table-danger');
        }
        
        tr.innerHTML = `
            <td>${motorista.id}</td>
            <td>${motorista.nome}</td>
            <td>${motorista.cpf}</td>
            <td>${motorista.telefone}</td>
            <td>${motorista.numero_cnh}</td>
            <td>${motorista.categoria_cnh}</td>
            <td>${formatarData(motorista.validade_cnh)}</td>
            <td>
                <span class="badge ${getBadgeClassMotorista(motorista.status)}">${motorista.status}</span>
            </td>
            <td>
                <button class="btn btn-sm btn-primary me-1" onclick="editarMotorista(${motorista.id})">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-sm btn-danger" onclick="excluirMotorista(${motorista.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        
        tabelaMotoristas.appendChild(tr);
    });
    
    // Se não houver motoristas, mostrar mensagem
    if (motoristas.length === 0) {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td colspan="9" class="text-center">Nenhum motorista encontrado</td>
        `;
        tabelaMotoristas.appendChild(tr);
    }
}

// Função para obter classe de badge de acordo com o status do motorista
function getBadgeClassMotorista(status) {
    switch (status) {
        case 'Disponível':
            return 'bg-success';
        case 'Em rota':
            return 'bg-warning text-dark';
        case 'Férias':
            return 'bg-info text-dark';
        case 'Afastado':
            return 'bg-danger';
        default:
            return 'bg-secondary';
    }
}

// Função para salvar motorista
function salvarMotorista() {
    // Obter valores do formulário
    const nome = document.getElementById('nomeMotorista').value;
    const cpf = document.getElementById('cpfMotorista').value;
    const dataNascimento = document.getElementById('dataNascimento').value;
    const telefone = document.getElementById('telefoneMotorista').value;
    const endereco = document.getElementById('enderecoMotorista').value;
    const numeroCNH = document.getElementById('numeroCNH').value;
    const categoriaCNH = document.getElementById('categoriaCNH').value;
    const validadeCNH = document.getElementById('validadeCNH').value;
    const dataAdmissao = document.getElementById('dataAdmissao').value;
    const status = document.getElementById('statusMotorista').value;
    const observacoes = document.getElementById('observacoesMotorista').value;
    
    // Validar campos obrigatórios
    if (!nome || !cpf || !dataNascimento || !telefone || !endereco || !numeroCNH || !categoriaCNH || !validadeCNH || !dataAdmissao || !status) {
        alert('Por favor, preencha todos os campos obrigatórios.');
        return;
    }
    
    // Obter motoristas existentes
    const motoristas = JSON.parse(localStorage.getItem('motoristas') || '[]');
    
    // Verificar se já existe motorista com o mesmo CPF
    const motoristaExistente = motoristas.find(m => m.cpf === cpf);
    if (motoristaExistente) {
        alert('Já existe um motorista cadastrado com este CPF.');
        return;
    }
    
    // Criar novo motorista
    const novoMotorista = {
        id: motoristas.length > 0 ? Math.max(...motoristas.map(m => m.id)) + 1 : 1,
        nome,
        cpf,
        data_nascimento: dataNascimento,
        telefone,
        endereco,
        numero_cnh: numeroCNH,
        categoria_cnh: categoriaCNH,
        validade_cnh: validadeCNH,
        data_admissao: dataAdmissao,
        status,
        observacoes
    };
    
    // Adicionar ao array de motoristas
    motoristas.push(novoMotorista);
    
    // Salvar no localStorage
    localStorage.setItem('motoristas', JSON.stringify(motoristas));
    
    // Fechar modal
    const modalNovoMotorista = bootstrap.Modal.getInstance(document.getElementById('modalNovoMotorista'));
    modalNovoMotorista.hide();
    
    // Limpar formulário
    document.getElementById('formNovoMotorista').reset();
    
    // Recarregar tabela
    carregarMotoristas();
    
    // Mostrar notificação
    mostrarNotificacao('Motorista cadastrado com sucesso!');
}

// Função para editar motorista
function editarMotorista(id) {
    // Obter motoristas do localStorage
    const motoristas = JSON.parse(localStorage.getItem('motoristas') || '[]');
    
    // Encontrar motorista pelo ID
    const motorista = motoristas.find(m => m.id === id);
    if (!motorista) {
        alert('Motorista não encontrado.');
        return;
    }
    
    // Preencher formulário com dados do motorista
    document.getElementById('nomeMotorista').value = motorista.nome;
    document.getElementById('cpfMotorista').value = motorista.cpf;
    document.getElementById('dataNascimento').value = motorista.data_nascimento;
    document.getElementById('telefoneMotorista').value = motorista.telefone;
    document.getElementById('enderecoMotorista').value = motorista.endereco;
    document.getElementById('numeroCNH').value = motorista.numero_cnh;
    document.getElementById('categoriaCNH').value = motorista.categoria_cnh;
    document.getElementById('validadeCNH').value = motorista.validade_cnh;
    document.getElementById('dataAdmissao').value = motorista.data_admissao;
    document.getElementById('statusMotorista').value = motorista.status;
    document.getElementById('observacoesMotorista').value = motorista.observacoes || '';
    
    // Alterar título do modal
    document.getElementById('modalNovoMotoristaLabel').textContent = 'Editar Motorista';
    
    // Alterar função do botão salvar
    const btnSalvarMotorista = document.getElementById('btnSalvarMotorista');
    btnSalvarMotorista.onclick = function() {
        atualizarMotorista(id);
    };
    
    // Abrir modal
    const modalNovoMotorista = new bootstrap.Modal(document.getElementById('modalNovoMotorista'));
    modalNovoMotorista.show();
}

// Função para atualizar motorista
function atualizarMotorista(id) {
    // Obter valores do formulário
    const nome = document.getElementById('nomeMotorista').value;
    const cpf = document.getElementById('cpfMotorista').value;
    const dataNascimento = document.getElementById('dataNascimento').value;
    const telefone = document.getElementById('telefoneMotorista').value;
    const endereco = document.getElementById('enderecoMotorista').value;
    const numeroCNH = document.getElementById('numeroCNH').value;
    const categoriaCNH = document.getElementById('categoriaCNH').value;
    const validadeCNH = document.getElementById('validadeCNH').value;
    const dataAdmissao = document.getElementById('dataAdmissao').value;
    const status = document.getElementById('statusMotorista').value;
    const observacoes = document.getElementById('observacoesMotorista').value;
    
    // Validar campos obrigatórios
    if (!nome || !cpf || !dataNascimento || !telefone || !endereco || !numeroCNH || !categoriaCNH || !validadeCNH || !dataAdmissao || !status) {
        alert('Por favor, preencha todos os campos obrigatórios.');
        return;
    }
    
    // Obter motoristas existentes
    const motoristas = JSON.parse(localStorage.getItem('motoristas') || '[]');
    
    // Verificar se já existe outro motorista com o mesmo CPF
    const motoristaExistente = motoristas.find(m => m.cpf === cpf && m.id !== id);
    if (motoristaExistente) {
        alert('Já existe outro motorista cadastrado com este CPF.');
        return;
    }
    
    // Encontrar índice do motorista a ser atualizado
    const index = motoristas.findIndex(m => m.id === id);
    if (index === -1) {
        alert('Motorista não encontrado.');
        return;
    }
    
    // Atualizar motorista
    motoristas[index] = {
        ...motoristas[index],
        nome,
        cpf,
        data_nascimento: dataNascimento,
        telefone,
        endereco,
        numero_cnh: numeroCNH,
        categoria_cnh: categoriaCNH,
        validade_cnh: validadeCNH,
        data_admissao: dataAdmissao,
        status,
        observacoes
    };
    
    // Salvar no localStorage
    localStorage.setItem('motoristas', JSON.stringify(motoristas));
    
    // Fechar modal
    const modalNovoMotorista = bootstrap.Modal.getInstance(document.getElementById('modalNovoMotorista'));
    modalNovoMotorista.hide();
    
    // Limpar formulário
    document.getElementById('formNovoMotorista').reset();
    
    // Restaurar título do modal e função do botão
    document.getElementById('modalNovoMotoristaLabel').textContent = 'Cadastrar Novo Motorista';
    document.getElementById('btnSalvarMotorista').onclick = salvarMotorista;
    
    // Recarregar tabela
    carregarMotoristas();
    
    // Mostrar notificação
    mostrarNotificacao('Motorista atualizado com sucesso!');
}

// Função para excluir motorista
function excluirMotorista(id) {
    // Confirmar exclusão
    confirmarAcao('Tem certeza que deseja excluir este motorista?', function() {
        // Obter motoristas do localStorage
        const motoristas = JSON.parse(localStorage.getItem('motoristas') || '[]');
        
        // Filtrar motoristas, removendo o que tem o ID especificado
        const motoristasFiltrados = motoristas.filter(m => m.id !== id);
        
        // Salvar no localStorage
        localStorage.setItem('motoristas', JSON.stringify(motoristasFiltrados));
        
        // Recarregar tabela
        carregarMotoristas();
        
        // Mostrar notificação
        mostrarNotificacao('Motorista excluído com sucesso!');
    });
}

// Função para filtrar motoristas
function filtrarMotoristas() {
    const status = document.getElementById('filtroStatus').value;
    const categoria = document.getElementById('filtroCategoria').value;
    const busca = document.getElementById('filtroBusca').value;
    
    carregarMotoristas({ status, categoria, busca });
}
