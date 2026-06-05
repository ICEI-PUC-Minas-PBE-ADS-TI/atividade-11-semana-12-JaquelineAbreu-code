const CHAVE_API_TMDB = "300498475335d93a0a3a1db7793c21b6";

const URL_BASE_IMAGEM =
    "https://image.tmdb.org/t/p/w500";

const containerFilmes =
    document.getElementById("movie-list");

const campoPesquisaFilme =
    document.getElementById("search");

const botaoPesquisarFilme =
    document.getElementById("btnSearch");

const mensagemStatus =
    document.getElementById("message");

/* Modal */

const janelaDetalhesFilme =
    document.getElementById("movieModal");

const imagemFilmeModal =
    document.getElementById("modalPoster");

const tituloFilmeModal =
    document.getElementById("modalTitle");

const anoFilmeModal =
    document.getElementById("modalYear");

const notaFilmeModal =
    document.getElementById("modalRating");

const sinopseFilmeModal =
    document.getElementById("modalOverview");

const botaoFecharModal =
    document.getElementById("closeModal");

/* Mensagens */

function mostrarMensagemUsuario(textoMensagem) {

    mensagemStatus.textContent =
        textoMensagem;
}

/* Buscar Filmes */

async function buscarFilmesNaApi(textoPesquisa = "") {

    try {

        mostrarMensagemUsuario(
            "Carregando filmes..."
        );

        let enderecoApi;

        if (textoPesquisa.trim()) {

            enderecoApi =
                `https://api.themoviedb.org/3/search/movie?api_key=${CHAVE_API_TMDB}&language=pt-BR&query=${textoPesquisa}`;

        } else {

            enderecoApi =
                `https://api.themoviedb.org/3/movie/popular?api_key=${CHAVE_API_TMDB}&language=pt-BR&page=1`;
        }

        const respostaApi =
            await fetch(enderecoApi);

        if (!respostaApi.ok) {

            throw new Error(
                "Erro ao acessar API"
            );
        }

        const dadosFilmes =
            await respostaApi.json();

        mostrarMensagemUsuario("");

        return dadosFilmes.results;

    } catch (erro) {

        console.error(erro);

        mostrarMensagemUsuario(
            "Erro ao carregar filmes."
        );

        return [];
    }
}

/* Modal */

function abrirModalDetalhesFilme(filme) {

    imagemFilmeModal.src =
        filme.poster_path
            ? URL_BASE_IMAGEM + filme.poster_path
            : "";

    tituloFilmeModal.textContent =
        filme.title;

    anoFilmeModal.textContent =
        `Ano: ${
            filme.release_date
                ? filme.release_date.substring(0, 4)
                : "Não informado"
        }`;

    notaFilmeModal.textContent =
        `⭐ Nota: ${filme.vote_average}`;

    sinopseFilmeModal.textContent =
        filme.overview ||
        "Sinopse não disponível.";

    janelaDetalhesFilme.style.display =
        "flex";
}

/* Card */

function criarCardFilme(filme) {

    const cardFilme =
        document.createElement("div");

    cardFilme.classList.add("movie-card");

    cardFilme.innerHTML = `
        <img src="${
            filme.poster_path
                ? URL_BASE_IMAGEM + filme.poster_path
                : "https://via.placeholder.com/500x750"
        }">

        <div class="movie-content">

            <h2>${filme.title}</h2>

            <div class="movie-info">

                <span>
                    ${
                        filme.release_date
                            ? filme.release_date.substring(0,4)
                            : "N/A"
                    }
                </span>

                <span>
                    ⭐ ${filme.vote_average.toFixed(1)}
                </span>

            </div>

            <p>
                ${
                    filme.overview
                        ? filme.overview.substring(0,120)
                        : "Sem descrição"
                }...
            </p>

        </div>
    `;

    cardFilme.addEventListener(
        "click",
        () => abrirModalDetalhesFilme(filme)
    );

    return cardFilme;
}

/* Renderização */

function exibirFilmesNaTela(listaFilmes) {

    containerFilmes.innerHTML = "";

    if (listaFilmes.length === 0) {

        mostrarMensagemUsuario(
            "Nenhum filme encontrado."
        );

        return;
    }

    listaFilmes.forEach(filme => {

        containerFilmes.appendChild(
            criarCardFilme(filme)
        );
    });
}

/* Pesquisa */

async function pesquisarFilmes() {

    const listaFilmes =
        await buscarFilmesNaApi(
            campoPesquisaFilme.value
        );

    exibirFilmesNaTela(listaFilmes);
}

/* Eventos */

botaoPesquisarFilme.addEventListener(
    "click",
    pesquisarFilmes
);

campoPesquisaFilme.addEventListener(
    "keypress",
    (evento) => {

        if (evento.key === "Enter") {
            pesquisarFilmes();
        }
    }
);

botaoFecharModal.addEventListener(
    "click",
    () => {

        janelaDetalhesFilme.style.display =
            "none";
    }
);

window.addEventListener(
    "click",
    (evento) => {

        if (
            evento.target ===
            janelaDetalhesFilme
        ) {

            janelaDetalhesFilme.style.display =
                "none";
        }
    }
);

/* Inicialização */

async function inicializarAplicacao() {

    const listaFilmes =
        await buscarFilmesNaApi();

    exibirFilmesNaTela(listaFilmes);
}

inicializarAplicacao();