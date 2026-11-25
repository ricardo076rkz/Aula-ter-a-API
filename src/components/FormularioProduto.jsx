
import { useState } from 'react';

export default function FormularioProduto({
    produto,
    aoSalvar,
    aoCancelar,
    desabilitado
}) {
    const [referencia, setReferencia] = useState(produto?.referencia || '');
    const [descricao, setDescricao] = useState(produto?.descricao || '');
    const [preco, setPreco] = useState(produto?.preco ?? '');
    const [estoque, setEstoque] = useState(produto?.estoque ?? '');

    async function enviar(e) {
        e.preventDefault();

        const dados = {
            referencia,
            descricao,
            preco,
            estoque
        };

        const sucesso = await aoSalvar(dados);

        if (sucesso) {
            setReferencia('');
            setDescricao('');
            setPreco('');
            setEstoque('');
        }
    }

    return (
        <section className="painel">
            <h2>
                {produto ? 'Editar produto' : 'Cadastrar produto'}
            </h2>

            <form onSubmit={enviar}>
                <label htmlFor="referencia">Referência</label>
                <input
                    id="referencia"
                    type="text"
                    maxLength="100"
                    value={referencia}
                    onChange={e => setReferencia(e.target.value)}
                    required
                    disabled={desabilitado}
                />

                <label htmlFor="descricao">Descrição</label>
                <textarea
                    id="descricao"
                    value={descricao}
                    onChange={e => setDescricao(e.target.value)}
                    required
                    disabled={desabilitado}
                />

                <label htmlFor="preco">Preço</label>
                <input
                    id="preco"
                    type="number"
                    min="0"
                    step="0.01"
                    value={preco}
                    onChange={e => setPreco(e.target.value)}
                    required
                    disabled={desabilitado}
                />

                <label htmlFor="estoque">Estoque</label>
                <input
                    id="estoque"
                    type="number"
                    min="0"
                    step="1"
                    value={estoque}
                    onChange={e => setEstoque(e.target.value)}
                    required
                    disabled={desabilitado}
                />

                <button type="submit" disabled={desabilitado}>
                    {produto ? 'Salvar alterações' : 'Cadastrar produto'}
                </button>

                {produto && (
                    <button
                        type="button"
                        className="secundario"
                        onClick={aoCancelar}
                        disabled={desabilitado}
                    >
                        Cancelar
                    </button>
                )}
            </form>
        </section>
    );
}
