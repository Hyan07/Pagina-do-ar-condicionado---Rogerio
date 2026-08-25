'use strict';

/* =========================================================
   1. CONFIGURAÇÕES DA EMPRESA
   Este objeto concentra dados que serão substituídos quando a empresa
   definir os canais comerciais oficiais. O WhatsApp deve conter apenas
   números no formato 55 + DDD + número.
   ========================================================= */
const CONFIGURACAO_EMPRESA = {
    whatsapp: ''
};

/* =========================================================
   2. CATÁLOGO
   Utilizamos fotografias oficiais de equipamentos reais apenas como
   referência visual. Marca/modelo efetivamente locados deverão ser
   confirmados conforme o estoque da empresa.
   ========================================================= */
const EQUIPAMENTOS = [
    {
        id: 'split-9000',
        grupo: 'split',
        tipo: 'Split Hi Wall',
        capacidade: 9000,
        titulo: 'Split compacto',
        area: 'Ambientes pequenos',
        descricao: 'Opção para quartos, salas menores e escritórios compactos.',
        imagem: 'https://mideabr.vtexassets.com/arquivos/ids/171236-1440-auto/Packshot.jpg.webp?quality=9&v=638754832343170000',
        automatico: true
    },
    {
        id: 'split-12000',
        grupo: 'split',
        tipo: 'Split Hi Wall',
        capacidade: 12000,
        titulo: 'Split versátil',
        area: 'Ambientes pequenos e médios',
        descricao: 'Configuração muito comum para salas, consultórios e escritórios.',
        imagem: 'https://samsungbrshop.vtexassets.com/arquivos/ids/256778-800-auto?v=638856973239300000',
        automatico: true
    },
    {
        id: 'split-18000',
        grupo: 'split',
        tipo: 'Split Hi Wall',
        capacidade: 18000,
        titulo: 'Split intermediário',
        area: 'Ambientes médios',
        descricao: 'Indicado quando o espaço ou a carga térmica exigem capacidade maior.',
        imagem: 'https://mideabr.vtexassets.com/arquivos/ids/166651-1440-auto/01.ar-condicionado-split-18000-btu-airvolution-frio-midea-42AFVCI18S5.38TVCI18S5-PackshotA.webp?quality=9&v=638337629642030000',
        automatico: true
    },
    {
        id: 'split-24000',
        grupo: 'split',
        tipo: 'Split Hi Wall',
        capacidade: 24000,
        titulo: 'Split alta capacidade',
        area: 'Ambientes médios e amplos',
        descricao: 'Alternativa para salas amplas, lojas e escritórios com maior carga.',
        imagem: 'https://mideabr.vtexassets.com/arquivos/ids/173424-1440-auto/01-ar-condicionado-midea-ai-ecomaster-38EZVCA12M5-packshot.webp?quality=9&v=638829323134230000',
        automatico: true
    },
    {
        id: 'portatil-12000',
        grupo: 'portatil',
        tipo: 'Portátil',
        capacidade: 12000,
        titulo: 'Ar-condicionado portátil',
        area: 'Demandas temporárias',
        descricao: 'Solução móvel para situações em que uma instalação fixa não é conveniente.',
        imagem: 'https://philco.vtexassets.com/arquivos/ids/278590-800-800?aspect=true&height=800&v=639040186832100000&width=800',
        automatico: false
    },
    {
        id: 'piso-teto-36000',
        grupo: 'comercial',
        tipo: 'Piso-teto',
        capacidade: 36000,
        titulo: 'Piso-teto comercial',
        area: 'Grandes ambientes',
        descricao: 'Configuração robusta para lojas, salões e espaços comerciais amplos.',
        imagem: 'https://mideabr.vtexassets.com/arquivos/ids/175118/02-ar-condicionado-piso-teto-36000-btu-evaporadora-aberta.jpg?v=638906874091230000',
        automatico: true
    },
    {
        id: 'piso-teto-60000',
        grupo: 'comercial',
        tipo: 'Piso-teto',
        capacidade: 60000,
        titulo: 'Piso-teto alta capacidade',
        area: 'Grandes espaços',
        descricao: 'Para demandas comerciais maiores e ambientes com alta carga térmica.',
        imagem: 'https://mideabr.vtexassets.com/arquivos/ids/172149-1440-auto/00-pisotet.jpg.webp?quality=9&v=638786975925030000',
        automatico: true
    },
    {
        id: 'cassete-36000',
        grupo: 'comercial',
        tipo: 'Cassete 4 vias',
        capacidade: 36000,
        titulo: 'Cassete 4 vias',
        area: 'Ambientes com forro',
        descricao: 'Boa distribuição de ar para lojas, escritórios e ambientes comerciais.',
        imagem: 'https://mideabr.vtexassets.com/arquivos/ids/174698-1440-auto/1.cassete-4-vias-midea-capa-selo.webp?quality=9&v=638881120548730000',
        automatico: false
    }
];

