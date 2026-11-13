import type { Locale } from "@/i18n";

/**
 * Internal version history, shown in the app at /changelog.
 *
 * Rules:
 * - Newest entry first.
 * - Every release adds an entry here and in docs/CHANGELOG.md.
 * - `version` of the first entry must match package.json (a test enforces it).
 * - Every text exists in English. Brazilian Portuguese and Spanish are kept
 *   complete too (a test enforces it). Other languages may be partial, and a
 *   missing text falls back to English.
 * - Bump the profile version in src/profiles when weights or categories change.
 */

/**
 * One text in several languages. English is required and is the fallback, so a
 * new language can be added without translating the whole history at once.
 */
export type Text = { en: string } & Partial<Record<Locale, string>>;

/** Text in the given language, or in English when that translation is missing. */
export const pick = (text: Text, locale: Locale): string => text[locale] ?? text.en;

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
    version: "0.11.0",
    date: "2026-11-13",
    sentaiProfileVersion: 1,
    title: { en: "A stable file format", "pt-BR": "Um formato de arquivo estável", es: "Un formato de archivo estable" },
    summary: {
      en: "The JSON file is now covered by a written promise and by tests: old files keep opening with the same score, and a file from a newer format is refused with a clear message.",
      "pt-BR": "O arquivo JSON agora tem uma promessa escrita e testes: arquivos antigos continuam abrindo com a mesma nota, e um arquivo de um formato mais novo é recusado com uma mensagem clara.",
      es: "El archivo JSON ahora tiene una promesa escrita y pruebas: los archivos antiguos siguen abriéndose con la misma puntuación, y un archivo de un formato más nuevo se rechaza con un mensaje claro.",
    },
    groups: [
      {
        area: "export",
        items: [
          {
            en: "Importing a file whose schema is newer than the app understands now stops with its own message, The file comes from a newer version of Tokuten, instead of being half read.",
            "pt-BR":
              "Importar um arquivo cujo esquema é mais novo do que o app entende agora para com uma mensagem própria, O arquivo vem de uma versão mais nova do Tokuten, em vez de ser lido pela metade.",
            es: "Importar un archivo cuyo esquema es más nuevo de lo que la aplicación entiende ahora se detiene con su propio mensaje, El archivo viene de una versión más nueva de Tokuten, en lugar de leerse a medias.",
          },
          {
            en: "Files with fields the app does not know still open, so a later version can add optional fields without breaking this one. The file format itself did not change.",
            "pt-BR":
              "Arquivos com campos que o app não conhece continuam abrindo, então uma versão futura pode adicionar campos opcionais sem quebrar esta. O formato do arquivo em si não mudou.",
            es: "Los archivos con campos que la aplicación no conoce siguen abriéndose, así que una versión futura puede añadir campos opcionales sin romper esta. El formato del archivo en sí no cambió.",
          },
        ],
      },
      {
        area: "quality",
        items: [
          {
            en: "Three real files from earlier stages of the format (before modes, with modes, with the checklist) are kept as fixtures. A test checks that each opens, gives the same score and gets the right defaults.",
            "pt-BR":
              "Três arquivos reais de fases anteriores do formato (antes dos modos, com modos, com a checklist) ficam guardados como amostras. Um teste verifica que cada um abre, dá a mesma nota e recebe os padrões corretos.",
            es: "Tres archivos reales de etapas anteriores del formato (antes de los modos, con modos, con la lista de consistencia) se guardan como muestras. Una prueba comprueba que cada uno se abre, da la misma puntuación y recibe los valores por defecto correctos.",
          },
          {
            en: "The file written by the current version is pinned to the newest fixture, so any change to the format makes a test fail and has to be a decision.",
            "pt-BR":
              "O arquivo escrito pela versão atual é fixado na amostra mais nova, então qualquer mudança no formato faz um teste falhar e precisa ser uma decisão.",
            es: "El archivo escrito por la versión actual se fija a la muestra más nueva, así que cualquier cambio en el formato hace fallar una prueba y tiene que ser una decisión.",
          },
        ],
      },
      {
        area: "docs",
        items: [
          {
            en: "New document docs/file-format.md with the promise for 1.x: old files keep opening, new fields are optional, unknown fields are ignored, a newer file is refused, and a breaking change is a new schema and a new major version. It also describes the share link and the draft.",
            "pt-BR":
              "Novo documento docs/file-format.md com a promessa para a 1.x: arquivos antigos continuam abrindo, campos novos são opcionais, campos desconhecidos são ignorados, um arquivo mais novo é recusado, e uma mudança que quebra é um novo esquema e uma nova versão maior. Ele descreve também o link de compartilhamento e o rascunho.",
            es: "Nuevo documento docs/file-format.md con la promesa para la 1.x: los archivos antiguos siguen abriéndose, los campos nuevos son opcionales, los campos desconocidos se ignoran, un archivo más nuevo se rechaza, y un cambio que rompe es un nuevo esquema y una nueva versión mayor. También describe el enlace para compartir y el borrador.",
          },
        ],
      },
    ],
  },
  {
    version: "0.10.0",
    date: "2026-11-13",
    sentaiProfileVersion: 1,
    title: { en: "Share a result as a link", "pt-BR": "Compartilhe o resultado como link", es: "Comparte el resultado como enlace" },
    summary: {
      en: "A result can now travel as a short, readable link. Whoever opens it sees the same card, read only, and nothing goes through a server.",
      "pt-BR": "Um resultado agora pode viajar como um link curto e legível. Quem abrir vê o mesmo cartão, só para leitura, e nada passa por um servidor.",
      es: "Un resultado ahora puede viajar como un enlace corto y legible. Quien lo abra verá la misma tarjeta, de solo lectura, y nada pasa por un servidor.",
    },
    groups: [
      {
        area: "interface",
        items: [
          {
            en: "The Results page has a new Share as a link section with the link and a Copy link button. The personal enjoyment switch applies to the link too, and it is off by default.",
            "pt-BR":
              "A página de Resultados tem uma nova seção Compartilhar como link, com o link e um botão Copiar link. A chave do gosto pessoal vale também para o link e fica desligada por padrão.",
            es: "La página de Resultados tiene una nueva sección Compartir como enlace, con el enlace y un botón Copiar enlace. El interruptor del disfrute personal también vale para el enlace y está desactivado por defecto.",
          },
          {
            en: "Opening a link shows the shared card at /results, read only, in the language of the person who opens it, with the same layouts, theme choice, download, copy and description as before.",
            "pt-BR":
              "Abrir um link mostra o cartão compartilhado em /results, só para leitura, no idioma de quem abre, com os mesmos layouts, escolha de tema, download, cópia e descrição de antes.",
            es: "Abrir un enlace muestra la tarjeta compartida en /results, de solo lectura, en el idioma de quien lo abre, con los mismos diseños, elección de tema, descarga, copia y descripción de antes.",
          },
          {
            en: "Open in the evaluator turns a shared result into an evaluation in Quick mode, with the grades from the link. If the evaluator already has work in it, a confirmation asks before replacing it. Show my own result goes back to your own card.",
            "pt-BR":
              "Abrir no avaliador transforma um resultado compartilhado em uma avaliação no modo Rápido, com as notas do link. Se o avaliador já tiver trabalho, uma confirmação pergunta antes de substituir. Mostrar o meu resultado volta ao seu próprio cartão.",
            es: "Abrir en el evaluador convierte un resultado compartido en una evaluación en modo Rápido, con las notas del enlace. Si el evaluador ya tiene trabajo, una confirmación pregunta antes de reemplazarlo. Mostrar mi propio resultado vuelve a tu propia tarjeta.",
          },
          {
            en: "A link that is damaged, cut short, from a newer version or for an unknown profile shows a clear message instead of a broken card.",
            "pt-BR":
              "Um link danificado, cortado, de uma versão mais nova ou de um perfil desconhecido mostra uma mensagem clara em vez de um cartão quebrado.",
            es: "Un enlace dañado, cortado, de una versión más nueva o de un perfil desconocido muestra un mensaje claro en lugar de una tarjeta rota.",
          },
        ],
      },
      {
        area: "export",
        items: [
          {
            en: "The link is plain text that a person can read, for example /results#1/sentai/8,7.5,7,-,n,9,8,7.5,6.5,7/t=Season. It holds the format version, the profile, one grade per category (n for not applicable, a dash for not graded), optional enjoyment and the title.",
            "pt-BR":
              "O link é texto simples que uma pessoa consegue ler, por exemplo /results#1/sentai/8,7.5,7,-,n,9,8,7.5,6.5,7/t=Temporada. Ele guarda a versão do formato, o perfil, uma nota por categoria (n para não se aplica, um traço para sem nota), o gosto pessoal opcional e o título.",
            es: "El enlace es texto simple que una persona puede leer, por ejemplo /results#1/sentai/8,7.5,7,-,n,9,8,7.5,6.5,7/t=Temporada. Contiene la versión del formato, el perfil, una nota por categoría (n para no aplica, un guion para sin calificar), el disfrute personal opcional y el título.",
          },
          {
            en: "It holds the grades and never the score, so the receiving side calculates the score with the same engine and the two cannot disagree. The introduction, the notes and the conclusion are not in it.",
            "pt-BR":
              "Ele guarda as notas e nunca a nota final, então quem recebe calcula a nota com o mesmo motor e os dois não podem discordar. A introdução, as anotações e a conclusão não estão nele.",
            es: "Contiene las notas y nunca la puntuación, así que quien lo recibe calcula la puntuación con el mismo motor y ambos no pueden discrepar. La introducción, los comentarios y la conclusión no están en él.",
          },
          {
            en: "Everything after the # sign stays in the browser and is never sent to a server, so the app still has no server side at all.",
            "pt-BR":
              "Tudo depois do sinal # fica no navegador e nunca é enviado a um servidor, então o app continua sem nenhum lado servidor.",
            es: "Todo lo que va después del signo # se queda en el navegador y nunca se envía a un servidor, así que la aplicación sigue sin ningún lado servidor.",
          },
        ],
      },
      {
        area: "design",
        items: [
          {
            en: "A generic preview image (1200 by 630) is added to the site, so a link to Tokuten shows a card in chats and social networks. It cannot show the result itself, because drawing one image per link would need a server.",
            "pt-BR":
              "Uma imagem de prévia genérica (1200 por 630) foi adicionada ao site, para que um link do Tokuten mostre um cartão em chats e redes sociais. Ela não consegue mostrar o resultado em si, porque desenhar uma imagem por link exigiria um servidor.",
            es: "Se añadió al sitio una imagen de vista previa genérica (1200 por 630), para que un enlace a Tokuten muestre una tarjeta en chats y redes sociales. No puede mostrar el resultado en sí, porque dibujar una imagen por enlace requeriría un servidor.",
          },
        ],
      },
      {
        area: "quality",
        items: [
          {
            en: "Tests for the link: format, round trip to the same score, not applicable and not graded categories, titles with slashes, accents, kanji and emoji, a long title, enjoyment only when asked, and rejection of empty, damaged, out of range, repeated, too long and prototype name inputs.",
            "pt-BR":
              "Testes do link: formato, ida e volta para a mesma nota, categorias não se aplica e sem nota, títulos com barras, acentos, kanji e emoji, título longo, gosto pessoal só quando pedido, e rejeição de entradas vazias, danificadas, fora da escala, repetidas, longas demais e com nome de protótipo.",
            es: "Pruebas del enlace: formato, ida y vuelta a la misma puntuación, categorías no aplica y sin calificar, títulos con barras, acentos, kanji y emoji, un título largo, disfrute solo cuando se pide, y rechazo de entradas vacías, dañadas, fuera de escala, repetidas, demasiado largas y con nombre de prototipo.",
          },
        ],
      },
      {
        area: "docs",
        items: [
          {
            en: "ADR 0010 records the link as built, and the roadmap no longer lists sharing as pending. The README explains what a link contains.",
            "pt-BR":
              "O ADR 0010 registra o link como construído, e o roadmap não lista mais o compartilhamento como pendente. O README explica o que um link contém.",
            es: "El ADR 0010 documenta el enlace tal como se construyó, y la hoja de ruta ya no indica el compartir como pendiente. El README explica qué contiene un enlace.",
          },
        ],
      },
      {
        area: "limits",
        items: [
          {
            en: "Anyone who has a link can read what is in it, and a link cannot be taken back once it has been sent. Grades are kept to four decimals, so a score can differ in a far decimal place from the sender's own.",
            "pt-BR":
              "Qualquer pessoa com o link pode ler o que há nele, e um link não pode ser desfeito depois de enviado. As notas são guardadas com quatro casas decimais, então a nota pode diferir numa casa decimal distante da de quem enviou.",
            es: "Cualquiera que tenga un enlace puede leer lo que contiene, y un enlace no se puede retirar una vez enviado. Las notas se guardan con cuatro decimales, así que la puntuación puede diferir en un decimal lejano de la de quien la envió.",
          },
          {
            en: "The preview in chats is always the generic image, never the card of the result.",
            "pt-BR":
              "A prévia nos chats é sempre a imagem genérica, nunca o cartão do resultado.",
            es: "La vista previa en los chats es siempre la imagen genérica, nunca la tarjeta del resultado.",
          },
        ],
      },
    ],
  },
  {
    version: "0.9.1",
    date: "2026-11-13",
    sentaiProfileVersion: 1,
    title: { en: "A portrait card for phones", "pt-BR": "Um cartão vertical para celular", es: "Una tarjeta vertical para móvil" },
    summary: {
      en: "The Results page gains a third card layout, tall and centered, made for phone screens.",
      "pt-BR": "A página de Resultados ganha um terceiro layout de cartão, alto e centralizado, feito para telas de celular.",
      es: "La página de Resultados gana un tercer diseño de tarjeta, alto y centrado, pensado para pantallas de móvil.",
    },
    groups: [
      {
        area: "interface",
        items: [
          {
            en: "New Poster layout (1080 by 1350): the season name, a very large score with its grade band, the seal with its caption and a radar with every axis named and graded. It follows the light or dark choice of the card, and the enjoyment line is centered when switched on.",
            "pt-BR":
              "Novo layout Cartaz (1080 por 1350): o nome da temporada, uma nota bem grande com a faixa, o selo com a legenda e um radar com todos os eixos nomeados e com nota. Ele segue a escolha de tema claro ou escuro do cartão, e a linha do gosto pessoal fica centralizada quando ligada.",
            es: "Nuevo diseño Cartel (1080 por 1350): el nombre de la temporada, una puntuación muy grande con su banda, el sello con su leyenda y un radar con cada eje nombrado y con su nota. Sigue la elección de tema claro u oscuro de la tarjeta, y la línea de disfrute aparece centrada cuando se activa.",
          },
          {
            en: "The layout picker now shows three previews, and the choice is remembered like the other two.",
            "pt-BR":
              "O seletor de layout agora mostra três prévias, e a escolha é lembrada como nos outros dois.",
            es: "El selector de diseño ahora muestra tres vistas previas, y la elección se recuerda igual que en los otros dos.",
          },
        ],
      },
      {
        area: "docs",
        items: [
          {
            en: "ADR 0010 and the roadmap now list only the share link as left to do.",
            "pt-BR":
              "O ADR 0010 e o roadmap agora listam só o link de compartilhamento como pendente.",
            es: "El ADR 0010 y la hoja de ruta ahora indican solo el enlace para compartir como pendiente.",
          },
        ],
      },
    ],
  },
  {
    version: "0.9.0",
    date: "2026-11-13",
    sentaiProfileVersion: 1,
    title: { en: "Share a result as an image", "pt-BR": "Compartilhe o resultado como imagem", es: "Comparte el resultado como imagen" },
    summary: {
      en: "A new Results page turns the result into a card you can save, copy or send, with a choice of layout, and nothing leaves your browser.",
      "pt-BR": "Uma nova página de Resultados transforma o resultado em um cartão que você pode salvar, copiar ou enviar, com escolha de layout, e nada sai do seu navegador.",
      es: "Una nueva página de Resultados convierte el resultado en una tarjeta que puedes guardar, copiar o enviar, con elección de diseño, y nada sale de tu navegador.",
    },
    groups: [
      {
        area: "interface",
        items: [
          {
            en: "A Share this result button under the result opens the new Results page at /results. It appears only when at least one category is graded.",
            "pt-BR":
              "Um botão Compartilhar este resultado sob o resultado abre a nova página de Resultados em /results. Ele só aparece quando ao menos uma categoria tem nota.",
            es: "Un botón Compartir este resultado bajo el resultado abre la nueva página de Resultados en /results. Solo aparece cuando al menos una categoría tiene nota.",
          },
          {
            en: "Two card layouts, each shown as a live preview to choose from. Seal is landscape (1200 by 630) with a radar, and Ledger is square (1080 by 1080) with every grade as a bar. The choice is remembered.",
            "pt-BR":
              "Dois layouts de cartão, cada um mostrado em uma prévia ao vivo para escolher. Selo é horizontal (1200 por 630) com um radar, e Registro é quadrado (1080 por 1080) com cada nota em uma barra. A escolha fica lembrada.",
            es: "Dos diseños de tarjeta, cada uno con una vista previa en vivo para elegir. Sello es horizontal (1200 por 630) con un radar, y Registro es cuadrado (1080 por 1080) con cada nota en una barra. La elección se recuerda.",
          },
          {
            en: "The card can be shown in the light or the dark theme, whatever theme the app is in.",
            "pt-BR":
              "O cartão pode ser mostrado no tema claro ou no escuro, seja qual for o tema do app.",
            es: "La tarjeta se puede mostrar en el tema claro o en el oscuro, sea cual sea el tema de la aplicación.",
          },
          {
            en: "Download the image as a PNG, copy it, or send it through the share sheet where the browser supports sharing files.",
            "pt-BR":
              "Baixe a imagem em PNG, copie-a ou envie pela folha de compartilhamento onde o navegador aceita arquivos.",
            es: "Descarga la imagen como PNG, cópiala o envíala con el menú de compartir cuando el navegador admita archivos.",
          },
          {
            en: "Every card can be read by someone who has never seen Tokuten: each axis and bar is named in plain words, the seal has a caption (Complete score or Partial score) and a footer says what Kijun is and the scale used.",
            "pt-BR":
              "Todo cartão pode ser lido por quem nunca viu o Tokuten: cada eixo e barra tem nome em palavras simples, o selo tem uma legenda (Nota completa ou Nota parcial) e um rodapé diz o que é o Kijun e a escala usada.",
            es: "Cada tarjeta la puede leer quien nunca ha visto Tokuten: cada eje y barra tiene un nombre en palabras sencillas, el sello tiene una leyenda (Puntuación completa o Puntuación parcial) y un pie dice qué es Kijun y qué escala se usa.",
          },
          {
            en: "A text description of the card is shown below it and can be copied, to use as the alternative text of the image.",
            "pt-BR":
              "Uma descrição em texto do cartão aparece abaixo dele e pode ser copiada, para usar como texto alternativo da imagem.",
            es: "Debajo de la tarjeta se muestra una descripción en texto que se puede copiar, para usarla como texto alternativo de la imagen.",
          },
        ],
      },
      {
        area: "method",
        items: [
          {
            en: "Every category has a short name (Theme, Suits, Mecha, Story, Characters, Chemistry, Music, Action, Production, Pacing) in all three languages, used on the cards.",
            "pt-BR":
              "Toda categoria tem um nome curto (Tema, Trajes, Mecha, Roteiro, Personagens, Química, Música, Ação, Produção, Ritmo) nos três idiomas, usado nos cartões.",
            es: "Cada categoría tiene un nombre corto (Tema, Trajes, Mecha, Historia, Personajes, Química, Música, Acción, Producción, Ritmo) en los tres idiomas, usado en las tarjetas.",
          },
        ],
      },
      {
        area: "export",
        items: [
          {
            en: "Privacy by construction: the introduction, the notes and the conclusion are never part of a card, and personal enjoyment is included only when you switch it on, on a separate line. It is off at every visit.",
            "pt-BR":
              "Privacidade por construção: a introdução, as anotações e a conclusão nunca fazem parte de um cartão, e o gosto pessoal só entra quando você liga, em uma linha separada. Ele fica desligado a cada visita.",
            es: "Privacidad por construcción: la introducción, los comentarios y la conclusión nunca forman parte de una tarjeta, y el disfrute personal solo se incluye cuando lo activas, en una línea aparte. Está desactivado en cada visita.",
          },
          {
            en: "The card is drawn in your browser, with the fonts the app already loaded. Nothing is uploaded and the image holds only what is drawn on it.",
            "pt-BR":
              "O cartão é desenhado no seu navegador, com as fontes que o app já carregou. Nada é enviado e a imagem guarda só o que está desenhado nela.",
            es: "La tarjeta se dibuja en tu navegador, con las fuentes que la aplicación ya cargó. No se sube nada y la imagen solo contiene lo que está dibujado en ella.",
          },
        ],
      },
      {
        area: "quality",
        items: [
          {
            en: "Tests check that a card never carries the introduction, notes or conclusion in any language, that enjoyment stays out unless asked, that every category has a short name, and that the canvas colors match the theme tokens in the stylesheet.",
            "pt-BR":
              "Testes verificam que um cartão nunca leva a introdução, as anotações ou a conclusão em nenhum idioma, que o gosto pessoal fica de fora se não for pedido, que toda categoria tem nome curto e que as cores do canvas coincidem com os tokens do tema na folha de estilo.",
            es: "Las pruebas comprueban que una tarjeta nunca lleva la introducción, los comentarios ni la conclusión en ningún idioma, que el disfrute queda fuera si no se pide, que cada categoría tiene un nombre corto y que los colores del canvas coinciden con los tokens del tema en la hoja de estilos.",
          },
        ],
      },
      {
        area: "docs",
        items: [
          {
            en: "ADR 0010 now records what was built, and the roadmap lists what is left: the dark portrait layout and the share link.",
            "pt-BR":
              "O ADR 0010 agora registra o que foi construído, e o roadmap lista o que falta: o layout vertical escuro e o link de compartilhamento.",
            es: "El ADR 0010 ahora documenta lo que se construyó, y la hoja de ruta enumera lo que falta: el diseño vertical oscuro y el enlace para compartir.",
          },
        ],
      },
      {
        area: "limits",
        items: [
          {
            en: "A card cannot be opened back into the app. Use the JSON export to keep working. The share link is planned.",
            "pt-BR":
              "Um cartão não pode ser reaberto no app. Use a exportação JSON para continuar o trabalho. O link de compartilhamento está planejado.",
            es: "Una tarjeta no se puede volver a abrir en la aplicación. Usa la exportación JSON para seguir trabajando. El enlace para compartir está planificado.",
          },
          {
            en: "The page reads the evaluation held in memory. After a reload, restore the draft in the evaluator first.",
            "pt-BR":
              "A página lê a avaliação que está na memória. Após recarregar, restaure o rascunho no avaliador primeiro.",
            es: "La página lee la evaluación que está en memoria. Tras recargar, restaura primero el borrador en el evaluador.",
          },
        ],
      },
    ],
  },
  {
    version: "0.8.0",
    date: "2026-11-13",
    sentaiProfileVersion: 1,
    title: { en: "Spanish and easier languages", "pt-BR": "Espanhol e idiomas mais fáceis", es: "Español e idiomas más fáciles" },
    summary: {
      en: "Tokuten now speaks English, Portuguese and Spanish, and adding another language takes one file and one line.",
      "pt-BR":
        "O Tokuten agora fala inglês, português e espanhol, e adicionar outro idioma leva um arquivo e uma linha.",
      es: "Tokuten ahora habla inglés, portugués y español, y añadir otro idioma requiere un archivo y una línea.",
    },
    groups: [
      {
        area: "interface",
        items: [
          {
            en: "Spanish is now available in the language menu. Every screen, the grade bands, the category guidance and both Markdown exports are translated.",
            "pt-BR":
              "O espanhol agora está no menu de idiomas. Todas as telas, as faixas de nota, a orientação das categorias e as duas exportações em Markdown estão traduzidas.",
            es: "El español ya está en el menú de idiomas. Todas las pantallas, las bandas de notas, la guía de las categorías y ambas exportaciones a Markdown están traducidas.",
          },
          {
            en: "Each language is named in its own language, so anyone can find theirs even when the interface is in another one. English is still the starting language, and a language chosen on purpose is still remembered.",
            "pt-BR":
              "Cada idioma aparece com o próprio nome, para que qualquer pessoa encontre o seu mesmo com a interface em outro idioma. O inglês continua sendo o idioma inicial, e um idioma escolhido de propósito continua sendo lembrado.",
            es: "Cada idioma aparece con su propio nombre, para que cualquiera encuentre el suyo aunque la interfaz esté en otro. El inglés sigue siendo el idioma inicial, y un idioma elegido a propósito se sigue recordando.",
          },
          {
            en: "The changelog falls back to English for any text that is not translated yet, so a new language is usable before its history is complete.",
            "pt-BR":
              "O changelog volta para o inglês em qualquer texto ainda não traduzido, então um idioma novo já pode ser usado antes de o histórico estar completo.",
            es: "El historial de cambios recurre al inglés para cualquier texto que aún no esté traducido, así que un idioma nuevo se puede usar antes de que su historial esté completo.",
          },
        ],
      },
      {
        area: "quality",
        items: [
          {
            en: "One registry lists every language. The language menu, the saved preference and the tests all read from it, so a new language needs its own dictionary file and one line in the registry.",
            "pt-BR":
              "Um único registro lista todos os idiomas. O menu de idiomas, a preferência salva e os testes leem dele, então um idioma novo precisa do próprio arquivo de dicionário e de uma linha no registro.",
            es: "Un único registro enumera todos los idiomas. El menú de idiomas, la preferencia guardada y las pruebas leen de él, así que un idioma nuevo necesita su propio archivo de diccionario y una línea en el registro.",
          },
          {
            en: "The dictionary tests now run for every registered language: same keys, same placeholders, no empty text, no em dashes and complete profile text. A new language is checked without editing the tests.",
            "pt-BR":
              "Os testes do dicionário agora rodam para cada idioma registrado: mesmas chaves, mesmos marcadores, nenhum texto vazio, nenhum travessão e texto completo do perfil. Um idioma novo é verificado sem editar os testes.",
            es: "Las pruebas del diccionario ahora se ejecutan para cada idioma registrado: mismas claves, mismos marcadores, sin textos vacíos, sin rayas largas y texto completo del perfil. Un idioma nuevo se verifica sin editar las pruebas.",
          },
          {
            en: "A test keeps English, Portuguese and Spanish complete in the changelog. Other languages may be partial.",
            "pt-BR":
              "Um teste mantém inglês, português e espanhol completos no changelog. Outros idiomas podem ser parciais.",
            es: "Una prueba mantiene completos el inglés, el portugués y el español en el historial de cambios. Otros idiomas pueden ser parciales.",
          },
        ],
      },
      {
        area: "docs",
        items: [
          {
            en: "ADR 0011 records the language registry. The README and the contributing guide now explain how to add a language in three steps.",
            "pt-BR":
              "O ADR 0011 registra o registro de idiomas. O README e o guia de contribuição agora explicam como adicionar um idioma em três passos.",
            es: "El ADR 0011 documenta el registro de idiomas. El README y la guía de contribución ahora explican cómo añadir un idioma en tres pasos.",
          },
        ],
      },
      {
        area: "limits",
        items: [
          {
            en: "The Spanish text was written without a native review. Corrections are welcome as issues or pull requests.",
            "pt-BR":
              "O texto em espanhol foi escrito sem revisão de um falante nativo. Correções são bem-vindas como issues ou pull requests.",
            es: "El texto en español se escribió sin la revisión de un hablante nativo. Las correcciones son bienvenidas como issues o pull requests.",
          },
        ],
      },
    ],
  },
  {
    version: "0.7.2",
    date: "2026-11-13",
    sentaiProfileVersion: 1,
    title: { en: "Easier changelog and a named result", "pt-BR": "Changelog mais fácil e resultado com nome", es: "Un historial de cambios más fácil y un resultado con nombre" },
    summary: {
      en: "The changelog now opens one release at a time, and the result card says which season it belongs to.",
      "pt-BR":
        "O changelog agora abre uma versão por vez, e o card do resultado diz a qual temporada ele pertence.",
      es:
        "El historial de cambios ahora abre una versión a la vez, y la tarjeta del resultado indica a qué temporada pertenece.",
    },
    groups: [
      {
        area: "interface",
        items: [
          {
            en: "Each release in the changelog is collapsible. The title, date and summary stay in view, and only the newest release starts open. Expand all and Collapse all are at the top.",
            "pt-BR":
              "Cada versão do changelog é recolhível. O título, a data e o resumo ficam à vista, e só a versão mais recente começa aberta. Expandir tudo e Recolher tudo ficam no topo.",
            es:
              "Cada versión del historial se puede contraer. El título, la fecha y el resumen siguen a la vista, y solo la versión más reciente empieza abierta. Expandir todo y Contraer todo están arriba.",
          },
          {
            en: "A link such as /changelog#v0.5.0 opens that release and scrolls to it.",
            "pt-BR": "Um link como /changelog#v0.5.0 abre aquela versão e rola até ela.",
            es: "Un enlace como /changelog#v0.5.0 abre esa versión y se desplaza hasta ella.",
          },
          {
            en: "The result card now shows the name of the season, under the name of the profile and above the official score. Long names are held to three lines, and a muted Untitled season shows until a name is typed, so the card does not change height as you write.",
            "pt-BR":
              "O card do resultado agora mostra o nome da temporada, abaixo do nome do perfil e acima da nota oficial. Nomes longos ficam limitados a três linhas, e um discreto Temporada sem título aparece até um nome ser digitado, para o card não mudar de altura enquanto você escreve.",
            es:
              "La tarjeta del resultado ahora muestra el nombre de la temporada, debajo del nombre del perfil y encima de la puntuación oficial. Los nombres largos se limitan a tres líneas, y hasta que se escriba un nombre aparece un discreto Temporada sin título, para que la tarjeta no cambie de altura mientras escribes.",
          },
        ],
      },
      {
        area: "design",
        items: [
          {
            en: "The score side of the card is now a component of its own, with no change to how it looks. It is the groundwork for sharing a result as an image or a page later.",
            "pt-BR":
              "O lado da nota no card agora é um componente próprio, sem mudar a aparência. É a base para compartilhar um resultado como imagem ou página mais adiante.",
            es:
              "El lado de la puntuación de la tarjeta es ahora un componente propio, sin cambios en su aspecto. Es la base para compartir un resultado como imagen o página más adelante.",
          },
        ],
      },
      {
        area: "quality",
        items: [
          {
            en: "Checked in the browser: the open and closed states, the keyboard, links with a version in the address, both languages and a 360 px screen.",
            "pt-BR":
              "Conferido no navegador: os estados aberto e fechado, o teclado, links com versão no endereço, os dois idiomas e uma tela de 360 px.",
            es:
              "Comprobado en el navegador: los estados abierto y cerrado, el teclado, los enlaces con una versión en la dirección, ambos idiomas y una pantalla de 360 px.",
          },
        ],
      },
    ],
  },
  {
    version: "0.7.1",
    date: "2026-11-13",
    sentaiProfileVersion: 1,
    title: { en: "Calmer draft controls", "pt-BR": "Controles do rascunho mais calmos", es: "Controles del borrador más discretos" },
    summary: {
      en: "The draft notice no longer repeats when you move between pages, it stays in view until you answer it, and the footer has fewer things that look like buttons.",
      "pt-BR":
        "O aviso do rascunho não se repete mais quando você troca de página, fica à vista até você responder, e o rodapé tem menos coisas que parecem botões.",
      es:
        "El aviso del borrador ya no se repite al cambiar de página, permanece a la vista hasta que lo respondas, y el pie de página tiene menos elementos que parecen botones.",
    },
    groups: [
      {
        area: "interface",
        items: [
          {
            en: "Fixed: going to Meaning or Version and coming back offered to restore a draft that was already restored. The notice now appears only when nothing is in progress, that is, after a reload or a new visit.",
            "pt-BR":
              "Corrigido: ir para Significado ou Versão e voltar oferecia restaurar um rascunho que já tinha sido restaurado. O aviso agora aparece só quando não há nada em andamento, ou seja, após recarregar ou numa nova visita.",
            es:
              "Corregido: ir a Significado o a Versión y volver ofrecía restaurar un borrador que ya estaba restaurado. El aviso ahora aparece solo cuando no hay nada en curso, es decir, tras recargar o en una nueva visita.",
          },
          {
            en: "The draft notice is now a slim strip under the header. It follows you while you scroll, does not cover the page, and stays until you restore or discard. On narrow screens it shortens to two lines.",
            "pt-BR":
              "O aviso do rascunho agora é uma faixa fina sob o cabeçalho. Ela acompanha a rolagem, não cobre a página e fica até você restaurar ou descartar. Em telas estreitas ela se reduz a duas linhas.",
            es:
              "El aviso del borrador es ahora una franja delgada bajo el encabezado. Te acompaña al desplazarte, no cubre la página y permanece hasta que restaures o descartes. En pantallas estrechas se reduce a dos líneas.",
          },
          {
            en: "Keeping a draft is now a switch instead of two buttons, with a quiet Delete draft link beside the status. Settings that stay on or off now look different from actions that do something.",
            "pt-BR":
              "Manter um rascunho agora é um interruptor em vez de dois botões, com um link discreto Apagar rascunho ao lado do status. Ajustes que ficam ligados ou desligados agora parecem diferentes de ações que fazem algo.",
            es:
              "Conservar un borrador ahora es un interruptor en lugar de dos botones, con un discreto enlace Eliminar borrador junto al estado. Los ajustes que se activan o desactivan ahora se ven distintos de las acciones que hacen algo.",
          },
          {
            en: "The Markdown format is a single segmented control and works with the arrow keys.",
            "pt-BR": "O formato do Markdown é um único controle segmentado e funciona com as setas do teclado.",
            es: "El formato de Markdown es un único control segmentado y funciona con las teclas de flecha.",
          },
        ],
      },
      {
        area: "quality",
        items: [
          {
            en: "Checked in the browser: a reload still offers the draft, while moving between pages, using the back button and returning from the changelog does not. The two controls work with the keyboard.",
            "pt-BR":
              "Conferido no navegador: recarregar ainda oferece o rascunho, enquanto trocar de página, usar o botão voltar e retornar do changelog não oferece. Os dois controles funcionam com o teclado.",
            es:
              "Comprobado en el navegador: al recargar se sigue ofreciendo el borrador, mientras que cambiar de página, usar el botón de retroceso y volver desde el historial de cambios no lo ofrece. Ambos controles funcionan con el teclado.",
          },
        ],
      },
      {
        area: "docs",
        items: [
          {
            en: "ADR 0009 and the design system describe the new rule and the two controls.",
            "pt-BR": "O ADR 0009 e o design system descrevem a nova regra e os dois controles.",
            es: "El ADR 0009 y el sistema de diseño describen la nueva regla y los dos controles.",
          },
        ],
      },
    ],
  },
  {
    version: "0.7.0",
    date: "2026-11-12",
    sentaiProfileVersion: 1,
    title: { en: "Consistency checklist", "pt-BR": "Checklist de consistência", es: "Lista de consistencia" },
    summary: {
      en: "The ten consistency checks of the method are now part of the app, as a last look before you finish. They are a reminder for you: they never change the score and never block the export.",
      "pt-BR":
        "As dez verificações de consistência do método agora fazem parte do app, como uma última olhada antes de terminar. Elas são um lembrete para você: nunca alteram a nota e nunca bloqueiam a exportação.",
      es:
        "Las diez comprobaciones de consistencia del método ahora forman parte de la aplicación, como una última mirada antes de terminar. Son un recordatorio para ti: nunca cambian la puntuación ni bloquean la exportación.",
    },
    groups: [
      {
        area: "method",
        items: [
          {
            en: "A new card after the conclusion lists the ten checks, such as no bonus for nostalgia, no double counting of a strength and each judgment supported by examples. It starts collapsed and shows how many are ticked.",
            "pt-BR":
              "Um novo cartão depois da conclusão lista as dez verificações, como nenhum bônus por nostalgia, nenhuma contagem dupla de um ponto forte e cada julgamento sustentado por exemplos. Ele começa recolhido e mostra quantas estão marcadas.",
            es:
              "Una nueva tarjeta después de la conclusión enumera las diez comprobaciones, como no dar bonificación por nostalgia, no contar dos veces una fortaleza y respaldar cada juicio con ejemplos. Empieza contraída y muestra cuántas están marcadas.",
          },
          {
            en: "Ticking never changes the score, in either mode.",
            "pt-BR": "Marcar nunca altera a nota, em nenhum dos modos.",
            es: "Marcar las comprobaciones nunca cambia la puntuación, en ninguno de los dos modos.",
          },
        ],
      },
      {
        area: "export",
        items: [
          {
            en: "When at least one check is ticked, both Markdown formats end with a consistency checklist as a task list. It is left out when nothing is ticked, so the output stays as before.",
            "pt-BR":
              "Quando ao menos uma verificação está marcada, os dois formatos de Markdown terminam com um checklist de consistência em forma de lista de tarefas. Ele fica de fora quando nada está marcado, então a saída continua como antes.",
            es:
              "Cuando hay al menos una comprobación marcada, ambos formatos de Markdown terminan con una lista de consistencia como lista de tareas. Se omite cuando no hay nada marcado, así que la salida queda como antes.",
          },
          {
            en: "In the Obsidian format the list sits in a collapsible to-do callout, and a checklist_done property records how many checks were ticked.",
            "pt-BR":
              "No formato Obsidian, a lista fica em um bloco recolhível de tarefas, e a propriedade checklist_done registra quantas verificações foram marcadas.",
            es:
              "En el formato Obsidian la lista va en una llamada plegable de tareas pendientes, y una propiedad checklist_done registra cuántas comprobaciones se marcaron.",
          },
          {
            en: "The JSON file keeps the ticked checks. Files saved before this version still import, with nothing ticked.",
            "pt-BR":
              "O arquivo JSON guarda as verificações marcadas. Arquivos salvos antes desta versão continuam sendo importados, sem nada marcado.",
            es:
              "El archivo JSON conserva las comprobaciones marcadas. Los archivos guardados antes de esta versión se siguen importando, sin nada marcado.",
          },
        ],
      },
      {
        area: "interface",
        items: [
          {
            en: "The checks are part of the local draft, so they come back with the rest of your work.",
            "pt-BR": "As verificações fazem parte do rascunho local, então voltam junto com o resto do seu trabalho.",
            es: "Las comprobaciones forman parte del borrador local, así que vuelven junto con el resto de tu trabajo.",
          },
        ],
      },
      {
        area: "quality",
        items: [
          {
            en: "Tests for the score being untouched, profile order, the JSON round trip, old files, unknown ids and both exports. A dictionary test checks that every check has text in both languages.",
            "pt-BR":
              "Testes para a nota intacta, a ordem do perfil, o ciclo do JSON, arquivos antigos, ids desconhecidos e os dois formatos de exportação. Um teste de dicionário confere que toda verificação tem texto nos dois idiomas.",
            es:
              "Pruebas para comprobar que la puntuación no se altera, el orden del perfil, el ciclo de ida y vuelta del JSON, los archivos antiguos, los identificadores desconocidos y ambas exportaciones. Una prueba del diccionario verifica que cada comprobación tenga texto en todos los idiomas.",
          },
        ],
      },
    ],
  },
  {
    version: "0.6.0",
    date: "2026-11-12",
    sentaiProfileVersion: 1,
    title: { en: "Subcriteria as tables", "pt-BR": "Subcritérios em tabela", es: "Subcriterios en tablas" },
    summary: {
      en: "In the Markdown export, the subcriteria of each category are now a table instead of a list, in both formats. The reasoning stays as plain text, where long writing reads best.",
      "pt-BR":
        "Na exportação em Markdown, os subcritérios de cada categoria agora formam uma tabela em vez de uma lista, nos dois formatos. A justificativa continua em texto corrido, onde textos longos são lidos melhor.",
      es:
        "En la exportación a Markdown, los subcriterios de cada categoría ahora son una tabla en lugar de una lista, en ambos formatos. El razonamiento sigue como texto simple, donde la escritura larga se lee mejor.",
    },
    groups: [
      {
        area: "export",
        items: [
          {
            en: "Standard format: each category lists its graded subcriteria in a two column table with the grade aligned to the right. It uses only core table syntax, so it renders in forums, on GitHub and in any Markdown viewer.",
            "pt-BR":
              "Formato Padrão: cada categoria lista seus subcritérios avaliados em uma tabela de duas colunas, com a nota alinhada à direita. Usa apenas a sintaxe básica de tabela, então aparece corretamente em fóruns, no GitHub e em qualquer leitor de Markdown.",
            es:
              "Formato estándar: cada categoría enumera sus subcriterios calificados en una tabla de dos columnas con la nota alineada a la derecha. Usa solo la sintaxis básica de tablas, así que se muestra bien en foros, en GitHub y en cualquier visor de Markdown.",
          },
          {
            en: "Obsidian format: the table sits inside the collapsible callout of the category and adds a third column with the ten cell gauge, so the strong and weak points of a category can be seen at a glance.",
            "pt-BR":
              "Formato Obsidian: a tabela fica dentro do bloco recolhível da categoria e ganha uma terceira coluna com o indicador de dez células, para ver de relance os pontos fortes e fracos de uma categoria.",
            es:
              "Formato Obsidian: la tabla va dentro de la llamada plegable de la categoría y añade una tercera columna con el indicador de diez celdas, para ver de un vistazo los puntos fuertes y débiles de una categoría.",
          },
          {
            en: "The reasoning is not put in a table on purpose. A table cell holds one line, and the reasoning is the longest and most important text of the evaluation.",
            "pt-BR":
              "A justificativa não vai para a tabela de propósito. Uma célula de tabela comporta uma linha, e a justificativa é o texto mais longo e mais importante da avaliação.",
            es:
              "El razonamiento no se pone en una tabla a propósito. Una celda de tabla admite una sola línea, y el razonamiento es el texto más largo e importante de la evaluación.",
          },
          {
            en: "Ungraded and not applicable subcriteria are left out, and quick evaluations still have no subcriteria table.",
            "pt-BR":
              "Subcritérios sem nota ou não aplicáveis ficam de fora, e avaliações rápidas continuam sem tabela de subcritérios.",
            es:
              "Los subcriterios sin calificar y los que no aplican se omiten, y las evaluaciones rápidas siguen sin tabla de subcriterios.",
          },
        ],
      },
      {
        area: "quality",
        items: [
          {
            en: "A new test renders both formats with the real English and Portuguese dictionaries and fails on any missing text, which would have caught a wrong label before release. The rendered tables were also checked with a Markdown parser.",
            "pt-BR":
              "Um novo teste gera os dois formatos com os dicionários reais em inglês e português e falha diante de qualquer texto ausente, o que teria pegado um rótulo errado antes do lançamento. As tabelas geradas também foram conferidas com um interpretador de Markdown.",
            es:
              "Una nueva prueba genera ambos formatos con los diccionarios reales en inglés y portugués y falla ante cualquier texto ausente, lo que habría detectado una etiqueta incorrecta antes de la publicación. Las tablas generadas también se comprobaron con un analizador de Markdown.",
          },
        ],
      },
    ],
  },
  {
    version: "0.5.1",
    date: "2026-11-11",
    sentaiProfileVersion: 1,
    title: { en: "Named palette and hex codes", "pt-BR": "Paleta nomeada e códigos hex", es: "Paleta con nombres y códigos hexadecimales" },
    summary: {
      en: "Every color of both themes now has a name, and each color on the Meaning page shows its hex code and copies it on a click.",
      "pt-BR":
        "Todas as cores dos dois temas agora têm nome, e cada cor da página Significado mostra o código hex e o copia com um clique.",
      es:
        "Cada color de ambos temas ahora tiene un nombre, y cada color de la página Significado muestra su código hexadecimal y lo copia con un clic.",
    },
    groups: [
      {
        area: "design",
        items: [
          {
            en: "The two missing names were added: Kinari (生成り) for the card surface of the light theme and Kurocha (黒茶) for the card surface of the dark theme. The text color of the dark theme is now Zōge (象牙), in place of the English word Ivory, so the whole palette is named the same way.",
            "pt-BR":
              "Os dois nomes que faltavam foram adicionados: Kinari (生成り) para a superfície dos cartões no tema claro e Kurocha (黒茶) para a do tema escuro. A cor do texto no tema escuro agora é Zōge (象牙), no lugar da palavra inglesa Ivory, então toda a paleta é nomeada do mesmo jeito.",
            es:
              "Se añadieron los dos nombres que faltaban: Kinari (生成り) para la superficie de las tarjetas del tema claro y Kurocha (黒茶) para la superficie de las tarjetas del tema oscuro. El color del texto del tema oscuro ahora es Zōge (象牙), en lugar de la palabra inglesa Ivory, de modo que toda la paleta se nombra de la misma manera.",
          },
          {
            en: "Each color is described on the Meaning page, including Shu, which is a little lighter on the dark theme.",
            "pt-BR":
              "Cada cor é descrita na página Significado, inclusive o Shu, que fica um pouco mais claro no tema escuro.",
            es:
              "Cada color se describe en la página Significado, incluido Shu, que es algo más claro en el tema oscuro.",
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
            es:
              "Pasa el cursor sobre un color, o enfócalo con el teclado, para ver su código hexadecimal. Selecciónalo para copiarlo. Un toque en una pantalla táctil también lo muestra.",
          },
          {
            en: "The five pillar colors are listed under each theme with the same behavior.",
            "pt-BR": "As cinco cores dos pilares aparecem sob cada tema, com o mesmo comportamento.",
            es: "Los cinco colores de los pilares aparecen bajo cada tema con el mismo comportamiento.",
          },
          {
            en: "The code is read from the computed color on screen, so it always matches what is shown.",
            "pt-BR": "O código é lido da cor calculada na tela, então sempre bate com o que é mostrado.",
            es: "El código se lee del color calculado en pantalla, así que siempre coincide con lo que se muestra.",
          },
        ],
      },
      {
        area: "docs",
        items: [
          {
            en: "The semiotics page and the design system table list all names.",
            "pt-BR": "A página de semiótica e a tabela do design system listam todos os nomes.",
            es: "La página de semiótica y la tabla del sistema de diseño enumeran todos los nombres.",
          },
        ],
      },
    ],
  },
  {
    version: "0.5.0",
    date: "2026-11-10",
    sentaiProfileVersion: 1,
    title: { en: "Local draft", "pt-BR": "Rascunho local",
    es: "Borrador local" },
    summary: {
      en: "Your work is now kept as a draft in this browser, so a refresh, a closed tab or a crash no longer costs a whole evaluation. Nothing is sent anywhere, and it can be turned off.",
      "pt-BR":
        "Seu trabalho agora fica guardado como rascunho neste navegador, então atualizar a página, fechar a aba ou uma falha não custa mais uma avaliação inteira. Nada é enviado, e dá para desligar.",
      es:
        "Tu trabajo ahora se conserva como borrador en este navegador, de modo que una actualización, una pestaña cerrada o un fallo ya no cuestan una evaluación entera. No se envía nada a ningún sitio y se puede desactivar.",
    },
    groups: [
      {
        area: "interface",
        items: [
          {
            en: "The evaluation is saved in this browser a moment after every change, and when the page is hidden or closed. A blank evaluation is never saved.",
            "pt-BR":
              "A avaliação é salva neste navegador um instante depois de cada alteração, e quando a página é ocultada ou fechada. Uma avaliação em branco nunca é salva.",
            es:
              "La evaluación se guarda en este navegador un momento después de cada cambio, y cuando la página se oculta o se cierra. Nunca se guarda una evaluación en blanco.",
          },
          {
            en: "On the next visit a prompt offers to restore the draft or discard it. Nothing is replaced without your choice, and the stored draft is left untouched until you decide.",
            "pt-BR":
              "Na visita seguinte, um aviso oferece restaurar o rascunho ou descartá-lo. Nada é substituído sem a sua escolha, e o rascunho guardado fica intacto até você decidir.",
            es:
              "En la siguiente visita, un aviso ofrece restaurar el borrador o descartarlo. No se reemplaza nada sin tu decisión, y el borrador almacenado no se toca hasta que decidas.",
          },
          {
            en: "A quiet line under the buttons says where your work is kept, with buttons to delete the draft or turn the feature off. Turning it off also deletes the stored copy.",
            "pt-BR":
              "Uma linha discreta abaixo dos botões diz onde seu trabalho está guardado, com botões para apagar o rascunho ou desligar o recurso. Desligar também apaga a cópia guardada.",
            es:
              "Una línea discreta bajo los botones indica dónde se conserva tu trabajo, con botones para eliminar el borrador o desactivar la función. Desactivarla también elimina la copia almacenada.",
          },
          {
            en: "With the draft off, leaving a page that holds work asks for confirmation first.",
            "pt-BR": "Com o rascunho desligado, sair de uma página que tem trabalho pede confirmação antes.",
            es: "Con el borrador desactivado, salir de una página que contiene trabajo pide confirmación antes.",
          },
          {
            en: "The grading mode and the Markdown export format are now remembered between visits, like the language.",
            "pt-BR":
              "O modo de avaliação e o formato da exportação em Markdown agora são lembrados entre visitas, como o idioma.",
            es:
              "El modo de calificación y el formato de exportación de Markdown ahora se recuerdan entre visitas, igual que el idioma.",
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
            es:
              "Empezar de nuevo también elimina el borrador. Empezar de nuevo e importar JSON se comportan como antes.",
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
            es:
              "Un borrador dañado, ajeno o fuera de rango se ignora en lugar de romper la página, y la aplicación funciona con normalidad cuando el navegador bloquea el almacenamiento. Las pruebas cubren las reglas y el flujo en el navegador.",
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
            es:
              "El ADR 0009 registra el cambio y sus límites. El pie de página, el README y las notas de decisiones anteriores se actualizaron para coincidir.",
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
            es:
              "El borrador vive en un navegador de un dispositivo. No se sincroniza, y borrar los datos del sitio en el navegador lo elimina. Exporta el JSON para conservar una evaluación de forma permanente.",
          },
        ],
      },
    ],
  },
  {
    version: "0.4.0",
    date: "2026-11-09",
    sentaiProfileVersion: 1,
    title: { en: "Obsidian Markdown export", "pt-BR": "Exportação em Markdown do Obsidian", es: "Exportación a Markdown para Obsidian" },
    summary: {
      en: "The Markdown export now comes in two formats. Standard stays as it was and renders anywhere. Obsidian adds properties, collapsible callouts, gauges and a chart for people who keep their notes in a vault.",
      "pt-BR":
        "A exportação em Markdown agora tem dois formatos. O Padrão continua como era e aparece corretamente em qualquer lugar. O Obsidian acrescenta propriedades, blocos recolhíveis, indicadores e um gráfico para quem guarda suas notas em um cofre.",
      es:
        "La exportación a Markdown ahora tiene dos formatos. El estándar se mantiene como era y se muestra en cualquier sitio. Obsidian añade propiedades, llamadas plegables, indicadores y un gráfico para quienes guardan sus notas en una bóveda.",
    },
    groups: [
      {
        area: "export",
        items: [
          {
            en: "New Obsidian format with properties (title, profile, mode, status, score, band, enjoyment, date, tags), so a vault can filter and sort evaluations.",
            "pt-BR":
              "Novo formato Obsidian com propriedades (título, perfil, modo, status, nota, faixa, diversão, data, tags), para que um cofre possa filtrar e ordenar avaliações.",
            es:
              "Nuevo formato Obsidian con propiedades (título, perfil, modo, estado, puntuación, banda, disfrute, fecha, etiquetas), para que una bóveda pueda filtrar y ordenar las evaluaciones.",
          },
          {
            en: "Each category becomes a collapsible callout with its grade, a ten cell gauge, the weight, the subcriteria and the reasoning. Partial scores, redistributed weights and quick evaluations get their own callouts.",
            "pt-BR":
              "Cada categoria vira um bloco recolhível com a nota, um indicador de dez células, o peso, os subcritérios e a justificativa. Notas parciais, pesos redistribuídos e avaliações rápidas ganham blocos próprios.",
            es:
              "Cada categoría se convierte en una llamada plegable con su nota, un indicador de diez celdas, el peso, los subcriterios y el razonamiento. Las puntuaciones parciales, los pesos redistribuidos y las evaluaciones rápidas tienen sus propias llamadas.",
          },
          {
            en: "The calculation is a table with the contribution of each category, followed by a Mermaid pie chart. The official score is highlighted, and the personal enjoyment score stays apart from it.",
            "pt-BR":
              "O cálculo é uma tabela com a contribuição de cada categoria, seguida de um gráfico de pizza em Mermaid. A nota oficial aparece destacada e a nota de diversão pessoal continua separada dela.",
            es:
              "El cálculo es una tabla con la contribución de cada categoría, seguida de un gráfico circular de Mermaid. La puntuación oficial aparece resaltada y la puntuación de disfrute personal queda aparte.",
          },
          {
            en: "The Standard format is unchanged, so forums and GitHub keep working. Both formats carry the same data in the same order.",
            "pt-BR":
              "O formato Padrão não mudou, então fóruns e GitHub continuam funcionando. Os dois formatos levam os mesmos dados na mesma ordem.",
            es:
              "El formato estándar no cambia, así que los foros y GitHub siguen funcionando. Ambos formatos llevan los mismos datos en el mismo orden.",
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
            es:
              "Selector de formato sobre los botones de exportación, con una línea breve que indica dónde se lee mejor cada formato.",
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
            es:
              "Pruebas para el bloque de propiedades, las llamadas, el gráfico de Mermaid y la separación de las dos puntuaciones.",
          },
        ],
      },
    ],
  },
  {
    version: "0.3.0",
    date: "2026-11-08",
    sentaiProfileVersion: 1,
    title: { en: "Detailed and Quick modes", "pt-BR": "Modos Detalhado e Rápido", es: "Modos Detallado y Rápido" },
    summary: {
      en: "The same method can now be graded at two levels of effort: Detailed (詳細) through subcriteria, or Quick (簡易) with one grade per category. Three navigation and input bugs were also fixed.",
      "pt-BR":
        "O mesmo método agora pode ser avaliado em dois níveis de esforço: Detalhado (詳細), por subcritérios, ou Rápido (簡易), com uma nota por categoria. Três bugs de navegação e de entrada também foram corrigidos.",
      es:
        "El mismo método ahora se puede calificar con dos niveles de esfuerzo: Detallado (詳細) mediante subcriterios, o Rápido (簡易) con una nota por categoría. También se corrigieron tres errores de navegación y de entrada.",
    },
    groups: [
      {
        area: "method",
        items: [
          {
            en: "Two evaluation modes, Detailed (詳細) and Quick (簡易). The weights, the not applicable rules and the calculation are identical in both. A test checks that the same data gives the same result in either mode.",
            "pt-BR":
              "Dois modos de avaliação, Detalhado (詳細) e Rápido (簡易). Os pesos, as regras de não aplicável e o cálculo são idênticos nos dois. Um teste confere que os mesmos dados dão o mesmo resultado em qualquer modo.",
            es:
              "Dos modos de evaluación, Detallado (詳細) y Rápido (簡易). Los pesos, las reglas de no aplica y el cálculo son idénticos en ambos. Una prueba comprueba que los mismos datos den el mismo resultado en cualquiera de los modos.",
          },
          {
            en: "Switching modes never discards a grade. In Quick mode a category with subcriteria grades starts from their average, and moving the slider replaces it with a direct grade. One button returns to the average.",
            "pt-BR":
              "Alternar entre os modos nunca descarta uma nota. No modo Rápido, uma categoria com notas de subcritérios começa pela média deles, e mover o slider a substitui por uma nota direta. Um botão volta para a média.",
            es:
              "Cambiar de modo nunca descarta una nota. En el modo Rápido, una categoría con notas de subcriterios parte de su promedio, y mover el control deslizante lo reemplaza por una nota directa. Un botón vuelve al promedio.",
          },
          {
            en: "Starting over clears the grades but keeps the chosen mode.",
            "pt-BR": "Recomeçar apaga as notas, mas mantém o modo escolhido.",
            es: "Empezar de nuevo borra las notas pero mantiene el modo elegido.",
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
            es:
              "Selector de modo sobre las categorías, con el kanji junto a cada nombre y una línea breve que explica el modo actual.",
          },
          {
            en: "Quick rows: one slider per category that shows the grade band and its description, the source of the grade, and buttons for guidance and notes, clearing the grade and marking the category as not applicable.",
            "pt-BR":
              "Linhas do modo Rápido: um slider por categoria que mostra a faixa da nota e a descrição, a origem da nota e botões para orientações e anotações, limpar a nota e marcar a categoria como não aplicável.",
            es:
              "Filas del modo Rápido: un control deslizante por categoría que muestra la banda de la nota y su descripción, el origen de la nota, y botones para la guía y las notas, para borrar la nota y para marcar la categoría como no aplicable.",
          },
          {
            en: "The result shows a Quick evaluation badge when the quick mode is in use.",
            "pt-BR": "O resultado mostra o selo Avaliação rápida quando o modo rápido está em uso.",
            es: "El resultado muestra una insignia de Evaluación rápida cuando se usa el modo rápido.",
          },
          {
            en: "Fixed: returning to the main page from Meaning or the changelog left it scrolled slightly down. It now starts at the top. The cause was the global smooth scrolling, which made the scroll of the navigation animate and compete with the reset, so it was removed. The back to top button still scrolls smoothly, and the back button of the browser now restores your position at once.",
            "pt-BR":
              "Corrigido: voltar para a página principal a partir de Significado ou do histórico a deixava um pouco rolada para baixo. Agora ela começa no topo. A causa era a rolagem suave global, que fazia a rolagem da navegação animar e disputar com o reinício, então ela foi removida. O botão de voltar ao topo continua rolando com suavidade, e o botão voltar do navegador agora restaura sua posição na hora.",
            es:
              "Corregido: volver a la página principal desde Significado o desde el historial de cambios la dejaba desplazada un poco hacia abajo. Ahora empieza arriba. La causa era el desplazamiento suave global, que hacía que el desplazamiento de la navegación se animara y compitiera con el reinicio, así que se eliminó. El botón de volver arriba sigue desplazándose con suavidad, y el botón de retroceso del navegador ahora restaura tu posición al instante.",
          },
          {
            en: "Fixed: a grade of exactly 5.0 could not be set on an ungraded slider, because the slider rests at 5.0 and clicking there changes nothing. Releasing the slider, or pressing Enter, now commits the value. This affected every slider since 0.1.0.",
            "pt-BR":
              "Corrigido: não era possível dar a nota exata 5,0 em um slider sem nota, porque ele repousa em 5,0 e clicar ali não muda nada. Soltar o slider, ou pressionar Enter, agora registra o valor. Isso afetava todos os sliders desde a 0.1.0.",
            es:
              "Corregido: no se podía fijar una nota de exactamente 5.0 en un control deslizante sin calificar, porque el control descansa en 5.0 y hacer clic ahí no cambia nada. Soltar el control, o pulsar Enter, ahora confirma el valor. Esto afectaba a todos los controles desde la versión 0.1.0.",
          },
          {
            en: "Fixed: after Start over or an import, a category could still show the manual grade view with an empty slider. That state now follows the data.",
            "pt-BR":
              "Corrigido: depois de Recomeçar ou de uma importação, uma categoria ainda podia mostrar a visão de nota manual com um slider vazio. Esse estado agora acompanha os dados.",
            es:
              "Corregido: tras Empezar de nuevo o una importación, una categoría podía seguir mostrando la vista de nota manual con un control deslizante vacío. Ese estado ahora sigue a los datos.",
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
            es:
              "La exportación a JSON guarda el modo. Los archivos exportados por versiones anteriores no tienen modo y se cargan como Detallado.",
          },
          {
            en: "The Markdown export states when an evaluation was quick and leaves the subcriteria out.",
            "pt-BR": "A exportação em Markdown informa quando a avaliação foi rápida e deixa os subcritérios de fora.",
            es: "La exportación a Markdown indica cuándo una evaluación fue rápida y omite los subcriterios.",
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
            es:
              "La página Significado y docs/semiotics.md explican 詳細 y 簡易. docs/framework.md tiene una nueva sección sobre los dos modos, y el registro de decisión 7 explica la elección.",
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
            es:
              "Nuevas pruebas para el modo: valor predeterminado, resultados iguales en ambos modos, ciclo de ida y vuelta del JSON y archivos sin modo, rechazo de un modo desconocido, Markdown por modo y las acciones del almacén.",
          },
        ],
      },
      {
        area: "limits",
        items: [
          {
            en: "The chosen mode is not remembered between visits. Nothing is stored unless you export it.",
            "pt-BR": "O modo escolhido não é lembrado entre visitas. Nada é guardado a menos que você exporte.",
            es: "El modo elegido no se recuerda entre visitas. No se almacena nada a menos que lo exportes.",
          },
        ],
      },
    ],
  },
  {
    version: "0.2.0",
    date: "2026-11-08",
    sentaiProfileVersion: 1,
    title: { en: "Meaning and community", "pt-BR": "Significado e comunidade", es: "Significado y comunidad" },
    summary: {
      en: "A new page explains where the name, colors, seal and numbers come from, and the project now has a license and a clear way to report bugs and contribute.",
      "pt-BR":
        "Uma nova página explica de onde vêm o nome, as cores, o selo e os números, e o projeto agora tem licença e um caminho claro para reportar bugs e contribuir.",
      es:
        "Una nueva página explica de dónde vienen el nombre, los colores, el sello y los números, y el proyecto ahora tiene una licencia y una forma clara de informar de errores y de contribuir.",
    },
    groups: [
      {
        area: "interface",
        items: [
          {
            en: "New Meaning page at /meaning. It teaches the name, the five pillars, the seal, the numerals, the colors of both themes and the typefaces, using the real elements of the app. Facts about language are tagged as facts, and pairings chosen for the project are tagged as design intent.",
            "pt-BR":
              "Nova página Significado em /meaning. Ela ensina o nome, os cinco pilares, o selo, os numerais, as cores dos dois temas e as fontes, usando os elementos reais do app. Fatos sobre a língua aparecem marcados como fatos, e combinações escolhidas para o projeto aparecem como intenção de design.",
            es:
              "Nueva página Significado en /meaning. Enseña el nombre, los cinco pilares, el sello, los numerales, los colores de ambos temas y las tipografías, usando los elementos reales de la aplicación. Los datos sobre el idioma se etiquetan como hechos, y las combinaciones elegidas para el proyecto se etiquetan como intención de diseño.",
          },
          {
            en: "Footer now links to Meaning and Contribute, next to the version and the credit.",
            "pt-BR": "O rodapé agora leva a Significado e a Contribuir, ao lado da versão e do crédito.",
            es: "El pie de página ahora enlaza a Significado y a Contribuir, junto a la versión y el crédito.",
          },
          {
            en: "Contribute card at the end of the Meaning page, with links to report a bug, suggest an improvement and read the contributing guide.",
            "pt-BR":
              "Cartão de contribuição no fim da página Significado, com links para reportar um bug, sugerir uma melhoria e ler o guia de contribuição.",
            es:
              "Tarjeta Contribuir al final de la página Significado, con enlaces para informar de un error, sugerir una mejora y leer la guía de contribución.",
          },
          {
            en: "The Meaning page opens at the top and has the back to top button.",
            "pt-BR": "A página Significado abre no topo e tem o botão de voltar ao topo.",
            es: "La página Significado se abre arriba y tiene el botón de volver arriba.",
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
            es:
              "Los tokens de tema ahora se pueden aplicar a cualquier contenedor, así que una página puede mostrar los temas claro y oscuro lado a lado. El aspecto de la aplicación no cambió.",
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
            es:
              "Nuevo documento docs/semiotics.md con el significado del nombre, los kanji, los colores, el sello, los numerales y la tipografía. El documento del sistema de diseño solo remite a él.",
          },
          {
            en: "MIT license, contributing guide, bug and suggestion forms for GitHub issues, and a pull request template.",
            "pt-BR":
              "Licença MIT, guia de contribuição, formulários de bug e de sugestão para as issues do GitHub e um modelo de pull request.",
            es:
              "Licencia MIT, guía de contribución, formularios de errores y sugerencias para los issues de GitHub y una plantilla de pull request.",
          },
          {
            en: "Decision record 6 explains why meaning has its own document and page.",
            "pt-BR": "O registro de decisão 6 explica por que o significado tem documento e página próprios.",
            es: "El registro de decisión 6 explica por qué el significado tiene su propio documento y página.",
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
            es:
              "Nuevas pruebas del diccionario: mismas claves y marcadores en todos los idiomas, sin textos vacíos, sin rayas largas y texto completo para cada categoría, subcriterio y pilar de cada perfil.",
          },
        ],
      },
    ],
  },
  {
    version: "0.1.2",
    date: "2026-11-06",
    sentaiProfileVersion: 1,
    title: { en: "Fixes and polish", "pt-BR": "Correções e acabamento",
    es: "Correcciones y mejoras" },
    summary: {
      en: "The changelog now opens at the top, English is always the starting language, the footer is easier to read and long pages have a way back to the top.",
      "pt-BR":
        "O histórico agora abre no topo, o inglês é sempre o idioma inicial, o rodapé ficou mais fácil de ler e as páginas longas ganharam um caminho de volta ao topo.",
      es:
        "El historial de cambios ahora se abre arriba, el inglés es siempre el idioma inicial, el pie de página se lee mejor y las páginas largas tienen una forma de volver arriba.",
    },
    groups: [
      {
        area: "interface",
        items: [
          {
            en: "Fixed: the changelog opened at the bottom, because the page kept the scroll position of the footer link. It now starts at the top, so the link back to the evaluator is visible.",
            "pt-BR":
              "Corrigido: o histórico abria no fim da página, porque mantinha a posição de rolagem do link do rodapé. Agora começa no topo, e o link de volta ao avaliador fica visível.",
            es:
              "Corregido: el historial de cambios se abría abajo, porque la página conservaba la posición de desplazamiento del enlace del pie de página. Ahora empieza arriba, así que el enlace de vuelta al evaluador es visible.",
          },
          {
            en: "English is now always the starting language, whatever the language of the browser. A language chosen on purpose is still remembered.",
            "pt-BR":
              "O inglês agora é sempre o idioma inicial, qualquer que seja o idioma do navegador. Um idioma escolhido de propósito continua sendo lembrado.",
            es:
              "El inglés es ahora siempre el idioma inicial, sea cual sea el idioma del navegador. Un idioma elegido a propósito se sigue recordando.",
          },
          {
            en: "Back to top button. It appears near the end of long pages, moves smoothly, and jumps instantly when reduced motion is on.",
            "pt-BR":
              "Botão de voltar ao topo. Aparece perto do fim das páginas longas, rola com suavidade e salta direto quando o movimento reduzido está ativado.",
            es:
              "Botón de volver arriba. Aparece cerca del final de las páginas largas, se mueve con suavidad y salta al instante cuando el movimiento reducido está activado.",
          },
        ],
      },
      {
        area: "design",
        items: [
          {
            en: "Footer text increased from 11 px to 13 px, with a little more space above it.",
            "pt-BR": "O texto do rodapé passou de 11 px para 13 px, com um pouco mais de espaço acima.",
            es: "El texto del pie de página aumentó de 11 px a 13 px, con un poco más de espacio encima.",
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
            es:
              "README limpio de restos de fusión. Las sugerencias de mensajes de commit ahora siguen el patrón de Conventional Commits.",
          },
        ],
      },
    ],
  },
  {
    version: "0.1.1",
    date: "2026-11-06",
    sentaiProfileVersion: 1,
    title: { en: "Site icon", "pt-BR": "Ícone do site",
    es: "Icono del sitio" },
    summary: {
      en: "The hanko seal with the 点 kanji is now the icon of the site in browser tabs, bookmarks and on the home screen of phones.",
      "pt-BR":
        "O selo hanko com o kanji 点 agora é o ícone do site nas abas do navegador, nos favoritos e na tela inicial de celulares.",
      es:
        "El sello hanko con el kanji 点 es ahora el icono del sitio en las pestañas del navegador, en los marcadores y en la pantalla de inicio de los teléfonos.",
    },
    groups: [
      {
        area: "design",
        items: [
          {
            en: "Vector icon (icon.svg) in vermilion with the kanji in cream. The kanji outline comes from the Shippori Mincho font and is stored as a path, so it needs no font to display.",
            "pt-BR":
              "Ícone vetorial (icon.svg) em vermelhão com o kanji em creme. O contorno do kanji vem da fonte Shippori Mincho e fica guardado como um traçado, então não depende de fonte para aparecer.",
            es:
              "Icono vectorial (icon.svg) en bermellón con el kanji en crema. El contorno del kanji proviene de la tipografía Shippori Mincho y se guarda como trazado, así que no necesita ninguna fuente para mostrarse.",
          },
          {
            en: "favicon.ico with 16, 32 and 48 px frames. The small sizes drop the inner border and use a larger kanji to stay readable.",
            "pt-BR":
              "favicon.ico com quadros de 16, 32 e 48 px. Os tamanhos pequenos retiram a borda interna e usam um kanji maior para continuar legíveis.",
            es:
              "favicon.ico con fotogramas de 16, 32 y 48 px. Los tamaños pequeños eliminan el borde interior y usan un kanji más grande para seguir siendo legibles.",
          },
          {
            en: "Apple touch icon (180 px) without rounded corners, since iOS applies its own.",
            "pt-BR": "Ícone para a tela inicial da Apple (180 px) sem cantos arredondados, já que o iOS aplica os seus.",
            es: "Icono Apple touch (180 px) sin esquinas redondeadas, ya que iOS aplica las suyas.",
          },
        ],
      },
    ],
  },
  {
    version: "0.1.0",
    date: "2026-11-06",
    sentaiProfileVersion: 1,
    title: { en: "First usable release", "pt-BR": "Primeira versão utilizável", es: "Primera versión utilizable" },
    summary: {
      en: "The Kijun method for Super Sentai as a working static app: grading by subcriteria, weighted official score, separate personal enjoyment, export and import, two languages and two themes.",
      "pt-BR":
        "O método Kijun para Super Sentai como um app estático funcional: avaliação por subcritérios, nota oficial ponderada, diversão pessoal separada, exportação e importação, dois idiomas e dois temas.",
      es:
        "El método Kijun para Super Sentai como una aplicación estática funcional: calificación por subcriterios, puntuación oficial ponderada, disfrute personal separado, exportación e importación, dos idiomas y dos temas.",
    },
    groups: [
      {
        area: "method",
        items: [
          {
            en: "Sentai profile with ten categories whose weights add up to 100%: Theme 8, Suits 8, Mecha 8, Story 14, Characters 14, Squad Chemistry 12, Music 8, Action 10, Production 8, Pacing 10.",
            "pt-BR":
              "Perfil Sentai com dez categorias cujos pesos somam 100%: Tema 8, Trajes 8, Mecha 8, História 14, Personagens 14, Química do Time 12, Música 8, Ação 10, Produção 8, Ritmo 10.",
            es:
              "Perfil Sentai con diez categorías cuyos pesos suman 100%: Tema 8, Trajes 8, Mecha 8, Historia 14, Personajes 14, Química del equipo 12, Música 8, Acción 10, Producción 8, Ritmo 10.",
          },
          {
            en: "Every category has its own subcriteria, taken from the original method. The category grade is the average of the graded subcriteria.",
            "pt-BR":
              "Cada categoria tem seus subcritérios, tirados do método original. A nota da categoria é a média dos subcritérios avaliados.",
            es:
              "Cada categoría tiene sus propios subcriterios, tomados del método original. La nota de la categoría es el promedio de los subcriterios calificados.",
          },
          {
            en: "A subcriterion can be marked as not applicable and is then left out of the average.",
            "pt-BR": "Um subcritério pode ser marcado como não aplicável e então sai da média.",
            es: "Un subcriterio se puede marcar como no aplicable y entonces se deja fuera del promedio.",
          },
          {
            en: "A category grade can be set by hand. A manual grade replaces the average and is labeled as such.",
            "pt-BR": "A nota de uma categoria pode ser definida à mão. A nota manual substitui a média e é identificada como tal.",
            es: "La nota de una categoría se puede fijar a mano. Una nota manual reemplaza el promedio y se etiqueta como tal.",
          },
          {
            en: "A whole category can be marked as not applicable. Its weight is shared among the remaining categories in proportion to their own weights.",
            "pt-BR":
              "Uma categoria inteira pode ser marcada como não aplicável. O peso dela é dividido entre as demais categorias na proporção dos pesos de cada uma.",
            es:
              "Una categoría entera se puede marcar como no aplicable. Su peso se reparte entre las demás categorías en proporción a sus propios pesos.",
          },
          {
            en: "Categories without a grade are never counted as an average. The score stays partial until every applicable category is graded.",
            "pt-BR":
              "Categorias sem nota nunca são contadas como média. A nota fica parcial até que toda categoria aplicável tenha sido avaliada.",
            es:
              "Las categorías sin nota nunca se cuentan como un promedio. La puntuación sigue siendo parcial hasta que cada categoría aplicable tenga nota.",
          },
          {
            en: "Personal enjoyment is stored apart from the evaluation grades and is never read by the scoring code.",
            "pt-BR": "A diversão pessoal é guardada separada das notas da avaliação e nunca é lida pelo código de cálculo.",
            es: "El disfrute personal se guarda aparte de las notas de la evaluación y el código de puntuación nunca lo lee.",
          },
          {
            en: "Grade bands from Abysmal (0) to Masterpiece (10). A half rounds up, so 5.5 is Fine.",
            "pt-BR": "Faixas de nota de Abismal (0) a Obra-prima (10). Meio ponto arredonda para cima, então 5,5 é Razoável.",
            es: "Bandas de notas desde Abismal (0) hasta Obra maestra (10). Un medio se redondea hacia arriba, así que 5.5 es Aceptable.",
          },
          {
            en: "Each category shows what it covers and what belongs to its neighbors, to prevent counting the same strength twice.",
            "pt-BR":
              "Cada categoria mostra o que cobre e o que pertence às vizinhas, para evitar contar a mesma qualidade duas vezes.",
            es:
              "Cada categoría muestra qué abarca y qué pertenece a sus vecinas, para evitar contar dos veces la misma fortaleza.",
          },
          {
            en: "A reading note under the score explains that 6 and 7 are solid results and that a number does not describe a whole work. When the category grades are very close or very far apart, a second line says so.",
            "pt-BR":
              "Uma nota de leitura sob o resultado explica que 6 e 7 são resultados sólidos e que um número não descreve uma obra inteira. Quando as notas das categorias estão muito próximas ou muito distantes, uma segunda linha avisa.",
            es:
              "Una nota de lectura bajo la puntuación explica que 6 y 7 son resultados sólidos y que un número no describe una obra entera. Cuando las notas de las categorías están muy cerca o muy lejos entre sí, una segunda línea lo indica.",
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
            es:
              "Título e introducción de la temporada, diez tarjetas de categoría plegables, una barra de progreso y un control para expandir todo.",
          },
          {
            en: "Sliders for subcriteria, category grades and enjoyment. An ungraded slider shows no fill, so it cannot be mistaken for a grade.",
            "pt-BR":
              "Sliders para subcritérios, notas de categoria e diversão. Um slider sem nota aparece sem preenchimento, para não ser confundido com uma nota.",
            es:
              "Controles deslizantes para los subcriterios, las notas de las categorías y el disfrute. Un control sin calificar no muestra relleno, así que no se puede confundir con una nota.",
          },
          {
            en: "Result panel with the official score, a provisional or decided seal, a radar chart, a calculation table and the strongest and weakest categories.",
            "pt-BR":
              "Painel de resultado com a nota oficial, selo provisório ou definitivo, gráfico radar, tabela de cálculo e as categorias mais forte e mais fraca.",
            es:
              "Panel de resultado con la puntuación oficial, un sello provisional o decidido, un gráfico de radar, una tabla de cálculo y las categorías más fuerte y más débil.",
          },
          {
            en: "Score in the sticky header, so it stays visible while grading.",
            "pt-BR": "Nota no cabeçalho fixo, para ficar visível durante a avaliação.",
            es: "Puntuación en el encabezado fijo, para que siga visible mientras calificas.",
          },
          {
            en: "Interface in English and Brazilian Portuguese. The language follows the browser at first and the choice is remembered.",
            "pt-BR":
              "Interface em inglês e português do Brasil. O idioma segue o navegador no primeiro acesso e a escolha é lembrada.",
            es:
              "Interfaz en inglés y portugués de Brasil. El idioma sigue al navegador al principio y la elección se recuerda.",
          },
          {
            en: "Everything lives in memory. Closing the tab clears the evaluation, by design.",
            "pt-BR": "Tudo fica na memória. Fechar a aba apaga a avaliação, de propósito.",
            es: "Todo vive en la memoria. Cerrar la pestaña borra la evaluación, por diseño.",
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
            es:
              "Tema claro Washi (papel crema, tinta sumi) y tema oscuro Shikkoku (negro laca, texto marfil). No se usan el blanco puro ni el negro puro.",
          },
          {
            en: "The theme follows the system until you pick one. Options: Light, Dark, System.",
            "pt-BR": "O tema segue o sistema até você escolher um. Opções: Claro, Escuro, Sistema.",
            es: "El tema sigue al sistema hasta que elijas uno. Opciones: Claro, Oscuro, Sistema.",
          },
          {
            en: "Five pillars with the ranger colors and the kanji 赤 青 黄 緑 桃. Categories are numbered with formal numerals.",
            "pt-BR":
              "Cinco pilares com as cores dos rangers e os kanjis 赤 青 黄 緑 桃. As categorias são numeradas com numerais formais.",
            es:
              "Cinco pilares con los colores de los rangers y los kanji 赤 青 黄 緑 桃. Las categorías se numeran con numerales formales.",
          },
          {
            en: "Hanko seal as the logo and as the result stamp. Fonts: Dela Gothic One, Shippori Mincho, Zen Kaku Gothic New and JetBrains Mono.",
            "pt-BR":
              "Selo hanko como logo e como carimbo do resultado. Fontes: Dela Gothic One, Shippori Mincho, Zen Kaku Gothic New e JetBrains Mono.",
            es:
              "Sello hanko como logotipo y como sello del resultado. Tipografías: Dela Gothic One, Shippori Mincho, Zen Kaku Gothic New y JetBrains Mono.",
          },
          {
            en: "Reduced motion is respected, focus is always visible and the layout works from 360 px wide.",
            "pt-BR":
              "Movimento reduzido é respeitado, o foco é sempre visível e o layout funciona a partir de 360 px de largura.",
            es:
              "Se respeta el movimiento reducido, el foco siempre es visible y el diseño funciona desde 360 px de ancho.",
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
            es:
              "Exportación a Markdown en el formato de siete partes del método. Se puede copiar o descargar, e indica cuándo se redistribuyeron los pesos o la puntuación es parcial.",
          },
          {
            en: "JSON export and import. Imports are validated against the profile and rejected with a clear message when the file does not fit.",
            "pt-BR":
              "Exportação e importação em JSON. A importação é validada contra o perfil e recusada com uma mensagem clara quando o arquivo não serve.",
            es:
              "Exportación e importación de JSON. Las importaciones se validan contra el perfil y se rechazan con un mensaje claro cuando el archivo no encaja.",
          },
          {
            en: "Starting over asks for confirmation first.",
            "pt-BR": "Recomeçar pede confirmação antes.",
            es: "Empezar de nuevo pide confirmación antes.",
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
            es:
              "El motor de puntuación es TypeScript puro y está cubierto por pruebas unitarias: pesos, promedios de subcriterios, redistribución, puntuaciones parciales, bandas de notas, niveles de lectura, orden del Markdown y el ciclo de ida y vuelta del JSON.",
          },
          {
            en: "A test keeps this changelog in sync with the version in package.json.",
            "pt-BR": "Um teste mantém este histórico em sincronia com a versão do package.json.",
            es: "Una prueba mantiene este historial de cambios sincronizado con la versión de package.json.",
          },
          {
            en: "Dictionaries are typed, so a missing translation fails the type check.",
            "pt-BR": "Os dicionários são tipados, então uma tradução faltando quebra a checagem de tipos.",
            es: "Los diccionarios están tipados, así que una traducción ausente falla la comprobación de tipos.",
          },
        ],
      },
      {
        area: "docs",
        items: [
          {
            en: "README, the method description, the design system and five decision records.",
            "pt-BR": "README, descrição do método, design system e cinco registros de decisão.",
            es: "README, la descripción del método, el sistema de diseño y cinco registros de decisión.",
          },
        ],
      },
      {
        area: "limits",
        items: [
          {
            en: "No draft is kept after a refresh. Export JSON to keep your work.",
            "pt-BR": "Nenhum rascunho é mantido depois de atualizar a página. Exporte o JSON para guardar seu trabalho.",
            es: "No se conserva ningún borrador tras una actualización. Exporta el JSON para conservar tu trabajo.",
          },
          {
            en: "Grade guidance is generic. Category specific anchors for what a 3, 5, 7 or 9 means are not written yet.",
            "pt-BR":
              "A orientação de notas é genérica. Âncoras específicas por categoria para o que significa um 3, 5, 7 ou 9 ainda não foram escritas.",
            es:
              "La guía de notas es genérica. Aún no están escritos los anclajes específicos por categoría sobre lo que significa un 3, un 5, un 7 o un 9.",
          },
          {
            en: "Only the Sentai profile exists.",
            "pt-BR": "Só existe o perfil Sentai.",
            es: "Solo existe el perfil Sentai.",
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
    es: "Anclajes de notas específicos por categoría, escritos junto con el método.",
  },
  {
    en: "Keyboard shortcuts for grading and marking not applicable.",
    "pt-BR": "Atalhos de teclado para avaliar e marcar como não aplicável.",
    es: "Atajos de teclado para calificar y para marcar no aplicable.",
  },
  {
    en: "Compare two or more seasons side by side from imported JSON files.",
    "pt-BR": "Comparar duas ou mais temporadas lado a lado a partir de arquivos JSON importados.",
    es: "Comparar dos o más temporadas lado a lado a partir de archivos JSON importados.",
  },
  {
    en: "Kamen Rider profile.",
    "pt-BR": "Perfil Kamen Rider.",
    es: "Perfil de Kamen Rider.",
  },
  {
    en: "Sensitivity view: how much each category moves the final score.",
    "pt-BR": "Visão de sensibilidade: o quanto cada categoria move a nota final.",
    es: "Vista de sensibilidad: cuánto mueve cada categoría la puntuación final.",
  },
];

export const currentVersion = releases[0].version;
