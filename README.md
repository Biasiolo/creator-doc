# Doc Creator Pro

Prompt — Aplicação Web de Geração Inteligente de Contratos e Documentos

Quero desenvolver uma aplicação web chamada GERADOR DE CONTRATOS, utilizando React + Vite, com foco na geração automatizada de contratos e documentos personalizados através de Inteligência Artificial.

A aplicação deve ter uma arquitetura organizada, moderna, responsiva e preparada para expansão futura.

1. Objetivo da aplicação

O usuário deverá conseguir criar documentos profissionais sem precisar redigir o documento manualmente.

O fluxo principal será:

Usuário acessa a aplicação.

Escolhe o tipo de documento que deseja gerar.

O sistema apresenta um formulário específico para aquele tipo de documento.

Usuário preenche os dados das partes envolvidas, serviço/negócio, valores, prazos, condições etc.

O frontend envia os dados para uma API de IA.

A IA recebe:

prompt de sistema previamente definido;

tipo do documento;

dados preenchidos pelo usuário;

regras específicas daquele documento.

A IA retorna o documento completo em texto estruturado.

Usuário visualiza uma prévia do documento.

Usuário pode editar o texto manualmente.

Usuário confirma o documento.

Sistema gera um PDF profissional.

Usuário pode visualizar, imprimir ou baixar o PDF.

2. Stack obrigatória

Utilize:

React

Vite

JavaScript ou TypeScript

React Router

Tailwind CSS

Lucide React para ícones

Zustand ou Context API para gerenciamento de estado

React Hook Form para formulários

Zod para validação

Uma biblioteca de edição de texto rica, preferencialmente TipTap

Biblioteca adequada para geração de PDF

Evite dependências desnecessárias.

A aplicação deve ser construída pensando em:

componentização;

reutilização;

manutenção;

escalabilidade;

boa experiência de usuário;

responsividade.

3. Arquitetura

Organize o projeto aproximadamente desta maneira:

src/

components/

pages/

layouts/

hooks/

services/

utils/

data/

config/

store/

types/

assets/

Crie componentes reutilizáveis.

Não coloque toda a lógica dentro das páginas.

Separe claramente:

interface;

estado;

serviços de API;

configuração dos documentos;

geração de PDF;

validação;

integração com IA.

4. Fluxo da aplicação

Tela 1 — Dashboard

Criar uma página inicial com:

logo/nome do sistema;

botão "Novo documento";

documentos recentes;

botão para criar documento;

indicação do tipo do documento;

data de criação;

status.

Exemplo:

Documentos recentes:

Contrato de Prestação de Serviços
08/08/2026

Contrato de Compra e Venda
07/08/2026

Orçamento Comercial
05/08/2026

Criar também um botão destacado:

+ Criar novo documento

5. Tela de seleção do documento

Criar uma página onde o usuário escolhe o tipo de documento.

Exibir cards.

Exemplos:

Contrato de Prestação de Serviços

Contrato de Compra e Venda

Contrato de Locação

Contrato de Freelancer

Termo de Confidencialidade

Termo de Prestação de Serviços

Orçamento Comercial

Proposta Comercial

Recibo

Termo de Responsabilidade

Documento personalizado

Cada card deve possuir:

ícone;

nome;

descrição curta;

botão/ação para selecionar.

A arquitetura deve permitir adicionar novos tipos de documento facilmente.

6. Sistema de formulários dinâmicos

Essa é uma parte fundamental da aplicação.

Não quero criar um formulário completamente diferente manualmente para cada documento.

Crie um sistema baseado em configuração.

Por exemplo:

documentTypes.js

Cada documento deverá possuir uma estrutura semelhante a:

{
id: "prestacao-servicos",
name: "Contrato de Prestação de Serviços",
description: "...",
fields: [...]
}

Os campos poderão ser:

text

email

phone

cpf

cnpj

address

date

currency

number

textarea

select

checkbox

radio

array/lista

Exemplo:

{
name: "contratante.nome",
label: "Nome do contratante",
type: "text",
required: true
}

Outro:

{
name: "servico.valor",
label: "Valor do serviço",
type: "currency",
required: true
}

O formulário deverá ser renderizado automaticamente a partir dessa configuração.

7. Campos condicionais

O sistema deve suportar campos que aparecem dependendo de respostas anteriores.

