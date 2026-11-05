import assert from 'node:assert/strict';
import test from 'node:test';

import { BASE_PACKAGES, ITEMS, MAINTENANCE_OPTIONS, SEGMENTS } from '../js/orcamento-config.js';
import {
  buildBudgetMessage,
  buildContactChannelLinks,
  calculateProject,
  formatCurrency,
  getSuggestedPackage,
  validateWhatsApp
} from '../js/orcamento-calculator.js';

const getAnswerMap = (segment, answers) => {
  const map = {};
  segment.questions.forEach((question) => {
    map[question.id] = answers[question.id] ?? false;
  });
  return map;
};

test('cada segmento produz Essencial, Profissional e Completo conforme respostas', () => {
  const segment = SEGMENTS.find((item) => item.id === 'cafeteria');
  const essentialAnswers = getAnswerMap(segment, {});
  const professionalAnswers = getAnswerMap(segment, { cardapio_fotos: true });
  const completeAnswers = getAnswerMap(segment, { carrinho: true, reservas: true, fidelidade: true });

  assert.equal(getSuggestedPackage(essentialAnswers, segment), 'Essencial');
  assert.equal(getSuggestedPackage(professionalAnswers, segment), 'Profissional');
  assert.equal(getSuggestedPackage(completeAnswers, segment), 'Completo');
});

test('itens já incluídos no pacote não entram no total', () => {
  const segment = SEGMENTS.find((item) => item.id === 'cafeteria');
  const answers = getAnswerMap(segment, { cardapio_fotos: true, galeria: true, seo_local: true, analytics: true });
  const result = calculateProject({ segment, answers, maintenanceSelected: false });

  assert.equal(result.suggestedPackage, 'Profissional');
  assert.equal(result.totalProject, BASE_PACKAGES.Profissional.price);
  assert.equal(result.additionalItems.some((item) => item.id === 'cardapio_fotos'), false);
});

test('cardápio com fotos sozinho eleva o pacote para Profissional', () => {
  const segment = SEGMENTS.find((item) => item.id === 'restaurante');
  const answers = getAnswerMap(segment, { cardapio_fotos: true });
  const result = calculateProject({ segment, answers, maintenanceSelected: false });

  assert.equal(result.suggestedPackage, 'Profissional');
  assert.equal(result.totalProject, BASE_PACKAGES.Profissional.price);
});

test('itens com preço null não entram no total e aparecem como a confirmar', () => {
  const segment = SEGMENTS.find((item) => item.id === 'barbearia');
  const answers = getAnswerMap(segment, { agendamento_horarios: true, fidelidade: true });
  const result = calculateProject({ segment, answers, maintenanceSelected: false });

  assert.equal(ITEMS.agendamento_horarios.price, null);
  assert.equal(result.suggestedPackage, 'Completo');
  assert.ok(result.includedButNotAdded.some((item) => item.id === 'agendamento_horarios'));
});

test('manutenção entra apenas quando marcada e nunca no total do projeto', () => {
  const segment = SEGMENTS.find((item) => item.id === 'cafeteria');
  const answers = getAnswerMap(segment, { seo_local: true });

  const resultWithoutMaintenance = calculateProject({ segment, answers, maintenanceSelected: false });
  const resultWithMaintenance = calculateProject({ segment, answers, maintenanceSelected: true });

  assert.equal(resultWithoutMaintenance.totalMaintenance, 0);
  assert.equal(resultWithMaintenance.totalMaintenance, MAINTENANCE_OPTIONS.reduce((sum, option) => sum + option.price, 0));
  assert.equal(resultWithMaintenance.totalProject, resultWithoutMaintenance.totalProject);
});

test('todas as respostas em Não sei ainda resultam em Essencial sem adicionais', () => {
  const segment = SEGMENTS.find((item) => item.id === 'cafeteria');
  const answers = Object.fromEntries(segment.questions.map((question) => [question.id, 'skip']));
  const result = calculateProject({ segment, answers, maintenanceSelected: false });

  assert.equal(result.suggestedPackage, 'Essencial');
  assert.equal(result.additionalItems.length, 0);
  assert.equal(result.totalProject, BASE_PACKAGES.Essencial.price);
});

