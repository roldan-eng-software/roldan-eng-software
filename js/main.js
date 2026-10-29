/* =========================================================
   Roldan Eng Software — main.js
   Interações do site: menu mobile, animações de entrada,
   acordeão de FAQ, navegação ativa e validação do formulário.
   Vanilla JavaScript, sem dependências externas.
   ========================================================= */

(function () {
  "use strict";

  /* ----------------------- Menu hambúrguer ----------------------- */

  // Alterna a visibilidade do menu de navegação no mobile.
  function iniciarMenu() {
    const botao = document.getElementById("nav-toggle");
    const menu = document.getElementById("menu-principal");

    if (!botao || !menu) return;

    const fecharMenu = function () {
      menu.classList.remove("is-aberto");
      botao.setAttribute("aria-expanded", "false");
      botao.setAttribute("aria-label", "Abrir menu de navegação");
    };

    const abrirMenu = function () {
      menu.classList.add("is-aberto");
      botao.setAttribute("aria-expanded", "true");
      botao.setAttribute("aria-label", "Fechar menu de navegação");
    };

    botao.addEventListener("click", function () {
      const estaAberto = botao.getAttribute("aria-expanded") === "true";
      if (estaAberto) {
        fecharMenu();
      } else {
        abrirMenu();
      }
    });

    // Fecha o menu ao escolher um item (navegação por âncora).
    menu.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", fecharMenu);
    });

    // Fecha o menu ao pressionar Esc e ao voltar para o desktop.
    document.addEventListener("keydown", function (evento) {
      if (evento.key === "Escape") fecharMenu();
    });

    window.addEventListener("resize", function () {
      if (window.innerWidth >= 1024) fecharMenu();
    });
  }

  /* ----------------------- Animações de entrada ----------------------- */

  // Revela os elementos ".reveal" quando eles entram na área visível da tela.
  function iniciarReveal() {
    const elementos = document.querySelectorAll(".reveal");

    if (!elementos.length) return;

    const suportaObserver = "IntersectionObserver" in window;
    const preferePoucoMovimento = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    // Sem suporte a IntersectionObserver ou com movimento reduzido,
    // tudo é exibido imediatamente para não esconder conteúdo.
    if (!suportaObserver || preferePoucoMovimento) {
      elementos.forEach(function (elemento) {
        elemento.classList.add("is-visivel");
      });
      return;
    }

    const observer = new IntersectionObserver(
      function (entradas, obs) {
        entradas.forEach(function (entrada) {
          if (entrada.isIntersecting) {
            entrada.target.classList.add("is-visivel");
            obs.unobserve(entrada.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    );

    elementos.forEach(function (elemento) {
      observer.observe(elemento);
    });
  }

  /* ----------------------- Acordeão do FAQ ----------------------- */

  // Abre e fecha cada item do FAQ, mantendo aria-expanded correto.
  function iniciarAcordeao() {
    const gatilhos = document.querySelectorAll(".acordeao__gatilho");

    gatilhos.forEach(function (gatilho) {
      gatilho.addEventListener("click", function () {
        const estaAberto = gatilho.getAttribute("aria-expanded") === "true";
        const painelId = gatilho.getAttribute("aria-controls");
        const painel = document.getElementById(painelId);

        // Fecha os demais itens para manter apenas um aberto por vez.
        gatilhos.forEach(function (outro) {
          if (outro === gatilho) return;
          outro.setAttribute("aria-expanded", "false");
          const outroPainel = document.getElementById(
            outro.getAttribute("aria-controls")
          );
          if (outroPainel) outroPainel.hidden = true;
        });

        gatilho.setAttribute("aria-expanded", String(!estaAberto));
        if (painel) painel.hidden = estaAberto;
      });
    });
  }

  /* ----------------------- Navegação ativa ----------------------- */

  // Destaca no menu o link da seção que está sendo exibida.
  function iniciarNavegacaoAtiva() {
    const secoes = document.querySelectorAll("main section[id]");
    const links = document.querySelectorAll(".nav__link");

    if (!secoes.length || !links.length || !("IntersectionObserver" in window)) {
      return;
    }

    const mapaDeLinks = {};
    links.forEach(function (link) {
      const alvo = link.getAttribute("href");
      if (alvo && alvo.startsWith("#")) mapaDeLinks[alvo.slice(1)] = link;
    });

    // Guarda as seções visíveis na faixa de leitura para recalcular
    // o destaque a cada mudança (evita destacar item ao voltar ao topo).
    const secoesVisiveis = new Set();

    const atualizarDestaque = function () {
      let secaoAtiva = null;
      secoes.forEach(function (secao) {
        if (secoesVisiveis.has(secao.id)) secaoAtiva = secao;
      });

      links.forEach(function (item) {
        item.classList.remove("is-ativo");
      });

      if (secaoAtiva && mapaDeLinks[secaoAtiva.id]) {
        mapaDeLinks[secaoAtiva.id].classList.add("is-ativo");
      }
    };

    const observer = new IntersectionObserver(
      function (entradas) {
        entradas.forEach(function (entrada) {
          if (entrada.isIntersecting) {
            secoesVisiveis.add(entrada.target.id);
          } else {
            secoesVisiveis.delete(entrada.target.id);
          }
        });
        atualizarDestaque();
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );

    secoes.forEach(function (secao) {
      observer.observe(secao);
    });
  }

  /* ----------------------- Formulário de contato ----------------------- */

  // Aplica máscara de telefone no formato (00) 00000-0000 enquanto digita.
  function aplicarMascaraDeTelefone(campo) {
    campo.addEventListener("input", function () {
      const digitos = campo.value.replace(/\D/g, "").slice(0, 11);
      let formatado = digitos;

      if (digitos.length > 2) {
        formatado = "(" + digitos.slice(0, 2) + ") " + digitos.slice(2);
      }
      if (digitos.length > 7) {
        const corte = digitos.length > 10 ? 7 : 6;
        formatado =
          "(" +
          digitos.slice(0, 2) +
          ") " +
          digitos.slice(2, corte) +
          "-" +
          digitos.slice(corte);
      }

      campo.value = formatado;
    });
  }

  // Valida um campo individual e exibe a mensagem de erro correspondente.
  function validarCampo(campo, mensagemDeErro, regraDeValidacao) {
    const valor = campo.value.trim();
    const campoWrapper = campo.closest(".campo");
    const erro = document.getElementById(mensagemDeErro);

    const resultado = regraDeValidacao(valor);

    if (resultado.valido) {
      campoWrapper.classList.remove("is-invalido");
      campo.removeAttribute("aria-invalid");
      if (erro) erro.textContent = "";
      return true;
    }

    campoWrapper.classList.add("is-invalido");
    campo.setAttribute("aria-invalid", "true");
    if (erro) erro.textContent = resultado.mensagem;
    return false;
  }

  // Valida todo o formulário e, se estiver correto, exibe a confirmação
  // (demonstração: nenhum dado real é enviado).
  function iniciarFormulario() {
    const formulario = document.getElementById("formulario-contato");
    if (!formulario) return;

    const nome = formulario.querySelector("#nome");
    const email = formulario.querySelector("#email");
    const telefone = formulario.querySelector("#telefone");
    const mensagem = formulario.querySelector("#mensagem");
    const avisoDeSucesso = document.getElementById("formulario-sucesso");

    const regras = {
      nome: {
        erro: "erro-nome",
        validar: function (valor) {
          if (!valor) {
            return { valido: false, mensagem: "Informe o seu nome." };
          }
          if (valor.length < 3) {
            return {
              valido: false,
              mensagem: "O nome precisa ter ao menos 3 caracteres.",
            };
          }
          return { valido: true, mensagem: "" };
        },
      },
      email: {
        erro: "erro-email",
        validar: function (valor) {
          if (!valor) {
            return { valido: false, mensagem: "Informe o seu e-mail." };
          }
          const formato = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
          if (!formato.test(valor)) {
            return {
              valido: false,
              mensagem: "Informe um e-mail válido, como voce@empresa.com.br.",
            };
          }
          return { valido: true, mensagem: "" };
        },
      },
      telefone: {
        erro: "erro-telefone",
        validar: function (valor) {
          if (!valor) {
            return { valido: false, mensagem: "Informe o seu telefone." };
          }
          const digitos = valor.replace(/\D/g, "");
          if (digitos.length < 10) {
            return {
              valido: false,
              mensagem: "Informe um telefone com DDD (mínimo 10 dígitos).",
            };
          }
          return { valido: true, mensagem: "" };
        },
      },
      mensagem: {
        erro: "erro-mensagem",
        validar: function (valor) {
          if (!valor) {
            return { valido: false, mensagem: "Escreva uma mensagem." };
          }
          if (valor.length < 10) {
            return {
              valido: false,
              mensagem: "Descreva o projeto em ao menos 10 caracteres.",
            };
          }
          return { valido: true, mensagem: "" };
        },
      },
    };

    if (telefone) aplicarMascaraDeTelefone(telefone);

    // Valida o campo assim que o visitante sai dele (após a primeira tentativa).
    let tentouEnviar = false;
    const campos = [
      { campo: nome, chave: "nome" },
      { campo: email, chave: "email" },
      { campo: telefone, chave: "telefone" },
      { campo: mensagem, chave: "mensagem" },
    ];

    campos.forEach(function (item) {
      if (!item.campo) return;
      item.campo.addEventListener("blur", function () {
        if (!tentouEnviar) return;
        validarCampo(
          item.campo,
          regras[item.chave].erro,
          regras[item.chave].validar
        );
      });

      // Após a primeira tentativa, limpa o erro assim que o campo fica válido
      // (não cria erros novos enquanto digita — esses aparecem no blur/envio).
      item.campo.addEventListener("input", function () {
        if (!tentouEnviar) return;
        const campoWrapper = item.campo.closest(".campo");
        if (!campoWrapper.classList.contains("is-invalido")) return;
        const resultado = regras[item.chave].validar(item.campo.value.trim());
        if (resultado.valido) {
          validarCampo(
            item.campo,
            regras[item.chave].erro,
            regras[item.chave].validar
          );
        }
      });
    });

    formulario.addEventListener("submit", function (evento) {
      evento.preventDefault();
      tentouEnviar = true;

      let formularioValido = true;
      let primeiroCampoInvalido = null;

      campos.forEach(function (item) {
        if (!item.campo) return;
        const campoValido = validarCampo(
          item.campo,
          regras[item.chave].erro,
          regras[item.chave].validar
        );
        if (!campoValido) {
          formularioValido = false;
          if (!primeiroCampoInvalido) primeiroCampoInvalido = item.campo;
        }
      });

      if (!formularioValido) {
        if (avisoDeSucesso) avisoDeSucesso.hidden = true;
        if (primeiroCampoInvalido) primeiroCampoInvalido.focus();
        return;
      }

      // Demonstração: sem envio real de dados.
      if (avisoDeSucesso) avisoDeSucesso.hidden = false;
      formulario.reset();

      campos.forEach(function (item) {
        if (!item.campo) return;
        item.campo.closest(".campo").classList.remove("is-invalido");
        item.campo.removeAttribute("aria-invalid");
      });
    });
  }

  /* ----------------------- Dropdown desktop/mobile ----------------------- */

  function iniciarDropdown() {
    const itensDropdown = document.querySelectorAll(".nav__item--dropdown");
    if (!itensDropdown.length) return;

    itensDropdown.forEach(function (item) {
      const gatilho = item.querySelector(".nav__link--dropdown");
      if (!gatilho) return;

      gatilho.addEventListener("click", function (evento) {
        if (window.innerWidth >= 1024) {
          return;
        }
        evento.preventDefault();
        const estaAberto = item.classList.contains("is-aberto");
        itensDropdown.forEach(function (outro) {
          outro.classList.remove("is-aberto");
        });
        if (!estaAberto) {
          item.classList.add("is-aberto");
        }
        gatilho.setAttribute("aria-expanded", String(!estaAberto));
      });

      gatilho.addEventListener("keydown", function (evento) {
        if (evento.key === "Enter" || evento.key === " ") {
          if (window.innerWidth >= 1024) return;
          evento.preventDefault();
          const estaAberto = item.classList.contains("is-aberto");
          itensDropdown.forEach(function (outro) {
            outro.classList.remove("is-aberto");
          });
          if (!estaAberto) {
            item.classList.add("is-aberto");
          }
          gatilho.setAttribute("aria-expanded", String(!estaAberto));
        }
        if (evento.key === "Escape") {
          item.classList.remove("is-aberto");
          gatilho.setAttribute("aria-expanded", "false");
          gatilho.focus();
        }
      });
    });

    window.addEventListener("resize", function () {
      if (window.innerWidth >= 1024) {
        itensDropdown.forEach(function (item) {
          item.classList.remove("is-aberto");
          const gatilho = item.querySelector(".nav__link--dropdown");
          if (gatilho) gatilho.setAttribute("aria-expanded", "false");
        });
      }
    });
  }

  /* ----------------------- Header sombra ao rolar ----------------------- */

  function iniciarHeaderRolado() {
    const header = document.querySelector(".header");
    if (!header) return;

    const atualizar = function () {
      if (window.scrollY > 10) {
        header.classList.add("is-rolado");
      } else {
        header.classList.remove("is-rolado");
      }
    };

    atualizar();
    window.addEventListener("scroll", atualizar, { passive: true });
  }

  /* ----------------------- Filtros de categoria e busca ----------------------- */

  // Liga os botões de categoria à lista de itens da página (.card-projeto no
  // portfólio ou .card-artigo no blog), combinando o filtro ativo com o termo
  // de busca quando o campo de busca existe.
  function iniciarFiltrosCategoria() {
    const botoes = document.querySelectorAll(".filtro-btn[data-filtro]");
    const itens = document.querySelectorAll(
      ".card-projeto[data-categoria], .card-artigo[data-categoria]"
    );
    if (!botoes.length || !itens.length) return;

    const campoBusca = document.getElementById("busca-blog");

    // Mostra ou esconde cada item conforme a categoria ativa e o termo de busca.
    const atualizar = function () {
      const botaoAtivo = document.querySelector(".filtro-btn.is-ativo");
      const filtro = botaoAtivo
        ? botaoAtivo.getAttribute("data-filtro")
        : "todos";
      const termo = campoBusca ? campoBusca.value.toLowerCase().trim() : "";

      itens.forEach(function (item) {
        const categoria = item.getAttribute("data-categoria");
        const texto = (
          item.getAttribute("data-busca") || item.textContent
        ).toLowerCase();
        const combinaCategoria = filtro === "todos" || categoria === filtro;
        const combinaBusca = termo === "" || texto.includes(termo);
        item.classList.toggle(
          "is-oculto",
          !(combinaCategoria && combinaBusca)
        );
      });
    };

    botoes.forEach(function (botao) {
      botao.addEventListener("click", function () {
        botoes.forEach(function (outro) {
          outro.classList.remove("is-ativo");
        });
        botao.classList.add("is-ativo");
        atualizar();
      });
    });

    if (campoBusca) {
      campoBusca.addEventListener("input", atualizar);
    }
  }

  /* ----------------------- Índice automático do artigo ----------------------- */

  function iniciarIndiceArtigo() {
    const indiceLista = document.querySelector(".indice-artigo__lista");
    const conteudo = document.querySelector(".artigo__conteudo");
    if (!indiceLista || !conteudo) return;

    const titulos = conteudo.querySelectorAll("h2");
    if (!titulos.length) {
      const indice = document.querySelector(".indice-artigo");
      if (indice) indice.style.display = "none";
      return;
    }

    titulos.forEach(function (titulo, index) {
      if (!titulo.id) {
        titulo.id = "secao-" + (index + 1);
      }
      const item = document.createElement("li");
      const link = document.createElement("a");
      link.href = "#" + titulo.id;
      link.textContent = titulo.textContent;
      item.appendChild(link);
      indiceLista.appendChild(item);
    });
  }

  /* ----------------------- Inicialização ----------------------- */

  // Ponto de entrada: inicializa todas as interações quando o DOM está pronto.
  function iniciar() {
    iniciarMenu();
    iniciarDropdown();
    iniciarHeaderRolado();
    iniciarReveal();
    iniciarAcordeao();
    iniciarNavegacaoAtiva();
    iniciarFormulario();
    iniciarFiltrosCategoria();
    iniciarIndiceArtigo();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", iniciar);
  } else {
    iniciar();
  }
})();
