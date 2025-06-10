// relatorios.js - Script para gerenciar a página de relatórios

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
    // Inicializar gráficos
    inicializarGraficos();
    
    // Definir período padrão
    document.getElementById('periodoRelatorio').textContent = 'Período: Este mês';
    
    // Mostrar filtros específicos para o tipo de relatório selecionado
    mostrarFiltrosEspecificos('entregas');
}

// Função para carregar dados iniciais
function carregarDadosIniciais() {
    // Carregar dados de exemplo para o relatório inicial
    carregarDadosRelatorio('entregas', 'mes');
}

// Função para adicionar eventos
function adicionarEventos() {
    // Evento para alternar tipo de relatório
    document.getElementById('tipoRelatorio').addEventListener('change', function() {
        const tipoRelatorio = this.value;
        document.getElementById('tituloRelatorio').textContent = `Relatório de ${tipoRelatorio.charAt(0).toUpperCase() + tipoRelatorio.slice(1)}`;
        mostrarFiltrosEspecificos(tipoRelatorio);
        carregarDadosRelatorio(tipoRelatorio, obterPeriodoAtual());
    });
    
    // Evento para alternar formato do relatório
    document.getElementById('formatoRelatorio').addEventListener('change', function() {
        const formato = this.value;
        const areaGraficos = document.getElementById('areaGraficos');
        const areaTabelaRelatorio = document.getElementById('areaTabelaRelatorio');
        
        if (formato === 'tabela') {
            areaGraficos.style.display = 'none';
            areaTabelaRelatorio.style.display = 'block';
        } else if (formato === 'grafico') {
            areaGraficos.style.display = 'block';
            areaTabelaRelatorio.style.display = 'none';
        } else {
            areaGraficos.style.display = 'block';
            areaTabelaRelatorio.style.display = 'block';
        }
    });
    
    // Evento para gerar relatório
    document.getElementById('btnGerarRelatorio').addEventListener('click', function() {
        const tipoRelatorio = document.getElementById('tipoRelatorio').value;
        const periodo = obterPeriodoAtual();
        carregarDadosRelatorio(tipoRelatorio, periodo);
        mostrarNotificacao('Relatório gerado com sucesso!', 'success');
    });
    
    // Evento para limpar filtros
    document.getElementById('btnLimparFiltros').addEventListener('click', function() {
        document.getElementById('formFiltrosRelatorio').reset();
        mostrarNotificacao('Filtros limpos com sucesso!', 'info');
    });
    
    // Eventos para filtros de período
    document.querySelectorAll('.periodo-filtro').forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            const periodo = this.getAttribute('data-periodo');
            definirPeriodo(periodo);
            const tipoRelatorio = document.getElementById('tipoRelatorio').value;
            carregarDadosRelatorio(tipoRelatorio, periodo);
        });
    });
    
    // Evento para aplicar período personalizado
    document.getElementById('btnAplicarPeriodo').addEventListener('click', function() {
        const dataInicio = document.getElementById('dataInicio').value;
        const dataFim = document.getElementById('dataFim').value;
        
        if (!dataInicio || !dataFim) {
            mostrarNotificacao('Por favor, preencha as datas de início e fim.', 'warning');
            return;
        }
        
        if (new Date(dataInicio) > new Date(dataFim)) {
            mostrarNotificacao('A data de início não pode ser posterior à data de fim.', 'warning');
            return;
        }
        
        definirPeriodoPersonalizado(dataInicio, dataFim);
        const tipoRelatorio = document.getElementById('tipoRelatorio').value;
        carregarDadosRelatorio(tipoRelatorio, 'personalizado');
        
        // Fechar modal
        const modalPeriodoPersonalizado = bootstrap.Modal.getInstance(document.getElementById('modalPeriodoPersonalizado'));
        modalPeriodoPersonalizado.hide();
    });
    
    // Eventos para exportação
    document.getElementById('btnExportarPDF').addEventListener('click', function() {
        exportarRelatorio('pdf');
    });
    
    document.getElementById('btnExportarExcel').addEventListener('click', function() {
        exportarRelatorio('excel');
    });
}

// Função para mostrar filtros específicos para cada tipo de relatório
function mostrarFiltrosEspecificos(tipo) {
    // Ocultar todos os filtros específicos
    document.querySelectorAll('.filtros-dinamicos').forEach(el => {
        el.style.display = 'none';
    });
    
    // Mostrar filtros específicos para o tipo selecionado
    const filtrosEspecificos = document.getElementById(`filtros${tipo.charAt(0).toUpperCase() + tipo.slice(1)}`);
    if (filtrosEspecificos) {
        filtrosEspecificos.style.display = 'flex';
    }
}

// Função para definir período
function definirPeriodo(periodo) {
    let textoPeríodo = '';
    
    switch (periodo) {
        case 'hoje':
            textoPeríodo = 'Hoje';
            break;
        case 'semana':
            textoPeríodo = 'Esta semana';
            break;
        case 'mes':
            textoPeríodo = 'Este mês';
            break;
        case 'trimestre':
            textoPeríodo = 'Último trimestre';
            break;
        case 'ano':
            textoPeríodo = 'Este ano';
            break;
        default:
            textoPeríodo = 'Período personalizado';
    }
    
    document.getElementById('periodoRelatorio').textContent = `Período: ${textoPeríodo}`;
    
    // Salvar período atual no localStorage
    localStorage.setItem('periodoRelatorio', periodo);
}

