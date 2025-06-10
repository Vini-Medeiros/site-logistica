// dashboard.js - Script para gerenciar o dashboard do sistema

document.addEventListener('DOMContentLoaded', function() {
    // Verificar login
    verificarLogin();
    
    // Carregar dados do dashboard
    carregarDadosDashboard();
    
    // Inicializar gráficos
    inicializarGraficos();
    
    // Carregar tabelas
    carregarEntregasRecentes();
    carregarRotasAtivas();
    carregarMotoristasEmRota();
});

// Função para carregar dados do dashboard
function carregarDadosDashboard() {
    // Obter dados do localStorage
    const veiculos = JSON.parse(localStorage.getItem('veiculos') || '[]');
    const rotas = JSON.parse(localStorage.getItem('rotas') || '[]');
    const entregas = JSON.parse(localStorage.getItem('entregas') || '[]');
    const motoristas = JSON.parse(localStorage.getItem('motoristas') || '[]');
    
    // Atualizar contadores de veículos
    document.getElementById('totalVeiculos').textContent = veiculos.length;
    document.getElementById('veiculosDisponiveis').textContent = veiculos.filter(v => v.status === 'Disponível').length;
    
    // Atualizar contadores de rotas
    document.getElementById('totalRotas').textContent = rotas.length;
    document.getElementById('rotasAndamento').textContent = rotas.filter(r => r.status === 'Em andamento').length;
    
    // Atualizar contadores de entregas
    document.getElementById('totalEntregas').textContent = entregas.length;
    document.getElementById('entregasTransito').textContent = entregas.filter(e => e.status === 'Em trânsito').length;
    
    // Atualizar contadores de motoristas
    document.getElementById('totalMotoristas').textContent = motoristas.length;
    document.getElementById('motoristasDisponiveis').textContent = motoristas.filter(m => m.status === 'Disponível').length;
}