test('arredondamento e formatação em pt-BR', () => {
  assert.equal(formatCurrency(1200), 'R$ 1.200');
  assert.equal(formatCurrency(2300), 'R$ 2.300');
});

test('validação do WhatsApp aceita válidos e recusa inválidos', () => {
  assert.equal(validateWhatsApp('(16) 99876-5432'), true);
  assert.equal(validateWhatsApp('16998765432'), true);
  assert.equal(validateWhatsApp('998765432'), false);
  assert.equal(validateWhatsApp('abc'), false);
});

test('mensagem de orçamento resume a simulação sem dados pessoais', () => {
  const segment = SEGMENTS.find((item) => item.id === 'restaurante');
  const answers = getAnswerMap(segment, { cardapio_fotos: true, carrinho: true, pagamento_online: true });
  const result = calculateProject({ segment, answers, maintenanceSelected: true });
  const message = buildBudgetMessage({
    segment,
    answers,
    result
  });

  assert.match(message, /Segmento: Restaurante/);
  assert.match(message, /Pacote sugerido: Completo/);
  assert.match(message, /Quer pedidos e delivery com carrinho\?/);
  assert.match(message, /Estimativa do projeto: R\$\s*\d/);
  assert.match(message, /Manutenção mensal: R\$\s*\d+ por mês/);
  assert.doesNotMatch(message, /Ana|Pizzaria Verde|99876-5432|ana@email\.com/);
  assert.ok(message.length <= 1500);
});

test('mensagem de orçamento explica quando nenhum item foi selecionado', () => {
  const segment = SEGMENTS.find((item) => item.id === 'cafeteria');
  const answers = getAnswerMap(segment, {});
  const result = calculateProject({ segment, answers, maintenanceSelected: false });
  const message = buildBudgetMessage({ segment, answers, result });

  assert.match(message, /Ainda estou definindo os recursos/);
  assert.match(message, /Manutenção mensal: Não incluída/);
});

test('links dos canais codificam a mesma mensagem e o assunto do orçamento', () => {
  const message = 'Pedido de orçamento\nSegmento: Clínica\nEstimativa: R$ 2.300';
  const links = buildContactChannelLinks({
    message,
    segmentName: 'Clínica',
    whatsappNumber: '5516981442301',
    emailAddress: 'contato@example.com'
  });
  const subject = 'Pedido de orçamento - Clínica';

  assert.equal(new URL(links.whatsapp).searchParams.get('text'), message);

  const emailUrl = new URL(links.email);
  assert.equal(emailUrl.pathname, 'contato@example.com');
  assert.equal(emailUrl.searchParams.get('subject'), subject);
  assert.equal(emailUrl.searchParams.get('body'), message);

  const gmailUrl = new URL(links.gmail);
  assert.equal(gmailUrl.searchParams.get('to'), 'contato@example.com');
  assert.equal(gmailUrl.searchParams.get('su'), subject);
  assert.equal(gmailUrl.searchParams.get('body'), message);

  const outlookUrl = new URL(links.outlook);
  assert.equal(outlookUrl.searchParams.get('to'), 'contato@example.com');
  assert.equal(outlookUrl.searchParams.get('subject'), subject);
  assert.equal(outlookUrl.searchParams.get('body'), message);
});

test('os valores da configuração conferem com as médias informadas', () => {
  assert.equal(BASE_PACKAGES.Essencial.price, 1200);
  assert.equal(BASE_PACKAGES.Profissional.price, 2300);
  assert.equal(BASE_PACKAGES.Completo.price, 3750);
  assert.equal(ITEMS.cardapio_fotos.price, 450);
  assert.equal(ITEMS.carrinho.price, 1150);
  assert.equal(ITEMS.pagamento_online.price, 700);
  assert.equal(ITEMS.ifood.price, 600);
  assert.equal(ITEMS.reservas.price, 550);
  assert.equal(ITEMS.fidelidade.price, 900);
  assert.equal(ITEMS.seo_local.price, 400);
  assert.equal(ITEMS.copywriting.price, 400);
  assert.equal(ITEMS.galeria.price, 300);
  assert.equal(ITEMS.analytics.price, 275);
  assert.equal(MAINTENANCE_OPTIONS[0].price + MAINTENANCE_OPTIONS[1].price, 265);
});
