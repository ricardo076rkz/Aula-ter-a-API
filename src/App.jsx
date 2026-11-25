
import { useEffect, useState } from 'react';

import FormularioProduto from './components/FormularioProduto.jsx';
import CartaoProduto from './components/CartaoProduto.jsx';

import {
    listarProdutos,
    criarProduto,
    atualizarProduto,
    excluirProduto
} from './services/produtosApi.js';

export default function App() {
    const [produtos, setProdutos] = useState([]);
    const [produtoEditando, setProdutoEditando] = useState(null);

    const [carregando, setCarregando] = useState(true);
    const [salvando, setSalvando] = useState(false);
    const [erro, setErro] = useState('');

    useEffect(() => {
        async function carregarProdutos() {
            try {
                const dados = await listarProdutos();

                if (!Array.isArray(dados)) {
                    throw new Error('A API não retornou uma lista de produtos.');
                }

                setProdutos(dados);
            } catch (error) {
                setErro(error.message);
            } finally {
                setCarregando(false);
            }
        }

        carregarProdutos();
    }, []);

    async function salvarProduto(dados) {
        setSalvando(true);
        setErro('');

        try {
            if (produtoEditando) {
                const atualizado = await atualizarProduto(
                    produtoEditando.id,
                    dados
                );

                setProdutos(atuais =>
                    atuais.map(item =>
                        item.id === atualizado.id ? atualizado : item
                    )
                );

                setProdutoEditando(null);
            } else {
                const novo = await criarProduto(dados);

                setProdutos(atuais => [novo, ...atuais]);
            }

            return true;
        } catch (error) {
            setErro(error.message);
            return false;
        } finally {
            setSalvando(false);
        }
    }

    async function removerProduto(id) {
        const confirmar = window.confirm(
            'Deseja realmente excluir este produto?'
        );

        if (!confirmar) return;

        setSalvando(true);
        setErro('');

        try {
            await excluirProduto(id);

            setProdutos(atuais =>
                atuais.filter(item => item.id !== id)
            );

            if (produtoEditando?.id === id) {
                setProdutoEditando(null);
            }
        } catch (error) {
            setErro(error.message);
        } finally {
            setSalvando(false);
        }
    }

    return (
        <main>
            <header>
                <p className="marca">MONOLITO · GERENCIAMENTO</p>
                <h1>Produtos</h1>
                <p>Cadastre, consulte, edite e exclua produtos.</p>
            </header>

            <section className="resumo">
                <p>
                    <strong>{produtos.length}</strong>
                    Produtos cadastrados
                </p>
            </section>

            {erro && (
                <p className="erro" role="alert">
                    {erro}
                </p>
            )}

            <div className="colunas">
                <FormularioProduto
                    key={produtoEditando?.id ?? 'novo'}
                    produto={produtoEditando}
                    aoSalvar={salvarProduto}
                    aoCancelar={() => setProdutoEditando(null)}
                    desabilitado={carregando || salvando}
                />

                <section className="painel">
                    <h2>Lista de produtos</h2>

                    {carregando && <p>Carregando produtos...</p>}

                    {!carregando && produtos.length === 0 && (
                        <p>Nenhum produto cadastrado.</p>
                    )}

                    {!carregando && produtos.length > 0 && (
                        <ul>
                            {produtos.map(produto => (
                                <CartaoProduto
                                    key={produto.id}
                                    produto={produto}
                                    aoEditar={() => setProdutoEditando(produto)}
                                    aoExcluir={() => removerProduto(produto.id)}
                                    desabilitado={salvando}
                                />
                            ))}
                        </ul>
                    )}
                </section>
            </div>

            <footer>
                Gerenciamento de produtos integrado ao backend Monolito.
            </footer>
        </main>
    );
}
