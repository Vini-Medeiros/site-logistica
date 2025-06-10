// rotas.js - Script para gerenciar rotas no sistema

document.addEventListener('DOMContentLoaded', function() {
    // Inicializar dados de rotas se não existirem
    inicializarDadosRotas();
    
    // Carregar rotas na tabela
    carregarRotas();
    
    // Carregar veículos e motoristas nos selects
    carregarVeiculosSelect();
    carregarMotoristasSelect();
    
    // Adicionar evento ao botão de salvar rota
    const btnSalvarRota = document.getElementById('btnSalvarRota');
    if (btnSalvarRota) {
        btnSalvarRota.addEventListener('click', salvarRota);
    }
    
    // Adicionar evento ao botão de filtrar
    const btnFiltrar = document.getElementById('btnFiltrar');
    if (btnFiltrar) {
        btnFiltrar.addEventListener('click', filtrarRotas);
    }
});

// Função para inicializar dados de rotas
function inicializarDadosRotas() {
    if (!localStorage.getItem('rotas')) {
        const rotasIniciais = [
            { id: 1, nome: 'Rota Sul', origem: 'São Paulo, SP', destino: 'Curitiba, PR', distancia: 408, tempo_estimado: 6, status: 'Planejada', veiculo_id: 1, motorista_id: 2, data_inicio: '2025-06-10', observacoes: 'Entrega de eletrônicos' },
            { id: 2, nome: 'Rota Nordeste', origem: 'Rio de Janeiro, RJ', destino: 'Salvador, BA', distancia: 1649, tempo_estimado: 24, status: 'Em andamento', veiculo_id: 2, motorista_id: 2, data_inicio: '2025-06-01', observacoes: 'Transporte de alimentos' }
        ];
        localStorage.setItem('rotas', JSON.stringify(rotasIniciais));
    }
}

// Função para carregar veículos no select
function carregarVeiculosSelect() {
    const selectVeiculo = document.getElementById('veiculoRota');
    const filtroVeiculo = document.getElementById('filtroVeiculo');
    if (!selectVeiculo && !filtroVeiculo) return;
    
    // Obter veículos do localStorage
    const veiculos = JSON.parse(localStorage.getItem('veiculos') || '[]');
    
    // Preencher select de veículos no formulário
    if (selectVeiculo) {
        // Manter apenas a primeira opção (Selecione...)
        selectVeiculo.innerHTML = '<option value="">Selecione...</option>';
        
        // Adicionar veículos disponíveis
        veiculos.filter(v => v.status === 'Disponível').forEach(veiculo => {
            const option = document.createElement('option');
            option.value = veiculo.id;
            option.textContent = `${veiculo.placa} - ${veiculo.modelo} (${veiculo.tipo})`;
            selectVeiculo.appendChild(option);
        });
    }
    
    // Preencher select de veículos no filtro
    if (filtroVeiculo) {
        // Manter apenas a primeira opção (Todos)
        filtroVeiculo.innerHTML = '<option value="">Todos</option>';
        
        // Adicionar todos os veículos
        veiculos.forEach(veiculo => {
            const option = document.createElement('option');
            option.value = veiculo.id;
            option.textContent = `${veiculo.placa} - ${veiculo.modelo}`;
            filtroVeiculo.appendChild(option);
        });
    }
}

// Função para carregar motoristas no select
function carregarMotoristasSelect() {
    const selectMotorista = document.getElementById('motoristaRota');
    if (!selectMotorista) return;
    
    // Obter usuários do localStorage (motoristas são usuários com cargo "Motorista")
    const usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]');
    
    // Manter apenas a primeira opção (Selecione...)
    selectMotorista.innerHTML = '<option value="">Selecione...</option>';
    
    // Adicionar motoristas disponíveis
    usuarios.filter(u => u.cargo === 'Motorista').forEach(motorista => {
        const option = document.createElement('option');
        option.value = motorista.id || usuarios.indexOf(motorista) + 1;
        option.textContent = motorista.nome;
        selectMotorista.appendChild(option);
    });
}

