import { BASE_PACKAGES, ITEMS, MAINTENANCE_OPTIONS, PACKAGE_LEVELS } from './orcamento-config.js';

export function getPackageLevelPenalty(questionItemId) {
  if (['carrinho', 'reservas', 'fidelidade', 'promocoes'].includes(questionItemId)) {
    return PACKAGE_LEVELS.COMPLETO;
  }

  if (['cardapio_fotos', 'galeria', 'seo_local', 'analytics'].includes(questionItemId)) {
    return PACKAGE_LEVELS.PROFESSIONAL;
  }

  return PACKAGE_LEVELS.ESSENTIAL;
}

export function getSuggestedPackage(answers, segment) {
  const packageOrder = [
    PACKAGE_LEVELS.ESSENTIAL,
    PACKAGE_LEVELS.PROFESSIONAL,
    PACKAGE_LEVELS.COMPLETO
  ];

  let requiredLevel = PACKAGE_LEVELS.ESSENTIAL;

  segment.questions.forEach((question) => {
    if (answers[question.id] !== true) {
      return;
    }

    const level = getPackageLevelPenalty(question.itemId);
    const levelIndex = packageOrder.indexOf(level);
    const currentIndex = packageOrder.indexOf(requiredLevel);

    if (levelIndex > currentIndex) {
      requiredLevel = level;
    }
  });

  return requiredLevel;
}

export function calculateProject({ segment, answers, maintenanceSelected = false }) {
  const safeAnswers = { ...answers };
  const suggestedPackage = getSuggestedPackage(safeAnswers, segment);
  const basePackage = BASE_PACKAGES[suggestedPackage];

  const additionalItems = segment.questions
    .filter((question) => safeAnswers[question.id] === true)
    .map((question) => {
      const item = ITEMS[question.itemId];

      return {
        id: question.itemId,
        name: item?.name ?? question.text,
        price: item?.price ?? null,
        includedIn: item?.includedIn ?? [],
        isIncludedInPackage: item ? item.includedIn.includes(suggestedPackage) : false
      };
    })
    .filter((item) => item.price !== null && !item.isIncludedInPackage)
    .map((item) => ({ ...item, price: Number(item.price) }));

  const totalProject = additionalItems.reduce((sum, item) => sum + item.price, 0) + basePackage.price;
  const totalMaintenance = maintenanceSelected
    ? MAINTENANCE_OPTIONS.reduce((sum, option) => sum + option.price, 0)
    : 0;

  return {
    suggestedPackage,
    basePackage,
    additionalItems,
    totalProject,
    totalMaintenance,
    includedButNotAdded: segment.questions
      .filter((question) => safeAnswers[question.id] === true)
      .map((question) => ({
        id: question.itemId,
        name: ITEMS[question.itemId]?.name ?? question.text,
        price: ITEMS[question.itemId]?.price ?? null,
        isIncludedInPackage: ITEMS[question.itemId] ? ITEMS[question.itemId].includedIn.includes(suggestedPackage) : false
      }))
      .filter((item) => item.price === null || item.isIncludedInPackage)
  };
}

export function formatCurrency(value) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(Number(value) || 0);
}

export function formatProjectTotal(value) {
  return formatCurrency(value);
}

export function validateWhatsApp(value) {
  if (!value || typeof value !== 'string') {
    return false;
  }

  const digits = value.replace(/\D/g, '');

  if (digits.length === 12 && digits.startsWith('55')) {
    const withoutCountry = digits.slice(2);
    return withoutCountry.length === 11 && /^\d{11}$/.test(withoutCountry);
  }

  return digits.length === 11 && /^\d{11}$/.test(digits);
}

export function buildEmailPayload({ segment, answers, result, customer }) {
  const responseText = segment.questions
    .map((question) => {
      const answer = answers[question.id];
      const label = answer === true ? 'Sim' : answer === false ? 'Não' : 'Não sei ainda';
      return `${question.text}: ${label}`;
    })
    .join('; ');

  const additionalItemsText = result.additionalItems.length
    ? result.additionalItems.map((item) => `${item.name} (${formatCurrency(item.price)})`).join('; ')
    : 'Nenhum';

  const maintenanceText = result.totalMaintenance > 0
    ? `${formatCurrency(result.totalMaintenance)} por mês`
    : 'Não incluída';

  return {
    data: new Date().toLocaleDateString('pt-BR'),
    segmento: segment.name,
    respostas: responseText,
    pacote_sugerido: result.suggestedPackage,
    itens_adicionais: additionalItemsText,
    total: formatCurrency(result.totalProject),
    manutencao: maintenanceText,
    nome: customer.name,
    nome_negocio: customer.businessName,
    whatsapp: customer.phone,
    email: customer.email,
    cidade: customer.city
  };
}

export function getEmailJsConfig() {
  if (typeof window === 'undefined') {
    return { publicKey: '', serviceId: '', templateId: '' };
  }

  const winConfig = window.__EMAILJS_CONFIG__ || {};

  return {
    publicKey: winConfig.EMAILJS_PUBLIC_KEY || winConfig.publicKey || window.EMAILJS_PUBLIC_KEY || '',
    serviceId: winConfig.EMAILJS_SERVICE_ID || winConfig.serviceId || window.EMAILJS_SERVICE_ID || '',
    templateId: winConfig.EMAILJS_TEMPLATE_ID || winConfig.templateId || window.EMAILJS_TEMPLATE_ID || ''
  };
}
