
const API_BASE = import.meta.env.VITE_API_URL
    ?.trim()
    .replace(/\/+$/, '');

const API_URL = API_BASE ? `${API_BASE}/produtos` : '';

async function requisitar(caminho = '', opcoes = {}) {
    if (!API_URL) {
        throw new Error('Configure VITE_API_URL no arquivo .env.');
    }

    const resposta = await fetch(`${API_URL}${caminho}`, {
        method: opcoes.method || 'GET',

        headers: opcoes.dados
            ? { 'Content-Type': 'application/json' }
            : undefined,

        body: opcoes.dados
            ? JSON.stringify(opcoes.dados)
            : undefined
    });

    if (!resposta.ok) {
        let mensagem = `Erro HTTP ${resposta.status}.`;

        try {
            const dados = await resposta.json();
            mensagem = dados.erro || mensagem;
        } catch {
            // Mantém a mensagem HTTP caso a resposta não tenha JSON.
        }

        throw new Error(mensagem);
    }

    if (resposta.status === 204) {
        return;
    }

    return resposta.json();
}

export const listarProdutos = () =>
    requisitar();

export const criarProduto = dados =>
    requisitar('', {
        method: 'POST',
        dados
    });

export const atualizarProduto = (id, dados) =>
    requisitar(`/${encodeURIComponent(id)}`, {
        method: 'PUT',
        dados
    });

export const excluirProduto = id =>
    requisitar(`/${encodeURIComponent(id)}`, {
        method: 'DELETE'
    });
