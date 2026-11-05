import {
  BASE_PACKAGES,
  DEFAULT_SEGMENT_ID,
  MAINTENANCE_OPTIONS,
  SEGMENTS
} from './orcamento-config.js';
import {
  buildEmailPayload,
  calculateProject,
  formatCurrency,
  getEmailJsConfig,
  getSuggestedPackage,
  validateWhatsApp
} from './orcamento-calculator.js';

const app = document.querySelector('#orcamento-app');
if (!app) {
  throw new Error('Não foi possível localizar o container do orçamento.');
}

const state = {
  segmentId: DEFAULT_SEGMENT_ID,
  answers: {},
  currentStep: 1,
  maintenanceSelected: false,
  formSubmitted: false,
  lastSubmissionAt: 0
};

const MAX_STEP = 4;
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
        <button class="btn btn--primary" type="button" data-action="continue-to-form">Solicitar orçamento</button>
      </div>
    </div>
  `;
}

function renderFormStep() {
  const segment = getSegment();
  const result = calculateProject({ segment, answers: state.answers, maintenanceSelected: state.maintenanceSelected });
  const totalProject = result.totalProject;
  const totalMaintenance = result.totalMaintenance;

  return `
    <div class="orcamento__shell">
      <div class="orcamento__topo">
        <span class="badge badge--primary">${getStepLabel(4)}</span>
        <h1>Solicite seu orçamento</h1>
        <p>Preencha os dados abaixo e envie o resumo do projeto para o proprietário.</p>
      </div>
      <div class="orcamento__progress" aria-label="Progresso do orçamento">
        <span style="width: ${getProgressWidth(4)}"></span>
      </div>

      <form class="formulario orcamento__form" id="orcamento-form" novalidate>
        <div class="campo">
          <label for="orcamento-nome">Nome</label>
          <input id="orcamento-nome" name="nome" type="text" required />
          <span class="campo__erro" data-error-for="nome"></span>
        </div>

        <div class="campo">
          <label for="orcamento-negocio">Nome do negócio</label>
          <input id="orcamento-negocio" name="nomeNegocio" type="text" />
        </div>

        <div class="campo">
          <label for="orcamento-whatsapp">WhatsApp</label>
          <input id="orcamento-whatsapp" name="whatsapp" type="tel" placeholder="(16) 99876-5432" required />
          <span class="campo__erro" data-error-for="whatsapp"></span>
        </div>

        <div class="campo">
          <label for="orcamento-email">E-mail</label>
          <input id="orcamento-email" name="email" type="email" placeholder="seu@email.com" />
          <span class="campo__erro" data-error-for="email"></span>
        </div>

        <div class="campo">
          <label for="orcamento-cidade">Cidade</label>
          <input id="orcamento-cidade" name="cidade" type="text" />
        </div>

        <div class="campo campo--checkbox">
          <label class="campo__checkbox">
            <input id="orcamento-consentimento" type="checkbox" name="consentimento" required />
            <span>Li e aceito a política de privacidade e autorizo o uso dos meus dados para atendimento deste orçamento.</span>
          </label>
          <a href="../politica-de-privacidade/" target="_blank" rel="noopener noreferrer">Ver política de privacidade</a>
          <span class="campo__erro" data-error-for="consentimento"></span>
        </div>

        <div class="campo campo--captcha" aria-hidden="true">
          <input type="text" name="website" tabindex="-1" autocomplete="off" />
        </div>

        <div class="orcamento__resumo-envio">
          <div>
            <span>Segmento</span>
            <strong>${segment.name}</strong>
          </div>
          <div>
            <span>Pacote</span>
            <strong>${result.suggestedPackage}</strong>
          </div>
          <div>
            <span>Total do projeto</span>
            <strong>${formatCurrency(totalProject)}</strong>
          </div>
          <div>
            <span>Manutenção</span>
            <strong>${totalMaintenance > 0 ? formatCurrency(totalMaintenance) : 'Não incluída'}</strong>
          </div>
        </div>

        <div class="formulario__erro" hidden>
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <circle cx="12" cy="12" r="9"></circle>
            <path d="m9 9 6 6M15 9l-6 6"></path>
          </svg>
          <span id="orcamento-form-error">Preencha os campos obrigatórios corretamente.</span>
        </div>

        <div class="formulario__sucesso" hidden>
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <path d="M20 6 9 17l-5-5"></path>
          </svg>
          <span>Orçamento enviado com sucesso. Em breve entraremos em contato.</span>
        </div>

        <div class="orcamento__actions orcamento__actions--split">
          <button class="btn btn--secondary" type="button" data-action="previous-step">Voltar</button>
          <button class="btn btn--primary" type="submit">Enviar orçamento</button>
        </div>
      </form>
    </div>
  `;
}

function applyError(input, message) {
  const wrapper = input.closest('.campo');
  const errorNode = document.querySelector(`[data-error-for="${input.name}"]`);

  if (wrapper) {
    wrapper.classList.add('is-invalido');
  }

  if (errorNode) {
    errorNode.textContent = message;
  }
}

function clearError(input) {
  const wrapper = input.closest('.campo');
  const errorNode = document.querySelector(`[data-error-for="${input.name}"]`);

  if (wrapper) {
    wrapper.classList.remove('is-invalido');
  }

  if (errorNode) {
    errorNode.textContent = '';
  }
}

function validateForm(form) {
  let valid = true;
  const name = form.querySelector('#orcamento-nome');
  const phone = form.querySelector('#orcamento-whatsapp');
  const email = form.querySelector('#orcamento-email');
  const consent = form.querySelector('#orcamento-consentimento');
  const honeypot = form.querySelector('input[name="website"]');
  const errorBox = form.querySelector('.formulario__erro');

  if (honeypot && honeypot.value.trim() !== '') {
    valid = false;
    if (errorBox) {
      errorBox.hidden = false;
      errorBox.querySelector('span').textContent = 'Solicitação rejeitada.';
    }
    return false;
  }

  if (!name.value.trim()) {
    valid = false;
    applyError(name, 'Informe seu nome.');
  } else {
    clearError(name);
  }

  if (!phone.value.trim() || !validateWhatsApp(phone.value)) {
    valid = false;
    applyError(phone, 'Informe um WhatsApp válido com DDD e 9 dígitos.');
  } else {
    clearError(phone);
  }

  if (email.value.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
    valid = false;
    applyError(email, 'Informe um e-mail válido.');
  } else {
    clearError(email);
  }

  if (!consent.checked) {
    valid = false;
    applyError(consent, 'Você precisa aceitar a política de privacidade.');
  } else {
    clearError(consent);
  }

  if (errorBox && valid) {
    errorBox.hidden = true;
  }

  return valid;
}

async function handleSubmit(event) {
  event.preventDefault();
  const form = event.currentTarget;
  const honeypot = form.querySelector('input[name="website"]');

  if (honeypot && honeypot.value.trim() !== '') {
    const successBox = form.querySelector('.formulario__sucesso');
    const errorBox = form.querySelector('.formulario__erro');
    if (successBox) {
      successBox.hidden = false;
    }
    if (errorBox) {
      errorBox.hidden = true;
    }
    form.reset();
    return;
  }

  if (!validateForm(form)) {
    return;
  }

  const now = Date.now();
  const cooldownMs = 60 * 1000;
  if (now - state.lastSubmissionAt < cooldownMs) {
    const errorBox = form.querySelector('.formulario__erro');
    errorBox.hidden = false;
    errorBox.querySelector('span').textContent = 'Aguarde 60 segundos antes de enviar um novo orçamento.';
    return;
  }

  const segment = getSegment();
  const result = calculateProject({ segment, answers: state.answers, maintenanceSelected: state.maintenanceSelected });
  const data = {
    name: form.querySelector('#orcamento-nome').value.trim(),
    businessName: form.querySelector('#orcamento-negocio').value.trim(),
    phone: form.querySelector('#orcamento-whatsapp').value.trim(),
    email: form.querySelector('#orcamento-email').value.trim(),
    city: form.querySelector('#orcamento-cidade').value.trim(),
    consent: form.querySelector('#orcamento-consentimento').checked
  };

  const config = getEmailJsConfig();
  const hasEmailConfig = Boolean(config.publicKey && config.serviceId && config.templateId);

  if (!hasEmailConfig) {
    const errorBox = form.querySelector('.formulario__erro');
    errorBox.hidden = false;
    errorBox.querySelector('span').textContent = 'As variáveis do EmailJS não foram configuradas. Ajuste o arquivo .env.example e recarregue a página.';
    return;
  }

  const payload = buildEmailPayload({
    segment,
    answers: state.answers,
    result,
    customer: data
  });

  const successBox = form.querySelector('.formulario__sucesso');
  const errorBox = form.querySelector('.formulario__erro');

  try {
    if (typeof window.emailjs?.init === 'function') {
      window.emailjs.init({ publicKey: config.publicKey });
    }

    await window.emailjs.send(config.serviceId, config.templateId, payload);
    state.lastSubmissionAt = now;
    state.formSubmitted = true;
    form.reset();
    successBox.hidden = false;
    errorBox.hidden = true;
  } catch (error) {
    errorBox.hidden = false;
    errorBox.querySelector('span').textContent = 'Não foi possível enviar o orçamento agora. Verifique sua conexão e tente novamente.';
    console.error('Erro ao enviar orçamento via EmailJS', error);
  }
}

function render() {
  if (state.currentStep === 1) {
    app.innerHTML = renderSegmentSelection();
  } else if (state.currentStep === 2) {
    app.innerHTML = renderQuestionStep();
  } else if (state.currentStep === 3) {
    app.innerHTML = renderResultStep();
  } else {
    app.innerHTML = renderFormStep();
    const form = app.querySelector('#orcamento-form');
    if (form) {
      form.addEventListener('submit', handleSubmit);
    }
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

      if (action === 'continue-to-form') {
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

  const form = app.querySelector('#orcamento-form');
  if (form) {
    form.querySelectorAll('input').forEach((input) => {
      input.addEventListener('input', () => clearError(input));
      input.addEventListener('blur', () => {
        if (input.name === 'whatsapp' && input.value.trim()) {
          if (!validateWhatsApp(input.value)) {
            applyError(input, 'Informe um WhatsApp válido com DDD e 9 dígitos.');
          }
        }
      });
    });
  }
}

render();
