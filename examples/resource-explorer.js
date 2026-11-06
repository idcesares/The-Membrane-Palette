// Deterministic local reference. No network, persistence, HTML interpolation or personal data.
const copy = {
  en: {
    title: "Resource explorer · The Membrane Palette", heading: "Find a resource. Keep the context.",
    static: {
      "skip-link": "Skip to content", eyebrow: "A working pattern / Learning resources",
      intro: "Explore six Membrane references, narrow the collection and inspect a resource without losing your place.",
      "sample-label": "Illustrative catalog. The resource links open existing English examples. Nothing is sent or saved.",
      "browse-title": "Browse resources", "search-label": "Search resources", "search-hint": "Search titles and descriptions in English or Portuguese.",
      "topic-label": "Topic", "topic-all": "All topics", "topic-teaching": "Teaching", "topic-research": "Research", "topic-design": "Design and development",
      "search-button": "Search", "cancel-loading": "Cancel loading", "back-to-results": "Back to results", "detail-label": "Read in context", "open-resource": "Open English reference",
      "detail-note": "The catalog copy is bilingual; the linked references remain in English. Selection is kept when the layout or language changes.",
      "load-error-title": "The catalog could not refresh", "load-error-body": "Previous results are still available. Try loading the sample again.", "retry-loading": "Retry loading",
      "partial-title": "Some resources are unavailable", "partial-body": "You can browse the available sample or retry the complete collection.", "retry-complete": "Load complete sample",
      "clear-filters": "Clear filters", "populate-sample": "Use populated sample", "states-summary": "Explore example states",
      "states-intro": "These controls deliberately simulate local catalog conditions. Loading is briefly delayed; no service is contacted.",
      "condition-label": "Example condition", "condition-ready": "Complete sample", "condition-loading": "Loading until canceled", "condition-partial": "Partial availability", "condition-empty": "Empty collection", "condition-error": "Temporary failure",
      "load-sample": "Load selected sample", "pattern-note": "Working reference: search, state recovery, bilingual content and adaptive list/detail.", "guide-link": "Experience patterns", "form-link": "Try the form journey", "evidence-link": "Accessibility evidence",
    },
    topics: { teaching: "Teaching", research: "Research", design: "Design and development" },
    loading: "Loading example resources…", canceled: "Loading canceled. Previous results are unchanged.", failure: "The catalog could not refresh. Previous results are available; retry loading.",
    count: (n) => `${new Intl.NumberFormat("en").format(n)} ${n === 1 ? "resource" : "resources"} available.`,
    partial: "Only part of the sample is available.", selected: (title) => `Selected: ${title}.`,
    choose: "Choose a resource", chooseBody: "Select a title to see its purpose and open the full reference.",
    noResults: "No resources match these filters", noResultsBody: "Try a broader phrase or clear the filters.",
    empty: "This sample collection is empty", emptyBody: "There is nothing to browse in this condition. Switch to the populated sample to continue.",
    listLabel: "Available resources",
  },
  "pt-BR": {
    title: "Explorador de recursos · The Membrane Palette", heading: "Encontre um recurso. Preserve o contexto.",
    static: {
      "skip-link": "Ir para o conteúdo", eyebrow: "Um padrão em funcionamento / Recursos de aprendizagem",
      intro: "Explore seis referências do Membrane, filtre a coleção e examine um recurso sem perder seu lugar.",
      "sample-label": "Catálogo ilustrativo. Os links abrem exemplos existentes em inglês. Nada é enviado ou salvo.",
      "browse-title": "Explorar recursos", "search-label": "Buscar recursos", "search-hint": "Busque títulos e descrições em português ou inglês.",
      "topic-label": "Tema", "topic-all": "Todos os temas", "topic-teaching": "Ensino", "topic-research": "Pesquisa", "topic-design": "Design e desenvolvimento",
      "search-button": "Buscar", "cancel-loading": "Cancelar carregamento", "back-to-results": "Voltar aos resultados", "detail-label": "Leia no contexto", "open-resource": "Abrir referência em inglês",
      "detail-note": "O catálogo é bilíngue; as referências continuam em inglês. A seleção é mantida quando o idioma ou o layout muda.",
      "load-error-title": "Não foi possível atualizar o catálogo", "load-error-body": "Os resultados anteriores continuam disponíveis. Tente carregar o exemplo novamente.", "retry-loading": "Tentar carregar novamente",
      "partial-title": "Alguns recursos estão indisponíveis", "partial-body": "Explore os recursos disponíveis ou tente carregar a coleção completa.", "retry-complete": "Carregar exemplo completo",
      "clear-filters": "Limpar filtros", "populate-sample": "Usar exemplo com recursos", "states-summary": "Explorar estados do exemplo",
      "states-intro": "Estes controles simulam condições locais do catálogo. Há um breve atraso no carregamento; nenhum serviço é acessado.",
      "condition-label": "Condição do exemplo", "condition-ready": "Exemplo completo", "condition-loading": "Carregando até cancelar", "condition-partial": "Disponibilidade parcial", "condition-empty": "Coleção vazia", "condition-error": "Falha temporária",
      "load-sample": "Carregar exemplo selecionado", "pattern-note": "Referência funcional: busca, recuperação de estados, conteúdo bilíngue e lista/detalhe adaptáveis.", "guide-link": "Padrões de experiência", "form-link": "Experimentar o formulário", "evidence-link": "Evidências de acessibilidade",
    },
    topics: { teaching: "Ensino", research: "Pesquisa", design: "Design e desenvolvimento" },
    loading: "Carregando recursos de exemplo…", canceled: "Carregamento cancelado. Os resultados anteriores foram mantidos.", failure: "Não foi possível atualizar o catálogo. Os resultados anteriores estão disponíveis; tente carregar novamente.",
    count: (n) => `${new Intl.NumberFormat("pt-BR").format(n)} ${n === 1 ? "recurso disponível" : "recursos disponíveis"}.`,
    partial: "Apenas parte do exemplo está disponível.", selected: (title) => `Selecionado: ${title}.`,
    choose: "Escolha um recurso", chooseBody: "Selecione um título para entender sua finalidade e abrir a referência completa.",
    noResults: "Nenhum recurso corresponde aos filtros", noResultsBody: "Tente uma expressão mais ampla ou limpe os filtros.",
    empty: "Esta coleção de exemplo está vazia", emptyBody: "Não há recursos nesta condição. Use o exemplo com recursos para continuar.",
    listLabel: "Recursos disponíveis",
  },
};

