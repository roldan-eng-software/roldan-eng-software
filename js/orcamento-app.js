import {
  BASE_PACKAGES,
  DEFAULT_SEGMENT_ID,
  MAINTENANCE_OPTIONS,
  SEGMENTS
} from './orcamento-config.js';
import {
  buildWhatsAppMessage,
  calculateProject,
  formatCurrency
} from './orcamento-calculator.js';

const app = document.querySelector('#orcamento-app');
if (!app) {
  throw new Error('Não foi possível localizar o container do orçamento.');
}

const state = {
  segmentId: DEFAULT_SEGMENT_ID,
  answers: {},
  currentStep: 1,
  maintenanceSelected: false
};

const MAX_STEP = 4;
const WHATSAPP_NUMBER = '5516981442301';
const BUSINESS_EMAIL = 'roldan.eng.software@gmail.com';
const segmentMap = new Map(SEGMENTS.map((segment) => [segment.id, segment]));

function setSegment(segmentId) {
  state.segmentId = segmentId;
  state.answers = {};
  state.currentStep = 2;
  render();
}

function getSegment() {
  return segmentMap.get(state.segmentId) ?? SEGMENTS[0];
}

function getStepLabel(stepNumber) {
  return `Passo ${stepNumber} de ${MAX_STEP}`;
}

function getProgressWidth(stepNumber) {
  return `${(stepNumber / MAX_STEP) * 100}%`;
}

function nextStep() {
  if (state.currentStep < 4) {
    state.currentStep += 1;
    render();
  }
}

function previousStep() {
  if (state.currentStep > 1) {
    state.currentStep -= 1;
    render();
  }
}

function handleAnswerChange(questionId, value) {
  state.answers[questionId] = value;
}

function renderSegmentSelection() {
  return `
    <div class="orcamento__shell">
      <div class="orcamento__topo">
        <span class="badge badge--primary">${getStepLabel(1)}</span>
        <h1>Qual segmento do seu negócio?</h1>
        <p>Responda 4 etapas rápidas para receber um pacote sugerido e um valor médio estimado.</p>
      </div>
      <div class="orcamento__progress" aria-label="Progresso do orçamento">
        <span style="width: ${getProgressWidth(1)}"></span>
      </div>
      <div class="orcamento__cards">
        ${SEGMENTS.map((segment) => {
          const isSelected = segment.id === state.segmentId;
          return `
            <button class="orcamento__card ${isSelected ? 'is-selected' : ''}" type="button" data-segment-id="${segment.id}">
              <span class="orcamento__card-badge">${segment.name}</span>
              <strong>${segment.card}</strong>
              <small>${segment.description}</small>
            </button>
          `;
        }).join('')}
      </div>
      <div class="orcamento__actions">
        <button class="btn btn--primary" type="button" data-action="continue-to-questions">Continuar</button>
      </div>
    </div>
  `;
}

function renderQuestionStep() {
  const segment = getSegment();
  const progressStep = 2;

  return `
    <div class="orcamento__shell">
      <div class="orcamento__topo">
        <span class="badge badge--primary">${getStepLabel(progressStep)}</span>
        <h1>${segment.name}</h1>
        <p>${segment.description}</p>
      </div>
      <div class="orcamento__progress" aria-label="Progresso do orçamento">
        <span style="width: ${getProgressWidth(progressStep)}"></span>
      </div>
      <div class="orcamento__lista">
        ${segment.questions.map((question) => {
          const currentAnswer = state.answers[question.id];
          const optionClasses = ['sim', 'nao', 'nao-sei'];

          return `
            <fieldset class="orcamento__questao" data-question-id="${question.id}">
              <legend>${question.text}</legend>
              <div class="orcamento__opcoes" role="radiogroup" aria-label="${question.text}">
                ${optionClasses.map((option) => {
                  const optionValue = option === 'sim' ? true : option === 'nao' ? false : 'skip';
                  const isChecked = currentAnswer === optionValue;
                  return `
                    <label class="orcamento__opcao ${isChecked ? 'is-selected' : ''}">
                      <input type="radio" name="${question.id}" value="${String(optionValue)}" ${isChecked ? 'checked' : ''} />
                      <span>${option === 'sim' ? 'Sim' : option === 'nao' ? 'Não' : 'Não sei ainda'}</span>
                    </label>
                  `;
                }).join('')}
              </div>
            </fieldset>
          `;
        }).join('')}
      </div>
      <div class="orcamento__actions orcamento__actions--split">
        <button class="btn btn--secondary" type="button" data-action="previous-step">Voltar</button>
        <button class="btn btn--primary" type="button" data-action="continue-to-result">Ver orçamento</button>
      </div>
    </div>
  `;
}

