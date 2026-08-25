'use strict';

/* =========================================================
   LÓGICA PRINCIPAL DO SITE
   Este arquivo cuida de catálogo, calculadora, orçamento, menu e
   geração da solicitação. Dados comerciais ficam em js/data.js.
   ========================================================= */

/* =========================================================
   1. VALIDAÇÃO DOS DADOS CARREGADOS
   Se data.js não for carregado, interrompemos com erro explícito em
   vez de deixar a página falhar silenciosamente.
   ========================================================= */
const APP = window.APP_DATA;

if (!APP || !APP.empresa || !Array.isArray(APP.equipamentos)) {
    throw new Error('APP_DATA não foi carregado corretamente. Verifique js/data.js.');
}

const EMPRESA = APP.empresa;
const FONTES = APP.fontes;
const EQUIPAMENTOS = APP.equipamentos;
const BENCHMARKS = APP.benchmarks;

/* =========================================================
   2. REFERÊNCIAS DO DOM
   Guardamos elementos usados diversas vezes para deixar o restante
   do código mais legível e evitar buscas repetidas no documento.
   ========================================================= */
const header = document.querySelector('[data-header]');
const menuToggle = document.querySelector('[data-menu-toggle]');
const navigation = document.querySelector('[data-navigation]');

const catalogContainer = document.querySelector('[data-catalog]');
const filterButtons = [...document.querySelectorAll('[data-filter]')];
const benchmarkTable = document.querySelector('[data-benchmark-table]');

const calculatorForm = document.querySelector('[data-calculator-form]');
const calculatorResult = document.querySelector('[data-calculator-result]');
const resultRecommendation = document.querySelector('[data-result-recommendation]');
const resultArea = document.querySelector('[data-result-area]');
const resultLoad = document.querySelector('[data-result-load]');
const resultUnits = document.querySelector('[data-result-units]');
const resultSolution = document.querySelector('[data-result-solution]');
const recalculateButton = document.querySelector('[data-recalculate]');
const sendToQuoteButton = document.querySelector('[data-send-to-quote]');

const quoteForm = document.querySelector('[data-quote-form]');
const quoteMode = document.querySelector('[data-quote-mode]');
const quoteEquipment = document.querySelector('[data-quote-equipment]');
const quoteEnvironment = document.querySelector('[data-quote-environment]');
const quoteSummary = document.querySelector('[data-quote-summary]');
const monthlyFields = document.querySelector('[data-monthly-fields]');
const quantityInput = document.querySelector('#quantidade');
const monthsInput = document.querySelector('#meses');
const phoneInput = document.querySelector('#telefone');
const formFeedback = document.querySelector('[data-form-feedback]');

const quoteStatus = document.querySelector('[data-quote-status]');
const quoteMonthly = document.querySelector('[data-quote-monthly]');
const quotePriceNote = document.querySelector('[data-quote-price-note]');
const quoteProduct = document.querySelector('[data-quote-product]');
const quoteQuantity = document.querySelector('[data-quote-quantity]');
const quotePeriod = document.querySelector('[data-quote-period]');
const quoteTotal = document.querySelector('[data-quote-total]');

/* Guarda o último cálculo válido para transferi-lo ao orçamento. */
let ultimoCalculo = null;

/* =========================================================
   3. FORMATAÇÃO E SEGURANÇA DE TEXTO
   ========================================================= */

/**
 * Formata um valor em reais usando padrão brasileiro.
 * @param {number} valor Valor numérico.
 * @returns {string} Exemplo: R$ 190,00.
 */
function formatarMoeda(valor) {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
        minimumFractionDigits: 2
    }).format(valor);
}

/**
 * Formata números inteiros com separador brasileiro.
 * @param {number} valor Número original.
 * @returns {string} Exemplo: 12000 -> 12.000.
 */
function formatarNumero(valor) {
    return new Intl.NumberFormat('pt-BR', {
        maximumFractionDigits: 0
    }).format(valor);
}

/**
 * Formata uma medida com até duas casas decimais.
 * @param {number} valor Medida original.
 * @returns {string} Medida formatada.
 */
