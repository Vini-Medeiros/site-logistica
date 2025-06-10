// entregas.js - Script para gerenciar entregas no sistema

document.addEventListener('DOMContentLoaded', function() {
    // Inicializar dados de entregas se não existirem
    inicializarDadosEntregas();
    
    // Carregar entregas na tabela
    carregarEntregas();
    
    // Carregar rotas no select
    carregarRotasSelect();
    
    // Adicionar evento ao botão de salvar entrega
    const btnSalvarEntrega = document.getElementById('btnSalvarEntrega');
    if (btnSalvarEntrega) {
        btnSalvarEntrega.addEventListener('click', salvarEntrega);
    }
    
    // Adicionar evento ao botão de filtrar
    const btnFiltrar = document.getElementById('btnFiltrar');
    if (btnFiltrar) {
        btnFiltrar.addEventListener('click', filtrarEntregas);
    }
});

// Função para inicializar dados de entregas
function inicializarDadosEntregas() {
    if (!localStorage.getItem('entregas')) {
        const entregasIniciais = [
            { 
                id: 1, 
                codigo_rastreamento: 'ENT001', 
                descricao: 'Eletrônicos', 
                endereco_entrega: 'Av. Paulista, 1000', 
                cidade: 'São Paulo', 
                estado: 'SP', 
                cep: '01310-100', 
                destinatario: 'Tech Store', 
                telefone_contato: '(11) 99999-8888',
                peso: 120,
                volume: 0.8,
                data_prevista: '2025-06-15',
                status: 'Em trânsito', 
                prioridade: 1,
                rota_id: 1 
            },
            { 
                id: 2, 
                codigo_rastreamento: 'ENT002', 
                descricao: 'Material de construção', 
                endereco_entrega: 'Rua das Flores, 200', 
                cidade: 'Curitiba', 
                estado: 'PR', 
                cep: '80020-190', 
                destinatario: 'Constrular', 
                telefone_contato: '(41) 98765-4321',
                peso: 500,
                volume: 2.5,
                data_prevista: '2025-06-20',
                status: 'Aguardando coleta', 
                prioridade: 2,
                rota_id: 1 
            },
            { 
                id: 3, 
                codigo_rastreamento: 'ENT003', 
                descricao: 'Alimentos não perecíveis', 
                endereco_entrega: 'Av. Atlântica, 500', 
                cidade: 'Rio de Janeiro', 
                estado: 'RJ', 
                cep: '22010-000', 
                destinatario: 'Supermercado Rio', 
                telefone_contato: '(21) 97777-6666',
                peso: 350,
                volume: 1.2,
                data_prevista: '2025-06-10',
                status: 'Entregue', 
                prioridade: 1,
                rota_id: null 
            }
        ];
        localStorage.setItem('entregas', JSON.stringify(entregasIniciais));
    }
}

// Função para carregar rotas no select
function carregarRotasSelect() {
    const selectRota = document.getElementById('rotaEntrega');
    const filtroRota = document.getElementById('filtroRota');
    if (!selectRota && !filtroRota) return;
    
    // Obter rotas do localStorage
    const rotas = JSON.parse(localStorage.getItem('rotas') || '[]');
    
    // Preencher select de rotas no formulário
    if (selectRota) {
        // Manter apenas a primeira opção (Selecione...)
        selectRota.innerHTML = '<option value="">Selecione...</option>';
        
        // Adicionar rotas planejadas ou em andamento
        rotas.filter(r => r.status === 'Planejada' || r.status === 'Em andamento').forEach(rota => {
            const option = document.createElement('option');
            option.value = rota.id;
            option.textContent = `${rota.nome} (${rota.origem} → ${rota.destino})`;
            selectRota.appendChild(option);
        });
    }
    
    // Preencher select de rotas no filtro
    if (filtroRota) {
        // Manter apenas a primeira opção (Todas)
        filtroRota.innerHTML = '<option value="">Todas</option>';
        
        // Adicionar todas as rotas
        rotas.forEach(rota => {
            const option = document.createElement('option');
            option.value = rota.id;
            option.textContent = rota.nome;
            filtroRota.appendChild(option);
        });
    }
}

