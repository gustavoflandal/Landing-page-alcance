// Visor das telas: abre a captura em tamanho real num <dialog>, com navegação
// pelo teclado. O catálogo é lido do próprio HTML — cada botão .tela traz o
// slug em data-tela e já carrega o título e a descrição —, então não há lista
// duplicada entre marcação e script.
(function () {
  'use strict';

  var dialogo = document.getElementById('visor');
  if (!dialogo || typeof dialogo.showModal !== 'function') return;

  var imagem = document.getElementById('visor-imagem');
  var titulo = document.getElementById('visor-titulo');
  var descricao = document.getElementById('visor-descricao');
  var contagem = document.getElementById('visor-contagem');
  var palco = dialogo.querySelector('.visor__palco');

  var telas = Array.prototype.map.call(document.querySelectorAll('.tela'), function (botao) {
    var texto = botao.querySelector('.tela__texto');
    return {
      slug: botao.getAttribute('data-tela'),
      titulo: texto.querySelector('strong').textContent.trim(),
      descricao: texto.querySelector('span').textContent.replace(/\s+/g, ' ').trim(),
      botao: botao,
    };
  });

  if (!telas.length) return;

  var atual = 0;
  var origem = null;

  function mostrar(indice) {
    atual = (indice + telas.length) % telas.length;
    var tela = telas[atual];
    imagem.src = 'img/telas/' + tela.slug + '.webp';
    imagem.alt = tela.titulo + '. ' + tela.descricao;
    titulo.textContent = tela.titulo;
    descricao.textContent = tela.descricao;
    contagem.textContent = atual + 1 + ' / ' + telas.length;
    palco.scrollTop = 0;
    precarregar();
  }

  // Deixa a vizinha pronta: a navegação por seta fica instantânea sem custar
  // nada na primeira visita à página.
  function precarregar() {
    var proxima = new Image();
    proxima.src = 'img/telas/' + telas[(atual + 1) % telas.length].slug + '.webp';
  }

  function abrir(indice) {
    origem = document.activeElement;
    mostrar(indice);
    dialogo.showModal();
  }

  telas.forEach(function (tela, indice) {
    tela.botao.addEventListener('click', function () {
      abrir(indice);
    });
  });

  document.getElementById('visor-anterior').addEventListener('click', function () {
    mostrar(atual - 1);
  });
  document.getElementById('visor-proxima').addEventListener('click', function () {
    mostrar(atual + 1);
  });
  document.getElementById('visor-fechar').addEventListener('click', function () {
    dialogo.close();
  });

  dialogo.addEventListener('keydown', function (evento) {
    if (evento.key === 'ArrowLeft') {
      evento.preventDefault();
      mostrar(atual - 1);
    } else if (evento.key === 'ArrowRight') {
      evento.preventDefault();
      mostrar(atual + 1);
    }
  });

  // Clique no véu fecha; clique na imagem, não.
  dialogo.addEventListener('click', function (evento) {
    if (evento.target === dialogo) dialogo.close();
  });

  // Devolve o foco ao cartão de onde a tela foi aberta (WCAG 2.4.3).
  dialogo.addEventListener('close', function () {
    if (origem && typeof origem.focus === 'function') origem.focus();
    origem = null;
  });
})();