function renderResultStep() {
  const segment = getSegment();
  const result = calculateProject({ segment, answers: state.answers, maintenanceSelected: state.maintenanceSelected });
  const suggestedPackageLabel = result.suggestedPackage;
  const suggestedPackage = BASE_PACKAGES[suggestedPackageLabel];
  const hasAdditionalItems = result.additionalItems.length > 0;

  return `
    <div class="orcamento__shell">
      <div class="orcamento__topo">
        <span class="badge badge--primary">${getStepLabel(3)}</span>
        <h1>Seu orçamento sugerido</h1>
        <p>Valor médio estimado para o segmento de ${segment.name.toLowerCase()}.</p>
      </div>
      <div class="orcamento__progress" aria-label="Progresso do orçamento">
        <span style="width: ${getProgressWidth(3)}"></span>
      </div>
      <div class="orcamento__resultado">
        <div class="orcamento__resumo">
          <span class="orcamento__resumo-label">Pacote sugerido</span>
          <strong>${suggestedPackageLabel}</strong>
          <p>${suggestedPackage.description}</p>
          <div class="orcamento__valor">${formatCurrency(suggestedPackage.price)}</div>
        </div>
        <div class="orcamento__detalhes">
          <h2>Itens adicionais</h2>
          ${hasAdditionalItems ? `
            <ul>
              ${result.additionalItems.map((item) => `
                <li>
                  <span>${item.name}</span>
                  <strong>${formatCurrency(item.price)}</strong>
                </li>
              `).join('')}
            </ul>
          ` : '<p class="orcamento__vazio">Nenhum item extra por enquanto.</p>'}
        </div>
      </div>

      <div class="orcamento__total-box">
        <div>
          <span>Total do projeto</span>
          <strong>${formatCurrency(result.totalProject)}</strong>
        </div>
        <label class="orcamento__check">
          <input type="checkbox" data-action="toggle-maintenance" ${state.maintenanceSelected ? 'checked' : ''} />
          <span>Incluir manutenção mensal</span>
        </label>
      </div>

      <div class="orcamento__manutencao ${state.maintenanceSelected ? 'is-visible' : ''}">
        <h3>Manutenção mensal</h3>
        <ul>
          ${MAINTENANCE_OPTIONS.map((option) => `
            <li>
              <span>${option.name}</span>
              <strong>${formatCurrency(option.price)}</strong>
            </li>
          `).join('')}
        </ul>
        <p>Subtotal: <strong>${formatCurrency(result.totalMaintenance)}</strong></p>
      </div>

      <p class="orcamento__nota">Valor médio estimado. O orçamento final depende do escopo, do conteúdo e de uma conversa inicial.</p>
      <div class="orcamento__actions orcamento__actions--split">
        <button class="btn btn--secondary" type="button" data-action="previous-step">Voltar</button>
        <button class="btn btn--primary" type="button" data-action="continue-to-contact">Solicitar orçamento</button>
      </div>
    </div>
  `;
}

