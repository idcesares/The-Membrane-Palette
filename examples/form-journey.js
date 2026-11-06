/* Example-local behavior: no storage, network requests or library API. */
(() => {
  "use strict";

  const byId = (id) => document.getElementById(id);
  const copy = {
    en: {
      title: "Plan a learning resource · The Membrane Palette",
      progress: "Form progress",
      labels: {
        "skip-link": "Skip to content",
        "language-label": "Language",
        "journey-kicker": "A complete form / Illustrative plan",
        "journey-title": "Plan a learning resource.",
        "journey-intro": "Start with one learning goal. Choose a format, review your choices and try a local confirmation.",
        "privacy-title": "An example, only in this tab.",
        "privacy-note": "No information is sent or stored. Your choices stay only in the current tab and reset when this page reloads.",
        "scenario-note": "Use an invented teaching scenario. Leave names and personal information out of this exercise.",
        "demo-options": "Explore a demo state",
        "failure-option-label": "Next confirmation fails",
        "demo-hint": "Interrupt the next local simulation. Your choices remain available, and retry completes the example.",
        "pattern-link": "Read the form pattern",
        "step-describe": "1. Describe",
        "step-review": "2. Review",
        "step-confirm": "3. Confirm locally",
        "entry-title": "What should the resource help someone learn?",
        "required-note": "Both fields are required.",
        "error-title": "Check the highlighted fields",
        "plan-legend": "Your example resource",
        "goal-label": "Learning goal",
        "goal-hint": "For example: compare two explanations of the water cycle.",
        "format-label": "Resource format",
        "format-empty": "Choose a format",
        "format-hint": "Choose the shape that best supports the goal.",
        "review-plan": "Review plan",
        "review-title": "Review your example plan",
        "review-intro": "Check each choice before confirming this local example.",
        "review-goal-label": "Learning goal",
        "review-format-label": "Resource format",
        "edit-goal": "Edit learning goal",
        "edit-format": "Edit resource format",
        "failure-title": "The simulation stopped",
        "failure-note": "The selected demo state interrupted the local confirmation. Your choices are unchanged. Try again to complete the example.",
        "review-note": "This confirms an example plan in this tab. It does not create or send a learning resource.",
        "confirmation-title": "Example plan confirmed in this tab",
        "confirmation-note": "You completed the local form example. No information was sent, and no resource was created or stored.",
        "confirmation-goal-label": "Learning goal",
        "confirmation-format-label": "Resource format",
        "confirmation-tab-note": "This example remains visible only in the current tab until you reload or leave the page.",
        "footer-note": "Membrane composition reference · An illustrative local form journey.",
      },
      formats: { guide: "Guide", activity: "Activity", checklist: "Checklist" },
      errors: { goal: "Enter a learning goal.", format: "Choose a resource format." },
      confirm: "Confirm example plan",
      retry: "Try again",
      busy: "Confirming locally…",
      status: {
        review: "Your example plan is ready to review. Nothing has been sent.",
        submitting: "Simulating confirmation in this tab. Nothing is being sent.",
        complete: "Local example completed. No information was sent or stored.",
      },
    },
    "pt-BR": {
      title: "Planeje um recurso de aprendizagem · The Membrane Palette",
      progress: "Etapas do formulário",
      labels: {
        "skip-link": "Pular para o conteúdo",
        "language-label": "Idioma",
        "journey-kicker": "Um formulário completo / Plano ilustrativo",
        "journey-title": "Planeje um recurso de aprendizagem.",
        "journey-intro": "Comece com um objetivo de aprendizagem. Escolha um formato, revise suas escolhas e experimente uma confirmação local.",
        "privacy-title": "Um exemplo, apenas nesta aba.",
        "privacy-note": "Nenhuma informação é enviada ou armazenada. Suas escolhas ficam apenas na aba atual e são apagadas ao recarregar esta página.",
        "scenario-note": "Use uma situação de ensino inventada. Não inclua nomes nem informações pessoais neste exercício.",
        "demo-options": "Explore um estado de demonstração",
        "failure-option-label": "A próxima confirmação falha",
        "demo-hint": "Interrompa a próxima simulação local. Suas escolhas continuam disponíveis, e uma nova tentativa conclui o exemplo.",
        "pattern-link": "Leia o padrão de formulários",
        "step-describe": "1. Descreva",
        "step-review": "2. Revise",
        "step-confirm": "3. Confirme localmente",
        "entry-title": "O que o recurso deve ajudar alguém a aprender?",
        "required-note": "Os dois campos são obrigatórios.",
        "error-title": "Revise os campos destacados",
        "plan-legend": "Seu recurso de exemplo",
        "goal-label": "Objetivo de aprendizagem",
        "goal-hint": "Por exemplo: comparar duas explicações do ciclo da água.",
        "format-label": "Formato do recurso",
        "format-empty": "Escolha um formato",
        "format-hint": "Escolha o formato que melhor apoia o objetivo.",
        "review-plan": "Revisar plano",
        "review-title": "Revise seu plano de exemplo",
        "review-intro": "Confira cada escolha antes de confirmar este exemplo local.",
        "review-goal-label": "Objetivo de aprendizagem",
        "review-format-label": "Formato do recurso",
        "edit-goal": "Editar objetivo de aprendizagem",
        "edit-format": "Editar formato do recurso",
        "failure-title": "A simulação foi interrompida",
        "failure-note": "O estado de demonstração selecionado interrompeu a confirmação local. Suas escolhas foram mantidas. Tente novamente para concluir o exemplo.",
        "review-note": "Esta ação confirma um plano de exemplo nesta aba. Ela não cria nem envia um recurso de aprendizagem.",
        "confirmation-title": "Plano de exemplo confirmado nesta aba",
        "confirmation-note": "Você concluiu o exemplo local de formulário. Nenhuma informação foi enviada, e nenhum recurso foi criado ou armazenado.",
        "confirmation-goal-label": "Objetivo de aprendizagem",
        "confirmation-format-label": "Formato do recurso",
        "confirmation-tab-note": "Este exemplo fica visível apenas na aba atual até você recarregar ou sair da página.",
        "footer-note": "Referência de composição Membrane · Um exemplo de formulário local.",
      },
      formats: { guide: "Guia", activity: "Atividade", checklist: "Lista de verificação" },
      errors: { goal: "Escreva um objetivo de aprendizagem.", format: "Escolha um formato para o recurso." },
      confirm: "Confirmar plano de exemplo",
      retry: "Tentar novamente",
      busy: "Confirmando localmente…",
      status: {
        review: "Seu plano de exemplo está pronto para revisão. Nada foi enviado.",
        submitting: "Simulando a confirmação nesta aba. Nenhuma informação está sendo enviada.",
        complete: "Exemplo local concluído. Nenhuma informação foi enviada ou armazenada.",
      },
    },
  };

  const languageControl = byId("journey-language");
  const goalControl = byId("learning-goal");
  const formatControl = byId("resource-format");
  const confirmButton = byId("confirm-plan");
  const errorFields = {
    goal: { control: goalControl, hint: "goal-hint" },
    format: { control: formatControl, hint: "format-hint" },
  };
  let language = new URL(location.href).searchParams.get("lang") === "pt-BR" ? "pt-BR" : "en";
  let stage = "entry";
  let errors = [];

  function render() {
    const words = copy[language];
    document.documentElement.lang = language;
    document.title = words.title;
    languageControl.value = language;
    for (const [id, label] of Object.entries(words.labels)) byId(id).textContent = label;
    byId("journey-steps").setAttribute("aria-label", words.progress);
    for (const [value, label] of Object.entries(words.formats)) byId(`format-${value}`).textContent = label;

    for (const [key, field] of Object.entries(errorFields)) {
      const invalid = errors.includes(key);
      byId(`${key}-error`).textContent = words.errors[key];
      byId(`${key}-error`).hidden = !invalid;
      byId(`${key}-summary-link`).textContent = words.errors[key];
      byId(`${key}-summary-item`).hidden = !invalid;
      field.control.setAttribute("aria-describedby", `${field.hint}${invalid ? ` ${key}-error` : ""}`);
      if (invalid) field.control.setAttribute("aria-invalid", "true");
      else field.control.removeAttribute("aria-invalid");
    }
    byId("error-summary").hidden = errors.length === 0;
    byId("entry-stage").hidden = stage !== "entry";
    byId("review-stage").hidden = !["review", "submitting", "failure"].includes(stage);
    byId("confirmation-stage").hidden = stage !== "complete";
    byId("failure-message").hidden = stage !== "failure";
    const busy = stage === "submitting";
    byId("review-stage").setAttribute("aria-busy", String(busy));
    confirmButton.setAttribute("aria-busy", String(busy));
    confirmButton.setAttribute("aria-disabled", String(busy));
    confirmButton.textContent = busy ? words.busy : stage === "failure" ? words.retry : words.confirm;
    byId("edit-goal").disabled = busy;
    byId("edit-format").disabled = busy;
    byId("fail-next-confirmation").disabled = busy || stage === "complete";

    for (const target of ["review", "confirmation"]) {
      byId(`${target}-goal`).textContent = goalControl.value;
      byId(`${target}-format`).textContent = words.formats[formatControl.value] || "";
    }
    const currentStep = stage === "entry" ? "describe" : stage === "complete" ? "confirm" : "review";
    for (const step of ["describe", "review", "confirm"]) {
      if (step === currentStep) byId(`step-${step}`).setAttribute("aria-current", "step");
      else byId(`step-${step}`).removeAttribute("aria-current");
    }
    byId("journey-status").textContent = words.status[stage] || "";
  }

  byId("plan-form").addEventListener("submit", (event) => {
    event.preventDefault();
    if (stage !== "entry") return;
    errors = [];
    if (!goalControl.value.trim()) errors.push("goal");
    if (!Object.hasOwn(copy.en.formats, formatControl.value)) errors.push("format");
    if (errors.length) {
      render();
      byId("error-summary").focus();
      return;
    }
    stage = "review";
    render();
    byId("review-title").focus();
  });

  for (const [key, field] of Object.entries(errorFields)) {
    byId(`${key}-summary-link`).addEventListener("click", (event) => {
      event.preventDefault();
      field.control.focus();
    });
    byId(`edit-${key}`).addEventListener("click", () => {
      if (!["review", "failure"].includes(stage)) return;
      stage = "entry";
      render();
      field.control.focus();
    });
  }

  confirmButton.addEventListener("click", () => {
    if (!["review", "failure"].includes(stage)) return;
    const fail = byId("fail-next-confirmation").checked;
    byId("fail-next-confirmation").checked = false;
    stage = "submitting";
    render();
    // A short local timer makes the pending state inspectable. No service runs.
    window.setTimeout(() => {
      stage = fail ? "failure" : "complete";
      // Do not steal focus if the reader moved to the language selector.
      const restoreFocus = document.activeElement === confirmButton;
      render();
      if (stage === "complete" && restoreFocus) byId("confirmation-title").focus();
    }, 900);
  });

  languageControl.addEventListener("change", () => {
    language = languageControl.value;
    const url = new URL(location.href);
    url.searchParams.set("lang", language);
    history.replaceState(null, "", url);
    render();
  });

  byId("plan-fields").disabled = false;
  render();
})();
