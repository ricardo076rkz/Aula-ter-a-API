
export default function CartaoProduto({
    produto,
    aoEditar,
    aoExcluir,
    desabilitado
}) {
    const preco = Number(produto.preco).toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    });

    return (
        <li className="produto-card">
            <div>
                <h3>{produto.referencia}</h3>

                <p>{produto.descricao}</p>

                <p><strong>Preço:</strong> {preco}</p>

                <p><strong>Estoque:</strong> {produto.estoque}</p>
            </div>

            <div className="acoes">
                <button
                    type="button"
                    onClick={aoEditar}
                    disabled={desabilitado}
                >
                    Editar
                </button>

                <button
                    type="button"
                    className="secundario"
                    onClick={aoExcluir}
                    disabled={desabilitado}
                >
                    Excluir
                </button>
            </div>
        </li>
    );
}
