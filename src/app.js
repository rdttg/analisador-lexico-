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
      ? "<i>nenhuma palavra adicionada</i>" // deixar escrever o que quiser, estacva limitando
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

  if (!afd) return; // vai ser chamaa no event listener depois

  if (afd.estado === -1) {
    tabela.insertRow().classList.add("erro");
    return;
  }

  const row = tabela.querySelector(`tr[data-e="${afd.estado}"]`);
  if (row) row.classList.add("atual");
}


entrada.addEventListener("input", () => {
  if (!afd) return;

  const valor = entrada.value;
  const ultimo = valor.slice(-1);

  if (valor.length < buffer.length) {
    buffer = valor;
    afd.reset();
    for (const s of buffer) afd.processar(s);
    atualizarTabela();
    atualizarSaida(); // nao precisa chamar gerar afd aqui pq puxa pelo ht
    return;
  }

  // valida
  if (!/[a-z]/.test(ultimo)) {
    entrada.value = valor.slice(0, -1);
    return;
  }

  buffer += ultimo;
  afd.processar(ultimo);
  atualizarTabela();
  atualizarSaida();
});

function atualizarSaida() {
  if (afd.estado === -1) {
    saida.innerHTML = `<span class="negado">token rejeitado</span>`;
  } else if (afd.aceito()) {
    saida.innerHTML = `<span class="ok">token aceito</span>`;
  } else {
    saida.innerHTML = `<span class="pendente">processando…</span>`;
  }
}

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

