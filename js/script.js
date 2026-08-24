'use strict';

/* =========================================================
   1. CATÁLOGO PROVISÓRIO
   Esta lista concentra as capacidades que aparecem na página e
   também são utilizadas pelo algoritmo de recomendação.

   Quando a empresa definir os equipamentos reais, basta editar
   este array em vez de procurar cada capacidade pelo projeto.
   ========================================================= */
const catalogoEquipamentos = [
    {
        capacidade: 9000,
        titulo: '9.000 BTU/h',
        descricao: 'Opção compacta para ambientes com menor carga térmica estimada.'
    },
    {
        capacidade: 12000,
        titulo: '12.000 BTU/h',
        descricao: 'Capacidade intermediária para espaços pequenos e usos variados.'
    },
    {
        capacidade: 18000,
        titulo: '18.000 BTU/h',
        descricao: 'Solução para ambientes que exigem uma capacidade térmica maior.'
    },
    {
        capacidade: 24000,
        titulo: '24.000 BTU/h',
        descricao: 'Alternativa para espaços médios ou com maior incidência de carga térmica.'
    },
    {
        capacidade: 30000,
        titulo: '30.000 BTU/h',
        descricao: 'Capacidade elevada para demandas comerciais ou ambientes amplos.'
    },
    {
        capacidade: 36000,
        titulo: '36.000 BTU/h',
        descricao: 'Maior capacidade provisória do catálogo para demandas mais intensas.'
    }
];

/* =========================================================
   2. REFERÊNCIAS DO DOM
   Guardamos os elementos usados mais vezes para evitar consultas
   repetidas ao documento e manter o restante do código legível.
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
const formFeedback = document.querySelector('[data-form-feedback]');
const currentYear = document.querySelector('[data-current-year]');
const phoneInput = document.querySelector('#telefone');

/*
   Esta variável guarda o último cálculo válido.
   Ela é utilizada quando o cliente decide enviar a recomendação
   calculada para o formulário de orçamento.
*/
let ultimoCalculo = null;

/* =========================================================
   3. FUNÇÕES AUXILIARES
   Pequenas funções reutilizáveis para formatação e navegação.
   ========================================================= */

/**
 * Converte um número para o padrão brasileiro sem casas decimais.
 * Exemplo: 18000 se transforma em "18.000".
 *
 * @param {number} valor Número que será formatado.
 * @returns {string} Número formatado em pt-BR.
 */
function formatarNumero(valor) {
    return new Intl.NumberFormat('pt-BR', {
        maximumFractionDigits: 0
    }).format(valor);
}

/**
 * Converte uma medida para no máximo duas casas decimais.
 * É utilizada principalmente na área calculada em metros quadrados.
 *
 * @param {number} valor Medida que será exibida.
 * @returns {string} Valor formatado em pt-BR.
 */
function formatarMedida(valor) {
    return new Intl.NumberFormat('pt-BR', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2
    }).format(valor);
}

/**
 * Leva o usuário até a seção de orçamento usando a rolagem suave
 * configurada no CSS.
 */
function irParaOrcamento() {
    document.querySelector('#orcamento')?.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
    });
}

/* =========================================================
   4. CATÁLOGO DINÂMICO
   Os cards são criados com base no array catalogoEquipamentos.
   Cada botão recebe a capacidade do aparelho pelo dataset.
   ========================================================= */
function renderizarCatalogo() {
    if (!catalogContainer) {
        return;
    }

    catalogContainer.innerHTML = catalogoEquipamentos.map((equipamento) => {
        return `
            <article class="product-card">
                <!-- Ilustração genérica em CSS; será substituída por foto real quando o catálogo existir. -->
                <div class="product-visual" aria-hidden="true">
                    <div class="product-ac"></div>
                </div>

                <div class="product-body">
                    <span class="product-tag">Catálogo provisório</span>
                    <h3>${equipamento.titulo}</h3>
                    <p>${equipamento.descricao}</p>

                    <div class="product-actions">
                        <button
                            class="button"
                            type="button"
                            data-product-quote
                            data-capacity="${equipamento.capacidade}"
                        >
                            Solicitar orçamento
                        </button>
                    </div>
                </div>
            </article>
        `;
    }).join('');

    /*
       Após criar os cards, associamos o clique dos botões ao formulário.
       O equipamento selecionado já chega preenchido no orçamento.
    */
    const productButtons = catalogContainer.querySelectorAll('[data-product-quote]');

    productButtons.forEach((button) => {
        button.addEventListener('click', () => {
            const capacidade = Number(button.dataset.capacity);

            if (quoteEquipment) {
                quoteEquipment.value = `${formatarNumero(capacidade)} BTU/h`;
            }

            /*
               Como a seleção veio diretamente do catálogo e não da calculadora,
               limpamos o resumo automático para não reaproveitar um cálculo antigo.
            */
            if (quoteSummary) {
                quoteSummary.value = '';
            }

            ultimoCalculo = null;
            irParaOrcamento();
        });
    });
}