// Apresenta o resumo da simulação e os canais para solicitar atendimento.
function renderContactStep() {
  const segment = getSegment();
  const result = calculateProject({ segment, answers: state.answers, maintenanceSelected: state.maintenanceSelected });
  const message = buildWhatsAppMessage({ segment, answers: state.answers, result });
  const selectedItems = segment.questions.filter((question) => state.answers[question.id] === true);
  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
  const emailUrl = `mailto:${BUSINESS_EMAIL}?subject=${encodeURIComponent(`Orçamento para ${segment.name}`)}&amp;body=${encodeURIComponent(message)}`;

  return `
    <div class="orcamento__shell">
      <div class="orcamento__topo">
        <span class="badge badge--primary">${getStepLabel(4)}</span>
        <h1>Vamos conversar sobre seu projeto</h1>
        <p>Confira o resumo e continue pelo canal que preferir. Você poderá revisar a mensagem antes de enviá-la.</p>
      </div>
      <div class="orcamento__progress" aria-label="Progresso do orçamento">
        <span style="width: ${getProgressWidth(4)}"></span>
      </div>

      <section class="orcamento__resumo-envio" aria-label="Resumo do orçamento">
        <div>
          <span>Segmento</span>
          <strong>${segment.name}</strong>
        </div>
        <div>
          <span>Pacote</span>
          <strong>${result.suggestedPackage}</strong>
        </div>
        <div class="orcamento__resumo-itens">
          <span>Itens desejados</span>
          ${selectedItems.length
            ? `<ul>${selectedItems.map((question) => `<li>${question.text}</li>`).join('')}</ul>`
            : '<strong>Ainda não definidos</strong>'}
        </div>
        <div>
          <span>Estimativa do projeto</span>
          <strong>${formatCurrency(result.totalProject)}</strong>
        </div>
        <div>
          <span>Manutenção</span>
          <strong>${result.totalMaintenance > 0 ? `${formatCurrency(result.totalMaintenance)} por mês` : 'Não incluída'}</strong>
        </div>
      </section>

      <p class="orcamento__nota">A mensagem só será compartilhada quando você confirmar o envio no WhatsApp ou no seu aplicativo de e-mail.</p>
      <div class="orcamento__actions orcamento__actions--split">
        <button class="btn btn--secondary" type="button" data-action="previous-step">Voltar</button>
        <a class="btn btn--primary" href="${whatsappUrl}" target="_blank" rel="noopener noreferrer">Continuar pelo WhatsApp</a>
      </div>
      <p class="orcamento__contato-alternativo">Prefere outro canal? <a href="${emailUrl}">Enviar por e-mail</a></p>
    </div>
  `;
}

// Renderiza a etapa ativa do assistente e conecta as interações disponíveis.
function render() {
  if (state.currentStep === 1) {
    app.innerHTML = renderSegmentSelection();
  } else if (state.currentStep === 2) {
    app.innerHTML = renderQuestionStep();
  } else if (state.currentStep === 3) {
    app.innerHTML = renderResultStep();
  } else {
    app.innerHTML = renderContactStep();
  }

  const segmentButtons = app.querySelectorAll('[data-segment-id]');
  segmentButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const segmentId = button.getAttribute('data-segment-id');
      setSegment(segmentId);
    });
  });

  const actionButtons = app.querySelectorAll('[data-action]');
  actionButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const action = button.getAttribute('data-action');
      if (action === 'continue-to-questions') {
        state.currentStep = 2;
        render();
      }

      if (action === 'continue-to-result') {
        const segment = getSegment();
        const unanswered = segment.questions.some((question) => state.answers[question.id] === undefined);
        if (unanswered) {
          const hasAnyAnswer = Object.values(state.answers).some(Boolean);
          if (!hasAnyAnswer) {
            state.answers = Object.fromEntries(segment.questions.map((question) => [question.id, false]));
          }
        }
        nextStep();
      }

      if (action === 'continue-to-contact') {
        nextStep();
      }

      if (action === 'previous-step') {
        previousStep();
      }

      if (action === 'toggle-maintenance') {
        const checkbox = button.closest('.orcamento__check')?.querySelector('input');
        state.maintenanceSelected = !!checkbox?.checked;
        render();
      }
    });
  });

  const questionInputs = app.querySelectorAll('input[type="radio"]');
  questionInputs.forEach((input) => {
    input.addEventListener('change', (event) => {
      const questionId = event.target.name;
      const value = event.target.value === 'true' ? true : event.target.value === 'false' ? false : 'skip';
      handleAnswerChange(questionId, value);
    });
  });

  const maintenanceToggle = app.querySelector('[data-action="toggle-maintenance"]');
  if (maintenanceToggle) {
    maintenanceToggle.addEventListener('change', (event) => {
      state.maintenanceSelected = event.target.checked;
      render();
    });
  }

}

render();
