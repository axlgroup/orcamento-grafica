import React, { useState } from 'react';

// ==========================================
// 1. MATRIZ DE PREÇOS DA GRÁFICA
// ==========================================
const tabelaPrecos = {
  papeis: {
    couche_150g: {
      nome: "Couché Brilho 150g",
      formato_folha_mm: { largura: 660, altura: 960 },
      custo_por_folha: 1.25
    },
    lona_front_440g: {
      nome: "Lona Frontlight 440g",
      formato_folha_mm: { largura: 1000, altura: 1000 },
      custo_por_folha: 15.00
    }
  },
  impressao_cliques: {
    "4x0": { nome: "Colorido Frente", custo_por_folha: 0.35 },
    "4x4": { nome: "Colorido Frente e Verso", custo_por_folha: 0.65 }
  },
  acabamentos: {
    refile_simples: { nome: "Refile", custo_fixo_setup: 15.00, custo_por_unidade: 0.01 },
    dobra_simples: { nome: "Dobra", custo_fixo_setup: 25.00, custo_por_unidade: 0.05 },
    verniz_total: { nome: "Verniz UV", custo_fixo_setup: 40.00, custo_por_folha_inteira: 0.20 }
  },
  maquinas: {
    offset_ryobi: { nome: "Offset Ryobi", custo_hora: 150.00 }
  }
};

// ==========================================
// 2. ENGENHARIA DE APROVEITAMENTO DE FOLHA
// ==========================================
function calcularAproveitamento(larguraFolha, alturaFolha, larguraPeca, alturaPeca) {
  if (!larguraPeca || !alturaPeca) return 0;
  const total1 = Math.floor(larguraFolha / larguraPeca) * Math.floor(alturaFolha / alturaPeca);
  const total2 = Math.floor(larguraFolha / alturaPeca) * Math.floor(alturaFolha / larguraPeca);
  return Math.max(total1, total2);
}