// Função para carregar rotas na tabela
function carregarRotas(filtros = {}) {
    const tabelaRotas = document.getElementById('tabelaRotas');
    if (!tabelaRotas) return;
    
    // Limpar tabela
    tabelaRotas.innerHTML = '';
    
    // Obter rotas do localStorage
    let rotas = JSON.parse(localStorage.getItem('rotas') || '[]');
    
    // Aplicar filtros se existirem
    if (filtros.status && filtros.status !== '') {
        rotas = rotas.filter(r => r.status === filtros.status);
    }
    
    if (filtros.veiculo_id && filtros.veiculo_id !== '') {
        rotas = rotas.filter(r => r.veiculo_id === parseInt(filtros.veiculo_id));
    }
    
    if (filtros.busca && filtros.busca !== '') {
        const termoBusca = filtros.busca.toLowerCase();
        rotas = rotas.filter(r => 
            r.origem.toLowerCase().includes(termoBusca) || 
            r.destino.toLowerCase().includes(termoBusca) ||
            r.nome.toLowerCase().includes(termoBusca)
        );
    }
    
    // Obter veículos e motoristas para exibir informações completas
    const veiculos = JSON.parse(localStorage.getItem('veiculos') || '[]');
    const usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]');
    
    // Preencher tabela com as rotas
    rotas.forEach(rota => {
        const tr = document.createElement('tr');
        
        // Definir classe de acordo com o status
        if (rota.status === 'Em andamento') {
            tr.classList.add('table-warning');
        } else if (rota.status === 'Concluída') {
            tr.classList.add('table-success');
        } else if (rota.status === 'Cancelada') {
            tr.classList.add('table-danger');
        }
        
        // Encontrar veículo e motorista
        const veiculo = veiculos.find(v => v.id === rota.veiculo_id) || { placa: 'Não atribuído' };
        const motorista = usuarios.find(u => u.id === rota.motorista_id) || { nome: 'Não atribuído' };
        
        tr.innerHTML = `
            <td>${rota.id}</td>
            <td>${rota.nome}</td>
            <td>${rota.origem}</td>
            <td>${rota.destino}</td>
            <td>${rota.distancia} km</td>
            <td>${rota.tempo_estimado} h</td>
            <td>${veiculo.placa}</td>
            <td>${motorista.nome}</td>
            <td>
                <span class="badge ${getBadgeClassRota(rota.status)}">${rota.status}</span>
            </td>
            <td>
                <button class="btn btn-sm btn-primary me-1" onclick="editarRota(${rota.id})">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-sm btn-danger" onclick="excluirRota(${rota.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        
        tabelaRotas.appendChild(tr);
    });
    
    // Se não houver rotas, mostrar mensagem
    if (rotas.length === 0) {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td colspan="10" class="text-center">Nenhuma rota encontrada</td>
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

// Função para salvar rota
function salvarRota() {
    // Obter valores do formulário
    const nome = document.getElementById('nomeRota').value;
    const origem = document.getElementById('origem').value;
    const destino = document.getElementById('destino').value;
    const distancia = parseFloat(document.getElementById('distancia').value);
    const tempoEstimado = parseFloat(document.getElementById('tempoEstimado').value);
    const veiculoId = document.getElementById('veiculoRota').value ? parseInt(document.getElementById('veiculoRota').value) : null;
    const motoristaId = document.getElementById('motoristaRota').value ? parseInt(document.getElementById('motoristaRota').value) : null;
    const dataInicio = document.getElementById('dataInicio').value;
    const status = document.getElementById('statusRota').value;
    const observacoes = document.getElementById('observacoesRota').value;
    
    // Validar campos obrigatórios
    if (!nome || !origem || !destino || isNaN(distancia) || isNaN(tempoEstimado) || !status) {
        alert('Por favor, preencha todos os campos obrigatórios.');
        return;
    }
    
    // Obter rotas existentes
    const rotas = JSON.parse(localStorage.getItem('rotas') || '[]');
    
    // Criar nova rota
    const novaRota = {
        id: rotas.length > 0 ? Math.max(...rotas.map(r => r.id)) + 1 : 1,
        nome,
        origem,
        destino,
        distancia,
        tempo_estimado: tempoEstimado,
        veiculo_id: veiculoId,
        motorista_id: motoristaId,
        data_inicio: dataInicio,
        status,
        observacoes
    };
    
    // Adicionar ao array de rotas
    rotas.push(novaRota);
    
    // Salvar no localStorage
    localStorage.setItem('rotas', JSON.stringify(rotas));
    
    // Atualizar status do veículo se foi atribuído
    if (veiculoId) {
        const veiculos = JSON.parse(localStorage.getItem('veiculos') || '[]');
        const veiculoIndex = veiculos.findIndex(v => v.id === veiculoId);
        
        if (veiculoIndex !== -1) {
            veiculos[veiculoIndex].status = 'Em rota';
            localStorage.setItem('veiculos', JSON.stringify(veiculos));
        }
    }
    
    // Fechar modal
    const modalNovaRota = bootstrap.Modal.getInstance(document.getElementById('modalNovaRota'));
    modalNovaRota.hide();
    
    // Limpar formulário
    document.getElementById('formNovaRota').reset();
    
    // Recarregar tabela
    carregarRotas();
    
    // Mostrar notificação
    mostrarNotificacao('Rota cadastrada com sucesso!');
}

// Função para editar rota
function editarRota(id) {
    // Obter rotas do localStorage
    const rotas = JSON.parse(localStorage.getItem('rotas') || '[]');
    
    // Encontrar rota pelo ID
    const rota = rotas.find(r => r.id === id);
    if (!rota) {
        alert('Rota não encontrada.');
        return;
    }
    
    // Carregar veículos e motoristas nos selects
    carregarVeiculosSelect();
    carregarMotoristasSelect();
    
    // Preencher formulário com dados da rota
    document.getElementById('nomeRota').value = rota.nome;
    document.getElementById('origem').value = rota.origem;
    document.getElementById('destino').value = rota.destino;
    document.getElementById('distancia').value = rota.distancia;
    document.getElementById('tempoEstimado').value = rota.tempo_estimado;
    
    // Adicionar opção do veículo atual se não estiver disponível
    if (rota.veiculo_id) {
        const veiculos = JSON.parse(localStorage.getItem('veiculos') || '[]');
        const veiculo = veiculos.find(v => v.id === rota.veiculo_id);
        
        if (veiculo) {
            const veiculoSelect = document.getElementById('veiculoRota');
            let encontrado = false;
            
            // Verificar se o veículo já está no select
            for (let i = 0; i < veiculoSelect.options.length; i++) {
                if (parseInt(veiculoSelect.options[i].value) === veiculo.id) {
                    encontrado = true;
                    break;
                }
            }
            
            // Se não estiver, adicionar
            if (!encontrado) {
                const option = document.createElement('option');
                option.value = veiculo.id;
                option.textContent = `${veiculo.placa} - ${veiculo.modelo} (${veiculo.tipo})`;
                veiculoSelect.appendChild(option);
            }
            
            veiculoSelect.value = veiculo.id;
        }
    }
    
    // Adicionar opção do motorista atual se não estiver disponível
    if (rota.motorista_id) {
        const usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]');
        const motorista = usuarios.find(u => u.id === rota.motorista_id);
        
        if (motorista) {
            const motoristaSelect = document.getElementById('motoristaRota');
            let encontrado = false;
            
            // Verificar se o motorista já está no select
            for (let i = 0; i < motoristaSelect.options.length; i++) {
                if (parseInt(motoristaSelect.options[i].value) === motorista.id) {
                    encontrado = true;
                    break;
                }
            }
            
            // Se não estiver, adicionar
            if (!encontrado) {
                const option = document.createElement('option');
                option.value = motorista.id;
                option.textContent = motorista.nome;
                motoristaSelect.appendChild(option);
            }
            
            motoristaSelect.value = motorista.id;
        }
    }
    
    document.getElementById('dataInicio').value = rota.data_inicio || '';
    document.getElementById('statusRota').value = rota.status;
    document.getElementById('observacoesRota').value = rota.observacoes || '';
    
    // Alterar título do modal
    document.getElementById('modalNovaRotaLabel').textContent = 'Editar Rota';
    
    // Alterar função do botão salvar
    const btnSalvarRota = document.getElementById('btnSalvarRota');
    btnSalvarRota.onclick = function() {
        atualizarRota(id);
    };
    
    // Abrir modal
    const modalNovaRota = new bootstrap.Modal(document.getElementById('modalNovaRota'));
    modalNovaRota.show();
}

// Função para atualizar rota
function atualizarRota(id) {
    // Obter valores do formulário
    const nome = document.getElementById('nomeRota').value;
    const origem = document.getElementById('origem').value;
    const destino = document.getElementById('destino').value;
    const distancia = parseFloat(document.getElementById('distancia').value);
    const tempoEstimado = parseFloat(document.getElementById('tempoEstimado').value);
    const veiculoId = document.getElementById('veiculoRota').value ? parseInt(document.getElementById('veiculoRota').value) : null;
    const motoristaId = document.getElementById('motoristaRota').value ? parseInt(document.getElementById('motoristaRota').value) : null;
    const dataInicio = document.getElementById('dataInicio').value;
    const status = document.getElementById('statusRota').value;
    const observacoes = document.getElementById('observacoesRota').value;
    
    // Validar campos obrigatórios
    if (!nome || !origem || !destino || isNaN(distancia) || isNaN(tempoEstimado) || !status) {
        alert('Por favor, preencha todos os campos obrigatórios.');
        return;
    }
    
    // Obter rotas existentes
    const rotas = JSON.parse(localStorage.getItem('rotas') || '[]');
    
    // Encontrar índice da rota a ser atualizada
    const index = rotas.findIndex(r => r.id === id);
    if (index === -1) {
        alert('Rota não encontrada.');
        return;
    }
    
    // Obter veículo anterior
    const veiculoAnteriorId = rotas[index].veiculo_id;
    
    // Atualizar rota
    rotas[index] = {
        ...rotas[index],
        nome,
        origem,
        destino,
        distancia,
        tempo_estimado: tempoEstimado,
        veiculo_id: veiculoId,
        motorista_id: motoristaId,
        data_inicio: dataInicio,
        status,
        observacoes
    };
    
    // Salvar no localStorage
    localStorage.setItem('rotas', JSON.stringify(rotas));
    
    // Atualizar status dos veículos
    const veiculos = JSON.parse(localStorage.getItem('veiculos') || '[]');
    
    // Se o veículo foi alterado, atualizar status do veículo anterior e do novo
    if (veiculoAnteriorId !== veiculoId) {
        // Liberar veículo anterior
        if (veiculoAnteriorId) {
            const veiculoAnteriorIndex = veiculos.findIndex(v => v.id === veiculoAnteriorId);
            if (veiculoAnteriorIndex !== -1) {
                // Verificar se o veículo não está em outra rota
                const outrasRotas = rotas.filter(r => r.id !== id && r.veiculo_id === veiculoAnteriorId);
                if (outrasRotas.length === 0) {
                    veiculos[veiculoAnteriorIndex].status = 'Disponível';
                }
            }
        }
        
        // Atualizar novo veículo
        if (veiculoId) {
            const veiculoIndex = veiculos.findIndex(v => v.id === veiculoId);
            if (veiculoIndex !== -1) {
                veiculos[veiculoIndex].status = 'Em rota';
            }
        }
        
        localStorage.setItem('veiculos', JSON.stringify(veiculos));
    }
    
    // Fechar modal
    const modalNovaRota = bootstrap.Modal.getInstance(document.getElementById('modalNovaRota'));
    modalNovaRota.hide();
    
    // Limpar formulário
    document.getElementById('formNovaRota').reset();
    
    // Restaurar título do modal e função do botão
    document.getElementById('modalNovaRotaLabel').textContent = 'Cadastrar Nova Rota';
    document.getElementById('btnSalvarRota').onclick = salvarRota;
    
    // Recarregar tabela
    carregarRotas();
    
    // Mostrar notificação
    mostrarNotificacao('Rota atualizada com sucesso!');
}

// Função para excluir rota
function excluirRota(id) {
    // Confirmar exclusão
    confirmarAcao('Tem certeza que deseja excluir esta rota?', function() {
        // Obter rotas do localStorage
        const rotas = JSON.parse(localStorage.getItem('rotas') || '[]');
        
        // Encontrar rota a ser excluída
        const rotaIndex = rotas.findIndex(r => r.id === id);
        if (rotaIndex === -1) {
            alert('Rota não encontrada.');
            return;
        }
        
        // Obter veículo da rota
        const veiculoId = rotas[rotaIndex].veiculo_id;
        
        // Remover rota
        rotas.splice(rotaIndex, 1);
        
        // Salvar no localStorage
        localStorage.setItem('rotas', JSON.stringify(rotas));
        
        // Atualizar status do veículo
        if (veiculoId) {
            const veiculos = JSON.parse(localStorage.getItem('veiculos') || '[]');
            const veiculoIndex = veiculos.findIndex(v => v.id === veiculoId);
            
            if (veiculoIndex !== -1) {
                // Verificar se o veículo não está em outra rota
                const outrasRotas = rotas.filter(r => r.veiculo_id === veiculoId);
                if (outrasRotas.length === 0) {
                    veiculos[veiculoIndex].status = 'Disponível';
                    localStorage.setItem('veiculos', JSON.stringify(veiculos));
                }
            }
        }
        
        // Recarregar tabela
        carregarRotas();
        
        // Mostrar notificação
        mostrarNotificacao('Rota excluída com sucesso!');
    });
}

// Função para filtrar rotas
function filtrarRotas() {
    const status = document.getElementById('filtroStatus').value;
    const veiculo_id = document.getElementById('filtroVeiculo').value;
    const busca = document.getElementById('filtroBusca').value;
    
    carregarRotas({ status, veiculo_id, busca });
}