function formatarMedida(valor) {
    return new Intl.NumberFormat('pt-BR', {
        maximumFractionDigits: 2
    }).format(valor);
}

/**
 * Escapa caracteres especiais antes de inserir texto em innerHTML.
 * @param {unknown} valor Valor que será exibido.
 * @returns {string} Conteúdo seguro para HTML.
 */
function escaparHtml(valor) {
    return String(valor)
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;')
        .replaceAll("'", '&#039;');
}

/**
 * Rola suavemente até a área de orçamento.
 */
function irParaOrcamento() {
    document.querySelector('#orcamento')?.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
    });
}

/* =========================================================
   4. DADOS DA EMPRESA NO LAYOUT
   Fallbacks são neutros e não inventam telefone/e-mail/região.
   ========================================================= */
function aplicarDadosDaEmpresa() {
    document.querySelectorAll('[data-company-name]').forEach((elemento) => {
        elemento.textContent = EMPRESA.nome;
    });

    const phoneLabel = document.querySelector('[data-company-phone]');
    const emailLabel = document.querySelector('[data-company-email]');
    const regionLabel = document.querySelector('[data-company-region]');

    if (phoneLabel) {
        phoneLabel.textContent = EMPRESA.whatsapp
            ? `WhatsApp: +${EMPRESA.whatsapp}`
            : 'Solicitação pelo formulário';
    }

    if (emailLabel) {
        emailLabel.textContent = EMPRESA.email || 'Contato oficial sob confirmação';
    }

    if (regionLabel) {
        regionLabel.textContent = EMPRESA.regiaoAtendimento || 'Consulte disponibilidade para sua cidade';
    }
}

/* =========================================================
   5. CATÁLOGO
   Cards são gerados a partir de data.js e podem ser filtrados por
   tipo sem duplicação de HTML.
   ========================================================= */
function renderizarCatalogo(filtro = 'todos') {
    if (!catalogContainer) return;

    const lista = filtro === 'todos'
        ? EQUIPAMENTOS
        : EQUIPAMENTOS.filter((equipamento) => equipamento.tipo === filtro);

    catalogContainer.innerHTML = lista.map((equipamento) => {
        const preco = equipamento.valorReferenciaMensal !== null
            ? `<strong>${formatarMoeda(equipamento.valorReferenciaMensal)}/mês</strong><small>Benchmark público; valor final sujeito à confirmação.</small>`
            : '<strong>Sob consulta</strong><small>Sem benchmark mensal comparável automatizado.</small>';

        return `
            <article class="product-card">
                <div class="product-card__image">
                    <span>${escaparHtml(equipamento.categoria)}</span>
                    <img src="${equipamento.imagem}" alt="${escaparHtml(`${equipamento.categoria} ${formatarNumero(equipamento.capacidade)} BTU/h - ${equipamento.marcaReferencia}`)}" loading="lazy">
                </div>
                <div class="product-card__body">
                    <small class="product-card__brand">${escaparHtml(equipamento.marcaReferencia)} · modelo de referência</small>
                    <h3>${escaparHtml(equipamento.categoria)} ${formatarNumero(equipamento.capacidade)} BTU/h</h3>
                    <p>${escaparHtml(equipamento.aplicacao)}</p>
                    <div class="product-specs">
                        <div><span>Capacidade</span><strong>${formatarNumero(equipamento.capacidade)} BTU/h</strong></div>
                        <div><span>Área indicativa</span><strong>${escaparHtml(equipamento.areaIndicativa)}</strong></div>
                        <div><span>Tensão ref.</span><strong>${escaparHtml(equipamento.tensaoReferencia)}</strong></div>
                        <div><span>Modelo ref.</span><strong>${escaparHtml(equipamento.modeloReferencia)}</strong></div>
                    </div>
                    <div class="product-price"><span>Referência mensal</span>${preco}</div>
                    <div class="product-actions">
                        <button class="button" type="button" data-product-quote="${equipamento.id}">Simular locação</button>
                        <a href="${equipamento.fonteProduto}" target="_blank" rel="noopener noreferrer">Fonte oficial</a>
                    </div>
                </div>
            </article>`;
    }).join('');

    catalogContainer.querySelectorAll('[data-product-quote]').forEach((button) => {
        button.addEventListener('click', () => {
            selecionarEquipamentoNoOrcamento(button.dataset.productQuote);
            irParaOrcamento();
        });
    });
}

