'use strict';

/* =========================================================
   1. CONFIGURAÇÃO COMERCIAL CENTRAL
   ---------------------------------------------------------
   Todo valor que a empresa provavelmente precisará ajustar fica
   concentrado neste objeto. Quando os preços reais forem definidos,
   altere SOMENTE esta área para atualizar a simulação do site.

   IMPORTANTE:
   - os preços abaixo são referências temporárias de desenvolvimento;
   - não representam tabela oficial da empresa;
   - o site sempre informa que o resultado é uma estimativa.
   ========================================================= */
const CONFIGURACAO_COMERCIAL = {
    /* Número do WhatsApp somente com DDI + DDD + número, sem símbolos. */
    whatsappNumero: '',

    /* Valores de deslocamento usados na composição do orçamento. */
    deslocamento: {
        local: 0,
        ate30: 80,
        '31a60': 160,
        '61a100': 280,
        avaliar: 0
    },

    /* Fator aplicado sobre a mensalidade-base conforme o período. */
    fatoresPeriodo: [
        { ateDias: 3, fator: 0.45 },
        { ateDias: 7, fator: 0.60 },
        { ateDias: 15, fator: 0.80 },
        { ateDias: 30, fator: 1.00 }
    ],

    /* Para períodos acima de 30 dias o valor mensal recebe desconto progressivo. */
    descontoPeriodoLongo: {
        ate60Dias: 0.10,
        acima60Dias: 0.18
    },

    /* Faixas de desconto automático conforme a quantidade de equipamentos. */
    descontosQuantidade: [
        { minimo: 6, percentual: 0.12 },
        { minimo: 4, percentual: 0.08 },
        { minimo: 2, percentual: 0.05 },
        { minimo: 1, percentual: 0 }
    ]
};

/* =========================================================
   2. CATÁLOGO E PREÇOS-BASE
   ---------------------------------------------------------
   Cada item contém capacidade, tipo, foto comercial de referência,
   mensalidade-base de teste e custos estimados de instalação/retirada.
   ========================================================= */