export default function App() {
  // ==========================================
  // 3. ESTADOS REATIVOS (O NOVO CÉREBRO)
  // ==========================================
  const [quantidade, setQuantidade] = useState(1000);
  const [larguraProduto, setLarguraProduto] = useState(90);
  const [alturaProduto, setAlturaProduto] = useState(50);
  const [papelSelecionado, setPapelSelecionado] = useState("couche_150g");
  const [corSelecionada, setCorSelecionada] = useState("4x4");
  const [acabamentosSelecionados, setAcabamentosSelecionados] = useState(["verniz_total"]);
  
  const maquinaSelecionada = "offset_ryobi";
  const horasMaquina = 1;
  const markup = 2.0;

  // ==========================================
  // 4. MOTOR DE CÁLCULO AUTOMÁTICO
  // ==========================================
  const papel = tabelaPrecos.papeis[papelSelecionado];
  const cor = tabelaPrecos.impressao_cliques[corSelecionada];
  const maquina = tabelaPrecos.maquinas[maquinaSelecionada];

  const pecasPorFolha = calcularAproveitamento(
    papel.formato_folha_mm.largura,
    papel.formato_folha_mm.altura,
    larguraProduto,
    alturaProduto
  );

  const folhasNecessarias = pecasPorFolha > 0 ? Math.ceil(quantidade / pecasPorFolha) : 0;
  const custoMaterial = folhasNecessarias * papel.custo_por_folha;
  const custoTinta = folhasNecessarias * cor.custo_por_folha;
  const custoMaquina = horasMaquina * maquina.custo_hora;

  let custoAcabamento = 0;
  acabamentosSelecionados.forEach(id => {
    const acab = tabelaPrecos.acabamentos[id];
    if (acab) {
      custoAcabamento += acab.custo_fixo_setup;
      if (acab.custo_por_unidade) custoAcabamento += (quantidade * acab.custo_por_unidade);
      if (acab.custo_por_folha_inteira) custoAcabamento += (folhasNecessarias * acab.custo_por_folha_inteira);
    }
  });

  const custoTotal = custoMaterial + custoTinta + custoMaquina + custoAcabamento;
  const precoDeVenda = pecasPorFolha > 0 ? custoTotal * markup : 0;
  const precoUnitario = quantidade > 0 ? precoDeVenda / quantidade : 0;

  const formatarMoeda = (valor) => valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  const alternarAcabamento = (id) => {
    if (acabamentosSelecionados.includes(id)) {
      setAcabamentosSelecionados(acabamentosSelecionados.filter(item => item !== id));
    } else {
      setAcabamentosSelecionados([...acabamentosSelecionados, id]);
    }
  };

  // ==========================================
  // 5. INTERFACE DO ERP GRÁFICO
  // ==========================================
  return (
    <div className="bg-zinc-950 text-zinc-100 min-h-screen antialiased font-sans">
      
      <header className="sticky top-0 z-50 bg-zinc-950/90 backdrop-blur-md p-4 border-b border-zinc-800">
        <div className="max-w-5xl mx-auto">
          <div className="flex gap-2">
            <div className="flex-1 h-1.5 rounded-full bg-emerald-500"></div>
            <div className="flex-1 h-1.5 rounded-full bg-zinc-800"></div>
            <div className="flex-1 h-1.5 rounded-full bg-zinc-800"></div>
          </div>
          <div className="flex justify-between mt-2.5 text-[11px] uppercase tracking-wider font-medium text-zinc-400">
            <span className="text-emerald-400 font-bold">1. Especificações</span>
            <span>2. Engenharia de Papel</span>
            <span>3. Acabamentos & Custo</span>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8 pb-40 grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        <div className="lg:col-span-2 space-y-8">
          
          <section className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl">
            <h1 className="text-2xl font-bold tracking-tight text-white mb-2">Orçamento de Produção</h1>
            <p className="text-sm text-zinc-400 mb-6">Insira as dimensões finais do produto e tiragem desejada.</p>

            <div className="mb-6">
              <label className="block text-xs uppercase tracking-wider text-zinc-400 font-bold mb-2">Quantidade (Tiragem)</label>
              <input 
                type="number" 
                value={quantidade} 
                onChange={(e) => setQuantidade(Math.max(1, Number(e.target.value)))}
                className="w-full h-14 rounded-xl border border-zinc-700 bg-zinc-950 text-white px-4 text-xl font-mono focus:border-emerald-500 focus:outline-none" 
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs uppercase tracking-wider text-zinc-400 font-bold mb-2">Largura Aberta (mm)</label>
                <input 
                  type="number" 
                  value={larguraProduto} 
                  onChange={(e) => setLarguraProduto(Number(e.target.value))}
                  className="w-full h-14 rounded-xl border border-zinc-700 bg-zinc-950 text-white px-4 text-xl font-mono focus:border-emerald-500 focus:outline-none" 
                />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wider text-zinc-400 font-bold mb-2">Altura Aberta (mm)</label>
                <input 
                  type="number" 
                  value={alturaProduto} 
                  onChange={(e) => setAlturaProduto(Number(e.target.value))}
                  className="w-full h-14 rounded-xl border border-zinc-700 bg-zinc-950 text-white px-4 text-xl font-mono focus:border-emerald-500 focus:outline-none" 
                />
              </div>
            </div>
          </section>

          <section className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl">
            <h2 className="text-xs uppercase tracking-wider text-zinc-400 font-bold mb-4">Substrato / Papel de Linha</h2>
            <div className="space-y-3">
              <button 
                onClick={() => setPapelSelecionado("couche_150g")}
                className={`w-full text-left p-4 rounded-xl border transition ${papelSelecionado === 'couche_150g' ? 'border-emerald-500 bg-emerald-500/5' : 'border-zinc-800 bg-zinc-950 hover:border-zinc-700'}`}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-bold text-white">Couché Brilho 150g</p>
                    <span className="text-xs text-zinc-500">Formato Padrão: 660x960 mm</span>
                  </div>
                  <span className="text-sm font-mono text-emerald-400">R$ 1,25 / fl</span>
                </div>
              </button>

              <button 
                onClick={() => setPapelSelecionado("lona_front_440g")}
                className={`w-full text-left p-4 rounded-xl border transition ${papelSelecionado === 'lona_front_440g' ? 'border-emerald-500 bg-emerald-500/5' : 'border-zinc-800 bg-zinc-950 hover:border-zinc-700'}`}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-bold text-white">Lona Frontlight 440g</p>
                    <span className="text-xs text-zinc-500">Formato Expandido: 1000x1000 mm</span>
                  </div>
                  <span className="text-sm font-mono text-emerald-400">R$ 15,00 / m²</span>
                </div>
              </button>
            </div>
          </section>

          <section className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl">
            <h2 className="text-xs uppercase tracking-wider text-zinc-400 font-bold mb-4">Entrada de Carga (Cores)</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button 
                onClick={() => setCorSelecionada("4x4")}
                className={`p-4 rounded-xl border text-left transition ${corSelecionada === '4x4' ? 'border-emerald-500 bg-emerald-500/5' : 'border-zinc-800 bg-zinc-950 hover:border-zinc-700'}`}
              >
                <p className="font-bold text-white">4x4 Cores</p>
                <span className="text-xs text-zinc-500">Cromia Frente e Verso</span>
              </button>
              <button 
                onClick={() => setCorSelecionada("4x0")}
                className={`p-4 rounded-xl border text-left transition ${corSelecionada === '4x0' ? 'border-emerald-500 bg-emerald-500/5' : 'border-zinc-800 bg-zinc-950 hover:border-zinc-700'}`}
              >
                <p className="font-bold text-white">4x0 Cores</p>
                <span className="text-xs text-zinc-500">Cromia Apenas Frente</span>
              </button>
            </div>
          </section>

          <section className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl">
            <h2 className="text-xs uppercase tracking-wider text-zinc-400 font-bold mb-4">Processos de Acabamento</h2>
            <div className="flex flex-wrap gap-3">
              <button 
                onClick={() => alternarAcabamento("verniz_total")}
                className={`px-5 py-3 rounded-xl border font-medium transition ${acabamentosSelecionados.includes("verniz_total") ? "bg-emerald-500 border-emerald-500 text-zinc-950 font-bold" : "border-zinc-800 bg-zinc-950 text-zinc-300 hover:border-zinc-700"}`}
              >
                + Verniz UV Total
              </button>
              <button 
                onClick={() => alternarAcabamento("dobra_simples")}
                className={`px-5 py-3 rounded-xl border font-medium transition ${acabamentosSelecionados.includes("dobra_simples") ? "bg-emerald-500 border-emerald-500 text-zinc-950 font-bold" : "border-zinc-800 bg-zinc-950 text-zinc-300 hover:border-zinc-700"}`}
              >
                + Dobra Mecânica
              </button>
              <button 
                onClick={() => alternarAcabamento("refile_simples")}
                className={`px-5 py-3 rounded-xl border font-medium transition ${acabamentosSelecionados.includes("refile_simples") ? "bg-emerald-500 border-emerald-500 text-zinc-950 font-bold" : "border-zinc-800 bg-zinc-950 text-zinc-300 hover:border-zinc-700"}`}
              >
                + Corte / Refile
              </button>
            </div>
          </section>
        </div>

        <div className="lg:col-span-1">
          <div className="sticky top-24 bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-6 shadow-xl">
            <h2 className="text-xs uppercase tracking-wider text-zinc-400 font-bold border-b border-zinc-800 pb-3">Painel Técnico de Engenharia</h2>
            
            <div className="grid grid-cols-2 gap-4 bg-zinc-950 p-4 rounded-xl border border-zinc-800">
              <div>
                <span className="text-[10px] text-zinc-500 uppercase block font-bold">Aproveitamento</span>
                <span className="text-lg font-mono font-bold text-emerald-400">{pecasPorFolha}</span> <small className="text-zinc-500 text-xs">pçs/fl</small>
              </div>
              <div>
                <span className="text-[10px] text-zinc-500 uppercase block font-bold">Folhas Gastas</span>
                <span className="text-lg font-mono font-bold text-white">{folhasNecessarias.toLocaleString("pt-BR")}</span> <small className="text-zinc-500 text-xs">fls</small>
              </div>
            </div>

            <div className="space-y-2 text-sm font-mono">
              <div className="flex justify-between text-zinc-400">
                <span>Custo Papel:</span>
                <span>{formatarMoeda(custoMaterial)}</span>
              </div>
              <div className="flex justify-between text-zinc-400">
                <span>Custo Clique/Tinta:</span>
                <span>{formatarMoeda(custoTinta)}</span>
              </div>
              <div className="flex justify-between text-zinc-400">
                <span>Custo Operacional:</span>
                <span>{formatarMoeda(custoAcabamento)}</span>
              </div>
              <div className="flex justify-between text-zinc-400">
                <span>Custo Hora-Máquina:</span>
                <span>{formatarMoeda(custoMaquina)}</span>
              </div>
              <div className="flex justify-between text-zinc-500 pt-2 border-t border-zinc-800 text-xs uppercase font-sans font-bold">
                <span>Custo Industrial Total:</span>
                <span className="font-mono text-zinc-300">{formatarMoeda(custoTotal)}</span>
              </div>
            </div>

            <div className="bg-zinc-950 p-3 rounded-xl border border-zinc-800 flex justify-between items-center text-xs">
              <span className="text-zinc-400 uppercase font-bold">Preço Unitário:</span>
              <span className="font-mono text-emerald-400 font-bold text-sm">{formatarMoeda(precoUnitario)}</span>
            </div>
          </div>
        </div>
      </main>

      <footer className="fixed bottom-0 left-0 w-full border-t border-zinc-800 p-5 bg-zinc-950/80 backdrop-blur-md z-40">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
          <div>
            <small className="text-xs uppercase tracking-wider text-zinc-400 font-bold block">Valor Comercial Sugerido (Markup 2.0x)</small>
            <h2 className="text-3xl font-mono font-black text-emerald-400 tracking-tight">
              {pecasPorFolha > 0 ? formatarMoeda(precoDeVenda) : "Formatos Incompatíveis"}
            </h2>
          </div>
          <button className="bg-emerald-500 text-zinc-950 font-bold px-8 h-14 rounded-xl hover:bg-emerald-400 transition shadow-lg shadow-emerald-500/20 uppercase tracking-wider text-sm">
            Salvar & Emitir OS
          </button>
        </div>
      </footer>

    </div>
  );
}