/* =========================================================
   3. REFERÊNCIAS DO DOM
   Guardamos os elementos acessados várias vezes para deixar as funções
   menores e evitar consultas repetidas ao documento.
   ========================================================= */
const header = document.querySelector('[data-header]');
const menuToggle = document.querySelector('[data-menu-toggle]');
const navigation = document.querySelector('[data-navigation]');
const catalogContainer = document.querySelector('[data-catalog]');
const catalogFilters = document.querySelectorAll('[data-filter]');

const calculatorForm = document.querySelector('[data-calculator-form]');
const calculatorSteps = document.querySelectorAll('[data-calculator-step]');
const stepDots = document.querySelectorAll('[data-step-dot]');
const nextStepButton = document.querySelector('[data-next-step]');
const prevStepButton = document.querySelector('[data-prev-step]');
const recalculateButton = document.querySelector('[data-recalculate]');
const sendToQuoteButton = document.querySelector('[data-send-to-quote]');

const resultImage = document.querySelector('[data-result-image]');
const resultBtu = document.querySelector('[data-result-btu]');
const resultTitle = document.querySelector('[data-result-title]');
const resultDescription = document.querySelector('[data-result-description]');
const resultArea = document.querySelector('[data-result-area]');
const resultLoad = document.querySelector('[data-result-load]');
const resultQuantity = document.querySelector('[data-result-quantity]');

const quoteForm = document.querySelector('[data-quote-form]');
const quoteEquipment = document.querySelector('[data-quote-equipment]');
const quoteSummary = document.querySelector('[data-quote-summary]');
const quoteQuantity = document.querySelector('#quantidade');
const quoteUse = document.querySelector('#tipoUso');
const phoneInput = document.querySelector('#telefone');
const formFeedback = document.querySelector('[data-form-feedback]');
const currentYear = document.querySelector('[data-current-year]');

let passoAtual = 1;
let ultimoCalculo = null;

/* =========================================================
   4. FUNÇÕES DE FORMATAÇÃO
   ========================================================= */
function formatarNumero(valor) {
    return new Intl.NumberFormat('pt-BR', {
        maximumFractionDigits: 0
    }).format(valor);
}

function formatarMedida(valor) {
    return new Intl.NumberFormat('pt-BR', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 1
    }).format(valor);
}

/* =========================================================
   5. CATÁLOGO DINÂMICO
   Renderiza apenas o grupo selecionado e reutiliza o mesmo array de
   equipamentos usado pela calculadora e pelo formulário de orçamento.
   ========================================================= */
function renderizarCatalogo(filtro = 'todos') {
    if (!catalogContainer) {
        return;
    }

    const itensVisiveis = filtro === 'todos'
        ? EQUIPAMENTOS
        : EQUIPAMENTOS.filter((equipamento) => equipamento.grupo === filtro);

    catalogContainer.innerHTML = itensVisiveis.map((equipamento) => `
        <article class="product-card">
            <div class="product-image">
                <span class="product-type">${equipamento.tipo}</span>
                <img src="${equipamento.imagem}" alt="${equipamento.titulo} — fotografia oficial de equipamento real" loading="lazy">
            </div>
            <div class="product-body">
                <span class="product-capacity">${formatarNumero(equipamento.capacidade)} BTU/h</span>
                <h3>${equipamento.titulo}</h3>
                <p>${equipamento.descricao}</p>
                <div class="product-footer">
                    <span class="product-area">${equipamento.area}</span>
                    <button class="product-link" type="button" data-product-quote="${equipamento.id}">Orçar →</button>
                </div>
            </div>
        </article>
    `).join('');

    /* Cada botão do catálogo preenche o equipamento e leva o cliente ao orçamento. */
    catalogContainer.querySelectorAll('[data-product-quote]').forEach((button) => {
        button.addEventListener('click', () => {
            selecionarEquipamentoNoOrcamento(button.dataset.productQuote);
            document.querySelector('#orcamento')?.scrollIntoView({ behavior: 'smooth' });
        });
    });
}

catalogFilters.forEach((button) => {
    button.addEventListener('click', () => {
        catalogFilters.forEach((item) => item.classList.remove('active'));
        button.classList.add('active');
        renderizarCatalogo(button.dataset.filter);
    });
});