const catalogoEquipamentos = [
    {
        id: 'split-9000', tipo: 'Split Hi Wall', capacidade: 9000,
        titulo: 'Split 9.000 BTU/h',
        aplicacao: 'Quartos, salas compactas e pequenos escritórios.',
        mensalidadeBase: 149, instalacao: 320, retirada: 100,
        imagem: 'https://mideabr.vtexassets.com/arquivos/ids/173498-1440-auto/01-ar-condicionado-midea-ai-ecomaster-38EZVCA12M5-packshot.webp?quality=9&v=638829347183700000',
        fonteImagem: 'Midea - imagem comercial de referência'
    },
    {
        id: 'split-12000', tipo: 'Split Hi Wall', capacidade: 12000,
        titulo: 'Split 12.000 BTU/h',
        aplicacao: 'Salas, escritórios e ambientes residenciais de porte pequeno a médio.',
        mensalidadeBase: 190, instalacao: 350, retirada: 100,
        imagem: 'https://mideabr.vtexassets.com/arquivos/ids/173498-1440-auto/01-ar-condicionado-midea-ai-ecomaster-38EZVCA12M5-packshot.webp?quality=9&v=638829347183700000',
        fonteImagem: 'Midea - imagem comercial de referência'
    },
    {
        id: 'split-18000', tipo: 'Split Hi Wall', capacidade: 18000,
        titulo: 'Split 18.000 BTU/h',
        aplicacao: 'Salas maiores, lojas pequenas e escritórios com maior ocupação.',
        mensalidadeBase: 280, instalacao: 420, retirada: 120,
        imagem: 'https://mideabr.vtexassets.com/arquivos/ids/173498-1440-auto/01-ar-condicionado-midea-ai-ecomaster-38EZVCA12M5-packshot.webp?quality=9&v=638829347183700000',
        fonteImagem: 'Midea - imagem comercial de referência'
    },
    {
        id: 'split-24000', tipo: 'Split Hi Wall', capacidade: 24000,
        titulo: 'Split 24.000 BTU/h',
        aplicacao: 'Ambientes médios, comércios e salas com carga térmica mais elevada.',
        mensalidadeBase: 390, instalacao: 480, retirada: 140,
        imagem: 'https://mideabr.vtexassets.com/arquivos/ids/173498-1440-auto/01-ar-condicionado-midea-ai-ecomaster-38EZVCA12M5-packshot.webp?quality=9&v=638829347183700000',
        fonteImagem: 'Midea - imagem comercial de referência'
    },
    {
        id: 'portatil-12000', tipo: 'Portátil', capacidade: 12000,
        titulo: 'Portátil 12.000 BTU/h',
        aplicacao: 'Demandas temporárias, apoio emergencial e locais sem instalação fixa.',
        mensalidadeBase: 239, instalacao: 80, retirada: 50,
        imagem: 'https://philco.vtexassets.com/arquivos/ids/281007-800-800?aspect=true&height=800&v=639100443148530000&width=800',
        fonteImagem: 'Philco - imagem comercial de referência'
    },
    {
        id: 'piso-teto-36000', tipo: 'Piso-Teto', capacidade: 36000,
        titulo: 'Piso-Teto 36.000 BTU/h',
        aplicacao: 'Lojas, restaurantes, salões e ambientes comerciais amplos.',
        mensalidadeBase: 690, instalacao: 650, retirada: 200,
        imagem: 'https://mideabr.vtexassets.com/arquivos/ids/175116-1440-auto/1.-Capa---com-selo.webp?quality=9&v=638906874090730000',
        fonteImagem: 'Midea - imagem comercial de referência'
    },
    {
        id: 'piso-teto-60000', tipo: 'Piso-Teto', capacidade: 60000,
        titulo: 'Piso-Teto 60.000 BTU/h',
        aplicacao: 'Grandes espaços comerciais, auditórios e áreas com alta circulação.',
        mensalidadeBase: 950, instalacao: 850, retirada: 260,
        imagem: 'https://mideabr.vtexassets.com/arquivos/ids/175116-1440-auto/1.-Capa---com-selo.webp?quality=9&v=638906874090730000',
        fonteImagem: 'Midea - imagem comercial de referência'
    },
    {
        id: 'cassete-36000', tipo: 'Cassete', capacidade: 36000,
        titulo: 'Cassete 36.000 BTU/h',
        aplicacao: 'Escritórios, lojas e ambientes com forro e distribuição de ar em várias direções.',
        mensalidadeBase: 790, instalacao: 800, retirada: 250,
        imagem: 'https://mideabr.vtexassets.com/arquivos/ids/171962-1440-auto/00_Cassete-4vias_38CQVE60515MC_Frente_kit.webp?quality=9&v=638785947667030000',
        fonteImagem: 'Carrier/Midea - imagem comercial de referência'
    }
];

/* =========================================================
   3. REFERÊNCIAS DO DOM
   ========================================================= */
const header = document.querySelector('[data-header]');
const menuToggle = document.querySelector('[data-menu-toggle]');
const navigation = document.querySelector('[data-navigation]');
const catalogContainer = document.querySelector('[data-catalog]');
const calculatorForm = document.querySelector('[data-calculator-form]');
const calculatorResult = document.querySelector('[data-calculator-result]');
const resultRecommendation = document.querySelector('[data-result-recommendation]');
const resultArea = document.querySelector('[data-result-area]');
const resultLoad = document.querySelector('[data-result-load]');
const resultSolution = document.querySelector('[data-result-solution]');
const sendToQuoteButton = document.querySelector('[data-send-to-quote]');
const recalculateButton = document.querySelector('[data-recalculate]');
const quoteForm = document.querySelector('[data-quote-form]');
const quoteEquipment = document.querySelector('[data-quote-equipment]');
const quoteEnvironment = document.querySelector('[data-quote-environment]');
const quoteSummary = document.querySelector('[data-quote-summary]');
const quoteTotal = document.querySelector('[data-quote-total]');
const quoteBreakdown = document.querySelector('[data-quote-breakdown]');
const formFeedback = document.querySelector('[data-form-feedback]');
const phoneInput = document.querySelector('#telefone');
const currentYear = document.querySelector('[data-current-year]');
let ultimoCalculo = null;

/* =========================================================
   4. FUNÇÕES DE FORMATAÇÃO E NAVEGAÇÃO
   ========================================================= */
function formatarNumero(valor) {
    return new Intl.NumberFormat('pt-BR', { maximumFractionDigits: 0 }).format(valor);
}

function formatarMoeda(valor) {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor);
}

function formatarMedida(valor) {
    return new Intl.NumberFormat('pt-BR', { minimumFractionDigits: 0, maximumFractionDigits: 2 }).format(valor);
}