/* =========================================================
   5. MOTOR DE RECOMENDAÇÃO
   Procura no catálogo uma combinação cuja capacidade total seja
   igual ou superior à carga térmica calculada.

   Critério usado:
   - menor capacidade total que atende a necessidade;
   - em caso de empate, menor quantidade de aparelhos.

   Exemplo: uma necessidade de 72.000 BTU/h resulta em 2 x 36.000.
   ========================================================= */
function encontrarMelhorSolucao(cargaNecessaria) {
    let melhorSolucao = null;

    /*
       O limite de 10 unidades é suficiente para a primeira versão comercial.
       Ambientes que ultrapassem esse cenário devem obrigatoriamente passar por
       avaliação técnica antes de qualquer recomendação definitiva.
    */
    for (const equipamento of catalogoEquipamentos) {
        for (let quantidade = 1; quantidade <= 10; quantidade += 1) {
            const capacidadeTotal = equipamento.capacidade * quantidade;

            if (capacidadeTotal < cargaNecessaria) {
                continue;
            }

            const solucaoAtual = {
                capacidadeUnitaria: equipamento.capacidade,
                quantidade,
                capacidadeTotal
            };

            /*
               Se ainda não existe solução, a atual passa a ser a melhor.
               Depois comparamos capacidade total e quantidade de equipamentos.
            */
            if (!melhorSolucao) {
                melhorSolucao = solucaoAtual;
                continue;
            }

            const temMenorCapacidadeTotal = solucaoAtual.capacidadeTotal < melhorSolucao.capacidadeTotal;
            const empataCapacidadeComMenosUnidades =
                solucaoAtual.capacidadeTotal === melhorSolucao.capacidadeTotal &&
                solucaoAtual.quantidade < melhorSolucao.quantidade;

            if (temMenorCapacidadeTotal || empataCapacidadeComMenosUnidades) {
                melhorSolucao = solucaoAtual;
            }
        }
    }

    return melhorSolucao;
}

/* =========================================================
   6. CÁLCULO SIMPLIFICADO DE BTU/H
   Fórmula inicial adotada no protótipo:

   - 600 BTU/h por m² em condição normal/sombra;
   - 800 BTU/h por m² com incidência solar forte;
   - +600 BTU/h por pessoa adicional à primeira;
   - +600 BTU/h por equipamento eletrônico informado.

   IMPORTANTE: isto é uma estimativa comercial inicial e não
   substitui cálculo de carga térmica realizado por profissional.
   ========================================================= */
function calcularCargaTermica({ largura, comprimento, pessoas, eletronicos, sol }) {
    const area = largura * comprimento;
    const fatorPorMetroQuadrado = sol === 'forte' ? 800 : 600;

    /*
       A primeira pessoa já está contemplada na ocupação base simplificada.
       Por isso, somente pessoas adicionais recebem o acréscimo de 600 BTU/h.
    */
    const pessoasAdicionais = Math.max(0, pessoas - 1);
    const cargaPessoas = pessoasAdicionais * 600;
    const cargaEletronicos = eletronicos * 600;

    const cargaBase = area * fatorPorMetroQuadrado;
    const cargaTotal = cargaBase + cargaPessoas + cargaEletronicos;

    return {
        area,
        fatorPorMetroQuadrado,
        cargaPessoas,
        cargaEletronicos,
        cargaTotal
    };
}

/* =========================================================
   7. ENVIO DA CALCULADORA
   Valida os valores, calcula a carga e apresenta a solução.
   O formulário é ocultado temporariamente para destacar o resultado.
   ========================================================= */
