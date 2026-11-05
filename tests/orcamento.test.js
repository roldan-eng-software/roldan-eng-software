import assert from 'node:assert/strict';
import test from 'node:test';

import { BASE_PACKAGES, ITEMS, MAINTENANCE_OPTIONS, SEGMENTS } from '../js/orcamento-config.js';
import {
  buildEmailPayload,
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

test('montagem do payload do EmailJS traz total e adicionais corretamente', () => {
  const segment = SEGMENTS.find((item) => item.id === 'restaurante');
  const answers = getAnswerMap(segment, { cardapio_fotos: true, carrinho: true, pagamento_online: true });
  const result = calculateProject({ segment, answers, maintenanceSelected: true });
  const payload = buildEmailPayload({
    segment,
    answers,
    result,
    customer: {
      name: 'Ana',
      businessName: 'Pizzaria Verde',
      phone: '(16) 99876-5432',
      email: 'ana@email.com',
      city: 'São Carlos'
    }
  });

  assert.match(payload.total, /R\$\s*\d/);
  assert.match(payload.itens_adicionais, /Cardápio digital com atualização inicial|Carrinho de pedidos via WhatsApp|Pagamento online/);
  assert.match(payload.respostas, /Sim/);
  assert.equal(payload.pacote_sugerido, 'Completo');
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