function irParaOrcamento() {
    document.querySelector('#orcamento')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function encontrarEquipamentoPorId(id) {
    return catalogoEquipamentos.find((equipamento) => equipamento.id === id) || null;
}

/* =========================================================
   5. RENDERIZAÇÃO DO CATÁLOGO
   ========================================================= */
function renderizarCatalogo() {
    if (!catalogContainer) return;

    catalogContainer.innerHTML = catalogoEquipamentos.map((equipamento) => `
        <article class="product-card">
            <div class="product-visual">
                <img src="${equipamento.imagem}" alt="${equipamento.titulo} em imagem comercial de referência" loading="lazy">
                <span class="product-type">${equipamento.tipo}</span>
            </div>
            <div class="product-body">
                <span class="product-tag">${equipamento.fonteImagem}</span>
                <h3>${equipamento.titulo}</h3>
                <p>${equipamento.aplicacao}</p>
                <div class="product-specs">
                    <span><strong>${formatarNumero(equipamento.capacidade)}</strong> BTU/h</span>
                    <span>A partir de <strong>${formatarMoeda(equipamento.mensalidadeBase)}</strong> / base mensal*</span>
                </div>
                <button class="button button-full" type="button" data-product-quote data-product-id="${equipamento.id}">Simular locação</button>
            </div>
        </article>
    `).join('');

    catalogContainer.querySelectorAll('[data-product-quote]').forEach((button) => {
        button.addEventListener('click', () => {
            const productId = button.dataset.productId;
            if (quoteEquipment && encontrarEquipamentoPorId(productId)) {
                quoteEquipment.value = productId;
                ultimoCalculo = null;
                if (quoteSummary) quoteSummary.value = '';
                atualizarOrcamento();
                irParaOrcamento();
            }
        });
    });
}

/* =========================================================
   6. OPÇÕES DO SELECT DE ORÇAMENTO
   ========================================================= */
function preencherOpcoesDeEquipamento() {
    if (!quoteEquipment) return;
    const opcoes = catalogoEquipamentos.map((equipamento) =>
        `<option value="${equipamento.id}">${equipamento.titulo} — ${equipamento.tipo}</option>`
    ).join('');
    quoteEquipment.innerHTML = `<option value="">Selecione um equipamento</option>${opcoes}`;
}

/* =========================================================
   7. CÁLCULO DE CARGA TÉRMICA SIMPLIFICADO
   Regras: área, insolação, altura, pessoas, eletrônicos e aberturas.
   Não substitui cálculo técnico de carga térmica.
   ========================================================= */
function calcularCargaTermica({ largura, comprimento, peDireito, pessoas, eletronicos, aberturas, sol }) {
    const area = largura * comprimento;
    const fatoresSol = { baixo: 550, normal: 600, forte: 800 };
    const fatorMetroQuadrado = fatoresSol[sol] || fatoresSol.normal;
    const fatorAltura = Math.max(1, peDireito / 2.7);
    const cargaBase = area * fatorMetroQuadrado * fatorAltura;
    const cargaPessoas = Math.max(0, pessoas - 1) * 600;
    const cargaEletronicos = eletronicos * 600;
    const cargaAntesAberturas = cargaBase + cargaPessoas + cargaEletronicos;
    const fatorAberturas = 1 + (Math.min(aberturas, 10) * 0.05);
    const cargaTotal = cargaAntesAberturas * fatorAberturas;
    return { area, fatorMetroQuadrado, fatorAltura, cargaPessoas, cargaEletronicos, fatorAberturas, cargaTotal };
}

/* =========================================================
   8. MOTOR DE RECOMENDAÇÃO DE EQUIPAMENTO
   ========================================================= */
function recomendarEquipamento(cargaNecessaria) {
    const faixas = [
        { limite: 9000, id: 'split-9000' },
        { limite: 12000, id: 'split-12000' },
        { limite: 18000, id: 'split-18000' },
        { limite: 24000, id: 'split-24000' },
        { limite: 36000, id: 'piso-teto-36000' },
        { limite: 60000, id: 'piso-teto-60000' }
    ];

    const faixa = faixas.find((item) => cargaNecessaria <= item.limite);
    if (faixa) {
        const equipamento = encontrarEquipamentoPorId(faixa.id);
        return { equipamento, quantidade: 1, capacidadeTotal: equipamento.capacidade };
    }

    const equipamento = encontrarEquipamentoPorId('piso-teto-60000');
    const quantidade = Math.ceil(cargaNecessaria / equipamento.capacidade);
    return { equipamento, quantidade, capacidadeTotal: equipamento.capacidade * quantidade };
}

/* =========================================================
   9. ENVIO DA CALCULADORA
   ========================================================= */
calculatorForm?.addEventListener('submit', (event) => {
    event.preventDefault();

    const data = new FormData(calculatorForm);
    const entrada = {
        tipoAmbiente: String(data.get('tipoAmbiente') || ''),
        largura: Number(data.get('largura')),
        comprimento: Number(data.get('comprimento')),
        peDireito: Number(data.get('peDireito')),
        pessoas: Number(data.get('pessoas')),
        eletronicos: Number(data.get('eletronicos')),
        aberturas: Number(data.get('aberturas')),
        sol: String(data.get('sol') || 'normal')
    };

    const invalido = Object.entries(entrada).some(([chave, valor]) =>
        chave !== 'tipoAmbiente' && chave !== 'sol' && (!Number.isFinite(valor) || valor < 0)
    );
    if (invalido || entrada.largura <= 0 || entrada.comprimento <= 0 || entrada.peDireito < 2 || entrada.pessoas < 1) return;

    const calculo = calcularCargaTermica(entrada);
    const recomendacao = recomendarEquipamento(calculo.cargaTotal);

    resultRecommendation.textContent = formatarNumero(recomendacao.capacidadeTotal);
    resultArea.textContent = `${formatarMedida(calculo.area)} m²`;
    resultLoad.textContent = `${formatarNumero(Math.ceil(calculo.cargaTotal))} BTU/h`;

    const quantidadeTexto = recomendacao.quantidade === 1
        ? `1 ${recomendacao.equipamento.titulo}`
        : `${recomendacao.quantidade} unidades de ${recomendacao.equipamento.titulo}`;

    resultSolution.textContent = `Sugestão inicial: ${quantidadeTexto}. Capacidade nominal total de ${formatarNumero(recomendacao.capacidadeTotal)} BTU/h.`;
    ultimoCalculo = { ...entrada, ...calculo, recomendacao };
    calculatorForm.hidden = true;
    calculatorResult.hidden = false;
});

recalculateButton?.addEventListener('click', () => {
    calculatorResult.hidden = true;
    calculatorForm.hidden = false;
});

sendToQuoteButton?.addEventListener('click', () => {
    if (!ultimoCalculo) return;

    const { tipoAmbiente, largura, comprimento, peDireito, pessoas, eletronicos, aberturas, sol, area, cargaTotal, recomendacao } = ultimoCalculo;
    if (quoteEnvironment) quoteEnvironment.value = tipoAmbiente;
    if (quoteEquipment) quoteEquipment.value = recomendacao.equipamento.id;

    const quantityInput = document.querySelector('#quantidade');
    if (quantityInput) quantityInput.value = String(recomendacao.quantidade);

    if (quoteSummary) {
        const solTexto = { baixo: 'baixa', normal: 'normal', forte: 'forte' }[sol] || 'normal';
        quoteSummary.value = [
            `Ambiente: ${tipoAmbiente}`,
            `Dimensões: ${formatarMedida(largura)} m x ${formatarMedida(comprimento)} m`,
            `Área: ${formatarMedida(area)} m²`,
            `Pé-direito: ${formatarMedida(peDireito)} m`,
            `Pessoas: ${pessoas}`,
            `Eletrônicos relevantes: ${eletronicos}`,
            `Aberturas grandes: ${aberturas}`,
            `Incidência solar: ${solTexto}`,
            `Carga térmica estimada: ${formatarNumero(Math.ceil(cargaTotal))} BTU/h`,
            `Sugestão: ${recomendacao.quantidade} x ${recomendacao.equipamento.titulo}`
        ].join('\n');
    }

    atualizarOrcamento();
    irParaOrcamento();
});

/* =========================================================
   10. REGRAS DE PREÇO DO PERÍODO
   ========================================================= */
function calcularValorLocacaoPorUnidade(equipamento, dias) {
    const faixaCurta = CONFIGURACAO_COMERCIAL.fatoresPeriodo.find((faixa) => dias <= faixa.ateDias);
    if (faixaCurta) return equipamento.mensalidadeBase * faixaCurta.fator;

    const mesesEquivalentes = dias / 30;
    const desconto = dias <= 60
        ? CONFIGURACAO_COMERCIAL.descontoPeriodoLongo.ate60Dias
        : CONFIGURACAO_COMERCIAL.descontoPeriodoLongo.acima60Dias;
    return equipamento.mensalidadeBase * mesesEquivalentes * (1 - desconto);
}

function obterDescontoQuantidade(quantidade) {
    const faixa = CONFIGURACAO_COMERCIAL.descontosQuantidade.find((item) => quantidade >= item.minimo);
    return faixa ? faixa.percentual : 0;
}

/* =========================================================
   11. CÁLCULO COMPLETO DO ORÇAMENTO
   ========================================================= */
function calcularOrcamentoAtual() {
    if (!quoteForm || !quoteEquipment) return null;
    const equipamento = encontrarEquipamentoPorId(quoteEquipment.value);
    if (!equipamento) return null;

    const quantidade = Math.max(1, Number(document.querySelector('#quantidade')?.value) || 1);
    const dias = Math.max(1, Number(document.querySelector('#periodoDias')?.value) || 1);
    const deslocamentoKey = document.querySelector('#deslocamento')?.value || 'local';
    const incluirInstalacao = Boolean(document.querySelector('#incluirInstalacao')?.checked);
    const incluirRetirada = Boolean(document.querySelector('#incluirRetirada')?.checked);
    const locacaoUnitaria = calcularValorLocacaoPorUnidade(equipamento, dias);
    const subtotalLocacao = locacaoUnitaria * quantidade;
    const descontoPercentual = obterDescontoQuantidade(quantidade);
    const descontoValor = subtotalLocacao * descontoPercentual;
    const instalacao = incluirInstalacao ? equipamento.instalacao * quantidade : 0;
    const retirada = incluirRetirada ? equipamento.retirada * quantidade : 0;
    const deslocamento = CONFIGURACAO_COMERCIAL.deslocamento[deslocamentoKey] ?? 0;
    const total = subtotalLocacao - descontoValor + instalacao + retirada + deslocamento;

    return { equipamento, quantidade, dias, deslocamentoKey, locacaoUnitaria, subtotalLocacao, descontoPercentual, descontoValor, instalacao, retirada, deslocamento, total };
}

function atualizarOrcamento() {
    const orcamento = calcularOrcamentoAtual();
    if (!orcamento) {
        if (quoteTotal) quoteTotal.textContent = 'R$ 0,00';
        if (quoteBreakdown) quoteBreakdown.innerHTML = '<span>Selecione um equipamento para calcular.</span>';
        return;
    }

    if (quoteTotal) quoteTotal.textContent = formatarMoeda(orcamento.total);
    if (quoteBreakdown) {
        const deslocamentoObservacao = orcamento.deslocamentoKey === 'avaliar'
            ? '<span class="breakdown-warning">Deslocamento acima de 100 km será avaliado separadamente.</span>'
            : '';
        quoteBreakdown.innerHTML = `
            <div><span>Locação (${orcamento.quantidade} un. / ${orcamento.dias} dias)</span><strong>${formatarMoeda(orcamento.subtotalLocacao)}</strong></div>
            <div><span>Desconto por quantidade (${Math.round(orcamento.descontoPercentual * 100)}%)</span><strong>- ${formatarMoeda(orcamento.descontoValor)}</strong></div>
            <div><span>Instalação estimada</span><strong>${formatarMoeda(orcamento.instalacao)}</strong></div>
            <div><span>Retirada estimada</span><strong>${formatarMoeda(orcamento.retirada)}</strong></div>
            <div><span>Deslocamento</span><strong>${formatarMoeda(orcamento.deslocamento)}</strong></div>
            ${deslocamentoObservacao}
        `;
    }
}

['#equipamentoOrcamento', '#quantidade', '#periodoDias', '#deslocamento', '#incluirInstalacao', '#incluirRetirada'].forEach((seletor) => {
    document.querySelector(seletor)?.addEventListener('input', atualizarOrcamento);
    document.querySelector(seletor)?.addEventListener('change', atualizarOrcamento);
});

/* =========================================================
   12. GERAÇÃO DA SOLICITAÇÃO COMERCIAL
   ========================================================= */
quoteForm?.addEventListener('submit', async (event) => {
    event.preventDefault();
    const orcamento = calcularOrcamentoAtual();
    if (!orcamento) {
        if (formFeedback) formFeedback.textContent = 'Selecione um equipamento antes de gerar a solicitação.';
        return;
    }

    const data = new FormData(quoteForm);
    const mensagem = [
        'SOLICITAÇÃO DE ORÇAMENTO - LOCAÇÃO DE AR-CONDICIONADO', '',
        `Nome: ${data.get('nome') || ''}`,
        `Telefone: ${data.get('telefone') || ''}`,
        `Cidade: ${data.get('cidade') || ''}`,
        `Uso: ${data.get('tipoUso') || 'Não informado'}`,
        `Equipamento: ${orcamento.equipamento.titulo}`,
        `Quantidade: ${orcamento.quantidade}`,
        `Período: ${orcamento.dias} dias`, '',
        `Locação: ${formatarMoeda(orcamento.subtotalLocacao)}`,
        `Desconto: - ${formatarMoeda(orcamento.descontoValor)}`,
        `Instalação: ${formatarMoeda(orcamento.instalacao)}`,
        `Retirada: ${formatarMoeda(orcamento.retirada)}`,
        `Deslocamento: ${orcamento.deslocamentoKey === 'avaliar' ? 'A avaliar' : formatarMoeda(orcamento.deslocamento)}`,
        `TOTAL ESTIMADO: ${formatarMoeda(orcamento.total)}`, '',
        'Resumo técnico:', data.get('resumoCalculo') || 'Não informado', '',
        `Observações: ${data.get('observacoes') || 'Nenhuma'}`, '',
        'Observação: valor sujeito à confirmação comercial e técnica.'
    ].join('\n');

    if (CONFIGURACAO_COMERCIAL.whatsappNumero) {
        const url = `https://wa.me/${CONFIGURACAO_COMERCIAL.whatsappNumero}?text=${encodeURIComponent(mensagem)}`;
        window.open(url, '_blank', 'noopener');
        if (formFeedback) formFeedback.textContent = 'Solicitação preparada. O WhatsApp foi aberto em uma nova janela.';
        return;
    }

    try {
        await navigator.clipboard.writeText(mensagem);
        if (formFeedback) formFeedback.textContent = 'Solicitação gerada e copiada. Cadastre o número da empresa no JavaScript para abrir o WhatsApp automaticamente.';
    } catch (erro) {
        if (formFeedback) formFeedback.textContent = 'Solicitação gerada. Cadastre o WhatsApp da empresa no JavaScript para ativar o envio automático.';
    }
});

/* =========================================================
   13. MÁSCARA DE TELEFONE
   ========================================================= */
phoneInput?.addEventListener('input', (event) => {
    const input = event.currentTarget;
    const numeros = input.value.replace(/\D/g, '').slice(0, 11);
    let formatado = numeros;
    if (numeros.length > 2) formatado = `(${numeros.slice(0, 2)}) ${numeros.slice(2)}`;
    if (numeros.length > 7) {
        const corte = numeros.length === 11 ? 7 : 6;
        formatado = `(${numeros.slice(0, 2)}) ${numeros.slice(2, corte)}-${numeros.slice(corte)}`;
    }
    input.value = formatado;
});

/* =========================================================
   14. MENU RESPONSIVO
   ========================================================= */
function alternarMenu() {
    if (!menuToggle || !navigation) return;
    const aberto = navigation.classList.toggle('active');
    menuToggle.classList.toggle('active', aberto);
    menuToggle.setAttribute('aria-expanded', String(aberto));
    menuToggle.setAttribute('aria-label', aberto ? 'Fechar menu' : 'Abrir menu');
    document.body.classList.toggle('menu-open', aberto);
}

function fecharMenu() {
    if (!menuToggle || !navigation) return;
    navigation.classList.remove('active');
    menuToggle.classList.remove('active');
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.setAttribute('aria-label', 'Abrir menu');
    document.body.classList.remove('menu-open');
}

menuToggle?.addEventListener('click', alternarMenu);
navigation?.querySelectorAll('a').forEach((link) => link.addEventListener('click', fecharMenu));

/* =========================================================
   15. CABEÇALHO, RODAPÉ E INICIALIZAÇÃO
   ========================================================= */
function atualizarCabecalho() {
    header?.classList.toggle('scrolled', window.scrollY > 16);
}

window.addEventListener('scroll', atualizarCabecalho, { passive: true });
atualizarCabecalho();
if (currentYear) currentYear.textContent = String(new Date().getFullYear());
preencherOpcoesDeEquipamento();
renderizarCatalogo();
atualizarOrcamento();