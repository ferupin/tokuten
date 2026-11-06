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
    en: "Optional draft saved in the browser, off by default.",
    "pt-BR": "Rascunho opcional salvo no navegador, desligado por padrão.",
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
