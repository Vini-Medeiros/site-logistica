// veiculos.js - Script para gerenciar veículos no sistema

document.addEventListener('DOMContentLoaded', function() {
    // Inicializar dados de veículos se não existirem
    inicializarDadosVeiculos();
    
    // Carregar veículos na tabela
    carregarVeiculos();
    
    // Adicionar evento ao botão de salvar veículo
    const btnSalvarVeiculo = document.getElementById('btnSalvarVeiculo');
    if (btnSalvarVeiculo) {
        btnSalvarVeiculo.addEventListener('click', salvarVeiculo);
    }
    
    // Adicionar evento ao botão de filtrar
    const btnFiltrar = document.getElementById('btnFiltrar');
    if (btnFiltrar) {
        btnFiltrar.addEventListener('click', filtrarVeiculos);
    }
});

// Função para inicializar dados de veículos
function inicializarDadosVeiculos() {
    if (!localStorage.getItem('veiculos')) {
        const veiculosIniciais = [
            { id: 1, placa: 'ABC1234', modelo: 'Cargo 2429', marca: 'Ford', ano: 2022, capacidade: 14, tipo: 'Caminhão', status: 'Disponível', km_atual: 15000 },
            { id: 2, placa: 'DEF5678', modelo: 'Accelo 1016', marca: 'Mercedes-Benz', ano: 2021, capacidade: 10, tipo: 'Caminhão', status: 'Em rota', km_atual: 25000 },
            { id: 3, placa: 'GHI9012', modelo: 'Master', marca: 'Renault', ano: 2023, capacidade: 3.5, tipo: 'Van', status: 'Disponível', km_atual: 5000 }
        ];
        localStorage.setItem('veiculos', JSON.stringify(veiculosIniciais));
    }
}