// Função para inicializar gráficos
function inicializarGraficos() {
    // Gráfico de status das entregas
    const entregas = JSON.parse(localStorage.getItem('entregas') || '[]');
    const statusEntregas = {
        'Aguardando coleta': 0,
        'Em trânsito': 0,
        'Entregue': 0,
        'Devolvido': 0
    };
    
    entregas.forEach(entrega => {
        if (statusEntregas.hasOwnProperty(entrega.status)) {
            statusEntregas[entrega.status]++;
        }
    });
    
    const ctxEntregas = document.getElementById('entregasChart').getContext('2d');
    new Chart(ctxEntregas, {
        type: 'pie',
        data: {
            labels: Object.keys(statusEntregas),
            datasets: [{
                data: Object.values(statusEntregas),
                backgroundColor: [
                    '#17a2b8', // info - Aguardando coleta
                    '#ffc107', // warning - Em trânsito
                    '#28a745', // success - Entregue
                    '#dc3545'  // danger - Devolvido
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            }
        }
    });
    
    // Gráfico de status dos veículos
    const veiculos = JSON.parse(localStorage.getItem('veiculos') || '[]');
    const statusVeiculos = {
        'Disponível': 0,
        'Em rota': 0,
        'Em manutenção': 0
    };
    
    veiculos.forEach(veiculo => {
        if (statusVeiculos.hasOwnProperty(veiculo.status)) {
            statusVeiculos[veiculo.status]++;
        }
    });
    
    const ctxVeiculos = document.getElementById('veiculosChart').getContext('2d');
    new Chart(ctxVeiculos, {
        type: 'doughnut',
        data: {
            labels: Object.keys(statusVeiculos),
            datasets: [{
                data: Object.values(statusVeiculos),
                backgroundColor: [
                    '#28a745', // success - Disponível
                    '#ffc107', // warning - Em rota
                    '#dc3545'  // danger - Em manutenção
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            }
        }
    });
}

// Função para carregar entregas recentes
function carregarEntregasRecentes() {
    const tabelaEntregas = document.getElementById('entregasRecentes');
    if (!tabelaEntregas) return;
    
    // Limpar tabela
    tabelaEntregas.innerHTML = '';
    
    // Obter entregas do localStorage
    const entregas = JSON.parse(localStorage.getItem('entregas') || '[]');
    
    // Ordenar por data de criação (mais recentes primeiro)
    // Como não temos data de criação explícita, vamos usar o ID como referência
    const entregasRecentes = [...entregas].sort((a, b) => b.id - a.id).slice(0, 5);
    
    // Preencher tabela com as entregas recentes
    entregasRecentes.forEach(entrega => {
        const tr = document.createElement('tr');
        
        // Definir classe de acordo com o status
        if (entrega.status === 'Em trânsito') {
            tr.classList.add('table-warning');
        } else if (entrega.status === 'Entregue') {
            tr.classList.add('table-success');
        } else if (entrega.status === 'Devolvido') {
            tr.classList.add('table-danger');
        }
        
        tr.innerHTML = `
            <td>${entrega.codigo_rastreamento}</td>
            <td>${entrega.destinatario}</td>
            <td>${entrega.cidade}/${entrega.estado}</td>
            <td>${entrega.data_prevista ? formatarData(entrega.data_prevista) : 'Não definida'}</td>
            <td>
                <span class="badge ${getBadgeClassEntrega(entrega.status)}">${entrega.status}</span>
            </td>
        `;
        
        tabelaEntregas.appendChild(tr);
    });
    
    // Se não houver entregas, mostrar mensagem
    if (entregasRecentes.length === 0) {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td colspan="5" class="text-center">Nenhuma entrega encontrada</td>
        `;
        tabelaEntregas.appendChild(tr);
    }
}

// Função para obter classe de badge de acordo com o status da entrega
function getBadgeClassEntrega(status) {
    switch (status) {
        case 'Aguardando coleta':
            return 'bg-info';
        case 'Em trânsito':
            return 'bg-warning text-dark';
        case 'Entregue':
            return 'bg-success';
        case 'Devolvido':
            return 'bg-danger';
        default:
            return 'bg-secondary';
    }
}

// Função para carregar rotas ativas
function carregarRotasAtivas() {
    const tabelaRotas = document.getElementById('rotasAtivas');
    if (!tabelaRotas) return;
    
    // Limpar tabela
    tabelaRotas.innerHTML = '';
    
    // Obter rotas do localStorage
    const rotas = JSON.parse(localStorage.getItem('rotas') || '[]');
    const veiculos = JSON.parse(localStorage.getItem('veiculos') || '[]');
    
    // Filtrar rotas ativas (planejadas ou em andamento)
    const rotasAtivas = rotas.filter(r => r.status === 'Planejada' || r.status === 'Em andamento').slice(0, 5);
    
    // Preencher tabela com as rotas ativas
    rotasAtivas.forEach(rota => {
        const tr = document.createElement('tr');
        
        // Definir classe de acordo com o status
        if (rota.status === 'Em andamento') {
            tr.classList.add('table-warning');
        }
        
        // Encontrar veículo
        const veiculo = rota.veiculo_id ? veiculos.find(v => v.id === rota.veiculo_id) : null;
        
        tr.innerHTML = `
            <td>${rota.nome}</td>
            <td>${rota.origem} → ${rota.destino}</td>
            <td>${veiculo ? veiculo.placa : 'Não atribuído'}</td>
            <td>
                <span class="badge ${getBadgeClassRota(rota.status)}">${rota.status}</span>
            </td>
        `;
        
        tabelaRotas.appendChild(tr);
    });
    
    // Se não houver rotas ativas, mostrar mensagem
    if (rotasAtivas.length === 0) {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td colspan="4" class="text-center">Nenhuma rota ativa encontrada</td>
        `;
        tabelaRotas.appendChild(tr);
    }
}

// Função para obter classe de badge de acordo com o status da rota
function getBadgeClassRota(status) {
    switch (status) {
        case 'Planejada':
            return 'bg-info';
        case 'Em andamento':
            return 'bg-warning text-dark';
        case 'Concluída':
            return 'bg-success';
        case 'Cancelada':
            return 'bg-danger';
        default:
            return 'bg-secondary';
    }
}

// Função para carregar motoristas em rota
function carregarMotoristasEmRota() {
    const tabelaMotoristas = document.getElementById('motoristasEmRota');
    if (!tabelaMotoristas) return;
    
    // Limpar tabela
    tabelaMotoristas.innerHTML = '';
    
    // Obter motoristas e rotas do localStorage
    const motoristas = JSON.parse(localStorage.getItem('motoristas') || '[]');
    const rotas = JSON.parse(localStorage.getItem('rotas') || '[]');
    
    // Filtrar motoristas em rota
    const motoristasEmRota = motoristas.filter(m => m.status === 'Em rota').slice(0, 5);
    
    // Preencher tabela com os motoristas em rota
    motoristasEmRota.forEach(motorista => {
        const tr = document.createElement('tr');
        
        // Encontrar rota atual do motorista
        const rotaAtual = rotas.find(r => r.motorista_id === motorista.id && r.status === 'Em andamento');
        
        tr.innerHTML = `
            <td>${motorista.nome}</td>
            <td>${motorista.telefone}</td>
            <td>${rotaAtual ? rotaAtual.nome : 'Não atribuída'}</td>
            <td>
                <span class="badge bg-warning text-dark">Em rota</span>
            </td>
        `;
        
        tabelaMotoristas.appendChild(tr);
    });
    
    // Se não houver motoristas em rota, mostrar mensagem
    if (motoristasEmRota.length === 0) {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td colspan="4" class="text-center">Nenhum motorista em rota encontrado</td>
        `;
        tabelaMotoristas.appendChild(tr);
    }
}