// Função para definir período personalizado
function definirPeriodoPersonalizado(dataInicio, dataFim) {
    const inicio = new Date(dataInicio);
    const fim = new Date(dataFim);
    
    const formatoData = { day: '2-digit', month: '2-digit', year: 'numeric' };
    const inicioFormatado = inicio.toLocaleDateString('pt-BR', formatoData);
    const fimFormatado = fim.toLocaleDateString('pt-BR', formatoData);
    
    document.getElementById('periodoRelatorio').textContent = `Período: ${inicioFormatado} a ${fimFormatado}`;
    
    // Salvar período personalizado no localStorage
    localStorage.setItem('periodoRelatorio', 'personalizado');
    localStorage.setItem('periodoInicio', dataInicio);
    localStorage.setItem('periodoFim', dataFim);
}

// Função para obter período atual
function obterPeriodoAtual() {
    return localStorage.getItem('periodoRelatorio') || 'mes';
}

// Função para inicializar gráficos
function inicializarGraficos() {
    // Gráfico 1 - Status das Entregas (exemplo)
    const ctx1 = document.getElementById('graficoRelatorio1').getContext('2d');
    new Chart(ctx1, {
        type: 'pie',
        data: {
            labels: ['Aguardando coleta', 'Em trânsito', 'Entregue', 'Devolvido'],
            datasets: [{
                data: [15, 30, 45, 10],
                backgroundColor: [
                    '#ffc107',
                    '#0d6efd',
                    '#198754',
                    '#dc3545'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'bottom',
                },
                title: {
                    display: true,
                    text: 'Status das Entregas'
                }
            }
        }
    });
    
    // Gráfico 2 - Entregas por Dia (exemplo)
    const ctx2 = document.getElementById('graficoRelatorio2').getContext('2d');
    new Chart(ctx2, {
        type: 'bar',
        data: {
            labels: ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'],
            datasets: [{
                label: 'Entregas',
                data: [12, 19, 15, 17, 14, 8, 5],
                backgroundColor: 'rgba(13, 110, 253, 0.5)',
                borderColor: 'rgba(13, 110, 253, 1)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true
                }
            },
            plugins: {
                title: {
                    display: true,
                    text: 'Entregas por Dia'
                }
            }
        }
    });
}

// Função para carregar dados do relatório
function carregarDadosRelatorio(tipo, periodo) {
    // Aqui seria feita uma requisição ao servidor para obter os dados
    // Como estamos usando localStorage, vamos simular dados
    
    // Limpar tabela atual
    const tbody = document.getElementById('dadosRelatorio');
    tbody.innerHTML = '';
    
    // Dados de exemplo para cada tipo de relatório
    let dados = [];
    
    switch (tipo) {
        case 'entregas':
            dados = gerarDadosEntregas(20);
            break;
        case 'veiculos':
            dados = gerarDadosVeiculos(15);
            break;
        case 'rotas':
            dados = gerarDadosRotas(10);
            break;
        case 'motoristas':
            dados = gerarDadosMotoristas(8);
            break;
        case 'financeiro':
            dados = gerarDadosFinanceiros(12);
            break;
        case 'desempenho':
            dados = gerarDadosDesempenho(15);
            break;
    }
    
    // Filtrar dados pelo período
    dados = filtrarDadosPorPeriodo(dados, periodo);
    
    // Atualizar cabeçalho da tabela conforme o tipo de relatório
    atualizarCabecalhoTabela(tipo);
    
    // Preencher tabela com os dados
    preencherTabelaRelatorio(dados, tipo);
    
    // Atualizar resumo
    atualizarResumo(dados, tipo);
    
    // Atualizar gráficos
    atualizarGraficos(dados, tipo);
}

// Função para gerar dados de exemplo para entregas
function gerarDadosEntregas(quantidade) {
    const dados = [];
    const status = ['Aguardando coleta', 'Em trânsito', 'Entregue', 'Devolvido'];
    const origens = ['São Paulo, SP', 'Rio de Janeiro, RJ', 'Belo Horizonte, MG', 'Curitiba, PR', 'Porto Alegre, RS'];
    const destinos = ['Brasília, DF', 'Salvador, BA', 'Fortaleza, CE', 'Recife, PE', 'Manaus, AM'];
    const veiculos = ['ABC1234 - Cargo 2429', 'DEF5678 - Atego 2426', 'GHI9012 - Master', 'JKL4567 - Sprinter'];
    const motoristas = ['João Silva', 'Maria Oliveira', 'Pedro Santos', 'Ana Costa'];
    
    for (let i = 0; i < quantidade; i++) {
        const data = new Date();
        data.setDate(data.getDate() - Math.floor(Math.random() * 30)); // Data aleatória nos últimos 30 dias
        
        dados.push({
            data: data,
            codigo: `ENT${String(Math.floor(Math.random() * 10000)).padStart(5, '0')}`,
            destinatario: `Cliente ${i + 1}`,
            origem: origens[Math.floor(Math.random() * origens.length)],
            destino: destinos[Math.floor(Math.random() * destinos.length)],
            status: status[Math.floor(Math.random() * status.length)],
            veiculo: veiculos[Math.floor(Math.random() * veiculos.length)],
            motorista: motoristas[Math.floor(Math.random() * motoristas.length)],
            valor: Math.floor(Math.random() * 5000) + 500
        });
    }
    
    return dados;
}

// Função para gerar dados de exemplo para veículos
function gerarDadosVeiculos(quantidade) {
    const dados = [];
    const modelos = ['Cargo 2429', 'Atego 2426', 'Master', 'Sprinter', 'Daily 35S14'];
    const marcas = ['Ford', 'Mercedes-Benz', 'Renault', 'Mercedes-Benz', 'Iveco'];
    const status = ['Disponível', 'Em rota', 'Em manutenção', 'Inativo'];
    const tipos = ['Caminhão', 'Caminhão', 'Van', 'Van', 'Van'];
    
    for (let i = 0; i < quantidade; i++) {
        const indiceModelo = Math.floor(Math.random() * modelos.length);
        const data = new Date();
        data.setDate(data.getDate() - Math.floor(Math.random() * 30)); // Data aleatória nos últimos 30 dias
        
        dados.push({
            data: data,
            placa: `${String.fromCharCode(65 + Math.floor(Math.random() * 26))}${String.fromCharCode(65 + Math.floor(Math.random() * 26))}${String.fromCharCode(65 + Math.floor(Math.random() * 26))}${Math.floor(Math.random() * 10)}${Math.floor(Math.random() * 10)}${Math.floor(Math.random() * 10)}${Math.floor(Math.random() * 10)}`,
            modelo: modelos[indiceModelo],
            marca: marcas[indiceModelo],
            tipo: tipos[indiceModelo],
            ano: 2020 + Math.floor(Math.random() * 5),
            status: status[Math.floor(Math.random() * status.length)],
            km: Math.floor(Math.random() * 100000),
            ultimaManutencao: new Date(data.getTime() - Math.floor(Math.random() * 90) * 24 * 60 * 60 * 1000).toLocaleDateString('pt-BR')
        });
    }
    
    return dados;
}

// Função para gerar dados de exemplo para rotas
function gerarDadosRotas(quantidade) {
    const dados = [];
    const origens = ['São Paulo, SP', 'Rio de Janeiro, RJ', 'Belo Horizonte, MG', 'Curitiba, PR', 'Porto Alegre, RS'];
    const destinos = ['Brasília, DF', 'Salvador, BA', 'Fortaleza, CE', 'Recife, PE', 'Manaus, AM'];
    const status = ['Planejada', 'Em andamento', 'Concluída', 'Cancelada'];
    const veiculos = ['ABC1234 - Cargo 2429', 'DEF5678 - Atego 2426', 'GHI9012 - Master', 'JKL4567 - Sprinter'];
    const motoristas = ['João Silva', 'Maria Oliveira', 'Pedro Santos', 'Ana Costa'];
    
    for (let i = 0; i < quantidade; i++) {
        const data = new Date();
        data.setDate(data.getDate() - Math.floor(Math.random() * 30)); // Data aleatória nos últimos 30 dias
        
        dados.push({
            data: data,
            nome: `Rota ${String.fromCharCode(65 + i)}`,
            origem: origens[Math.floor(Math.random() * origens.length)],
            destino: destinos[Math.floor(Math.random() * destinos.length)],
            distancia: Math.floor(Math.random() * 2000) + 100,
            tempo: Math.floor(Math.random() * 48) + 1,
            status: status[Math.floor(Math.random() * status.length)],
            veiculo: veiculos[Math.floor(Math.random() * veiculos.length)],
            motorista: motoristas[Math.floor(Math.random() * motoristas.length)]
        });
    }
    
    return dados;
}

// Função para gerar dados de exemplo para motoristas
function gerarDadosMotoristas(quantidade) {
    const dados = [];
    const nomes = ['João Silva', 'Maria Oliveira', 'Pedro Santos', 'Ana Costa', 'Carlos Ferreira', 'Luiza Souza', 'Fernando Lima', 'Juliana Martins'];
    const status = ['Disponível', 'Em rota', 'Em descanso', 'Férias', 'Afastado'];
    
    for (let i = 0; i < quantidade; i++) {
        const data = new Date();
        data.setDate(data.getDate() - Math.floor(Math.random() * 30)); // Data aleatória nos últimos 30 dias
        
        dados.push({
            data: data,
            nome: nomes[i],
            cnh: `${Math.floor(Math.random() * 10000000000)}`,
            categoria: ['B', 'C', 'D', 'E'][Math.floor(Math.random() * 4)],
            telefone: `(${Math.floor(Math.random() * 90) + 10}) ${Math.floor(Math.random() * 90000) + 10000}-${Math.floor(Math.random() * 9000) + 1000}`,
            status: status[Math.floor(Math.random() * status.length)],
            rotaAtual: Math.random() > 0.5 ? `Rota ${String.fromCharCode(65 + Math.floor(Math.random() * 10))}` : '-',
            entregas: Math.floor(Math.random() * 100),
            avaliacao: (Math.random() * 2 + 3).toFixed(1)
        });
    }
    
    return dados;
}

// Função para gerar dados de exemplo para financeiro
function gerarDadosFinanceiros(quantidade) {
    const dados = [];
    const tipos = ['Receita', 'Despesa'];
    const categorias = ['Frete', 'Combustível', 'Manutenção', 'Salários', 'Impostos', 'Seguro', 'Outros'];
    
    for (let i = 0; i < quantidade; i++) {
        const data = new Date();
        data.setDate(data.getDate() - Math.floor(Math.random() * 30)); // Data aleatória nos últimos 30 dias
        const tipo = tipos[Math.floor(Math.random() * tipos.length)];
        
        dados.push({
            data: data,
            tipo: tipo,
            categoria: tipo === 'Receita' ? 'Frete' : categorias[Math.floor(Math.random() * categorias.length)],
            descricao: `${tipo} - ${i + 1}`,
            valor: Math.floor(Math.random() * 10000) + 100,
            status: ['Pendente', 'Pago', 'Atrasado'][Math.floor(Math.random() * 3)]
        });
    }
    
    return dados;
}

// Função para gerar dados de exemplo para desempenho
function gerarDadosDesempenho(quantidade) {
    const dados = [];
    const metricas = ['Entregas no prazo', 'Entregas atrasadas', 'Consumo de combustível', 'Tempo médio de entrega', 'Satisfação do cliente'];
    
    for (let i = 0; i < quantidade; i++) {
        const data = new Date();
        data.setDate(data.getDate() - Math.floor(Math.random() * 30)); // Data aleatória nos últimos 30 dias
        
        dados.push({
            data: data,
            metrica: metricas[i % metricas.length],
            valor: Math.floor(Math.random() * 100),
            meta: Math.floor(Math.random() * 100) + 50,
            variacao: Math.floor(Math.random() * 20) - 10,
            status: ['Abaixo da meta', 'Na meta', 'Acima da meta'][Math.floor(Math.random() * 3)]
        });
    }
    
    return dados;
}

// Função para filtrar dados por período
function filtrarDadosPorPeriodo(dados, periodo) {
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    
    const inicioSemana = new Date(hoje);
    inicioSemana.setDate(hoje.getDate() - hoje.getDay());
    
    const inicioMes = new Date(hoje.getFullYear(), hoje.getMonth(), 1);
    
    const inicioTrimestre = new Date(hoje);
    inicioTrimestre.setMonth(Math.floor(hoje.getMonth() / 3) * 3);
    inicioTrimestre.setDate(1);
    
    const inicioAno = new Date(hoje.getFullYear(), 0, 1);
    
    let dataInicio, dataFim;
    
    switch (periodo) {
        case 'hoje':
            dataInicio = hoje;
            dataFim = new Date(hoje);
            dataFim.setHours(23, 59, 59, 999);
            break;
        case 'semana':
            dataInicio = inicioSemana;
            dataFim = new Date(hoje);
            dataFim.setHours(23, 59, 59, 999);
            break;
        case 'mes':
            dataInicio = inicioMes;
            dataFim = new Date(hoje);
            dataFim.setHours(23, 59, 59, 999);
            break;
        case 'trimestre':
            dataInicio = inicioTrimestre;
            dataFim = new Date(hoje);
            dataFim.setHours(23, 59, 59, 999);
            break;
        case 'ano':
            dataInicio = inicioAno;
            dataFim = new Date(hoje);
            dataFim.setHours(23, 59, 59, 999);
            break;
        case 'personalizado':
            dataInicio = new Date(localStorage.getItem('periodoInicio'));
            dataFim = new Date(localStorage.getItem('periodoFim'));
            dataFim.setHours(23, 59, 59, 999);
            break;
        default:
            return dados;
    }
    
    return dados.filter(item => {
        const dataItem = new Date(item.data);
        return dataItem >= dataInicio && dataItem <= dataFim;
    });
}

// Função para atualizar cabeçalho da tabela conforme o tipo de relatório
function atualizarCabecalhoTabela(tipo) {
    const thead = document.querySelector('#areaTabelaRelatorio table thead tr');
    thead.innerHTML = '';
    
    // Colunas comuns
    thead.appendChild(criarElementoTh('Data'));
    
    // Colunas específicas por tipo
    switch (tipo) {
        case 'entregas':
            thead.appendChild(criarElementoTh('Código'));
            thead.appendChild(criarElementoTh('Destinatário'));
            thead.appendChild(criarElementoTh('Origem'));
            thead.appendChild(criarElementoTh('Destino'));
            thead.appendChild(criarElementoTh('Status'));
            thead.appendChild(criarElementoTh('Veículo'));
            thead.appendChild(criarElementoTh('Motorista'));
            break;
        case 'veiculos':
            thead.appendChild(criarElementoTh('Placa'));
            thead.appendChild(criarElementoTh('Modelo'));
            thead.appendChild(criarElementoTh('Marca'));
            thead.appendChild(criarElementoTh('Tipo'));
            thead.appendChild(criarElementoTh('Ano'));
            thead.appendChild(criarElementoTh('Status'));
            thead.appendChild(criarElementoTh('KM'));
            break;
        case 'rotas':
            thead.appendChild(criarElementoTh('Nome'));
            thead.appendChild(criarElementoTh('Origem'));
            thead.appendChild(criarElementoTh('Destino'));
            thead.appendChild(criarElementoTh('Distância (km)'));
            thead.appendChild(criarElementoTh('Tempo (h)'));
            thead.appendChild(criarElementoTh('Status'));
            thead.appendChild(criarElementoTh('Veículo'));
            break;
        case 'motoristas':
            thead.appendChild(criarElementoTh('Nome'));
            thead.appendChild(criarElementoTh('CNH'));
            thead.appendChild(criarElementoTh('Categoria'));
            thead.appendChild(criarElementoTh('Telefone'));
            thead.appendChild(criarElementoTh('Status'));
            thead.appendChild(criarElementoTh('Rota Atual'));
            thead.appendChild(criarElementoTh('Avaliação'));
            break;
        case 'financeiro':
            thead.appendChild(criarElementoTh('Tipo'));
            thead.appendChild(criarElementoTh('Categoria'));
            thead.appendChild(criarElementoTh('Descrição'));
            thead.appendChild(criarElementoTh('Valor'));
            thead.appendChild(criarElementoTh('Status'));
            break;
        case 'desempenho':
            thead.appendChild(criarElementoTh('Métrica'));
            thead.appendChild(criarElementoTh('Valor'));
            thead.appendChild(criarElementoTh('Meta'));
            thead.appendChild(criarElementoTh('Variação'));
            thead.appendChild(criarElementoTh('Status'));
            break;
    }
}

// Função auxiliar para criar elemento th
function criarElementoTh(texto) {
    const th = document.createElement('th');
    th.textContent = texto;
    return th;
}

// Função para preencher tabela de relatório
function preencherTabelaRelatorio(dados, tipo) {
    const tbody = document.getElementById('dadosRelatorio');
    tbody.innerHTML = '';
    
    dados.forEach(item => {
        const tr = document.createElement('tr');
        
        // Coluna de data
        const tdData = document.createElement('td');
        tdData.textContent = item.data.toLocaleDateString('pt-BR');
        tr.appendChild(tdData);
        
        // Colunas específicas por tipo
        switch (tipo) {
            case 'entregas':
                tr.appendChild(criarElementoTd(item.codigo));
                tr.appendChild(criarElementoTd(item.destinatario));
                tr.appendChild(criarElementoTd(item.origem));
                tr.appendChild(criarElementoTd(item.destino));
                tr.appendChild(criarElementoTdStatus(item.status));
                tr.appendChild(criarElementoTd(item.veiculo));
                tr.appendChild(criarElementoTd(item.motorista));
                break;
            case 'veiculos':
                tr.appendChild(criarElementoTd(item.placa));
                tr.appendChild(criarElementoTd(item.modelo));
                tr.appendChild(criarElementoTd(item.marca));
                tr.appendChild(criarElementoTd(item.tipo));
                tr.appendChild(criarElementoTd(item.ano));
                tr.appendChild(criarElementoTdStatus(item.status));
                tr.appendChild(criarElementoTd(`${item.km.toLocaleString('pt-BR')} km`));
                break;
            case 'rotas':
                tr.appendChild(criarElementoTd(item.nome));
                tr.appendChild(criarElementoTd(item.origem));
                tr.appendChild(criarElementoTd(item.destino));
                tr.appendChild(criarElementoTd(item.distancia));
                tr.appendChild(criarElementoTd(item.tempo));
                tr.appendChild(criarElementoTdStatus(item.status));
                tr.appendChild(criarElementoTd(item.veiculo));
                break;
            case 'motoristas':
                tr.appendChild(criarElementoTd(item.nome));
                tr.appendChild(criarElementoTd(item.cnh));
                tr.appendChild(criarElementoTd(item.categoria));
                tr.appendChild(criarElementoTd(item.telefone));
                tr.appendChild(criarElementoTdStatus(item.status));
                tr.appendChild(criarElementoTd(item.rotaAtual));
                tr.appendChild(criarElementoTd(item.avaliacao));
                break;
            case 'financeiro':
                tr.appendChild(criarElementoTd(item.tipo));
                tr.appendChild(criarElementoTd(item.categoria));
                tr.appendChild(criarElementoTd(item.descricao));
                tr.appendChild(criarElementoTd(`R$ ${item.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`));
                tr.appendChild(criarElementoTdStatus(item.status));
                break;
            case 'desempenho':
                tr.appendChild(criarElementoTd(item.metrica));
                tr.appendChild(criarElementoTd(item.valor));
                tr.appendChild(criarElementoTd(item.meta));
                tr.appendChild(criarElementoTdVariacao(item.variacao));
                tr.appendChild(criarElementoTdStatus(item.status));
                break;
        }
        
        tbody.appendChild(tr);
    });
}

// Função auxiliar para criar elemento td
function criarElementoTd(texto) {
    const td = document.createElement('td');
    td.textContent = texto;
    return td;
}

// Função auxiliar para criar elemento td com status
function criarElementoTdStatus(status) {
    const td = document.createElement('td');
    const span = document.createElement('span');
    span.textContent = status;
    span.classList.add('badge');
    
    // Definir cor do badge conforme o status
    switch (status) {
        case 'Aguardando coleta':
        case 'Planejada':
        case 'Pendente':
            span.classList.add('bg-warning', 'text-dark');
            break;
        case 'Em trânsito':
        case 'Em andamento':
        case 'Em rota':
        case 'Na meta':
            span.classList.add('bg-primary');
            break;
        case 'Entregue':
        case 'Concluída':
        case 'Disponível':
        case 'Pago':
        case 'Acima da meta':
            span.classList.add('bg-success');
            break;
        case 'Devolvido':
        case 'Cancelada':
        case 'Em manutenção':
        case 'Inativo':
        case 'Afastado':
        case 'Atrasado':
        case 'Abaixo da meta':
            span.classList.add('bg-danger');
            break;
        case 'Em descanso':
        case 'Férias':
            span.classList.add('bg-info');
            break;
        default:
            span.classList.add('bg-secondary');
    }
    
    td.appendChild(span);
    return td;
}

// Função auxiliar para criar elemento td com variação
function criarElementoTdVariacao(variacao) {
    const td = document.createElement('td');
    
    if (variacao > 0) {
        td.innerHTML = `<span class="text-success">+${variacao}% <i class="fas fa-arrow-up"></i></span>`;
    } else if (variacao < 0) {
        td.innerHTML = `<span class="text-danger">${variacao}% <i class="fas fa-arrow-down"></i></span>`;
    } else {
        td.innerHTML = `<span class="text-secondary">${variacao}% <i class="fas fa-equals"></i></span>`;
    }
    
    return td;
}

// Função para atualizar resumo
function atualizarResumo(dados, tipo) {
    document.getElementById('totalRegistros').textContent = dados.length;
    
    // Calcular média por dia
    const diasUnicos = new Set(dados.map(item => item.data.toLocaleDateString('pt-BR'))).size;
    const mediaDia = diasUnicos > 0 ? (dados.length / diasUnicos).toFixed(1) : '0';
    document.getElementById('mediaDia').textContent = mediaDia;
    
    // Calcular valor total
    let valorTotal = 0;
    let taxaSucesso = 0;
    
    switch (tipo) {
        case 'entregas':
            valorTotal = dados.reduce((total, item) => total + item.valor, 0);
            const entregasSucesso = dados.filter(item => item.status === 'Entregue').length;
            taxaSucesso = dados.length > 0 ? ((entregasSucesso / dados.length) * 100).toFixed(1) : '0';
            break;
        case 'veiculos':
            valorTotal = dados.reduce((total, item) => total + (item.km || 0), 0);
            const veiculosDisponiveis = dados.filter(item => item.status === 'Disponível').length;
            taxaSucesso = dados.length > 0 ? ((veiculosDisponiveis / dados.length) * 100).toFixed(1) : '0';
            break;
        case 'rotas':
            valorTotal = dados.reduce((total, item) => total + item.distancia, 0);
            const rotasConcluidas = dados.filter(item => item.status === 'Concluída').length;
            taxaSucesso = dados.length > 0 ? ((rotasConcluidas / dados.length) * 100).toFixed(1) : '0';
            break;
        case 'motoristas':
            valorTotal = dados.reduce((total, item) => total + (item.entregas || 0), 0);
            const motoristasDisponiveis = dados.filter(item => item.status === 'Disponível').length;
            taxaSucesso = dados.length > 0 ? ((motoristasDisponiveis / dados.length) * 100).toFixed(1) : '0';
            break;
        case 'financeiro':
            const receitas = dados.filter(item => item.tipo === 'Receita').reduce((total, item) => total + item.valor, 0);
            const despesas = dados.filter(item => item.tipo === 'Despesa').reduce((total, item) => total + item.valor, 0);
            valorTotal = receitas - despesas;
            const pagos = dados.filter(item => item.status === 'Pago').length;
            taxaSucesso = dados.length > 0 ? ((pagos / dados.length) * 100).toFixed(1) : '0';
            break;
        case 'desempenho':
            valorTotal = dados.reduce((total, item) => total + item.valor, 0);
            const acimaMedia = dados.filter(item => item.status === 'Acima da meta').length;
            taxaSucesso = dados.length > 0 ? ((acimaMedia / dados.length) * 100).toFixed(1) : '0';
            break;
    }
    
    // Formatar valor total conforme o tipo
    if (tipo === 'financeiro') {
        document.getElementById('valorTotal').textContent = `R$ ${valorTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
    } else if (tipo === 'veiculos') {
        document.getElementById('valorTotal').textContent = `${valorTotal.toLocaleString('pt-BR')} km`;
    } else if (tipo === 'rotas') {
        document.getElementById('valorTotal').textContent = `${valorTotal.toLocaleString('pt-BR')} km`;
    } else {
        document.getElementById('valorTotal').textContent = valorTotal.toLocaleString('pt-BR');
    }
    
    document.getElementById('taxaSucesso').textContent = `${taxaSucesso}%`;
}

// Função para atualizar gráficos
function atualizarGraficos(dados, tipo) {
    // Aqui seria feita a atualização dos gráficos com os dados filtrados
    // Como exemplo, vamos apenas simular a atualização
    
    // Obter gráficos existentes
    const charts = Chart.getChart('graficoRelatorio1');
    const charts2 = Chart.getChart('graficoRelatorio2');
    
    // Destruir gráficos existentes
    if (charts) charts.destroy();
    if (charts2) charts2.destroy();
    
    // Criar novos gráficos com base no tipo
    switch (tipo) {
        case 'entregas':
            criarGraficoEntregas(dados);
            break;
        case 'veiculos':
            criarGraficoVeiculos(dados);
            break;
        case 'rotas':
            criarGraficoRotas(dados);
            break;
        case 'motoristas':
            criarGraficoMotoristas(dados);
            break;
        case 'financeiro':
            criarGraficoFinanceiro(dados);
            break;
        case 'desempenho':
            criarGraficoDesempenho(dados);
            break;
    }
}

// Função para criar gráfico de entregas
function criarGraficoEntregas(dados) {
    // Gráfico 1 - Status das Entregas
    const statusCount = {};
    dados.forEach(item => {
        statusCount[item.status] = (statusCount[item.status] || 0) + 1;
    });
    
    const ctx1 = document.getElementById('graficoRelatorio1').getContext('2d');
    new Chart(ctx1, {
        type: 'pie',
        data: {
            labels: Object.keys(statusCount),
            datasets: [{
                data: Object.values(statusCount),
                backgroundColor: [
                    '#ffc107',
                    '#0d6efd',
                    '#198754',
                    '#dc3545'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'bottom',
                },
                title: {
                    display: true,
                    text: 'Status das Entregas'
                }
            }
        }
    });
    
    // Gráfico 2 - Entregas por Dia
    const entregasPorDia = {};
    dados.forEach(item => {
        const dia = item.data.toLocaleDateString('pt-BR');
        entregasPorDia[dia] = (entregasPorDia[dia] || 0) + 1;
    });
    
    const diasOrdenados = Object.keys(entregasPorDia).sort((a, b) => {
        const [diaA, mesA, anoA] = a.split('/').map(Number);
        const [diaB, mesB, anoB] = b.split('/').map(Number);
        return new Date(anoA, mesA - 1, diaA) - new Date(anoB, mesB - 1, diaB);
    });
    
    const ctx2 = document.getElementById('graficoRelatorio2').getContext('2d');
    new Chart(ctx2, {
        type: 'bar',
        data: {
            labels: diasOrdenados,
            datasets: [{
                label: 'Entregas',
                data: diasOrdenados.map(dia => entregasPorDia[dia]),
                backgroundColor: 'rgba(13, 110, 253, 0.5)',
                borderColor: 'rgba(13, 110, 253, 1)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true
                }
            },
            plugins: {
                title: {
                    display: true,
                    text: 'Entregas por Dia'
                }
            }
        }
    });
}

// Função para criar gráfico de veículos
function criarGraficoVeiculos(dados) {
    // Gráfico 1 - Status dos Veículos
    const statusCount = {};
    dados.forEach(item => {
        statusCount[item.status] = (statusCount[item.status] || 0) + 1;
    });
    
    const ctx1 = document.getElementById('graficoRelatorio1').getContext('2d');
    new Chart(ctx1, {
        type: 'pie',
        data: {
            labels: Object.keys(statusCount),
            datasets: [{
                data: Object.values(statusCount),
                backgroundColor: [
                    '#198754',
                    '#0d6efd',
                    '#dc3545',
                    '#6c757d'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'bottom',
                },
                title: {
                    display: true,
                    text: 'Status dos Veículos'
                }
            }
        }
    });
    
    // Gráfico 2 - Veículos por Tipo
    const tipoCount = {};
    dados.forEach(item => {
        tipoCount[item.tipo] = (tipoCount[item.tipo] || 0) + 1;
    });
    
    const ctx2 = document.getElementById('graficoRelatorio2').getContext('2d');
    new Chart(ctx2, {
        type: 'bar',
        data: {
            labels: Object.keys(tipoCount),
            datasets: [{
                label: 'Quantidade',
                data: Object.values(tipoCount),
                backgroundColor: 'rgba(25, 135, 84, 0.5)',
                borderColor: 'rgba(25, 135, 84, 1)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true
                }
            },
            plugins: {
                title: {
                    display: true,
                    text: 'Veículos por Tipo'
                }
            }
        }
    });
}

// Função para criar gráfico de rotas
function criarGraficoRotas(dados) {
    // Gráfico 1 - Status das Rotas
    const statusCount = {};
    dados.forEach(item => {
        statusCount[item.status] = (statusCount[item.status] || 0) + 1;
    });
    
    const ctx1 = document.getElementById('graficoRelatorio1').getContext('2d');
    new Chart(ctx1, {
        type: 'pie',
        data: {
            labels: Object.keys(statusCount),
            datasets: [{
                data: Object.values(statusCount),
                backgroundColor: [
                    '#ffc107',
                    '#0d6efd',
                    '#198754',
                    '#dc3545'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'bottom',
                },
                title: {
                    display: true,
                    text: 'Status das Rotas'
                }
            }
        }
    });
    
    // Gráfico 2 - Distância por Rota
    const ctx2 = document.getElementById('graficoRelatorio2').getContext('2d');
    new Chart(ctx2, {
        type: 'bar',
        data: {
            labels: dados.map(item => item.nome),
            datasets: [{
                label: 'Distância (km)',
                data: dados.map(item => item.distancia),
                backgroundColor: 'rgba(13, 110, 253, 0.5)',
                borderColor: 'rgba(13, 110, 253, 1)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true
                }
            },
            plugins: {
                title: {
                    display: true,
                    text: 'Distância por Rota'
                }
            }
        }
    });
}

// Função para criar gráfico de motoristas
function criarGraficoMotoristas(dados) {
    // Gráfico 1 - Status dos Motoristas
    const statusCount = {};
    dados.forEach(item => {
        statusCount[item.status] = (statusCount[item.status] || 0) + 1;
    });
    
    const ctx1 = document.getElementById('graficoRelatorio1').getContext('2d');
    new Chart(ctx1, {
        type: 'pie',
        data: {
            labels: Object.keys(statusCount),
            datasets: [{
                data: Object.values(statusCount),
                backgroundColor: [
                    '#198754',
                    '#0d6efd',
                    '#0dcaf0',
                    '#ffc107',
                    '#dc3545'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'bottom',
                },
                title: {
                    display: true,
                    text: 'Status dos Motoristas'
                }
            }
        }
    });
    
    // Gráfico 2 - Avaliação dos Motoristas
    const ctx2 = document.getElementById('graficoRelatorio2').getContext('2d');
    new Chart(ctx2, {
        type: 'bar',
        data: {
            labels: dados.map(item => item.nome),
            datasets: [{
                label: 'Avaliação',
                data: dados.map(item => item.avaliacao),
                backgroundColor: 'rgba(13, 202, 240, 0.5)',
                borderColor: 'rgba(13, 202, 240, 1)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true,
                    max: 5
                }
            },
            plugins: {
                title: {
                    display: true,
                    text: 'Avaliação dos Motoristas'
                }
            }
        }
    });
}

// Função para criar gráfico financeiro
function criarGraficoFinanceiro(dados) {
    // Gráfico 1 - Receitas vs Despesas
    const receitas = dados.filter(item => item.tipo === 'Receita').reduce((total, item) => total + item.valor, 0);
    const despesas = dados.filter(item => item.tipo === 'Despesa').reduce((total, item) => total + item.valor, 0);
    
    const ctx1 = document.getElementById('graficoRelatorio1').getContext('2d');
    new Chart(ctx1, {
        type: 'pie',
        data: {
            labels: ['Receitas', 'Despesas'],
            datasets: [{
                data: [receitas, despesas],
                backgroundColor: [
                    '#198754',
                    '#dc3545'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'bottom',
                },
                title: {
                    display: true,
                    text: 'Receitas vs Despesas'
                }
            }
        }
    });
    
    // Gráfico 2 - Despesas por Categoria
    const despesasPorCategoria = {};
    dados.filter(item => item.tipo === 'Despesa').forEach(item => {
        despesasPorCategoria[item.categoria] = (despesasPorCategoria[item.categoria] || 0) + item.valor;
    });
    
    const ctx2 = document.getElementById('graficoRelatorio2').getContext('2d');
    new Chart(ctx2, {
        type: 'bar',
        data: {
            labels: Object.keys(despesasPorCategoria),
            datasets: [{
                label: 'Valor (R$)',
                data: Object.values(despesasPorCategoria),
                backgroundColor: 'rgba(220, 53, 69, 0.5)',
                borderColor: 'rgba(220, 53, 69, 1)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true
                }
            },
            plugins: {
                title: {
                    display: true,
                    text: 'Despesas por Categoria'
                }
            }
        }
    });
}

// Função para criar gráfico de desempenho
function criarGraficoDesempenho(dados) {
    // Gráfico 1 - Valor vs Meta
    const ctx1 = document.getElementById('graficoRelatorio1').getContext('2d');
    new Chart(ctx1, {
        type: 'bar',
        data: {
            labels: dados.map(item => item.metrica),
            datasets: [
                {
                    label: 'Valor Atual',
                    data: dados.map(item => item.valor),
                    backgroundColor: 'rgba(13, 110, 253, 0.5)',
                    borderColor: 'rgba(13, 110, 253, 1)',
                    borderWidth: 1
                },
                {
                    label: 'Meta',
                    data: dados.map(item => item.meta),
                    backgroundColor: 'rgba(108, 117, 125, 0.5)',
                    borderColor: 'rgba(108, 117, 125, 1)',
                    borderWidth: 1,
                    type: 'line'
                }
            ]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true
                }
            },
            plugins: {
                title: {
                    display: true,
                    text: 'Valor vs Meta'
                }
            }
        }
    });
    
    // Gráfico 2 - Status de Desempenho
    const statusCount = {};
    dados.forEach(item => {
        statusCount[item.status] = (statusCount[item.status] || 0) + 1;
    });
    
    const ctx2 = document.getElementById('graficoRelatorio2').getContext('2d');
    new Chart(ctx2, {
        type: 'pie',
        data: {
            labels: Object.keys(statusCount),
            datasets: [{
                data: Object.values(statusCount),
                backgroundColor: [
                    '#dc3545',
                    '#ffc107',
                    '#198754'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'bottom',
                },
                title: {
                    display: true,
                    text: 'Status de Desempenho'
                }
            }
        }
    });
}

// Função para exportar relatório
function exportarRelatorio(formato) {
    // Aqui seria implementada a exportação real
    // Como exemplo, vamos apenas simular a exportação
    
    const tipoRelatorio = document.getElementById('tipoRelatorio').value;
    const periodoTexto = document.getElementById('periodoRelatorio').textContent;
    
    mostrarNotificacao(`Exportando relatório de ${tipoRelatorio} (${periodoTexto}) em formato ${formato.toUpperCase()}...`, 'info');
    
    // Simular processamento
    setTimeout(() => {
        mostrarNotificacao(`Relatório de ${tipoRelatorio} exportado com sucesso!`, 'success');
    }, 1500);
}
