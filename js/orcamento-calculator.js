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

// Monta um resumo do projeto sem incluir dados pessoais na mensagem.
export function buildBudgetMessage({ segment, answers, result }) {
  const selectedItems = segment.questions
    .filter((question) => answers[question.id] === true)
    .map((question) => question.text);
  const selectedItemsText = selectedItems.length
    ? selectedItems.map((item) => `- ${item}`).join('\n')
    : 'Ainda estou definindo os recursos.';
  const maintenanceText = result.totalMaintenance > 0
    ? `${formatCurrency(result.totalMaintenance)} por mês`
    : 'Não incluída';

  return [
    'Olá! Fiz a simulação de orçamento pelo site da Roldan Eng Software.',
    '',
    `Segmento: ${segment.name}`,
    `Pacote sugerido: ${result.suggestedPackage}`,
    'Itens desejados:',
    selectedItemsText,
    `Estimativa do projeto: ${formatCurrency(result.totalProject)}`,
    `Manutenção mensal: ${maintenanceText}`,
    '',
    'Gostaria de conversar sobre esse projeto.'
  ].join('\n');
}

// Gera links para os canais sem enviar a mensagem ou armazenar dados.
export function buildContactChannelLinks({ message, segmentName, whatsappNumber, emailAddress }) {
  const subject = `Pedido de orçamento - ${segmentName}`;
  const encodedSubject = encodeURIComponent(subject);
  const encodedMessage = encodeURIComponent(message);
  const encodedEmail = encodeURIComponent(emailAddress);

  return {
    whatsapp: `https://wa.me/${whatsappNumber}?text=${encodedMessage}`,
    email: `mailto:${emailAddress}?subject=${encodedSubject}&body=${encodedMessage}`,
    gmail: `https://mail.google.com/mail/?view=cm&fs=1&to=${encodedEmail}&su=${encodedSubject}&body=${encodedMessage}`,
    outlook: `https://outlook.live.com/mail/0/deeplink/compose?to=${encodedEmail}&subject=${encodedSubject}&body=${encodedMessage}`
  };
}