const resources = [
  { id: "teaching", topic: "teaching", href: "workshop.html", en: ["Start from a classroom question", "A workshop opening, learning journey and preparation notes."], "pt-BR": ["Começar por uma questão da sala de aula", "Abertura de oficina, percurso de aprendizagem e orientações de preparação."] },
  { id: "trace", topic: "research", href: "research-explainer.html", en: ["Interpreting a learning trace", "A conceptual question, a relationship diagram and the limits of an interpretation."], "pt-BR": ["Interpretar um registro de aprendizagem", "Uma questão conceitual, um diagrama de relações e os limites de uma interpretação."] },
  { id: "argument", topic: "research", href: "presentation.html", en: ["Structure an argument", "Six illustrative canvases connect a question, a method and a qualification."], "pt-BR": ["Estruturar um argumento", "Seis quadros ilustrativos conectam uma questão, um método e uma ressalva."] },
  { id: "article", topic: "design", href: "article.html", en: ["Compose a long-form article", "A reading layout with prose, a pull quote and related references."], "pt-BR": ["Compor um artigo longo", "Um layout de leitura com texto, citação em destaque e referências relacionadas."] },
  { id: "dashboard", topic: "design", href: "dashboard.html", en: ["Read a dashboard", "A sample interface brings together statistics, a chart, a table and navigation."], "pt-BR": ["Ler um painel", "Uma interface de exemplo reúne indicadores, gráfico, tabela e navegação."] },
  { id: "starter", topic: "design", href: "starter.html", en: ["Start a page", "A complete starter combines navigation, an opening, cards and a form."], "pt-BR": ["Começar uma página", "Um exemplo inicial combina navegação, abertura, cartões e formulário."] },
];

const byId = (id) => document.getElementById(id);
const wide = window.matchMedia("(min-width: 56rem)");
let language = new URLSearchParams(location.search).get("lang") === "pt-BR" ? "pt-BR" : "en";
let selected = null;
let detailView = false;
let results = resources;
let filters = { query: "", topic: "all" };
let outcome = "ready";
let busy = false;
let canceled = false;
let operation = 0;
let timer;
let pendingAction = null;

const normalize = (value) => value.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase().trim();
const matches = (resource, next) => (next.topic === "all" || resource.topic === next.topic)
  && normalize([...resource.en, ...resource["pt-BR"]].join(" ")).includes(normalize(next.query));

function layout() {
  const active = document.activeElement;
  byId("resource-browser").hidden = !wide.matches && detailView;
  byId("resource-detail").hidden = !wide.matches && !detailView;
  byId("back-to-results").hidden = wide.matches || !selected;
  if (active?.closest("[hidden]")) byId(detailView ? "detail-title" : "search-query").focus();
}