// Função para carregar veículos na tabela
function carregarVeiculos(filtros = {}) {
    const tabelaVeiculos = document.getElementById('tabelaVeiculos');
    if (!tabelaVeiculos) return;
    
    // Limpar tabela
    tabelaVeiculos.innerHTML = '';
    
    // Obter veículos do localStorage
    let veiculos = JSON.parse(localStorage.getItem('veiculos') || '[]');
    
    // Aplicar filtros se existirem
    if (filtros.status && filtros.status !== '') {
        veiculos = veiculos.filter(v => v.status === filtros.status);
    }
    
    if (filtros.tipo && filtros.tipo !== '') {
        veiculos = veiculos.filter(v => v.tipo === filtros.tipo);
    }
    
    if (filtros.busca && filtros.busca !== '') {
        const termoBusca = filtros.busca.toLowerCase();
        veiculos = veiculos.filter(v => 
            v.placa.toLowerCase().includes(termoBusca) || 
            v.modelo.toLowerCase().includes(termoBusca)
        );
    }
    
    // Preencher tabela com os veículos
    veiculos.forEach(veiculo => {
        const tr = document.createElement('tr');
        
        // Definir classe de acordo com o status
        if (veiculo.status === 'Em rota') {
            tr.classList.add('table-warning');
        } else if (veiculo.status === 'Em manutenção') {
            tr.classList.add('table-danger');
        }
        
        tr.innerHTML = `
            <td>${veiculo.id}</td>
            <td>${veiculo.placa}</td>
            <td>${veiculo.modelo}</td>
            <td>${veiculo.marca}</td>
            <td>${veiculo.ano}</td>
            <td>${veiculo.capacidade} ton</td>
            <td>${veiculo.tipo}</td>
            <td>
                <span class="badge ${getBadgeClass(veiculo.status)}">${veiculo.status}</span>
            </td>
            <td>${veiculo.km_atual.toLocaleString('pt-BR')} km</td>
            <td>
                <button class="btn btn-sm btn-primary me-1" onclick="editarVeiculo(${veiculo.id})">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-sm btn-danger" onclick="excluirVeiculo(${veiculo.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        
        tabelaVeiculos.appendChild(tr);
    });
    
    // Se não houver veículos, mostrar mensagem
    if (veiculos.length === 0) {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td colspan="10" class="text-center">Nenhum veículo encontrado</td>
        `;
        tabelaVeiculos.appendChild(tr);
    }
}

// Função para obter classe de badge de acordo com o status
function getBadgeClass(status) {
    switch (status) {
        case 'Disponível':
            return 'bg-success';
        case 'Em rota':
            return 'bg-warning text-dark';
        case 'Em manutenção':
            return 'bg-danger';
        default:
            return 'bg-secondary';
    }
}

// Função para salvar veículo
function salvarVeiculo() {
    // Obter valores do formulário
    const placa = document.getElementById('placa').value;
    const modelo = document.getElementById('modelo').value;
    const marca = document.getElementById('marca').value;
    const ano = parseInt(document.getElementById('ano').value);
    const capacidade = parseFloat(document.getElementById('capacidade').value);
    const tipo = document.getElementById('tipo').value;
    const status = document.getElementById('status').value;
    const kmAtual = parseFloat(document.getElementById('kmAtual').value);
    
    // Validar campos obrigatórios
    if (!placa || !modelo || !marca || !ano || !capacidade || !tipo || !status || isNaN(kmAtual)) {
        alert('Por favor, preencha todos os campos obrigatórios.');
        return;
    }
    
    // Obter veículos existentes
    const veiculos = JSON.parse(localStorage.getItem('veiculos') || '[]');
    
    // Verificar se já existe veículo com a mesma placa
    const veiculoExistente = veiculos.find(v => v.placa === placa);
    if (veiculoExistente) {
        alert('Já existe um veículo cadastrado com esta placa.');
        return;
    }
    
    // Criar novo veículo
    const novoVeiculo = {
        id: veiculos.length > 0 ? Math.max(...veiculos.map(v => v.id)) + 1 : 1,
        placa,
        modelo,
        marca,
        ano,
        capacidade,
        tipo,
        status,
        km_atual: kmAtual
    };
    
    // Adicionar ao array de veículos
    veiculos.push(novoVeiculo);
    
    // Salvar no localStorage
    localStorage.setItem('veiculos', JSON.stringify(veiculos));
    
    // Fechar modal
    const modalNovoVeiculo = bootstrap.Modal.getInstance(document.getElementById('modalNovoVeiculo'));
    modalNovoVeiculo.hide();
    
    // Limpar formulário
    document.getElementById('formNovoVeiculo').reset();
    
    // Recarregar tabela
    carregarVeiculos();
    
    // Mostrar notificação
    mostrarNotificacao('Veículo cadastrado com sucesso!');
}

// Função para editar veículo
function editarVeiculo(id) {
    // Obter veículos do localStorage
    const veiculos = JSON.parse(localStorage.getItem('veiculos') || '[]');
    
    // Encontrar veículo pelo ID
    const veiculo = veiculos.find(v => v.id === id);
    if (!veiculo) {
        alert('Veículo não encontrado.');
        return;
    }
    
    // Preencher formulário com dados do veículo
    document.getElementById('placa').value = veiculo.placa;
    document.getElementById('modelo').value = veiculo.modelo;
    document.getElementById('marca').value = veiculo.marca;
    document.getElementById('ano').value = veiculo.ano;
    document.getElementById('capacidade').value = veiculo.capacidade;
    document.getElementById('tipo').value = veiculo.tipo;
    document.getElementById('status').value = veiculo.status;
    document.getElementById('kmAtual').value = veiculo.km_atual;
    
    // Alterar título do modal
    document.getElementById('modalNovoVeiculoLabel').textContent = 'Editar Veículo';
    
    // Alterar função do botão salvar
    const btnSalvarVeiculo = document.getElementById('btnSalvarVeiculo');
    btnSalvarVeiculo.onclick = function() {
        atualizarVeiculo(id);
    };
    
    // Abrir modal
    const modalNovoVeiculo = new bootstrap.Modal(document.getElementById('modalNovoVeiculo'));
    modalNovoVeiculo.show();
}

// Função para atualizar veículo
function atualizarVeiculo(id) {
    // Obter valores do formulário
    const placa = document.getElementById('placa').value;
    const modelo = document.getElementById('modelo').value;
    const marca = document.getElementById('marca').value;
    const ano = parseInt(document.getElementById('ano').value);
    const capacidade = parseFloat(document.getElementById('capacidade').value);
    const tipo = document.getElementById('tipo').value;
    const status = document.getElementById('status').value;
    const kmAtual = parseFloat(document.getElementById('kmAtual').value);
    
    // Validar campos obrigatórios
    if (!placa || !modelo || !marca || !ano || !capacidade || !tipo || !status || isNaN(kmAtual)) {
        alert('Por favor, preencha todos os campos obrigatórios.');
        return;
    }
    
    // Obter veículos existentes
    const veiculos = JSON.parse(localStorage.getItem('veiculos') || '[]');
    
    // Verificar se já existe outro veículo com a mesma placa
    const veiculoExistente = veiculos.find(v => v.placa === placa && v.id !== id);
    if (veiculoExistente) {
        alert('Já existe outro veículo cadastrado com esta placa.');
        return;
    }
    
    // Encontrar índice do veículo a ser atualizado
    const index = veiculos.findIndex(v => v.id === id);
    if (index === -1) {
        alert('Veículo não encontrado.');
        return;
    }
    
    // Atualizar veículo
    veiculos[index] = {
        ...veiculos[index],
        placa,
        modelo,
        marca,
        ano,
        capacidade,
        tipo,
        status,
        km_atual: kmAtual
    };
    
    // Salvar no localStorage
    localStorage.setItem('veiculos', JSON.stringify(veiculos));
    
    // Fechar modal
    const modalNovoVeiculo = bootstrap.Modal.getInstance(document.getElementById('modalNovoVeiculo'));
    modalNovoVeiculo.hide();
    
    // Limpar formulário
    document.getElementById('formNovoVeiculo').reset();
    
    // Restaurar título do modal e função do botão
    document.getElementById('modalNovoVeiculoLabel').textContent = 'Cadastrar Novo Veículo';
    document.getElementById('btnSalvarVeiculo').onclick = salvarVeiculo;
    
    // Recarregar tabela
    carregarVeiculos();
    
    // Mostrar notificação
    mostrarNotificacao('Veículo atualizado com sucesso!');
}

// Função para excluir veículo
function excluirVeiculo(id) {
    // Confirmar exclusão
    confirmarAcao('Tem certeza que deseja excluir este veículo?', function() {
        // Obter veículos do localStorage
        const veiculos = JSON.parse(localStorage.getItem('veiculos') || '[]');
        
        // Filtrar veículos, removendo o que tem o ID especificado
        const veiculosFiltrados = veiculos.filter(v => v.id !== id);
        
        // Salvar no localStorage
        localStorage.setItem('veiculos', JSON.stringify(veiculosFiltrados));
        
        // Recarregar tabela
        carregarVeiculos();
        
        // Mostrar notificação
        mostrarNotificacao('Veículo excluído com sucesso!');
    });
}

// Função para filtrar veículos
function filtrarVeiculos() {
    const status = document.getElementById('filtroStatus').value;
    const tipo = document.getElementById('filtroTipo').value;
    const busca = document.getElementById('filtroBusca').value;
    
    carregarVeiculos({ status, tipo, busca });
}