/* Filtros visuais do catálogo. */
filterButtons.forEach((button) => {
    button.addEventListener('click', () => {
        filterButtons.forEach((item) => item.classList.remove('active'));
        button.classList.add('active');
        renderizarCatalogo(button.dataset.filter || 'todos');
    });
});

/* =========================================================
   6. TABELA DE REFERÊNCIAS PÚBLICAS
   ========================================================= */
function renderizarBenchmarks() {
    if (!benchmarkTable) return;

    benchmarkTable.innerHTML = BENCHMARKS.map((item) => `
        <tr>
            <td><strong>${escaparHtml(item.categoria)}</strong></td>
            <td>${escaparHtml(item.capacidade)}</td>
            <td><strong>${escaparHtml(item.valor)}</strong></td>
            <td>${escaparHtml(item.observacao)}</td>
        </tr>`).join('');
}

/* =========================================================
   7. CÁLCULO SIMPLIFICADO DE CARGA TÉRMICA
   Fórmula de triagem comercial usada no site:
   - 600 BTU/h por m² em sombra/condição normal;
   - 800 BTU/h por m² com sol forte;
   - ajuste proporcional para pé-direito acima de 2,70m;
   - +600 BTU/h por pessoa adicional à primeira;
   - +600 BTU/h por eletrônico relevante;
   - +600 BTU/h por abertura grande.

   Este cálculo NÃO substitui projeto técnico/normativo de carga.
   ========================================================= */
function calcularCargaTermica({ largura, comprimento, peDireito, pessoas, eletronicos, aberturas, sol }) {
    const area = largura * comprimento;
    const basePorMetro = sol === 'forte' ? 800 : 600;
    const fatorPeDireito = Math.max(1, peDireito / 2.7);
    const cargaArea = area * basePorMetro * fatorPeDireito;
    const cargaPessoas = Math.max(0, pessoas - 1) * 600;
    const cargaEletronicos = eletronicos * 600;
    const cargaAberturas = aberturas * 600;
    const cargaTotal = cargaArea + cargaPessoas + cargaEletronicos + cargaAberturas;

    return {
        area,
        cargaArea,
        cargaPessoas,
        cargaEletronicos,
        cargaAberturas,
        cargaTotal
    };
}

/* =========================================================
   8. MOTOR DE RECOMENDAÇÃO
   Testa até 10 unidades iguais. O score penaliza tanto excesso de
   capacidade quanto muitas unidades, evitando resultados pouco
   práticos como três aparelhos pequenos quando um maior atende bem.
   ========================================================= */
function encontrarMelhorSolucao(cargaNecessaria) {
    const candidatos = EQUIPAMENTOS.filter((equipamento) => equipamento.automatico);
    let melhor = null;

    candidatos.forEach((equipamento) => {
        for (let quantidade = 1; quantidade <= 10; quantidade += 1) {
            const capacidadeTotal = equipamento.capacidade * quantidade;
            if (capacidadeTotal < cargaNecessaria) continue;

            const excesso = capacidadeTotal - cargaNecessaria;
            const penalidadeUnidades = (quantidade - 1) * 3000;
            const score = excesso + penalidadeUnidades;

            if (!melhor || score < melhor.score || (score === melhor.score && quantidade < melhor.quantidade)) {
                melhor = {
                    equipamento,
                    quantidade,
                    capacidadeTotal,
                    score
                };
            }
        }
    });

    return melhor;
}

/* =========================================================
   9. ENVIO DA CALCULADORA
   ========================================================= */
