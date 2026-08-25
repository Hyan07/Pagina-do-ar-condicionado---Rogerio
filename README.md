# Página de locação de ar-condicionado

Site comercial em **HTML, CSS e JavaScript puros** para uma empresa de locação de ar-condicionado.

## O que esta versão faz

- catálogo com tipos/capacidades comuns e fotos reais de fabricantes usadas como referência;
- filtros por categoria;
- calculadora comercial de carga térmica em BTU/h;
- recomendação de capacidade e quantidade;
- benchmarks públicos de locação mensal pesquisados em 24/08/2026;
- simulador de mensalidade e valor do período;
- modalidade de evento/projeto especial sob avaliação;
- geração de solicitação comercial;
- abertura direta do WhatsApp quando o número oficial for configurado;
- compartilhamento/cópia da solicitação como fallback;
- FAQ, escopo de instalação e fontes públicas visíveis.

## Configuração da empresa

Edite o objeto `empresa` no começo de `js/data.js`:

```js
empresa: {
    nome: 'Nome da empresa',
    whatsapp: '5535999999999',
    email: 'contato@empresa.com.br',
    regiaoAtendimento: 'Cidade/UF e região',
    descontos: { /* política comercial */ }
}
```

O WhatsApp deve conter somente números: `55` + DDD + telefone.

## Onde ajustar equipamentos e preços

A lista `equipamentos` fica em `js/data.js`. Cada item contém capacidade, tipo, referência visual, fonte e `valorReferenciaMensal`.

Quando a empresa tiver estoque e tabela próprios, substitua:

- marca/modelo de referência pelo estoque real;
- benchmark público pelo preço interno real;
- disponibilidade e tensão conforme os aparelhos efetivamente locados.

## Metodologia financeira desta versão

O site não inventa frete, instalação ou margem. Para itens comparáveis, calcula:

```text
mensalidade = referência mensal × quantidade × fator de desconto configurado
valor do período = mensalidade × meses
```

Eventos e itens sem benchmark comparável ficam **sob consulta**.

## Metodologia simplificada de BTU/h

A calculadora usa uma triagem comercial:

- 600 BTU/h por m² em sombra/condição normal;
- 800 BTU/h por m² com sol forte;
- ajuste proporcional para pé-direito acima de 2,70 m;
- +600 BTU/h por pessoa adicional à primeira;
- +600 BTU/h por eletrônico relevante;
- +600 BTU/h por abertura grande.

Essa estimativa **não substitui cálculo técnico/normativo de carga térmica**.

## Fontes principais de pesquisa

### Locação e serviço

- https://app.locaar.com.br/
- https://www.ctdigital.net.br/locaar.html
- https://www.al.rn.leg.br/storage/licitacao/2024/rhq6huizzgtbk3ae0wldd9g5f2saus.pdf
- https://www.aluguetudo.com/
- https://casadoconstrutor.com.br/pt-br/blog/como-funciona-locacao-equipamentos
- https://content.electrolux.com.br/brasil/electrolux/servicos/instalacao/instalacao_ar_condicionado_12000/index.html

### Fabricantes / produtos

- https://www.midea.com.br/
- https://www.samsung.com/br/air-conditioners/
- https://www.lg.com/br/ar-condicionado-residencial/
- https://gree.com.br/
- https://www.philco.com.br/climatizacao/ar-condicionado

## Antes de publicidade/produção definitiva

1. Informar nome comercial, WhatsApp, e-mail, CNPJ/endereço quando aplicável e região atendida.
2. Definir estoque real e capacidades disponíveis.
3. Criar preço próprio considerando aquisição, depreciação, manutenção, instalação, logística, impostos, risco e margem.
4. Confirmar autorização/licenciamento das imagens usadas comercialmente; as atuais são referências externas de fabricantes.
5. Publicar Política de Privacidade/LGPD com dados jurídicos reais da empresa.
6. Se for necessário armazenar leads/orçamentos, conectar o formulário a backend/CRM. O site atual não finge possuir banco de dados.