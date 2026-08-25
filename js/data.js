'use strict';

/* =========================================================
   DADOS E CONFIGURAÇÕES DO PROJETO
   Este arquivo concentra tudo o que muda com o negócio: nome,
   contatos, fontes, equipamentos e benchmarks. A lógica fica em
   script.js; assim a empresa consegue atualizar preços/estoque sem
   reescrever funções.
   ========================================================= */
window.APP_DATA = {
    /* -------------------------------------------------------
       DADOS DA EMPRESA
       Não inventamos informações não fornecidas. Quando existirem,
       preencha os campos abaixo e o site passará a exibi-las.
       O WhatsApp deve conter apenas números, com 55 + DDD + número.
       ------------------------------------------------------- */
    empresa: {
        nome: 'Locação de Ar-Condicionado',
        whatsapp: '',
        email: '',
        regiaoAtendimento: '',

        /*
           Política de desconto começa zerada. Ela pode ser alterada
           quando a empresa definir condições comerciais reais.
           Exemplo: 0.05 representa 5%.
        */
        descontos: {
            porPrazo: {
                1: 0,
                3: 0,
                6: 0,
                12: 0,
                24: 0
            },
            porQuantidade: 0
        }
    },

    /* -------------------------------------------------------
       FONTES DE MERCADO
       Guardamos as URLs para rastreabilidade dos números. O site
       NÃO consulta estes endereços em tempo real no navegador.
       ------------------------------------------------------- */
    fontes: {
        dataReferencia: '24/08/2026',
        locaarProdutos: 'https://app.locaar.com.br/',
        locaarPlanos: 'https://www.ctdigital.net.br/locaar.html',
        assembleiaRN: 'https://www.al.rn.leg.br/storage/licitacao/2024/rhq6huizzgtbk3ae0wldd9g5f2saus.pdf',
        casaConstrutor: 'https://casadoconstrutor.com.br/pt-br/blog/como-funciona-locacao-equipamentos',
        alugueTudo: 'https://www.aluguetudo.com/',
        electroluxInstalacao: 'https://content.electrolux.com.br/brasil/electrolux/servicos/instalacao/instalacao_ar_condicionado_12000/index.html'
    },

    /* -------------------------------------------------------
       CATÁLOGO DE REFERÊNCIA
       - valorReferenciaMensal: benchmark público para comparação;
       - faixaMercado: intervalo entre referências pesquisadas;
       - automatico: permite usar o item na recomendação de BTUs;
       - imagem/fonteProduto: produto real de fabricante.

       Antes de vender de fato, substitua esta lista pelo estoque
       próprio e revise autorização/licenciamento das imagens.
       ------------------------------------------------------- */
    equipamentos: [
        {
            id: 'split-9000',
            tipo: 'split',
            categoria: 'Split Hi Wall',
            capacidade: 9000,
            marcaReferencia: 'Midea',
            modeloReferencia: 'XtremeSave AI',
            tensaoReferencia: '220V',
            areaIndicativa: 'até ~15 m²',
            aplicacao: 'Quartos, salas pequenas e escritórios compactos.',
            imagem: 'https://mideabr.vtexassets.com/arquivos/ids/171236-1440-auto/Packshot.jpg.webp?quality=9&v=638754832343170000',
            fonteProduto: 'https://www.midea.com.br/ar-condicionado-split-9000-btu-inverter-ai-xtremesave-frio-midea/p',
            valorReferenciaMensal: 149,
            faixaMercado: [143.50, 149],
            fontePreco: 'locaarProdutos',
            automatico: true
        },
        {
            id: 'split-12000',
            tipo: 'split',
            categoria: 'Split Hi Wall',
            capacidade: 12000,
            marcaReferencia: 'Samsung',
            modeloReferencia: 'WindFree Connect',
            tensaoReferencia: '220V / versões específicas',
            areaIndicativa: 'até ~20 m²',
            aplicacao: 'Salas, quartos maiores, consultórios e pequenos escritórios.',
            imagem: 'https://samsungbrshop.vtexassets.com/arquivos/ids/256778-800-auto?v=638856973239300000',
            fonteProduto: 'https://shop.samsung.com/br/ar-condicionado-split-inverter-samsung-windfree-connect-sem-vento-quente-e-frio-12-000btus/p',
            valorReferenciaMensal: 190,
            faixaMercado: [167.75, 190],
            fontePreco: 'locaarProdutos',
            automatico: true
        },
        {
            id: 'split-18000',
            tipo: 'split',
            categoria: 'Split Hi Wall',
            capacidade: 18000,
            marcaReferencia: 'Midea',
            modeloReferencia: 'AirVolution Inverter',
            tensaoReferencia: '220V',
            areaIndicativa: 'até ~30 m²',
            aplicacao: 'Salas médias, escritórios e pequenos comércios.',
            imagem: 'https://mideabr.vtexassets.com/arquivos/ids/166651-1440-auto/01.ar-condicionado-split-18000-btu-airvolution-frio-midea-42AFVCI18S5.38TVCI18S5-PackshotA.webp?quality=9&v=638337629642030000',
            fonteProduto: 'https://www.midea.com.br/ar-condicionado-split-inverter-18000-btu-airvolution-frio-midea-3/p',
            valorReferenciaMensal: 280,
            faixaMercado: [211.33, 300],
            fontePreco: 'locaarProdutos',
            automatico: true
        },
        {
            id: 'split-24000',
            tipo: 'split',
            categoria: 'Split Hi Wall',
            capacidade: 24000,
            marcaReferencia: 'Midea',
            modeloReferencia: 'AI Ecomaster',
            tensaoReferencia: '220V',
            areaIndicativa: 'até ~40–50 m²',
            aplicacao: 'Salas amplas, lojas pequenas e escritórios com maior carga térmica.',
            imagem: 'https://mideabr.vtexassets.com/arquivos/ids/173424-1440-auto/01-ar-condicionado-midea-ai-ecomaster-38EZVCA12M5-packshot.webp?quality=9&v=638829323134230000',
            fonteProduto: 'https://www.midea.com.br/ar-condicionado-24000-btus-inverter-ai-ecomaster-frio-midea/p',
            valorReferenciaMensal: 380,
            faixaMercado: [287.33, 380],
            fontePreco: 'locaarPlanos',
            automatico: true
        },
        {
            id: 'split-30000',
            tipo: 'split',
            categoria: 'Split Hi Wall',
            capacidade: 30000,
            marcaReferencia: 'Midea',
            modeloReferencia: 'XtremeSave Inverter',
            tensaoReferencia: '220V',
            areaIndicativa: 'até ~50 m²',
            aplicacao: 'Ambientes amplos e aplicações comerciais de médio porte.',
            imagem: 'https://mideabr.vtexassets.com/arquivos/ids/186259-1440-auto/1-ar-split-inverter30000-btu-xtremesave-midea-frente.webp?quality=9&v=639173857353230000',
            fonteProduto: 'https://www.midea.com.br/ar-condicionado-split-inverter-30000-btu-xtremesave-frio-midea-1/p',
            valorReferenciaMensal: 450,
            faixaMercado: [351.25, 450],
            fontePreco: 'locaarPlanos',
            automatico: true
        },
        {
            id: 'portatil-12000',
            tipo: 'portatil',
            categoria: 'Portátil',
            capacidade: 12000,
            marcaReferencia: 'Philco',
            modeloReferencia: 'PAC12000F5',
            tensaoReferencia: '127V / 220V',
            areaIndicativa: 'ambientes pequenos',
            aplicacao: 'Demandas temporárias onde uma instalação fixa não é conveniente.',
            imagem: 'https://philco.vtexassets.com/arquivos/ids/278590-800-800?aspect=true&height=800&v=639040186832100000&width=800',
            fonteProduto: 'https://www.philco.com.br/ar-condicionado-portatil-philco-pac12000f5-056651084/p',
            valorReferenciaMensal: 250,
            faixaMercado: [239, 250],
            fontePreco: 'locaarPlanos',
            automatico: false
        },
        {
            id: 'piso-teto-36000',
            tipo: 'piso-teto',
            categoria: 'Piso-teto',
            capacidade: 36000,
            marcaReferencia: 'Midea / Carrier',
            modeloReferencia: 'Inverter 36k',
            tensaoReferencia: '220V',
            areaIndicativa: 'até ~60 m²',
            aplicacao: 'Lojas, salões, salas comerciais e ambientes de maior porte.',
            imagem: 'https://mideabr.vtexassets.com/arquivos/ids/175118/02-ar-condicionado-piso-teto-36000-btu-evaporadora-aberta.jpg?v=638906874091230000',
            fonteProduto: 'https://www.midea.com.br/ar-condicionado-split-teto-36000-btus-inverter-frio-midea/p',
            valorReferenciaMensal: 690,
            faixaMercado: [690, 950],
            fontePreco: 'locaarProdutos',
            automatico: true
        },
        {
            id: 'piso-teto-60000',
            tipo: 'piso-teto',
            categoria: 'Piso-teto',
            capacidade: 60000,
            marcaReferencia: 'Carrier',
            modeloReferencia: 'Xpower Inverter',
            tensaoReferencia: '220V',
            areaIndicativa: 'grandes ambientes',
            aplicacao: 'Comércios amplos, salões e espaços temporários com grande carga.',
            imagem: 'https://mideabr.vtexassets.com/arquivos/ids/172149-1440-auto/00-pisotet.jpg.webp?quality=9&v=638786975925030000',
            fonteProduto: 'https://www.midea.com.br/ar-condicionado-split-teto-60000-btus-inverter-xpower-frio-carrier-1/p',
            valorReferenciaMensal: 950,
            faixaMercado: [950, 1100],
            fontePreco: 'locaarProdutos',
            automatico: true
        },
        {
            id: 'cassete-36000',
            tipo: 'cassete',
            categoria: 'Cassete 4 vias',
            capacidade: 36000,
            marcaReferencia: 'Midea',
            modeloReferencia: 'Cassete Inverter 4 vias',
            tensaoReferencia: '220V',
            areaIndicativa: 'ambientes comerciais amplos',
            aplicacao: 'Escritórios, lojas e ambientes com forro e distribuição multidirecional.',
            imagem: 'https://mideabr.vtexassets.com/arquivos/ids/174698-1440-auto/1.cassete-4-vias-midea-capa-selo.webp?quality=9&v=638881120548730000',
            fonteProduto: 'https://www.midea.com.br/ar-condicionado-split-cassete-36-000-btus-inverter-frio-midea-4-vias/p',
            valorReferenciaMensal: null,
            faixaMercado: null,
            fontePreco: null,
            automatico: false
        }
    ],

    /* -------------------------------------------------------
       TABELA DE BENCHMARKS
       Textos são explícitos para que o visitante entenda que fontes
       e escopos diferentes geram preços diferentes.
       ------------------------------------------------------- */
    benchmarks: [
        { categoria: 'Split Hi Wall', capacidade: '9.000 BTU/h', valor: 'R$ 143,50 a R$ 149/mês', observacao: 'Contratação pública e plano comercial publicado.' },
        { categoria: 'Split Hi Wall', capacidade: '12.000 BTU/h', valor: 'R$ 167,75 a R$ 190/mês', observacao: 'Referências mensais públicas comparáveis.' },
        { categoria: 'Split Hi Wall', capacidade: '18.000 BTU/h', valor: 'R$ 211,33 a R$ 300/mês', observacao: 'Varia conforme prazo e escopo.' },
        { categoria: 'Split Hi Wall', capacidade: '24.000 BTU/h', valor: 'R$ 287,33 a R$ 380/mês', observacao: 'Faixa usada como ordem de grandeza.' },
        { categoria: 'Split Hi Wall', capacidade: '30.000 BTU/h', valor: 'R$ 351,25 a R$ 450/mês', observacao: 'Referências públicas de locação.' },
        { categoria: 'Portátil', capacidade: '12.000 BTU/h', valor: 'R$ 239 a R$ 250/mês', observacao: 'Planos públicos de locação mensal.' },
        { categoria: 'Piso-teto', capacidade: '36.000 BTU/h', valor: 'R$ 690 a R$ 950/mês', observacao: 'Escopo de instalação altera bastante o contrato.' },
        { categoria: 'Piso-teto', capacidade: '60.000 BTU/h', valor: 'R$ 950 a R$ 1.100/mês', observacao: 'Referência comercial publicada.' }
    ]
};