calculatorForm?.addEventListener('submit', (event) => {
    event.preventDefault();

    const dados = new FormData(calculatorForm);
    const entrada = {
        tipoAmbiente: String(dados.get('tipoAmbiente') || ''),
        largura: Number(dados.get('largura')),
        comprimento: Number(dados.get('comprimento')),
        peDireito: Number(dados.get('peDireito')),
        pessoas: Number(dados.get('pessoas')),
        eletronicos: Number(dados.get('eletronicos')),
        aberturas: Number(dados.get('aberturas')),
        sol: String(dados.get('sol') || 'normal')
    };

    const invalido =
        !Number.isFinite(entrada.largura) || entrada.largura <= 0 ||
        !Number.isFinite(entrada.comprimento) || entrada.comprimento <= 0 ||
        !Number.isFinite(entrada.peDireito) || entrada.peDireito < 2 ||
        !Number.isFinite(entrada.pessoas) || entrada.pessoas < 1 ||
        !Number.isFinite(entrada.eletronicos) || entrada.eletronicos < 0 ||
        !Number.isFinite(entrada.aberturas) || entrada.aberturas < 0;

    if (invalido) return;

    const carga = calcularCargaTermica(entrada);
    const solucao = encontrarMelhorSolucao(carga.cargaTotal);

    resultArea.textContent = `${formatarMedida(carga.area)} m²`;
    resultLoad.textContent = `${formatarNumero(Math.ceil(carga.cargaTotal))} BTU/h`;

    if (!solucao) {
        resultRecommendation.textContent = 'Avaliação';
        resultUnits.textContent = '--';
        resultSolution.textContent = 'A carga ultrapassa as combinações automáticas previstas. Solicite dimensionamento técnico.';
        ultimoCalculo = { entrada, carga, solucao: null };
    } else {
        resultRecommendation.textContent = formatarNumero(solucao.capacidadeTotal);
        resultUnits.textContent = String(solucao.quantidade);
        resultSolution.textContent = solucao.quantidade === 1
            ? `Sugestão inicial: 1 ${solucao.equipamento.categoria} de ${formatarNumero(solucao.equipamento.capacidade)} BTU/h.`
            : `Sugestão inicial: ${solucao.quantidade} unidades de ${formatarNumero(solucao.equipamento.capacidade)} BTU/h, totalizando ${formatarNumero(solucao.capacidadeTotal)} BTU/h.`;
        ultimoCalculo = { entrada, carga, solucao };
    }

    calculatorForm.hidden = true;
    calculatorResult.hidden = false;
});

/* Permite editar os valores sem apagar o formulário. */
recalculateButton?.addEventListener('click', () => {
    calculatorResult.hidden = true;
    calculatorForm.hidden = false;
});

/* =========================================================
   10. TRANSFERÊNCIA DO CÁLCULO PARA O ORÇAMENTO
   ========================================================= */
sendToQuoteButton?.addEventListener('click', () => {
    if (!ultimoCalculo) return;

    const { entrada, carga, solucao } = ultimoCalculo;

    if (quoteEnvironment) quoteEnvironment.value = entrada.tipoAmbiente;

    if (solucao) {
        selecionarEquipamentoNoOrcamento(solucao.equipamento.id);
        if (quantityInput) quantityInput.value = String(solucao.quantidade);
    }

    if (quoteSummary) {
        quoteSummary.value = [
            `Ambiente: ${entrada.tipoAmbiente}`,
            `Dimensões: ${formatarMedida(entrada.largura)} m x ${formatarMedida(entrada.comprimento)} m`,
            `Pé-direito: ${formatarMedida(entrada.peDireito)} m`,
            `Área: ${formatarMedida(carga.area)} m²`,
            `Pessoas: ${entrada.pessoas}`,
            `Eletrônicos relevantes: ${entrada.eletronicos}`,
            `Portas/janelas grandes: ${entrada.aberturas}`,
            `Sol: ${entrada.sol === 'forte' ? 'forte' : 'normal/sombra'}`,
            `Carga estimada: ${formatarNumero(Math.ceil(carga.cargaTotal))} BTU/h`,
            solucao
                ? `Sugestão: ${solucao.quantidade} x ${formatarNumero(solucao.equipamento.capacidade)} BTU/h`
                : 'Sugestão: avaliação técnica necessária'
        ].join('\n');
    }

    atualizarResumoOrcamento();
    irParaOrcamento();
});