calculatorForm?.addEventListener('submit', (event) => {
    event.preventDefault();

    const formData = new FormData(calculatorForm);

    const tipoAmbiente = String(formData.get('tipoAmbiente') || '');
    const largura = Number(formData.get('largura'));
    const comprimento = Number(formData.get('comprimento'));
    const pessoas = Number(formData.get('pessoas'));
    const eletronicos = Number(formData.get('eletronicos'));
    const sol = String(formData.get('sol') || 'normal');

    /*
       Os atributos required/min do HTML já fazem a primeira validação.
       Esta checagem evita cálculos inválidos caso os dados sejam manipulados.
    */
    const valoresInvalidos =
        !Number.isFinite(largura) || largura <= 0 ||
        !Number.isFinite(comprimento) || comprimento <= 0 ||
        !Number.isFinite(pessoas) || pessoas < 1 ||
        !Number.isFinite(eletronicos) || eletronicos < 0;

    if (valoresInvalidos) {
        return;
    }

    const calculo = calcularCargaTermica({
        largura,
        comprimento,
        pessoas,
        eletronicos,
        sol
    });

    const solucao = encontrarMelhorSolucao(calculo.cargaTotal);

    /*
       Se nenhuma combinação do catálogo provisório atender o cálculo,
       o sistema não inventa uma capacidade e orienta avaliação técnica.
    */
    if (!solucao) {
        resultRecommendation.textContent = 'Avaliação';
        resultArea.textContent = `${formatarMedida(calculo.area)} m²`;
        resultLoad.textContent = `${formatarNumero(Math.ceil(calculo.cargaTotal))} BTU/h`;
        resultSolution.textContent = 'A necessidade estimada ultrapassa as combinações previstas no catálogo inicial. Solicite uma avaliação técnica.';

        ultimoCalculo = {
            tipoAmbiente,
            largura,
            comprimento,
            pessoas,
            eletronicos,
            sol,
            ...calculo,
            solucao: null
        };
    } else {
        /*
           A capacidade exibida em destaque representa a capacidade total
           da solução sugerida, mesmo quando são necessários vários aparelhos.
        */
        resultRecommendation.textContent = formatarNumero(solucao.capacidadeTotal);
        resultArea.textContent = `${formatarMedida(calculo.area)} m²`;
        resultLoad.textContent = `${formatarNumero(Math.ceil(calculo.cargaTotal))} BTU/h`;

        const textoQuantidade = solucao.quantidade === 1
            ? `1 aparelho de ${formatarNumero(solucao.capacidadeUnitaria)} BTU/h`
            : `${solucao.quantidade} aparelhos de ${formatarNumero(solucao.capacidadeUnitaria)} BTU/h`;

        resultSolution.textContent = `Sugestão inicial: ${textoQuantidade}, totalizando ${formatarNumero(solucao.capacidadeTotal)} BTU/h de capacidade nominal.`;

        ultimoCalculo = {
            tipoAmbiente,
            largura,
            comprimento,
            pessoas,
            eletronicos,
            sol,
            ...calculo,
            solucao
        };
    }

    calculatorForm.hidden = true;
    calculatorResult.hidden = false;
});

/* =========================================================
   8. RECALCULAR
   Volta ao formulário sem apagar os valores já preenchidos para
   que o cliente altere somente a variável que desejar.
   ========================================================= */
recalculateButton?.addEventListener('click', () => {
    calculatorResult.hidden = true;
    calculatorForm.hidden = false;
});

/* =========================================================
   9. ENVIAR RESULTADO PARA O ORÇAMENTO
   Transfere a solução e as variáveis técnicas para os campos do
   formulário comercial. Assim o usuário não precisa digitar tudo.
   ========================================================= */
sendToQuoteButton?.addEventListener('click', () => {
    if (!ultimoCalculo) {
        return;
    }

    const {
        tipoAmbiente,
        largura,
        comprimento,
        pessoas,
        eletronicos,
        sol,
        area,
        cargaTotal,
        solucao
    } = ultimoCalculo;

    if (quoteEnvironment) {
        quoteEnvironment.value = tipoAmbiente;
    }

    if (quoteEquipment) {
        quoteEquipment.value = solucao
            ? `${solucao.quantidade} x ${formatarNumero(solucao.capacidadeUnitaria)} BTU/h`
            : 'Necessita avaliação técnica';
    }

    /*
       A quantidade do orçamento acompanha automaticamente a quantidade
       de equipamentos sugeridos, quando houver uma solução calculada.
    */
    const quantityInput = document.querySelector('#quantidade');
    if (quantityInput) {
        quantityInput.value = solucao ? String(solucao.quantidade) : '1';
    }

    if (quoteSummary) {
        const incidenciaSolar = sol === 'forte' ? 'sol forte' : 'normal / sombra';

        quoteSummary.value = [
            `Ambiente: ${tipoAmbiente}`,
            `Dimensões: ${formatarMedida(largura)} m x ${formatarMedida(comprimento)} m`,
            `Área calculada: ${formatarMedida(area)} m²`,
            `Pessoas: ${pessoas}`,
            `Equipamentos eletrônicos: ${eletronicos}`,
            `Incidência solar: ${incidenciaSolar}`,
            `Carga térmica estimada: ${formatarNumero(Math.ceil(cargaTotal))} BTU/h`,
            solucao
                ? `Sugestão: ${solucao.quantidade} x ${formatarNumero(solucao.capacidadeUnitaria)} BTU/h`
                : 'Sugestão: avaliação técnica necessária'
        ].join('\n');
    }

    irParaOrcamento();
});