Exemplo:

"Existe prazo determinado?"

Sim / Não

Se Sim:

"Data de início"

"Data de término"

Outro exemplo:

"Pagamento parcelado?"

Sim / Não

Se Sim:

"Número de parcelas"

"Periodicidade"

"Valor da parcela"

Portanto, o sistema precisa suportar regras condicionais.

8. Dados personalizados

Além dos campos padrão, permitir futuramente que cada tipo de documento possua campos personalizados.

A arquitetura deve permitir adicionar novos campos sem precisar modificar vários componentes.

9. Etapas do formulário

Não quero colocar todos os campos em uma única tela.

Criar um formulário dividido em etapas.

Exemplo:

Etapa 1

Tipo de documento

Etapa 2

Dados do contratante

Etapa 3

Dados do contratado

Etapa 4

Dados do serviço

Etapa 5

Valores e pagamento

Etapa 6

Prazos e condições

Etapa 7

Revisão dos dados

Criar:

barra de progresso;

botão Voltar;

botão Continuar;

validação por etapa.

10. Revisão dos dados

Antes de enviar para a IA, apresentar uma tela de revisão.

Mostrar todos os dados preenchidos de forma organizada.

Exemplo:

PARTES

Contratante:
João da Silva

Contratado:
Empresa XYZ Ltda.

SERVIÇO

Desenvolvimento de website

VALOR

R$ 3.500,00

PAGAMENTO

50% na contratação
50% na entrega

O usuário poderá clicar em "Editar" em cada seção.

Botão:

Gerar documento com IA

11. Integração com Inteligência Artificial

Criar uma camada isolada para comunicação com a IA.

Exemplo:

services/aiService.js

A função deverá receber algo semelhante a:

generateDocument({
documentType,
documentRules,
formData
})

E retornar:

{
title,
content,
metadata
}

IMPORTANTE:

Não deixar a chave da API da IA exposta no frontend.

A aplicação deve ser preparada para utilizar um backend/proxy futuramente.

Como o projeto inicialmente é React + Vite, crie uma camada de abstração:

aiService

para que posteriormente eu possa conectar:

API própria;

OpenAI;

Gemini;

Groq;

OpenRouter;

outro provedor.

Não acople toda a aplicação diretamente a um único fornecedor.

12. Prompt de sistema da IA

A IA deverá receber um prompt de sistema especializado.

A estrutura deverá ser semelhante a:

Você é um assistente especializado na elaboração de documentos formais.

Sua função é transformar os dados fornecidos pelo usuário em um documento claro, organizado e profissional.

Regras:

Nunca invente informações.

Utilize somente os dados fornecidos.

Caso uma informação necessária esteja ausente, utilize um marcador apropriado ou informe que o dado está ausente.

Mantenha linguagem formal e clara.

Organize o documento em cláusulas e seções.

Não altere valores fornecidos pelo usuário.

Não altere nomes, documentos, datas ou informações cadastrais.

Não adicione obrigações que não tenham sido solicitadas sem deixar isso claro.

Preserve a intenção comercial informada pelo usuário.

Gere o documento em formato adequado para edição posterior.

Não inclua explicações sobre o processo de geração dentro do documento.

Retorne somente o conteúdo solicitado.

O prompt deverá receber também as regras específicas de cada tipo de documento.

13. Contexto enviado para a IA

A requisição deverá conter:

Tipo de documento

Exemplo:

Contrato de Prestação de Serviços

Regras do documento

Exemplo:

Deve possuir identificação das partes.

Deve possuir objeto do contrato.

Deve possuir descrição dos serviços.

Deve possuir valores.

Deve possuir forma de pagamento.

Deve possuir prazo.

Deve possuir cláusulas de rescisão.

Deve possuir foro.

Deve possuir espaço para assinatura.

Dados fornecidos

Enviar todos os dados preenchidos pelo usuário.

A IA deverá transformar essas informações em um documento final.

14. Estado de geração

Quando o usuário clicar em:

Gerar documento

mostrar uma tela/loading profissional.

Exemplos de mensagens:

"Analisando as informações..."

"Organizando as cláusulas..."

"Gerando seu documento..."

"Finalizando documento..."

Não permitir múltiplas requisições acidentais.

15. Editor do documento