// Função para carregar entregas na tabela
function carregarEntregas(filtros = {}) {
    const tabelaEntregas = document.getElementById('tabelaEntregas');
    if (!tabelaEntregas) return;
    
    // Limpar tabela
    tabelaEntregas.innerHTML = '';
    
    // Obter entregas do localStorage
    let entregas = JSON.parse(localStorage.getItem('entregas') || '[]');
    
    // Aplicar filtros se existirem
    if (filtros.status && filtros.status !== '') {
        entregas = entregas.filter(e => e.status === filtros.status);
    }
    
    if (filtros.rota_id && filtros.rota_id !== '') {
        entregas = entregas.filter(e => e.rota_id === parseInt(filtros.rota_id));
    }
    
    if (filtros.busca && filtros.busca !== '') {
        const termoBusca = filtros.busca.toLowerCase();
        entregas = entregas.filter(e => 
            e.codigo_rastreamento.toLowerCase().includes(termoBusca) || 
            e.destinatario.toLowerCase().includes(termoBusca) ||
            e.descricao.toLowerCase().includes(termoBusca)
        );
    }
    
    // Obter rotas para exibir informações completas
    const rotas = JSON.parse(localStorage.getItem('rotas') || '[]');
    
    // Preencher tabela com as entregas
    entregas.forEach(entrega => {
        const tr = document.createElement('tr');
        
        // Definir classe de acordo com o status
        if (entrega.status === 'Em trânsito') {
            tr.classList.add('table-warning');
        } else if (entrega.status === 'Entregue') {
            tr.classList.add('table-success');
        } else if (entrega.status === 'Devolvido') {
            tr.classList.add('table-danger');
        }
        
        // Encontrar rota
        const rota = entrega.rota_id ? rotas.find(r => r.id === entrega.rota_id) : null;
        
        // Formatar prioridade
        let prioridadeTexto = '';
        let prioridadeBadge = '';
        
        switch (parseInt(entrega.prioridade)) {
            case 1:
                prioridadeTexto = 'Alta';
                prioridadeBadge = 'bg-danger';
                break;
            case 2:
                prioridadeTexto = 'Normal';
                prioridadeBadge = 'bg-primary';
                break;
            case 3:
                prioridadeTexto = 'Baixa';
                prioridadeBadge = 'bg-secondary';
                break;
        }
        
        tr.innerHTML = `
            <td>${entrega.id}</td>
            <td>${entrega.codigo_rastreamento}</td>
            <td>${entrega.descricao}</td>
            <td>${entrega.destinatario}</td>
            <td>${entrega.cidade}/${entrega.estado}</td>
            <td>${entrega.data_prevista ? formatarData(entrega.data_prevista) : 'Não definida'}</td>
            <td>${rota ? rota.nome : 'Não atribuída'}</td>
            <td><span class="badge ${prioridadeBadge}">${prioridadeTexto}</span></td>
            <td>
                <span class="badge ${getBadgeClassEntrega(entrega.status)}">${entrega.status}</span>
            </td>
            <td>
                <button class="btn btn-sm btn-primary me-1" onclick="editarEntrega(${entrega.id})">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-sm btn-danger" onclick="excluirEntrega(${entrega.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        
        tabelaEntregas.appendChild(tr);
    });
    
    // Se não houver entregas, mostrar mensagem
    if (entregas.length === 0) {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td colspan="10" class="text-center">Nenhuma entrega encontrada</td>
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

// Função para salvar entrega
function salvarEntrega() {
    // Obter valores do formulário
    const codigoRastreamento = document.getElementById('codigoRastreamento').value;
    const rotaId = document.getElementById('rotaEntrega').value ? parseInt(document.getElementById('rotaEntrega').value) : null;
    const descricao = document.getElementById('descricaoEntrega').value;
    const destinatario = document.getElementById('destinatario').value;
    const telefoneContato = document.getElementById('telefoneContato').value;
    const enderecoEntrega = document.getElementById('enderecoEntrega').value;
    const cidadeEntrega = document.getElementById('cidadeEntrega').value;
    const estadoEntrega = document.getElementById('estadoEntrega').value;
    const cepEntrega = document.getElementById('cepEntrega').value;
    const pesoEntrega = document.getElementById('pesoEntrega').value ? parseFloat(document.getElementById('pesoEntrega').value) : null;
    const volumeEntrega = document.getElementById('volumeEntrega').value ? parseFloat(document.getElementById('volumeEntrega').value) : null;
    const prioridadeEntrega = parseInt(document.getElementById('prioridadeEntrega').value);
    const dataPrevista = document.getElementById('dataPrevista').value;
    const statusEntrega = document.getElementById('statusEntrega').value;
    const observacoesEntrega = document.getElementById('observacoesEntrega').value;
    
    // Validar campos obrigatórios
    if (!codigoRastreamento || !descricao || !destinatario || !enderecoEntrega || !cidadeEntrega || !estadoEntrega || !cepEntrega || !statusEntrega) {
        alert('Por favor, preencha todos os campos obrigatórios.');
        return;
    }
    
    // Obter entregas existentes
    const entregas = JSON.parse(localStorage.getItem('entregas') || '[]');
    
    // Verificar se já existe entrega com o mesmo código de rastreamento
    const entregaExistente = entregas.find(e => e.codigo_rastreamento === codigoRastreamento);
    if (entregaExistente) {
        alert('Já existe uma entrega cadastrada com este código de rastreamento.');
        return;
    }
    
    // Criar nova entrega
    const novaEntrega = {
        id: entregas.length > 0 ? Math.max(...entregas.map(e => e.id)) + 1 : 1,
        codigo_rastreamento: codigoRastreamento,
        rota_id: rotaId,
        descricao,
        destinatario,
        telefone_contato: telefoneContato,
        endereco_entrega: enderecoEntrega,
        cidade: cidadeEntrega,
        estado: estadoEntrega,
        cep: cepEntrega,
        peso: pesoEntrega,
        volume: volumeEntrega,
        prioridade: prioridadeEntrega,
        data_prevista: dataPrevista,
        status: statusEntrega,
        observacoes: observacoesEntrega
    };
    
    // Adicionar ao array de entregas
    entregas.push(novaEntrega);
    
    // Salvar no localStorage
    localStorage.setItem('entregas', JSON.stringify(entregas));
    
    // Fechar modal
    const modalNovaEntrega = bootstrap.Modal.getInstance(document.getElementById('modalNovaEntrega'));
    modalNovaEntrega.hide();
    
    // Limpar formulário
    document.getElementById('formNovaEntrega').reset();
    
    // Recarregar tabela
    carregarEntregas();
    
    // Mostrar notificação
    mostrarNotificacao('Entrega cadastrada com sucesso!');
}

// Função para editar entrega
function editarEntrega(id) {
    // Obter entregas do localStorage
    const entregas = JSON.parse(localStorage.getItem('entregas') || '[]');
    
    // Encontrar entrega pelo ID
    const entrega = entregas.find(e => e.id === id);
    if (!entrega) {
        alert('Entrega não encontrada.');
        return;
    }
    
    // Carregar rotas no select
    carregarRotasSelect();
    
    // Preencher formulário com dados da entrega
    document.getElementById('codigoRastreamento').value = entrega.codigo_rastreamento;
    document.getElementById('descricaoEntrega').value = entrega.descricao;
    document.getElementById('destinatario').value = entrega.destinatario;
    document.getElementById('telefoneContato').value = entrega.telefone_contato || '';
    document.getElementById('enderecoEntrega').value = entrega.endereco_entrega;
    document.getElementById('cidadeEntrega').value = entrega.cidade;
    document.getElementById('estadoEntrega').value = entrega.estado;
    document.getElementById('cepEntrega').value = entrega.cep;
    document.getElementById('pesoEntrega').value = entrega.peso || '';
    document.getElementById('volumeEntrega').value = entrega.volume || '';
    document.getElementById('prioridadeEntrega').value = entrega.prioridade;
    document.getElementById('dataPrevista').value = entrega.data_prevista || '';
    document.getElementById('statusEntrega').value = entrega.status;
    document.getElementById('observacoesEntrega').value = entrega.observacoes || '';
    
    // Adicionar opção da rota atual se não estiver disponível
    if (entrega.rota_id) {
        const rotas = JSON.parse(localStorage.getItem('rotas') || '[]');
        const rota = rotas.find(r => r.id === entrega.rota_id);
        
        if (rota) {
            const rotaSelect = document.getElementById('rotaEntrega');
            let encontrado = false;
            
            // Verificar se a rota já está no select
            for (let i = 0; i < rotaSelect.options.length; i++) {
                if (parseInt(rotaSelect.options[i].value) === rota.id) {
                    encontrado = true;
                    break;
                }
            }
            
            // Se não estiver, adicionar
            if (!encontrado) {
                const option = document.createElement('option');
                option.value = rota.id;
                option.textContent = `${rota.nome} (${rota.origem} → ${rota.destino})`;
                rotaSelect.appendChild(option);
            }
            
            rotaSelect.value = rota.id;
        }
    }
    
    // Alterar título do modal
    document.getElementById('modalNovaEntregaLabel').textContent = 'Editar Entrega';
    
    // Alterar função do botão salvar
    const btnSalvarEntrega = document.getElementById('btnSalvarEntrega');
    btnSalvarEntrega.onclick = function() {
        atualizarEntrega(id);
    };
    
    // Abrir modal
    const modalNovaEntrega = new bootstrap.Modal(document.getElementById('modalNovaEntrega'));
    modalNovaEntrega.show();
}

// Função para atualizar entrega
function atualizarEntrega(id) {
    // Obter valores do formulário
    const codigoRastreamento = document.getElementById('codigoRastreamento').value;
    const rotaId = document.getElementById('rotaEntrega').value ? parseInt(document.getElementById('rotaEntrega').value) : null;
    const descricao = document.getElementById('descricaoEntrega').value;
    const destinatario = document.getElementById('destinatario').value;
    const telefoneContato = document.getElementById('telefoneContato').value;
    const enderecoEntrega = document.getElementById('enderecoEntrega').value;
    const cidadeEntrega = document.getElementById('cidadeEntrega').value;
    const estadoEntrega = document.getElementById('estadoEntrega').value;
    const cepEntrega = document.getElementById('cepEntrega').value;
    const pesoEntrega = document.getElementById('pesoEntrega').value ? parseFloat(document.getElementById('pesoEntrega').value) : null;
    const volumeEntrega = document.getElementById('volumeEntrega').value ? parseFloat(document.getElementById('volumeEntrega').value) : null;
    const prioridadeEntrega = parseInt(document.getElementById('prioridadeEntrega').value);
    const dataPrevista = document.getElementById('dataPrevista').value;
    const statusEntrega = document.getElementById('statusEntrega').value;
    const observacoesEntrega = document.getElementById('observacoesEntrega').value;
    
    // Validar campos obrigatórios
    if (!codigoRastreamento || !descricao || !destinatario || !enderecoEntrega || !cidadeEntrega || !estadoEntrega || !cepEntrega || !statusEntrega) {
        alert('Por favor, preencha todos os campos obrigatórios.');
        return;
    }
    
    // Obter entregas existentes
    const entregas = JSON.parse(localStorage.getItem('entregas') || '[]');
    
    // Verificar se já existe outra entrega com o mesmo código de rastreamento
    const entregaExistente = entregas.find(e => e.codigo_rastreamento === codigoRastreamento && e.id !== id);
    if (entregaExistente) {
        alert('Já existe outra entrega cadastrada com este código de rastreamento.');
        return;
    }
    
    // Encontrar índice da entrega a ser atualizada
    const index = entregas.findIndex(e => e.id === id);
    if (index === -1) {
        alert('Entrega não encontrada.');
        return;
    }
    
    // Atualizar entrega
    entregas[index] = {
        ...entregas[index],
        codigo_rastreamento: codigoRastreamento,
        rota_id: rotaId,
        descricao,
        destinatario,
        telefone_contato: telefoneContato,
        endereco_entrega: enderecoEntrega,
        cidade: cidadeEntrega,
        estado: estadoEntrega,
        cep: cepEntrega,
        peso: pesoEntrega,
        volume: volumeEntrega,
        prioridade: prioridadeEntrega,
        data_prevista: dataPrevista,
        status: statusEntrega,
        observacoes: observacoesEntrega
    };
    
    // Salvar no localStorage
    localStorage.setItem('entregas', JSON.stringify(entregas));
    
    // Fechar modal
    const modalNovaEntrega = bootstrap.Modal.getInstance(document.getElementById('modalNovaEntrega'));
    modalNovaEntrega.hide();
    
    // Limpar formulário
    document.getElementById('formNovaEntrega').reset();
    
    // Restaurar título do modal e função do botão
    document.getElementById('modalNovaEntregaLabel').textContent = 'Cadastrar Nova Entrega';
    document.getElementById('btnSalvarEntrega').onclick = salvarEntrega;
    
    // Recarregar tabela
    carregarEntregas();
    
    // Mostrar notificação
    mostrarNotificacao('Entrega atualizada com sucesso!');
}

// Função para excluir entrega
function excluirEntrega(id) {
    // Confirmar exclusão
    confirmarAcao('Tem certeza que deseja excluir esta entrega?', function() {
        // Obter entregas do localStorage
        const entregas = JSON.parse(localStorage.getItem('entregas') || '[]');
        
        // Filtrar entregas, removendo a que tem o ID especificado
        const entregasFiltradas = entregas.filter(e => e.id !== id);
        
        // Salvar no localStorage
        localStorage.setItem('entregas', JSON.stringify(entregasFiltradas));
        
        // Recarregar tabela
        carregarEntregas();
        
        // Mostrar notificação
        mostrarNotificacao('Entrega excluída com sucesso!');
    });
}

// Função para filtrar entregas
function filtrarEntregas() {
    const status = document.getElementById('filtroStatus').value;
    const rota_id = document.getElementById('filtroRota').value;
    const busca = document.getElementById('filtroBusca').value;
    
    carregarEntregas({ status, rota_id, busca });
}