/* =========================================================
   11. SELECT DE EQUIPAMENTOS DO ORÇAMENTO
   ========================================================= */
function preencherSelectEquipamentos() {
    if (!quoteEquipment) return;

    quoteEquipment.innerHTML = EQUIPAMENTOS.map((equipamento) => {
        const preco = equipamento.valorReferenciaMensal !== null
            ? ` — ref. ${formatarMoeda(equipamento.valorReferenciaMensal)}/mês`
            : ' — sob consulta';

        return `<option value="${equipamento.id}">${escaparHtml(equipamento.categoria)} ${formatarNumero(equipamento.capacidade)} BTU/h${preco}</option>`;
    }).join('');
}

/**
 * Seleciona um equipamento pelo id, se ele existir no catálogo.
 * @param {string} equipamentoId Identificador definido em data.js.
 */
function selecionarEquipamentoNoOrcamento(equipamentoId) {
    if (!quoteEquipment) return;
    const existe = EQUIPAMENTOS.some((equipamento) => equipamento.id === equipamentoId);
    if (existe) quoteEquipment.value = equipamentoId;
}

/* =========================================================
   12. CÁLCULO FINANCEIRO DA REFERÊNCIA MENSAL
   Não inventamos taxa de instalação, frete ou logística. O cálculo
   automático é: benchmark mensal × quantidade × prazo, aplicando
   somente descontos explicitamente configurados em data.js.
   ========================================================= */
function calcularOrcamentoAtual() {
    const equipamento = EQUIPAMENTOS.find((item) => item.id === quoteEquipment?.value);
    const quantidade = Math.max(1, Number(quantityInput?.value || 1));
    const meses = Math.max(1, Number(monthsInput?.value || 1));
    const modalidade = quoteMode?.value || 'mensal';

    if (!equipamento) return null;

    const permiteCalculo = modalidade !== 'evento' && equipamento.valorReferenciaMensal !== null;

    if (!permiteCalculo) {
        return { equipamento, quantidade, meses, modalidade, mensalidade: null, totalPeriodo: null };
    }

    const descontoPrazo = Number(EMPRESA.descontos?.porPrazo?.[meses] || 0);
    const descontoQuantidade = Number(EMPRESA.descontos?.porQuantidade || 0);
    const fatorDesconto = Math.max(0, 1 - descontoPrazo - descontoQuantidade);
    const mensalidadeBruta = equipamento.valorReferenciaMensal * quantidade;
    const mensalidade = mensalidadeBruta * fatorDesconto;
    const totalPeriodo = mensalidade * meses;

    return { equipamento, quantidade, meses, modalidade, mensalidade, totalPeriodo };
}

/* =========================================================
   13. RESUMO FINANCEIRO EM TEMPO REAL
   ========================================================= */
function atualizarResumoOrcamento() {
    const calculo = calcularOrcamentoAtual();
    if (!calculo) return;

    const nomes = {
        mensal: 'Mensal',
        corporativa: 'Corporativo',
        evento: 'Sob avaliação'
    };

    quoteStatus.textContent = nomes[calculo.modalidade] || 'Mensal';
    quoteProduct.textContent = `${calculo.equipamento.categoria} ${formatarNumero(calculo.equipamento.capacidade)} BTU/h`;
    quoteQuantity.textContent = String(calculo.quantidade);
    quotePeriod.textContent = calculo.modalidade === 'evento'
        ? 'Definido após análise'
        : `${calculo.meses} ${calculo.meses === 1 ? 'mês' : 'meses'}`;

    if (calculo.mensalidade === null) {
        quoteMonthly.textContent = 'Sob consulta';
        quoteTotal.textContent = 'A confirmar';
        quotePriceNote.textContent = calculo.modalidade === 'evento'
            ? 'Eventos dependem de data, lotação, logística, energia e montagem.'
            : 'Este item não possui benchmark mensal automatizado comparável.';
    } else {
        quoteMonthly.textContent = formatarMoeda(calculo.mensalidade);
        quoteTotal.textContent = formatarMoeda(calculo.totalPeriodo);
        quotePriceNote.textContent = `Benchmark público pesquisado em ${FONTES.dataReferencia}; não é proposta comercial definitiva.`;
    }

    if (monthlyFields) monthlyFields.hidden = calculo.modalidade === 'evento';
}

