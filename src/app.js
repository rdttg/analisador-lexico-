const inpAdd = document.getElementById("novaPalavra");
const btnAdd = document.getElementById("btnAdd");
const listaDiv = document.getElementById("lista");

const entrada = document.getElementById("entrada");
const tabela = document.getElementById("tabela");
const saida = document.getElementById("saida");
const btnClearAll = document.getElementById("btnClearAll");

let palavras = [];
let afd = null;
let buffer = "";

btnAdd.onclick = () => {
  const p = inpAdd.value.trim().toLowerCase();

  if (!p) return alert("Digite algo!");
  if (!/^[a-z]+$/.test(p)) return alert("Use apenas letras minúsculas.");
  if (palavras.includes(p)) return alert("Já adicionada.");

  palavras.push(p);
  inpAdd.value = "";
  atualizarLista();
  gerarAFD();
};

function atualizarLista() {
  listaDiv.innerHTML =
    palavras.length === 0
      ? "<i>nenhuma palavra adicionada</i>"
      : palavras.join(", ");
}

function gerarAFD() {
  afd = new AFD(palavras);
  entrada.disabled = false;
  entrada.value = "";
  buffer = "";
  saida.innerHTML = "";
  montarTabela();
  atualizarTabela();
}

function montarTabela() {
  if (!afd) return;

  const estados = [...Array(afd.total).keys()];
  const a = afd.alfabeto;

  let html = "<tr><th>Estado</th>";

  for (const s of a) html += `<th>${s}</th>`;
  html += "</tr>";

  for (const e of estados) {
    html += `<tr data-e="${e}"><td>q${e}${afd.finais.has(e) ? " *" : ""}</td>`;
    for (const s of a) {
      const d = afd.trans[e]?.[s];
      html += `<td>${d !== undefined ? "q" + d : "-"}</td>`;
    }
    html += "</tr>";
  }

  tabela.innerHTML = html;
}

function atualizarTabela() {
  tabela.querySelectorAll("tr").forEach(tr => tr.classList.remove("atual", "erro"));

  if (!afd) return;

  if (afd.estado === -1) {
    return;
  }

  const row = tabela.querySelector(`tr[data-e="${afd.estado}"]`);
  if (row) row.classList.add("atual");
}


entrada.addEventListener("input", () => {
  if (!afd) return;

  const valor = entrada.value;
  const ultimo = valor.slice(-1);

  if (ultimo === " ") {
    if (buffer.length > 0) {
      let msg;

      if (afd.estado === -1) {
        msg = `<span class="negado">'${buffer}' → REJEITADO</span>`;
      } else if (afd.aceito()) {
        msg = `<span class="ok">'${buffer}' → ACEITO</span>`;
      } else {
        msg = `<span class="negado">'${buffer}' → REJEITADO</span>`;
      }

      saida.innerHTML += msg + "<br>";
    }

    afd.reset();
    buffer = "";
    entrada.value = "";
    atualizarTabela();
    return;
  }

  if (valor.length < buffer.length) {
    buffer = valor;
    afd.reset();
    for (const s of buffer) afd.processar(s);
    atualizarTabela();
    return;
  }

  if (!/[a-z]/.test(ultimo)) {
    entrada.value = valor.slice(0, -1);
    return;
  }

  buffer += ultimo;
  afd.processar(ultimo);
  atualizarTabela();
});


btnClearAll.onclick = () => {
  palavras = [];

  afd = null;

  listaDiv.innerHTML = "<i>nenhuma palavra adicionada</i>";
  entrada.value = "";
  entrada.disabled = true;
  saida.innerHTML = "";
  tabela.innerHTML = "";

  buffer = "";
};
