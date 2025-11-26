class AFD {
  constructor(lista) {
    this.palavras = lista;
    this.trans = [];
    this.finais = new Set();
    this.estado = 0;
    this._montar();
  }

  _montar() {
    this.trans[0] = {};
    let id = 1;

    for (const palavra of this.palavras) {
      let q = 0;

      for (const s of palavra) {
        if (!this.trans[q]) this.trans[q] = {};
        if (!this.trans[q][s]) {
          this.trans[q][s] = id;
          this.trans[id] = {};
          q = id;
          id++;
        } else {
          q = this.trans[q][s];
        }
      }
// lembrar de arrumar a posicao
      this.finais.add(q);
    }

    this.total = id;
    this.alfabeto = [...new Set(this.palavras.join("").split(""))].sort();
  }

  reset() {
    this.estado = 0;
  }

  processar(simbolo) {
    const prox = this.trans[this.estado]?.[simbolo];
    this.estado = prox ?? -1;
    return this.estado;
  }

  aceito() {
    return this.finais.has(this.estado);
  }
}