[quoteMode, quoteEquipment, quantityInput, monthsInput].forEach((elemento) => {
    elemento?.addEventListener('change', atualizarResumoOrcamento);
    elemento?.addEventListener('input', atualizarResumoOrcamento);
});

/* Links de CTA podem pré-selecionar a modalidade de evento. */
document.querySelectorAll('[data-set-quote-mode]').forEach((link) => {
    link.addEventListener('click', () => {
        if (quoteMode) quoteMode.value = link.dataset.setQuoteMode || 'evento';
        atualizarResumoOrcamento();
    });
});

/* =========================================================
   14. CÓDIGO ÚNICO DA SOLICITAÇÃO
   Ajuda a empresa e o cliente a identificarem uma conversa sem
   precisar de banco de dados nesta fase.
   ========================================================= */
function gerarCodigoOrcamento() {
    const agora = new Date();
    const data = [agora.getFullYear(), String(agora.getMonth() + 1).padStart(2, '0'), String(agora.getDate()).padStart(2, '0')].join('');
    const sufixo = String(Math.floor(1000 + Math.random() * 9000));
    return `ORC-${data}-${sufixo}`;
}

/* =========================================================
   15. GERAÇÃO E ENVIO DA SOLICITAÇÃO
   - com WhatsApp oficial configurado: abre conversa direta;
   - sem WhatsApp: usa o compartilhamento nativo do aparelho;
   - se o navegador não suportar compartilhamento: copia o texto.

   Não simulamos envio para um destinatário inexistente.
   ========================================================= */
quoteForm?.addEventListener('submit', async (event) => {
    event.preventDefault();

    const formData = new FormData(quoteForm);
    const calculo = calcularOrcamentoAtual();
    if (!calculo) return;

    const codigo = gerarCodigoOrcamento();
    const nome = String(formData.get('nome') || '').trim();
    const telefone = String(formData.get('telefone') || '').trim();
    const email = String(formData.get('email') || '').trim();
    const cidade = String(formData.get('cidade') || '').trim();
    const tipoUso = String(formData.get('tipoUso') || '').trim();
    const tensao = String(formData.get('tensao') || 'Não informado');
    const resumo = String(formData.get('resumoCalculo') || 'Não informado').trim() || 'Não informado';
    const observacoes = String(formData.get('observacoes') || 'Sem observações').trim() || 'Sem observações';

    const valorMensal = calculo.mensalidade === null ? 'Sob consulta' : formatarMoeda(calculo.mensalidade);
    const valorPeriodo = calculo.totalPeriodo === null ? 'A confirmar' : formatarMoeda(calculo.totalPeriodo);

    const mensagem = [
        `SOLICITAÇÃO DE ORÇAMENTO ${codigo}`,
        '',
        `Cliente: ${nome}`,
        `WhatsApp: ${telefone}`,
        `E-mail: ${email || 'Não informado'}`,
        `Cidade: ${cidade}`,
        `Uso: ${tipoUso || 'Não informado'}`,
        `Modalidade: ${quoteMode?.selectedOptions[0]?.textContent || calculo.modalidade}`,
        '',
        `Equipamento: ${calculo.equipamento.categoria} ${formatarNumero(calculo.equipamento.capacidade)} BTU/h`,
        `Quantidade: ${calculo.quantidade}`,
        `Prazo: ${calculo.modalidade === 'evento' ? 'Sob avaliação' : `${calculo.meses} mês(es)`}`,
        `Tensão: ${tensao}`,
        `Referência mensal: ${valorMensal}`,
        `Referência do período: ${valorPeriodo}`,
        '',
        'Resumo técnico:',
        resumo,
        '',
        'Observações:',
        observacoes,
        '',
        `Benchmark de mercado: ${FONTES.dataReferencia}.`,
        'Sujeito à confirmação técnica, comercial, de estoque, instalação e logística.'
    ].join('\n');

    if (EMPRESA.whatsapp) {
        const url = `https://wa.me/${EMPRESA.whatsapp}?text=${encodeURIComponent(mensagem)}`;
        window.open(url, '_blank', 'noopener,noreferrer');
        if (formFeedback) formFeedback.textContent = `${codigo} preparado. O WhatsApp foi aberto.`;
        return;
    }

    if (navigator.share) {
        try {
            await navigator.share({ title: `Orçamento ${codigo}`, text: mensagem });
            if (formFeedback) formFeedback.textContent = `${codigo} preparado para compartilhamento.`;
            return;
        } catch (error) {
            /* Se o usuário cancelar o compartilhamento, tentamos copiar abaixo. */
        }
    }

    try {
        await navigator.clipboard.writeText(mensagem);
        if (formFeedback) formFeedback.textContent = `${codigo} criado e copiado. O contato oficial da empresa ainda precisa ser configurado.`;
    } catch (error) {
        if (formFeedback) formFeedback.textContent = `${codigo} criado. Configure o WhatsApp da empresa em js/data.js para habilitar o envio direto.`;
    }
});