/* =========================================================
   6. PREENCHIMENTO DO SELECT DE ORÇAMENTO
   ========================================================= */
function preencherSelectEquipamentos() {
    if (!quoteEquipment) {
        return;
    }

    quoteEquipment.innerHTML = `
        <option value="">Selecione uma opção</option>
        ${EQUIPAMENTOS.map((equipamento) => `
            <option value="${equipamento.id}">
                ${equipamento.tipo} — ${formatarNumero(equipamento.capacidade)} BTU/h
            </option>
        `).join('')}
        <option value="avaliacao">Preciso de avaliação técnica</option>
    `;
}

function selecionarEquipamentoNoOrcamento(equipamentoId) {
    if (quoteEquipment) {
        quoteEquipment.value = equipamentoId;
    }
}

/* =========================================================
   7. CONTROLE DE ETAPAS DA CALCULADORA
   ========================================================= */
function mostrarPasso(numero) {
    passoAtual = numero;

    calculatorSteps.forEach((step) => {
        const numeroDoStep = Number(step.dataset.calculatorStep);
        const ativo = numeroDoStep === numero;
        step.hidden = !ativo;
        step.classList.toggle('active', ativo);
    });

    stepDots.forEach((dot) => {
        dot.classList.toggle('active', Number(dot.dataset.stepDot) <= numero);
    });
}

/**
 * Valida somente os campos visíveis da primeira etapa antes de avançar.
 * Isso evita exibir mensagens da segunda etapa antes de o usuário chegar nela.
 */
function validarPrimeiroPasso() {
    const largura = document.querySelector('#largura');
    const comprimento = document.querySelector('#comprimento');
    const peDireito = document.querySelector('#peDireito');

    return [largura, comprimento, peDireito].every((campo) => campo?.reportValidity());
}

nextStepButton?.addEventListener('click', () => {
    if (validarPrimeiroPasso()) {
        mostrarPasso(2);
    }
});

prevStepButton?.addEventListener('click', () => mostrarPasso(1));

recalculateButton?.addEventListener('click', () => {
    mostrarPasso(1);
    document.querySelector('#calculadora')?.scrollIntoView({ behavior: 'smooth' });
});

/* =========================================================
   8. CÁLCULO DE CARGA TÉRMICA
   Fórmula simplificada para orientação inicial:
   - base de 600 BTU/h por m²;
   - 700 BTU/h por m² em condição solar normal;
   - 800 BTU/h por m² com sol forte;
   - ajuste proporcional para pé-direito acima de 2,70 m;
   - +600 BTU/h por pessoa além da primeira;
   - +600 BTU/h por eletrônico relevante;
   - adicional de 8% ou 15% para grandes aberturas.

   O resultado NÃO substitui projeto técnico de carga térmica.
   ========================================================= */
function calcularCargaTermica(dados) {
    const area = dados.largura * dados.comprimento;

    const fatoresSolar = {
        baixo: 600,
        normal: 700,
        forte: 800
    };

    const fatorSolar = fatoresSolar[dados.sol] || fatoresSolar.normal;
    const fatorAltura = Math.max(1, dados.peDireito / 2.7);
    const cargaBase = area * fatorSolar * fatorAltura;
    const cargaPessoas = Math.max(0, dados.pessoas - 1) * 600;
    const cargaEletronicos = dados.eletronicos * 600;

    const adicionalAberturas = dados.aberturas === 2
        ? 0.15
        : dados.aberturas === 1
            ? 0.08
            : 0;

    const cargaAntesAberturas = cargaBase + cargaPessoas + cargaEletronicos;
    const cargaTotal = cargaAntesAberturas * (1 + adicionalAberturas);

    return {
        area,
        cargaTotal
    };
}

/* =========================================================
   9. MOTOR DE RECOMENDAÇÃO
   Procura a menor combinação de equipamentos automáticos que atenda
   a carga calculada. Em caso de empate, prefere menos unidades.
   ========================================================= */