function render(restoreFocus = true) {
  const previousFocus = document.activeElement?.id;
  const text = copy[language];
  document.documentElement.lang = language;
  document.title = text.title;
  byId("language").value = language;
  byId("explorer-title").textContent = text.heading;
  for (const [id, value] of Object.entries(text.static)) byId(id).textContent = value;
  byId("resource-list").setAttribute("aria-label", text.listLabel);
  byId("load-progress").setAttribute("aria-label", text.loading);
  byId("load-progress").hidden = !busy;
  byId("cancel-loading").hidden = !busy;
  for (const id of ["search-button", "load-sample", "retry-loading", "retry-complete", "clear-filters", "populate-sample"]) {
    byId(id).setAttribute("aria-disabled", String(busy));
  }
  byId("resource-results").setAttribute("aria-busy", String(busy));
  byId("load-error").hidden = outcome !== "error";
  byId("partial-notice").hidden = outcome !== "partial";
  byId("empty-state").hidden = results.length !== 0;
  byId("empty-title").textContent = outcome === "empty" ? text.empty : text.noResults;
  byId("empty-body").textContent = outcome === "empty" ? text.emptyBody : text.noResultsBody;
  byId("clear-filters").hidden = outcome === "empty";
  byId("populate-sample").hidden = outcome !== "empty";
  let message = text.count(results.length);
  if (outcome === "partial") message += ` ${text.partial}`;
  if (outcome === "error") message = text.failure;
  if (selected) message += ` ${text.selected(resources.find((resource) => resource.id === selected)[language][0])}`;
  byId("results-status").textContent = busy ? text.loading : canceled ? text.canceled : message;

  const list = document.createDocumentFragment();
  for (const resource of results) {
    const item = document.createElement("li");
    const button = document.createElement("button");
    button.type = "button";
    button.id = `resource-${resource.id}`;
    button.className = "mp-button composition-resource-button";
    button.setAttribute("data-variant", "ghost");
    if (selected === resource.id) button.setAttribute("aria-current", "true");
    button.disabled = busy;
    button.textContent = resource[language][0];
    button.addEventListener("click", () => {
      selected = resource.id;
      detailView = true;
      canceled = false;
      render();
      byId(wide.matches ? `resource-${resource.id}` : "detail-title").focus();
    });
    const meta = document.createElement("p");
    meta.className = "composition-resource-meta";
    meta.textContent = text.topics[resource.topic];
    item.append(button, meta);
    list.append(item);
  }
  byId("resource-list").replaceChildren(list);
  const resource = resources.find((item) => item.id === selected);
  byId("detail-title").textContent = resource ? resource[language][0] : text.choose;
  byId("detail-description").textContent = resource ? resource[language][1] : text.chooseBody;
  byId("detail-topic").hidden = !resource;
  byId("detail-topic").textContent = resource ? text.topics[resource.topic] : "";
  byId("open-resource").hidden = !resource;
  if (resource) byId("open-resource").setAttribute("href", resource.href);
  layout();
  if (restoreFocus && previousFocus) {
    const target = byId(previousFocus);
    if (target && !target.closest("[hidden]") && !target.disabled) target.focus({ preventScroll: true });
    else if (!target || target.closest("[hidden]")) byId(detailView && !wide.matches ? "detail-title" : "search-query").focus({ preventScroll: true });
  }
}

function load(mode, nextFilters = filters) {
  if (busy) return;
  pendingAction = document.activeElement?.id;
  const ticket = ++operation;
  clearTimeout(timer);
  busy = true;
  canceled = false;
  render();
  // An inspectable waiting state in the demo lab; the cancel control stays visible.
  if (mode === "loading") { byId("cancel-loading").focus(); return; }
  timer = setTimeout(() => {
    if (ticket !== operation) return;
    busy = false;
    outcome = mode;
    if (mode !== "error") {
      filters = { ...nextFilters };
      const available = mode === "empty" ? [] : mode === "partial" ? resources.slice(0, 3) : resources;
      results = available.filter((resource) => matches(resource, filters));
      if (!results.some((resource) => resource.id === selected)) { selected = null; detailView = false; }
    }
    render();
  }, 650);
}

byId("search-form").addEventListener("submit", (event) => {
  event.preventDefault();
  if (busy) return;
  byId("sample-condition").value = "ready";
  load("ready", { query: byId("search-query").value, topic: byId("topic").value });
});
byId("language").addEventListener("change", (event) => { language = event.target.value; render(); });
byId("load-sample").addEventListener("click", () => { if (!busy) load(byId("sample-condition").value); });
for (const id of ["retry-loading", "retry-complete", "populate-sample"]) {
  byId(id).addEventListener("click", () => { if (busy) return; byId("sample-condition").value = "ready"; load("ready"); });
}
byId("clear-filters").addEventListener("click", () => {
  if (busy) return;
  byId("search-query").value = "";
  byId("topic").value = "all";
  byId("sample-condition").value = "ready";
  load("ready", { query: "", topic: "all" });
});
byId("cancel-loading").addEventListener("click", () => {
  operation++;
  clearTimeout(timer);
  busy = false;
  canceled = true;
  render(false);
  const target = byId(pendingAction);
  if (target && !target.closest("[hidden]")) target.focus();
  else byId(detailView && !wide.matches ? "detail-title" : "search-button").focus();
});
byId("back-to-results").addEventListener("click", () => {
  detailView = false;
  layout();
  byId(`resource-${selected}`).focus();
});
wide.addEventListener("change", layout);
render();