/* =========================================================
   10. FORMULÁRIO DE ORÇAMENTO - MODO DEMONSTRATIVO
   Nesta fase não existe backend nem canal comercial definido.
   Impedimos o envio real e mostramos uma mensagem transparente.
   ========================================================= */
quoteForm?.addEventListener('submit', (event) => {
    event.preventDefault();

    if (formFeedback) {
        formFeedback.textContent = 'Solicitação preenchida. O canal de envio será conectado quando os dados comerciais da empresa forem definidos.';
    }
});

/* =========================================================
   11. MÁSCARA SIMPLES DE TELEFONE
   Mantém somente números e organiza visualmente celulares no
   padrão brasileiro durante a digitação.
   ========================================================= */
phoneInput?.addEventListener('input', (event) => {
    const input = event.currentTarget;
    const apenasNumeros = input.value.replace(/\D/g, '').slice(0, 11);

    let telefoneFormatado = apenasNumeros;

    if (apenasNumeros.length > 2) {
        telefoneFormatado = `(${apenasNumeros.slice(0, 2)}) ${apenasNumeros.slice(2)}`;
    }

    if (apenasNumeros.length > 7) {
        const possuiNonoDigito = apenasNumeros.length === 11;
        const limitePrefixo = possuiNonoDigito ? 7 : 6;

        telefoneFormatado = `(${apenasNumeros.slice(0, 2)}) ${apenasNumeros.slice(2, limitePrefixo)}-${apenasNumeros.slice(limitePrefixo)}`;
    }

    input.value = telefoneFormatado;
});

/* =========================================================
   12. MENU RESPONSIVO
   Alterna classes, acessibilidade aria-expanded e bloqueio de
   rolagem quando o menu móvel está aberto.
   ========================================================= */
function alternarMenu() {
    if (!menuToggle || !navigation) {
        return;
    }

    const estaAberto = navigation.classList.toggle('active');
    menuToggle.classList.toggle('active', estaAberto);
    menuToggle.setAttribute('aria-expanded', String(estaAberto));
    menuToggle.setAttribute('aria-label', estaAberto ? 'Fechar menu' : 'Abrir menu');
    document.body.classList.toggle('menu-open', estaAberto);
}

/**
 * Fecha o menu móvel depois que um item de navegação é escolhido.
 */
function fecharMenu() {
    if (!menuToggle || !navigation) {
        return;
    }

    navigation.classList.remove('active');
    menuToggle.classList.remove('active');
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.setAttribute('aria-label', 'Abrir menu');
    document.body.classList.remove('menu-open');
}

menuToggle?.addEventListener('click', alternarMenu);

navigation?.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', fecharMenu);
});

/* =========================================================
   13. CABEÇALHO DURANTE A ROLAGEM
   Adiciona uma classe após poucos pixels para melhorar o contraste
   do menu sobre o conteúdo conforme o usuário navega pela página.
   ========================================================= */
function atualizarCabecalho() {
    if (!header) {
        return;
    }

    header.classList.toggle('scrolled', window.scrollY > 16);
}

window.addEventListener('scroll', atualizarCabecalho, { passive: true });
atualizarCabecalho();

/* =========================================================
   14. ANO DO RODAPÉ
   Evita precisar atualizar manualmente o ano no HTML.
   ========================================================= */
if (currentYear) {
    currentYear.textContent = String(new Date().getFullYear());
}

/* =========================================================
   15. INICIALIZAÇÃO
   O catálogo é renderizado por último, depois que todas as funções
   necessárias para seus botões já foram declaradas.
   ========================================================= */
renderizarCatalogo();