function encontrarMelhorSolucao(cargaNecessaria) {
    const disponiveis = EQUIPAMENTOS.filter((equipamento) => equipamento.automatico);
    let melhorSolucao = null;

    disponiveis.forEach((equipamento) => {
        for (let quantidade = 1; quantidade <= 12; quantidade += 1) {
            const capacidadeTotal = equipamento.capacidade * quantidade;

            if (capacidadeTotal < cargaNecessaria) {
                continue;
            }

            const candidato = {
                equipamento,
                quantidade,
                capacidadeTotal,
                excesso: capacidadeTotal - cargaNecessaria
            };

            if (!melhorSolucao) {
                melhorSolucao = candidato;
                continue;
            }

            const menorExcesso = candidato.excesso < melhorSolucao.excesso;
            const mesmoExcessoMenosUnidades =
                candidato.excesso === melhorSolucao.excesso &&
                candidato.quantidade < melhorSolucao.quantidade;

            if (menorExcesso || mesmoExcessoMenosUnidades) {
                melhorSolucao = candidato;
            }
        }
    });

    return melhorSolucao;
}

/* =========================================================
   10. RESULTADO DA CALCULADORA
   ========================================================= */
calculatorForm?.addEventListener('submit', (event) => {
    event.preventDefault();

    if (!calculatorForm.reportValidity()) {
        return;
    }

    const formData = new FormData(calculatorForm);

    const dados = {
        tipoAmbiente: String(formData.get('tipoAmbiente') || ''),
        largura: Number(formData.get('largura')),
        comprimento: Number(formData.get('comprimento')),
        peDireito: Number(formData.get('peDireito')),
        pessoas: Number(formData.get('pessoas')),
        eletronicos: Number(formData.get('eletronicos')),
        aberturas: Number(formData.get('aberturas')),
        sol: String(formData.get('sol') || 'normal')
    };

    const calculo = calcularCargaTermica(dados);
    const solucao = encontrarMelhorSolucao(calculo.cargaTotal);

    if (!solucao) {
        return;
    }

    ultimoCalculo = {
        ...dados,
        ...calculo,
        solucao
    };

    const { equipamento, quantidade, capacidadeTotal } = solucao;

    if (resultImage) {
        resultImage.src = equipamento.imagem;
        resultImage.alt = `${equipamento.titulo} recomendado`;
    }

    if (resultBtu) {
        resultBtu.textContent = formatarNumero(capacidadeTotal);
    }

    if (resultTitle) {
        resultTitle.textContent = quantidade === 1
            ? `${equipamento.tipo} de ${formatarNumero(equipamento.capacidade)} BTU/h`
            : `${quantidade} × ${equipamento.tipo} de ${formatarNumero(equipamento.capacidade)} BTU/h`;
    }

    if (resultDescription) {
        resultDescription.textContent = equipamento.descricao;
    }

    if (resultArea) {
        resultArea.textContent = `${formatarMedida(calculo.area)} m²`;
    }

    if (resultLoad) {
        resultLoad.textContent = `${formatarNumero(Math.ceil(calculo.cargaTotal))} BTU/h`;
    }

    if (resultQuantity) {
        resultQuantity.textContent = `${quantidade} ${quantidade === 1 ? 'unidade' : 'unidades'}`;
    }

    mostrarPasso(3);
});

/* =========================================================
   11. TRANSFERÊNCIA DO CÁLCULO PARA O ORÇAMENTO
   ========================================================= */
sendToQuoteButton?.addEventListener('click', () => {
    if (!ultimoCalculo) {
        return;
    }

    const { tipoAmbiente, largura, comprimento, peDireito, pessoas, eletronicos, area, cargaTotal, solucao } = ultimoCalculo;

    selecionarEquipamentoNoOrcamento(solucao.equipamento.id);

    if (quoteQuantity) {
        quoteQuantity.value = String(solucao.quantidade);
    }

    if (quoteUse) {
        quoteUse.value = tipoAmbiente;
    }

    if (quoteSummary) {
        quoteSummary.value = [
            `Ambiente: ${tipoAmbiente}`,
            `Dimensões: ${formatarMedida(largura)} m × ${formatarMedida(comprimento)} m`,
            `Pé-direito: ${formatarMedida(peDireito)} m`,
            `Área: ${formatarMedida(area)} m²`,
            `Pessoas: ${pessoas}`,
            `Eletrônicos relevantes: ${eletronicos}`,
            `Carga estimada: ${formatarNumero(Math.ceil(cargaTotal))} BTU/h`,
            `Sugestão: ${solucao.quantidade} × ${solucao.equipamento.tipo} de ${formatarNumero(solucao.equipamento.capacidade)} BTU/h`
        ].join('\n');
    }

    document.querySelector('#orcamento')?.scrollIntoView({ behavior: 'smooth' });
});

/* =========================================================
   12. GERAÇÃO DA SOLICITAÇÃO COMERCIAL
   Sem um número oficial configurado, o site exibe o texto pronto para
   ser copiado. Quando CONFIGURACAO_EMPRESA.whatsapp for preenchido,
   o mesmo botão abrirá o WhatsApp automaticamente.
   ========================================================= */