Depois da geração, abrir uma tela de edição.

Utilizar TipTap ou editor equivalente.

O usuário deverá conseguir:

editar texto;

adicionar texto;

remover texto;

negrito;

itálico;

títulos;

listas;

alinhamento;

espaçamento;

desfazer/refazer.

A interface deve parecer um editor de documentos.

Criar uma área central semelhante a uma folha A4.

16. Preview

O documento deve ser apresentado visualmente como uma página A4.

Exemplo:

┌─────────────────────────────┐
│ │
│ CONTRATO │
│ │
│ CLÁUSULA 1ª │
│ │
│ Texto do contrato... │
│ │
│ CLÁUSULA 2ª │
│ │
│ Texto... │
│ │
│ │
│ _______________________ │
│ Contratante │
│ │
└─────────────────────────────┘

Criar aparência profissional e próxima de um documento real.

17. Geração do PDF

Criar botão:

Gerar PDF

O PDF deve:

possuir tamanho A4;

respeitar margens;

manter formatação;

possuir quebra automática de páginas;

possuir cabeçalho opcional;

possuir rodapé opcional;

preservar acentuação;

ser adequado para impressão.

O PDF deve representar o documento exatamente como o usuário visualiza no editor.

18. Assinaturas

Preparar a arquitetura para futuramente adicionar:

assinatura manual;

assinatura eletrônica;

assinatura digital;

campos para nome;

CPF/CNPJ;

data.

Inicialmente pode apenas existir um espaço para assinatura no documento.

19. Salvamento

Preparar o sistema para salvar documentos.

Inicialmente pode utilizar localStorage ou IndexedDB.

Estrutura aproximada:

{
id,
documentType,
title,
data,
content,
createdAt,
updatedAt
}

No futuro isso poderá ser substituído por Supabase.

Portanto, criar uma camada de persistência:

storageService

para evitar acoplamento direto ao localStorage.

20. Histórico

Criar página:

"Meus documentos"

Com:

nome;

tipo;

data;

última alteração;

ações.

Ações:

Abrir

Editar

Duplicar

Excluir

Gerar PDF

21. Design

Quero um design moderno de SaaS.

Características:

minimalista;

profissional;

bastante espaço em branco;

cards;

bordas suaves;

sombras discretas;

boa hierarquia visual;

responsivo;

desktop-first, mas funcionando perfeitamente no mobile.

Evitar aparência genérica de template.

Criar uma identidade visual consistente.

22. Responsividade

A aplicação deve funcionar em:

desktop;

notebook;

tablet;

celular.

No celular, o editor e a visualização do documento devem ser adaptados para a tela.

23. Tratamento de erros

Implementar tratamento para:

erro da API;

timeout;

resposta vazia;

dados incompletos;

erro de geração do PDF;

falha de conexão.

Exibir mensagens amigáveis.

Nunca mostrar stack traces para o usuário.

24. Validação

Utilizar React Hook Form + Zod.

Validar:

campos obrigatórios;

e-mail;

CPF;

CNPJ;

telefone;

datas;

valores;

campos condicionais.

As mensagens devem estar em português.

25. Segurança

Não armazenar chaves de API no frontend.

Não confiar somente na validação do frontend.

Preparar a aplicação para futuramente possuir backend.

Não enviar informações desnecessárias para a IA.

Considerar privacidade dos documentos e dados pessoais.

Adicionar futuramente:

autenticação;

criptografia;

banco de dados;

controle de acesso;

exclusão definitiva dos documentos.

26. Configuração dos documentos

Criar uma arquitetura em que adicionar um novo documento seja simples.

Idealmente:

documentTypes/
prestacaoServicos.js
compraVenda.js
locacao.js
freelancer.js
confidencialidade.js

Cada arquivo deverá definir:

nome;

descrição;

campos;

etapas;

regras;

estrutura;

prompt específico.

Exemplo:

const prestacaoServicos = {
id: "prestacao-servicos",

name: "Contrato de Prestação de Serviços",

description: "Contrato para formalização de prestação de serviços.",

steps: [...],

fields: [...],

aiInstructions: ...
}

Isso deve alimentar automaticamente:

seleção do documento;

formulário;

validação;

revisão;

prompt da IA.

27. Prompt final enviado à IA

Criar uma função que monte o prompt automaticamente.