/* =========================================================
   16. MÁSCARA DE TELEFONE BRASILEIRO
   Mantém apenas 11 dígitos e melhora a leitura durante a digitação.
   ========================================================= */
phoneInput?.addEventListener('input', (event) => {
    const numeros = event.currentTarget.value.replace(/\D/g, '').slice(0, 11);
    let formatado = numeros;

    if (numeros.length > 2) {
        formatado = `(${numeros.slice(0, 2)}) ${numeros.slice(2)}`;
    }

    if (numeros.length > 6) {
        const celular = numeros.length > 10;
        const corte = celular ? 7 : 6;
        formatado = `(${numeros.slice(0, 2)}) ${numeros.slice(2, corte)}-${numeros.slice(corte)}`;
    }

    event.currentTarget.value = formatado;
});

/* =========================================================
   17. MENU RESPONSIVO
   ========================================================= */
function fecharMenu() {
    if (!menuToggle || !navigation) return;
    navigation.classList.remove('active');
    menuToggle.classList.remove('active');
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.setAttribute('aria-label', 'Abrir menu');
    document.body.classList.remove('menu-open');
}

menuToggle?.addEventListener('click', () => {
    if (!navigation) return;
    const aberto = navigation.classList.toggle('active');
    menuToggle.classList.toggle('active', aberto);
    menuToggle.setAttribute('aria-expanded', String(aberto));
    menuToggle.setAttribute('aria-label', aberto ? 'Fechar menu' : 'Abrir menu');
    document.body.classList.toggle('menu-open', aberto);
});

navigation?.querySelectorAll('a').forEach((link) => link.addEventListener('click', fecharMenu));

/* =========================================================
   18. CABEÇALHO E ANO
   ========================================================= */
function atualizarCabecalho() {
    header?.classList.toggle('scrolled', window.scrollY > 16);
}

window.addEventListener('scroll', atualizarCabecalho, { passive: true });
atualizarCabecalho();

document.querySelectorAll('[data-current-year]').forEach((elemento) => {
    elemento.textContent = String(new Date().getFullYear());
});

/* =========================================================
   19. INICIALIZAÇÃO
   A ordem importa: primeiro preenchemos os dados e selects; depois
   calculamos o resumo inicial do orçamento.
   ========================================================= */
aplicarDadosDaEmpresa();
renderizarCatalogo();
renderizarBenchmarks();
preencherSelectEquipamentos();
atualizarResumoOrcamento();