quoteForm?.addEventListener('submit', async (event) => {
    event.preventDefault();

    const formData = new FormData(quoteForm);
    const equipamentoId = String(formData.get('equipamento') || '');
    const equipamento = EQUIPAMENTOS.find((item) => item.id === equipamentoId);

    const equipamentoTexto = equipamento
        ? `${equipamento.tipo} — ${formatarNumero(equipamento.capacidade)} BTU/h`
        : 'Avaliação técnica necessária';

    const mensagem = [
        '*SOLICITAÇÃO DE ORÇAMENTO — LOCAÇÃO DE AR-CONDICIONADO*',
        '',
        `Nome: ${formData.get('nome')}`,
        `Telefone: ${formData.get('telefone')}`,
        `Cidade: ${formData.get('cidade')}`,
        `Uso: ${formData.get('tipoUso') || 'Não informado'}`,
        `Equipamento: ${equipamentoTexto}`,
        `Quantidade: ${formData.get('quantidade')}`,
        `Início desejado: ${formData.get('inicioLocacao') || 'A combinar'}`,
        `Período: ${formData.get('periodo')}`,
        '',
        `Resumo técnico:\n${formData.get('resumoCalculo') || 'Não informado'}`,
        '',
        `Observações:\n${formData.get('observacoes') || 'Sem observações'}`
    ].join('\n');

    if (CONFIGURACAO_EMPRESA.whatsapp) {
        const url = `https://wa.me/${CONFIGURACAO_EMPRESA.whatsapp}?text=${encodeURIComponent(mensagem)}`;
        window.open(url, '_blank', 'noopener,noreferrer');

        if (formFeedback) {
            formFeedback.textContent = 'Solicitação preparada. O WhatsApp foi aberto em uma nova janela.';
        }

        return;
    }

    /*
       Tenta copiar automaticamente. Se o navegador bloquear o clipboard,
       ainda mostramos a mensagem para o usuário não perder o preenchimento.
    */
    try {
        await navigator.clipboard.writeText(mensagem);

        if (formFeedback) {
            formFeedback.textContent = 'Solicitação pronta e copiada. O WhatsApp oficial da empresa ainda precisa ser configurado no sistema.';
        }
    } catch (error) {
        if (formFeedback) {
            formFeedback.textContent = `Solicitação pronta:\n\n${mensagem}`;
        }
    }
});

/* =========================================================
   13. MÁSCARA SIMPLES DE TELEFONE
   ========================================================= */
phoneInput?.addEventListener('input', (event) => {
    const input = event.currentTarget;
    const numeros = input.value.replace(/\D/g, '').slice(0, 11);

    let formatado = numeros;

    if (numeros.length > 2) {
        formatado = `(${numeros.slice(0, 2)}) ${numeros.slice(2)}`;
    }

    if (numeros.length > 7) {
        const corte = numeros.length === 11 ? 7 : 6;
        formatado = `(${numeros.slice(0, 2)}) ${numeros.slice(2, corte)}-${numeros.slice(corte)}`;
    }

    input.value = formatado;
});

/* =========================================================
   14. FAQ EM ACORDEÃO
   ========================================================= */
document.querySelectorAll('.faq-item > button').forEach((button) => {
    button.addEventListener('click', () => {
        const item = button.closest('.faq-item');
        const aberto = item.classList.toggle('open');
        button.setAttribute('aria-expanded', String(aberto));
    });
});

/* =========================================================
   15. MENU RESPONSIVO
   ========================================================= */
function fecharMenu() {
    navigation?.classList.remove('active');
    menuToggle?.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('menu-open');
}

menuToggle?.addEventListener('click', () => {
    const aberto = navigation?.classList.toggle('active');
    menuToggle.setAttribute('aria-expanded', String(Boolean(aberto)));
    document.body.classList.toggle('menu-open', Boolean(aberto));
});

navigation?.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', fecharMenu);
});

/* =========================================================
   16. CABEÇALHO DURANTE A ROLAGEM
   ========================================================= */
function atualizarCabecalho() {
    header?.classList.toggle('scrolled', window.scrollY > 12);
}

window.addEventListener('scroll', atualizarCabecalho, { passive: true });
atualizarCabecalho();

/* =========================================================
   17. INICIALIZAÇÃO
   ========================================================= */
if (currentYear) {
    currentYear.textContent = String(new Date().getFullYear());
}

renderizarCatalogo();
preencherSelectEquipamentos();
mostrarPasso(1);