Estrutura:

SYSTEM PROMPT

TIPO DO DOCUMENTO

REGRAS DO DOCUMENTO

DADOS DO USUÁRIO

INSTRUÇÕES DE FORMATAÇÃO

A aplicação não deve simplesmente mandar um JSON cru para a IA sem contexto.

Criar um prompt estruturado.

28. Resposta estruturada da IA

Sempre que possível, solicitar à IA uma resposta estruturada.

Por exemplo:

{
"title": "Contrato de Prestação de Serviços",
"content": "...",
"sections": [
{
"title": "DO OBJETO",
"content": "..."
}
]
}

Criar tratamento caso a IA retorne JSON inválido.

29. Separação entre conteúdo e apresentação

O texto gerado pela IA não deve depender diretamente do HTML utilizado no frontend.

Manter:

DOCUMENT DATA

↓

AI GENERATED CONTENT

↓

EDITOR

↓

PDF

Isso permitirá trocar o editor ou o sistema de PDF futuramente.

30. Página final

Após o PDF ser gerado, apresentar:

"Documento pronto!"

Botões:

Visualizar documento

Editar documento

Gerar PDF novamente

Novo documento

Meus documentos

31. Experiência do usuário

O fluxo precisa ser extremamente simples.

O usuário não deve precisar entender de IA.

Ele simplesmente:

Escolhe o documento.

Preenche os dados.

Clica em gerar.

Revisa.

Edita se necessário.

Gera o PDF.

A IA deve funcionar como uma camada invisível da experiência.

32. Arquitetura preparada para monetização

Estruture o projeto para futuramente possuir:

Plano gratuito:

3 documentos por mês.

Plano pago:

documentos ilimitados;

modelos premium;

histórico;

personalização;

assinatura eletrônica;

marca personalizada.

Não é necessário implementar pagamento agora, mas a arquitetura deve permitir isso futuramente.

33. Importante sobre documentos jurídicos

A aplicação deve deixar claro que os documentos gerados por IA são modelos e não substituem necessariamente a análise de um advogado ou profissional qualificado.

Não apresentar a IA como autoridade jurídica infalível.

Adicionar uma mensagem discreta na interface quando apropriado.

34. O que quero que você entregue

Quero que você construa a aplicação funcional, não apenas apresente um exemplo conceitual.

Comece criando:

Estrutura do projeto React + Vite.

Configuração do Tailwind.

Router.

Layout principal.

Dashboard.

Seleção de documentos.

Sistema de documentos configuráveis.

Formulário dinâmico.

Validação.

Tela de revisão.

Serviço de IA mockado inicialmente.

Tela de geração.

Editor de documentos.

Preview A4.

Geração de PDF.

Sistema de armazenamento local.

Histórico de documentos.

Arquitetura preparada para API real.

35. Desenvolvimento incremental

Não tente colocar tudo em um único arquivo.

Crie componentes pequenos e reutilizáveis.

Utilize boas práticas de React.

Evite:

componentes gigantes;

código duplicado;

lógica de negócio dentro da UI;

valores hardcoded espalhados;

dependência direta de uma API específica.

Sempre que uma funcionalidade puder ser configurável através de dados, prefira configuração em vez de código duplicado.

36. Primeiro MVP

Para o primeiro MVP, implemente completamente apenas estes documentos:

Contrato de Prestação de Serviços

Contrato de Freelancer

Orçamento Comercial

Recibo

Depois que a arquitetura estiver funcionando, ela deverá permitir adicionar novos documentos apenas criando novas configurações.

37. Resultado esperado

Ao final, quero ter uma aplicação que pareça um produto SaaS real, e não apenas um projeto demonstrativo.

O usuário deve conseguir:

Dashboard → escolher documento → preencher formulário → revisar → gerar com IA → editar → visualizar → gerar PDF → salvar documento

Toda a interface deve estar em português brasileiro.

O código deve ser limpo, organizado e pronto para receber posteriormente:

backend;

Supabase;

autenticação;

API de IA real;

pagamentos;

assinatura eletrônica;

novos modelos de documentos.

Comece pelo MVP funcional e explique brevemente as decisões arquiteturais importantes antes de apresentar os arquivos/códigos.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/025db230-5db5-44b0-8ab9-6f7aca7019b8).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
