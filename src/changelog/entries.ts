import type { Locale } from "@/i18n";

/**
 * Internal version history, shown in the app at /changelog.
 *
 * Rules:
 * - Newest entry first.
 * - Every release adds an entry here and in docs/CHANGELOG.md.
 * - `version` of the first entry must match package.json (a test enforces it).
 * - Every text exists in English and Brazilian Portuguese.
 * - Bump the profile version in src/profiles when weights or categories change.
 */

export type Text = Record<Locale, string>;

export type Area = "method" | "interface" | "design" | "export" | "quality" | "docs" | "limits";

export interface ReleaseGroup {
  area: Area;
  items: Text[];
}

export interface Release {
  version: string;
  /** ISO date, YYYY-MM-DD. */
  date: string;
  title: Text;
  summary: Text;
  sentaiProfileVersion: number;
  groups: ReleaseGroup[];
}

export const releases: Release[] = [
  {
    version: "0.5.1",
    date: "2026-11-11",
    sentaiProfileVersion: 1,
    title: { en: "Named palette and hex codes", "pt-BR": "Paleta nomeada e códigos hex" },
    summary: {
      en: "Every color of both themes now has a name, and each color on the Meaning page shows its hex code and copies it on a click.",
      "pt-BR":
        "Todas as cores dos dois temas agora têm nome, e cada cor da página Significado mostra o código hex e o copia com um clique.",
    },
    groups: [
      {
        area: "design",
        items: [
          {
            en: "The two missing names were added: Kinari (生成り) for the card surface of the light theme and Kurocha (黒茶) for the card surface of the dark theme. The text color of the dark theme is now Zōge (象牙), in place of the English word Ivory, so the whole palette is named the same way.",
            "pt-BR":
              "Os dois nomes que faltavam foram adicionados: Kinari (生成り) para a superfície dos cartões no tema claro e Kurocha (黒茶) para a do tema escuro. A cor do texto no tema escuro agora é Zōge (象牙), no lugar da palavra inglesa Ivory, então toda a paleta é nomeada do mesmo jeito.",
          },
          {
            en: "Each color is described on the Meaning page, including Shu, which is a little lighter on the dark theme.",
            "pt-BR":
              "Cada cor é descrita na página Significado, inclusive o Shu, que fica um pouco mais claro no tema escuro.",
          },
        ],
      },
      {
        area: "interface",
        items: [
          {
            en: "Hover over a color, or focus it with the keyboard, to see its hex code. Select it to copy the code. A tap on a touch screen shows it too.",
            "pt-BR":
              "Passe o mouse sobre uma cor, ou foque nela com o teclado, para ver o código hex. Selecione para copiar. Um toque em tela sensível também mostra o código.",
          },
          {
            en: "The five pillar colors are listed under each theme with the same behavior.",
            "pt-BR": "As cinco cores dos pilares aparecem sob cada tema, com o mesmo comportamento.",
          },
          {
            en: "The code is read from the computed color on screen, so it always matches what is shown.",
            "pt-BR": "O código é lido da cor calculada na tela, então sempre bate com o que é mostrado.",
          },
        ],
      },
      {
        area: "docs",
        items: [
          {
            en: "The semiotics page and the design system table list all names.",
            "pt-BR": "A página de semiótica e a tabela do design system listam todos os nomes.",
          },
        ],
      },
    ],
  },
  {
    version: "0.5.0",
    date: "2026-11-10",
    sentaiProfileVersion: 1,
    title: { en: "Local draft", "pt-BR": "Rascunho local" },
    summary: {
      en: "Your work is now kept as a draft in this browser, so a refresh, a closed tab or a crash no longer costs a whole evaluation. Nothing is sent anywhere, and it can be turned off.",
      "pt-BR":
        "Seu trabalho agora fica guardado como rascunho neste navegador, então atualizar a página, fechar a aba ou uma falha não custa mais uma avaliação inteira. Nada é enviado, e dá para desligar.",
    },
    groups: [
      {
        area: "interface",
        items: [
          {
            en: "The evaluation is saved in this browser a moment after every change, and when the page is hidden or closed. A blank evaluation is never saved.",
            "pt-BR":
              "A avaliação é salva neste navegador um instante depois de cada alteração, e quando a página é ocultada ou fechada. Uma avaliação em branco nunca é salva.",
          },
          {
            en: "On the next visit a prompt offers to restore the draft or discard it. Nothing is replaced without your choice, and the stored draft is left untouched until you decide.",
            "pt-BR":
              "Na visita seguinte, um aviso oferece restaurar o rascunho ou descartá-lo. Nada é substituído sem a sua escolha, e o rascunho guardado fica intacto até você decidir.",
          },
          {
            en: "A quiet line under the buttons says where your work is kept, with buttons to delete the draft or turn the feature off. Turning it off also deletes the stored copy.",
            "pt-BR":
              "Uma linha discreta abaixo dos botões diz onde seu trabalho está guardado, com botões para apagar o rascunho ou desligar o recurso. Desligar também apaga a cópia guardada.",
          },
          {
            en: "With the draft off, leaving a page that holds work asks for confirmation first.",
            "pt-BR": "Com o rascunho desligado, sair de uma página que tem trabalho pede confirmação antes.",
          },
          {
            en: "The grading mode and the Markdown export format are now remembered between visits, like the language.",
            "pt-BR":
              "O modo de avaliação e o formato da exportação em Markdown agora são lembrados entre visitas, como o idioma.",
          },
        ],
      },
      {
        area: "method",
        items: [
          {
            en: "Start over also deletes the draft. Starting over and importing JSON behave as before.",
            "pt-BR":
              "Recomeçar também apaga o rascunho. Recomeçar e importar JSON se comportam como antes.",
          },
        ],
      },
      {
        area: "quality",
        items: [
          {
            en: "A broken, foreign or out of range draft is ignored instead of breaking the page, and the app works normally when the browser blocks storage. Tests cover the rules and the browser flow.",
            "pt-BR":
              "Um rascunho quebrado, de outra origem ou fora da escala é ignorado em vez de quebrar a página, e o app funciona normalmente quando o navegador bloqueia o armazenamento. Testes cobrem as regras e o fluxo no navegador.",
          },
        ],
      },
      {
        area: "docs",
        items: [
          {
            en: "ADR 0009 records the change and its limits. The footer, the README and the notes of earlier decisions were updated to match.",
            "pt-BR":
              "O ADR 0009 registra a mudança e seus limites. O rodapé, o README e as notas de decisões anteriores foram atualizados para combinar.",
          },
        ],
      },
      {
        area: "limits",
        items: [
          {
            en: "The draft lives in one browser on one device. It does not sync, and clearing the site data of the browser removes it. Export JSON to keep an evaluation for good.",
            "pt-BR":
              "O rascunho vive em um navegador de um dispositivo. Ele não sincroniza, e limpar os dados do site no navegador o remove. Exporte o JSON para guardar uma avaliação de vez.",
          },
        ],
      },
    ],
  },
  {
    version: "0.4.0",
    date: "2026-11-09",
    sentaiProfileVersion: 1,
    title: { en: "Obsidian Markdown export", "pt-BR": "Exportação em Markdown do Obsidian" },
    summary: {
      en: "The Markdown export now comes in two formats. Standard stays as it was and renders anywhere. Obsidian adds properties, collapsible callouts, gauges and a chart for people who keep their notes in a vault.",
      "pt-BR":
        "A exportação em Markdown agora tem dois formatos. O Padrão continua como era e aparece corretamente em qualquer lugar. O Obsidian acrescenta propriedades, blocos recolhíveis, indicadores e um gráfico para quem guarda suas notas em um cofre.",
    },
    groups: [
      {
        area: "export",
        items: [
          {
            en: "New Obsidian format with properties (title, profile, mode, status, score, band, enjoyment, date, tags), so a vault can filter and sort evaluations.",
            "pt-BR":
              "Novo formato Obsidian com propriedades (título, perfil, modo, status, nota, faixa, diversão, data, tags), para que um cofre possa filtrar e ordenar avaliações.",
          },
          {
            en: "Each category becomes a collapsible callout with its grade, a ten cell gauge, the weight, the subcriteria and the reasoning. Partial scores, redistributed weights and quick evaluations get their own callouts.",
            "pt-BR":
              "Cada categoria vira um bloco recolhível com a nota, um indicador de dez células, o peso, os subcritérios e a justificativa. Notas parciais, pesos redistribuídos e avaliações rápidas ganham blocos próprios.",
          },
          {
            en: "The calculation is a table with the contribution of each category, followed by a Mermaid pie chart. The official score is highlighted, and the personal enjoyment score stays apart from it.",
            "pt-BR":
              "O cálculo é uma tabela com a contribuição de cada categoria, seguida de um gráfico de pizza em Mermaid. A nota oficial aparece destacada e a nota de diversão pessoal continua separada dela.",
          },
          {
            en: "The Standard format is unchanged, so forums and GitHub keep working. Both formats carry the same data in the same order.",
            "pt-BR":
              "O formato Padrão não mudou, então fóruns e GitHub continuam funcionando. Os dois formatos levam os mesmos dados na mesma ordem.",
          },
        ],
      },
      {
        area: "interface",
        items: [
          {
            en: "Format selector above the export buttons, with a short line that says where each format reads best.",
            "pt-BR":
              "Seletor de formato acima dos botões de exportação, com uma linha curta que diz onde cada formato é lido melhor.",
          },
        ],
      },
      {
        area: "quality",
        items: [
          {
            en: "Tests for the property block, the callouts, the Mermaid chart and the separation of the two scores.",
            "pt-BR":
              "Testes para o bloco de propriedades, os blocos de destaque, o gráfico Mermaid e a separação das duas notas.",
          },
        ],
      },
    ],
  },
  {
    version: "0.3.0",
    date: "2026-11-08",
    sentaiProfileVersion: 1,
    title: { en: "Detailed and Quick modes", "pt-BR": "Modos Detalhado e Rápido" },
    summary: {
      en: "The same method can now be graded at two levels of effort: Detailed (詳細) through subcriteria, or Quick (簡易) with one grade per category. Three navigation and input bugs were also fixed.",
      "pt-BR":
        "O mesmo método agora pode ser avaliado em dois níveis de esforço: Detalhado (詳細), por subcritérios, ou Rápido (簡易), com uma nota por categoria. Três bugs de navegação e de entrada também foram corrigidos.",
    },
    groups: [
      {
        area: "method",
        items: [
          {
            en: "Two evaluation modes, Detailed (詳細) and Quick (簡易). The weights, the not applicable rules and the calculation are identical in both. A test checks that the same data gives the same result in either mode.",
            "pt-BR":
              "Dois modos de avaliação, Detalhado (詳細) e Rápido (簡易). Os pesos, as regras de não aplicável e o cálculo são idênticos nos dois. Um teste confere que os mesmos dados dão o mesmo resultado em qualquer modo.",
          },
          {
            en: "Switching modes never discards a grade. In Quick mode a category with subcriteria grades starts from their average, and moving the slider replaces it with a direct grade. One button returns to the average.",
            "pt-BR":
              "Alternar entre os modos nunca descarta uma nota. No modo Rápido, uma categoria com notas de subcritérios começa pela média deles, e mover o slider a substitui por uma nota direta. Um botão volta para a média.",
          },
          {
            en: "Starting over clears the grades but keeps the chosen mode.",
            "pt-BR": "Recomeçar apaga as notas, mas mantém o modo escolhido.",
          },
        ],
      },
      {
        area: "interface",
        items: [
          {
            en: "Mode switch above the categories, with the kanji next to each name and a short line that explains the current mode.",
            "pt-BR":
              "Seletor de modo acima das categorias, com o kanji ao lado de cada nome e uma linha curta que explica o modo atual.",
          },
          {
            en: "Quick rows: one slider per category that shows the grade band and its description, the source of the grade, and buttons for guidance and notes, clearing the grade and marking the category as not applicable.",
            "pt-BR":
              "Linhas do modo Rápido: um slider por categoria que mostra a faixa da nota e a descrição, a origem da nota e botões para orientações e anotações, limpar a nota e marcar a categoria como não aplicável.",
          },
          {
            en: "The result shows a Quick evaluation badge when the quick mode is in use.",
            "pt-BR": "O resultado mostra o selo Avaliação rápida quando o modo rápido está em uso.",
          },
          {
            en: "Fixed: returning to the main page from Meaning or the changelog left it scrolled slightly down. It now starts at the top. The cause was the global smooth scrolling, which made the scroll of the navigation animate and compete with the reset, so it was removed. The back to top button still scrolls smoothly, and the back button of the browser now restores your position at once.",
            "pt-BR":
              "Corrigido: voltar para a página principal a partir de Significado ou do histórico a deixava um pouco rolada para baixo. Agora ela começa no topo. A causa era a rolagem suave global, que fazia a rolagem da navegação animar e disputar com o reinício, então ela foi removida. O botão de voltar ao topo continua rolando com suavidade, e o botão voltar do navegador agora restaura sua posição na hora.",
          },
          {
            en: "Fixed: a grade of exactly 5.0 could not be set on an ungraded slider, because the slider rests at 5.0 and clicking there changes nothing. Releasing the slider, or pressing Enter, now commits the value. This affected every slider since 0.1.0.",
            "pt-BR":
              "Corrigido: não era possível dar a nota exata 5,0 em um slider sem nota, porque ele repousa em 5,0 e clicar ali não muda nada. Soltar o slider, ou pressionar Enter, agora registra o valor. Isso afetava todos os sliders desde a 0.1.0.",
          },
          {
            en: "Fixed: after Start over or an import, a category could still show the manual grade view with an empty slider. That state now follows the data.",
            "pt-BR":
              "Corrigido: depois de Recomeçar ou de uma importação, uma categoria ainda podia mostrar a visão de nota manual com um slider vazio. Esse estado agora acompanha os dados.",
          },
        ],
      },
      {
        area: "export",
        items: [
          {
            en: "The JSON export stores the mode. Files exported by earlier versions have no mode and load as Detailed.",
            "pt-BR":
              "A exportação em JSON guarda o modo. Arquivos exportados por versões anteriores não têm modo e são carregados como Detalhado.",
          },
          {
            en: "The Markdown export states when an evaluation was quick and leaves the subcriteria out.",
            "pt-BR": "A exportação em Markdown informa quando a avaliação foi rápida e deixa os subcritérios de fora.",
          },
        ],
      },
      {
        area: "docs",
        items: [
          {
            en: "The Meaning page and docs/semiotics.md explain 詳細 and 簡易. docs/framework.md has a new section on the two modes, and decision record 7 explains the choice.",
            "pt-BR":
              "A página Significado e o docs/semiotics.md explicam 詳細 e 簡易. O docs/framework.md ganhou uma seção sobre os dois modos, e o registro de decisão 7 explica a escolha.",
          },
        ],
      },
      {
        area: "quality",
        items: [
          {
            en: "New tests for the mode: default value, equal results in both modes, JSON round trip and files without a mode, rejection of an unknown mode, Markdown by mode, and the store actions.",
            "pt-BR":
              "Novos testes do modo: valor padrão, resultados iguais nos dois modos, ida e volta do JSON e arquivos sem modo, recusa de um modo desconhecido, Markdown por modo e as ações do store.",
          },
        ],
      },
      {
        area: "limits",
        items: [
          {
            en: "The chosen mode is not remembered between visits. Nothing is stored unless you export it.",
            "pt-BR": "O modo escolhido não é lembrado entre visitas. Nada é guardado a menos que você exporte.",
          },
        ],
      },
    ],
  },
  {
    version: "0.2.0",
    date: "2026-11-08",
    sentaiProfileVersion: 1,
    title: { en: "Meaning and community", "pt-BR": "Significado e comunidade" },
    summary: {
      en: "A new page explains where the name, colors, seal and numbers come from, and the project now has a license and a clear way to report bugs and contribute.",
      "pt-BR":
        "Uma nova página explica de onde vêm o nome, as cores, o selo e os números, e o projeto agora tem licença e um caminho claro para reportar bugs e contribuir.",
    },
    groups: [
      {
        area: "interface",
        items: [
          {
            en: "New Meaning page at /meaning. It teaches the name, the five pillars, the seal, the numerals, the colors of both themes and the typefaces, using the real elements of the app. Facts about language are tagged as facts, and pairings chosen for the project are tagged as design intent.",
            "pt-BR":
              "Nova página Significado em /meaning. Ela ensina o nome, os cinco pilares, o selo, os numerais, as cores dos dois temas e as fontes, usando os elementos reais do app. Fatos sobre a língua aparecem marcados como fatos, e combinações escolhidas para o projeto aparecem como intenção de design.",
          },
          {
            en: "Footer now links to Meaning and Contribute, next to the version and the credit.",
            "pt-BR": "O rodapé agora leva a Significado e a Contribuir, ao lado da versão e do crédito.",
          },
          {
            en: "Contribute card at the end of the Meaning page, with links to report a bug, suggest an improvement and read the contributing guide.",
            "pt-BR":
              "Cartão de contribuição no fim da página Significado, com links para reportar um bug, sugerir uma melhoria e ler o guia de contribuição.",
          },
          {
            en: "The Meaning page opens at the top and has the back to top button.",
            "pt-BR": "A página Significado abre no topo e tem o botão de voltar ao topo.",
          },
        ],
      },
      {
        area: "design",
        items: [
          {
            en: "Theme tokens can now be applied to any container, so a page can show the light and dark themes side by side. The look of the app itself did not change.",
            "pt-BR":
              "Os tokens de tema agora podem ser aplicados a qualquer contêiner, para que uma página mostre os temas claro e escuro lado a lado. A aparência do app em si não mudou.",
          },
        ],
      },
      {
        area: "docs",
        items: [
          {
            en: "New document docs/semiotics.md with the meaning of the name, kanji, colors, seal, numerals and type. The design system document only points to it.",
            "pt-BR":
              "Novo documento docs/semiotics.md com o significado do nome, dos kanjis, das cores, do selo, dos numerais e da tipografia. O documento do design system apenas aponta para ele.",
          },
          {
            en: "MIT license, contributing guide, bug and suggestion forms for GitHub issues, and a pull request template.",
            "pt-BR":
              "Licença MIT, guia de contribuição, formulários de bug e de sugestão para as issues do GitHub e um modelo de pull request.",
          },
          {
            en: "Decision record 6 explains why meaning has its own document and page.",
            "pt-BR": "O registro de decisão 6 explica por que o significado tem documento e página próprios.",
          },
        ],
      },
      {
        area: "quality",
        items: [
          {
            en: "New dictionary tests: same keys and placeholders in every language, no empty text, no em dashes, and complete text for every category, subcriterion and pillar of every profile.",
            "pt-BR":
              "Novos testes dos dicionários: mesmas chaves e marcadores em todos os idiomas, nenhum texto vazio, nenhum travessão, e texto completo para cada categoria, subcritério e pilar de cada perfil.",
          },
        ],
      },
    ],
  },
  {
    version: "0.1.2",
    date: "2026-11-06",
    sentaiProfileVersion: 1,
    title: { en: "Fixes and polish", "pt-BR": "Correções e acabamento" },
    summary: {
      en: "The changelog now opens at the top, English is always the starting language, the footer is easier to read and long pages have a way back to the top.",
      "pt-BR":
        "O histórico agora abre no topo, o inglês é sempre o idioma inicial, o rodapé ficou mais fácil de ler e as páginas longas ganharam um caminho de volta ao topo.",
    },
    groups: [
      {
        area: "interface",
        items: [
          {
            en: "Fixed: the changelog opened at the bottom, because the page kept the scroll position of the footer link. It now starts at the top, so the link back to the evaluator is visible.",
            "pt-BR":
              "Corrigido: o histórico abria no fim da página, porque mantinha a posição de rolagem do link do rodapé. Agora começa no topo, e o link de volta ao avaliador fica visível.",
          },
          {
            en: "English is now always the starting language, whatever the language of the browser. A language chosen on purpose is still remembered.",
            "pt-BR":
              "O inglês agora é sempre o idioma inicial, qualquer que seja o idioma do navegador. Um idioma escolhido de propósito continua sendo lembrado.",
          },
          {
            en: "Back to top button. It appears near the end of long pages, moves smoothly, and jumps instantly when reduced motion is on.",
            "pt-BR":
              "Botão de voltar ao topo. Aparece perto do fim das páginas longas, rola com suavidade e salta direto quando o movimento reduzido está ativado.",
          },
        ],
      },
      {
        area: "design",
        items: [
          {
            en: "Footer text increased from 11 px to 13 px, with a little more space above it.",
            "pt-BR": "O texto do rodapé passou de 11 px para 13 px, com um pouco mais de espaço acima.",
          },
        ],
      },
      {
        area: "docs",
        items: [
          {
            en: "README cleaned of merge leftovers. Commit message suggestions now follow the Conventional Commits pattern.",
            "pt-BR":
              "README limpo de sobras de merge. As sugestões de mensagem de commit agora seguem o padrão Conventional Commits.",
          },
        ],
      },
    ],
  },
  {
    version: "0.1.1",
    date: "2026-11-06",
    sentaiProfileVersion: 1,
    title: { en: "Site icon", "pt-BR": "Ícone do site" },
    summary: {
      en: "The hanko seal with the 点 kanji is now the icon of the site in browser tabs, bookmarks and on the home screen of phones.",
      "pt-BR":
        "O selo hanko com o kanji 点 agora é o ícone do site nas abas do navegador, nos favoritos e na tela inicial de celulares.",
    },
    groups: [
      {
        area: "design",
        items: [
          {
            en: "Vector icon (icon.svg) in vermilion with the kanji in cream. The kanji outline comes from the Shippori Mincho font and is stored as a path, so it needs no font to display.",
            "pt-BR":
              "Ícone vetorial (icon.svg) em vermelhão com o kanji em creme. O contorno do kanji vem da fonte Shippori Mincho e fica guardado como um traçado, então não depende de fonte para aparecer.",
          },
          {
            en: "favicon.ico with 16, 32 and 48 px frames. The small sizes drop the inner border and use a larger kanji to stay readable.",
            "pt-BR":
              "favicon.ico com quadros de 16, 32 e 48 px. Os tamanhos pequenos retiram a borda interna e usam um kanji maior para continuar legíveis.",
          },
          {
            en: "Apple touch icon (180 px) without rounded corners, since iOS applies its own.",
            "pt-BR": "Ícone para a tela inicial da Apple (180 px) sem cantos arredondados, já que o iOS aplica os seus.",
          },
        ],
      },
    ],
  },
  {
    version: "0.1.0",
    date: "2026-11-06",
    sentaiProfileVersion: 1,
    title: { en: "First usable release", "pt-BR": "Primeira versão utilizável" },
    summary: {
      en: "The Kijun method for Super Sentai as a working static app: grading by subcriteria, weighted official score, separate personal enjoyment, export and import, two languages and two themes.",
      "pt-BR":
        "O método Kijun para Super Sentai como um app estático funcional: avaliação por subcritérios, nota oficial ponderada, diversão pessoal separada, exportação e importação, dois idiomas e dois temas.",
    },
    groups: [
      {
        area: "method",
        items: [
          {
            en: "Sentai profile with ten categories whose weights add up to 100%: Theme 8, Suits 8, Mecha 8, Story 14, Characters 14, Squad Chemistry 12, Music 8, Action 10, Production 8, Pacing 10.",
            "pt-BR":
              "Perfil Sentai com dez categorias cujos pesos somam 100%: Tema 8, Trajes 8, Mecha 8, História 14, Personagens 14, Química do Time 12, Música 8, Ação 10, Produção 8, Ritmo 10.",
          },
          {
            en: "Every category has its own subcriteria, taken from the original method. The category grade is the average of the graded subcriteria.",
            "pt-BR":
              "Cada categoria tem seus subcritérios, tirados do método original. A nota da categoria é a média dos subcritérios avaliados.",
          },
          {
            en: "A subcriterion can be marked as not applicable and is then left out of the average.",
            "pt-BR": "Um subcritério pode ser marcado como não aplicável e então sai da média.",
          },
          {
            en: "A category grade can be set by hand. A manual grade replaces the average and is labeled as such.",
            "pt-BR": "A nota de uma categoria pode ser definida à mão. A nota manual substitui a média e é identificada como tal.",
          },
          {
            en: "A whole category can be marked as not applicable. Its weight is shared among the remaining categories in proportion to their own weights.",
            "pt-BR":
              "Uma categoria inteira pode ser marcada como não aplicável. O peso dela é dividido entre as demais categorias na proporção dos pesos de cada uma.",
          },
          {
            en: "Categories without a grade are never counted as an average. The score stays partial until every applicable category is graded.",
            "pt-BR":
              "Categorias sem nota nunca são contadas como média. A nota fica parcial até que toda categoria aplicável tenha sido avaliada.",
          },
          {
            en: "Personal enjoyment is stored apart from the evaluation grades and is never read by the scoring code.",
            "pt-BR": "A diversão pessoal é guardada separada das notas da avaliação e nunca é lida pelo código de cálculo.",
          },
          {
            en: "Grade bands from Abysmal (0) to Masterpiece (10). A half rounds up, so 5.5 is Fine.",
            "pt-BR": "Faixas de nota de Abismal (0) a Obra-prima (10). Meio ponto arredonda para cima, então 5,5 é Razoável.",
          },
          {
            en: "Each category shows what it covers and what belongs to its neighbors, to prevent counting the same strength twice.",
            "pt-BR":
              "Cada categoria mostra o que cobre e o que pertence às vizinhas, para evitar contar a mesma qualidade duas vezes.",
          },
          {
            en: "A reading note under the score explains that 6 and 7 are solid results and that a number does not describe a whole work. When the category grades are very close or very far apart, a second line says so.",
            "pt-BR":
              "Uma nota de leitura sob o resultado explica que 6 e 7 são resultados sólidos e que um número não descreve uma obra inteira. Quando as notas das categorias estão muito próximas ou muito distantes, uma segunda linha avisa.",
          },
        ],
      },
      {
        area: "interface",
        items: [
          {
            en: "Season title and introduction, ten collapsible category cards, a progress bar and an expand all control.",
            "pt-BR":
              "Título e introdução da temporada, dez cartões de categoria recolhíveis, barra de progresso e controle para expandir tudo.",
          },
          {
            en: "Sliders for subcriteria, category grades and enjoyment. An ungraded slider shows no fill, so it cannot be mistaken for a grade.",
            "pt-BR":
              "Sliders para subcritérios, notas de categoria e diversão. Um slider sem nota aparece sem preenchimento, para não ser confundido com uma nota.",
          },
          {
            en: "Result panel with the official score, a provisional or decided seal, a radar chart, a calculation table and the strongest and weakest categories.",
            "pt-BR":
              "Painel de resultado com a nota oficial, selo provisório ou definitivo, gráfico radar, tabela de cálculo e as categorias mais forte e mais fraca.",
          },
          {
            en: "Score in the sticky header, so it stays visible while grading.",
            "pt-BR": "Nota no cabeçalho fixo, para ficar visível durante a avaliação.",
          },
          {
            en: "Interface in English and Brazilian Portuguese. The language follows the browser at first and the choice is remembered.",
            "pt-BR":
              "Interface em inglês e português do Brasil. O idioma segue o navegador no primeiro acesso e a escolha é lembrada.",
          },
          {
            en: "Everything lives in memory. Closing the tab clears the evaluation, by design.",
            "pt-BR": "Tudo fica na memória. Fechar a aba apaga a avaliação, de propósito.",
          },
        ],
      },
      {
        area: "design",
        items: [
          {
            en: "Light theme Washi (cream paper, sumi ink) and dark theme Shikkoku (lacquer black, ivory text). Pure white and pure black are not used.",
            "pt-BR":
              "Tema claro Washi (papel creme, tinta sumi) e tema escuro Shikkoku (preto laca, texto marfim). Branco e preto puros não são usados.",
          },
          {
            en: "The theme follows the system until you pick one. Options: Light, Dark, System.",
            "pt-BR": "O tema segue o sistema até você escolher um. Opções: Claro, Escuro, Sistema.",
          },
          {
            en: "Five pillars with the ranger colors and the kanji 赤 青 黄 緑 桃. Categories are numbered with formal numerals.",
            "pt-BR":
              "Cinco pilares com as cores dos rangers e os kanjis 赤 青 黄 緑 桃. As categorias são numeradas com numerais formais.",
          },
          {
            en: "Hanko seal as the logo and as the result stamp. Fonts: Dela Gothic One, Shippori Mincho, Zen Kaku Gothic New and JetBrains Mono.",
            "pt-BR":
              "Selo hanko como logo e como carimbo do resultado. Fontes: Dela Gothic One, Shippori Mincho, Zen Kaku Gothic New e JetBrains Mono.",
          },
          {
            en: "Reduced motion is respected, focus is always visible and the layout works from 360 px wide.",
            "pt-BR":
              "Movimento reduzido é respeitado, o foco é sempre visível e o layout funciona a partir de 360 px de largura.",
          },
        ],
      },
      {
        area: "export",
        items: [
          {
            en: "Markdown export in the seven-part format of the method. It can be copied or downloaded, and it states when weights were redistributed or the score is partial.",
            "pt-BR":
              "Exportação em Markdown no formato de sete partes do método. Pode ser copiada ou baixada, e informa quando os pesos foram redistribuídos ou a nota é parcial.",
          },
          {
            en: "JSON export and import. Imports are validated against the profile and rejected with a clear message when the file does not fit.",
            "pt-BR":
              "Exportação e importação em JSON. A importação é validada contra o perfil e recusada com uma mensagem clara quando o arquivo não serve.",
          },
          {
            en: "Starting over asks for confirmation first.",
            "pt-BR": "Recomeçar pede confirmação antes.",
          },
        ],
      },
      {
        area: "quality",
        items: [
          {
            en: "The scoring engine is pure TypeScript and covered by unit tests: weights, subcriteria averages, redistribution, partial scores, grade bands, reading tiers, Markdown order and the JSON round trip.",
            "pt-BR":
              "O motor de cálculo é TypeScript puro e coberto por testes unitários: pesos, médias de subcritérios, redistribuição, notas parciais, faixas, tons de leitura, ordem do Markdown e ida e volta do JSON.",
          },
          {
            en: "A test keeps this changelog in sync with the version in package.json.",
            "pt-BR": "Um teste mantém este histórico em sincronia com a versão do package.json.",
          },
          {
            en: "Dictionaries are typed, so a missing translation fails the type check.",
            "pt-BR": "Os dicionários são tipados, então uma tradução faltando quebra a checagem de tipos.",
          },
        ],
      },
      {
        area: "docs",
        items: [
          {
            en: "README, the method description, the design system and five decision records.",
            "pt-BR": "README, descrição do método, design system e cinco registros de decisão.",
          },
        ],
      },
      {
        area: "limits",
        items: [
          {
            en: "No draft is kept after a refresh. Export JSON to keep your work.",
            "pt-BR": "Nenhum rascunho é mantido depois de atualizar a página. Exporte o JSON para guardar seu trabalho.",
          },
          {
            en: "Grade guidance is generic. Category specific anchors for what a 3, 5, 7 or 9 means are not written yet.",
            "pt-BR":
              "A orientação de notas é genérica. Âncoras específicas por categoria para o que significa um 3, 5, 7 ou 9 ainda não foram escritas.",
          },
          {
            en: "Only the Sentai profile exists.",
            "pt-BR": "Só existe o perfil Sentai.",
          },
        ],
      },
    ],
  },
];

export const planned: Text[] = [
  {
    en: "Category specific grade anchors, written together with the method.",
    "pt-BR": "Âncoras de nota específicas por categoria, escritas junto com o método.",
  },
  {
    en: "Consistency checklist before finishing an evaluation.",
    "pt-BR": "Checklist de consistência antes de finalizar uma avaliação.",
  },
  {
    en: "Keyboard shortcuts for grading and marking not applicable.",
    "pt-BR": "Atalhos de teclado para avaliar e marcar como não aplicável.",
  },
  {
    en: "Compare two or more seasons side by side from imported JSON files.",
    "pt-BR": "Comparar duas ou mais temporadas lado a lado a partir de arquivos JSON importados.",
  },
  {
    en: "Kamen Rider profile.",
    "pt-BR": "Perfil Kamen Rider.",
  },
  {
    en: "Sensitivity view: how much each category moves the final score.",
    "pt-BR": "Visão de sensibilidade: o quanto cada categoria move a nota final.",
  },
];

export const currentVersion = releases[0].version;
