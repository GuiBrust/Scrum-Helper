document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("myButton").addEventListener("click", function () {
    geraQuadro();
  });

  document.getElementById("clearButton").addEventListener("click", function () {
    limparCampos();
  });

  carregaValoresSalvos();

  var botoes = document.getElementsByClassName("capturarUrlButton");
  for (var i = 0; i < botoes.length; i++) {
    botoes[i].addEventListener("click", capturarUrl);
  }
});

function carregaValoresSalvos() {
  var textareaIds = [];

  var botoes = document.getElementsByClassName("capturarUrlButton");

  for (var i = 0; i < botoes.length; i++) {
    var textarea = botoes[i].previousElementSibling;

    if (textarea) {
      textareaIds.push(textarea.id);
    }
  }

  textareaIds.forEach(function (textareaId) {
    chrome.storage.local.get(textareaId, function (result) {
      if (textareaId in result) {
        var textarea = document.getElementById(textareaId);
        textarea.value = result[textareaId];
      } else {
        console.log("A chave '" + textareaId + "' não foi encontrada no armazenamento local");
      }
    });
  });
}

function capturarUrl(event) {
  var botao = event.target;
  var textarea = botao.previousElementSibling;

  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    var currentTab = tabs[0];
    var currentUrl = currentTab.url;

    var data = {};
    data[textarea.id] = currentUrl;

    textarea.value = currentUrl;

    chrome.storage.local.set(data).then(() => {
      //
    });
  });
}

function geraQuadro() {
  var textareaIds = [];

  var botoes = document.getElementsByClassName("capturarUrlButton");

  for (var i = 0; i < botoes.length; i++) {
    var textarea = botoes[i].previousElementSibling;

    if (textarea) {
      textareaIds.push(textarea.id);
    }
  }

  var modelo = `h1. Andamento da Sprint

table{width:50%; border: none;}.
|{border: none;}. "Histórias - Prioridades":%{inputHistorias}|
|{border: none;}. "Quadro de Tarefas - Desenvolvimento":%{inputQuadroTarefasDesenv}|
|{border: none;}. "Quadro de Tarefas - Teste":%{inputQuadroTarefasTest}|
|{border: none;}. "Quadro de Tarefas - Histórias":%{inputQuadroTarefasHistorias}|
|{border: none;}. "Burndown":%{inputBurndown}|
|{border: none;}. "Tempo Gasto":%{inputTempoGasto}|
|{border: none;}. "Relatório de Horas":%{inputRelatorioHoras}|`;

  var promessas = textareaIds.map(function (textareaId) {
    return new Promise(function (resolve) {
      chrome.storage.local.get(textareaId, function (result) {
        if (textareaId in result) {
          modelo = modelo.replace(`%{${textareaId}}`, result[textareaId]);
        } else {
          alert("A chave '" + textareaId + "' não foi encontrada no armazenamento local");
        }
        resolve();
      });
    });
  });

  Promise.all(promessas).then(function () {
    navigator.clipboard.writeText(modelo).then(
      function () {
        alert("Texto copiado com sucesso!");
      },
      function (err) {
        console.error("Falha ao copiar o texto: ", err);
      }
    );
  });
}

function limparCampos() {
  var textareas = document.getElementsByTagName('textarea');
  for (var i = 0; i < textareas.length; i++) {
    textareas[i].value = '';

    var data = {};
    data[textareas[i].id] = '';

    chrome.storage.local.set(data).then(() => {
      //
    });
  }
}

