function fazerLogin() {
  const emailDigitado = document.getElementById("email").value;
  const senhaDigitada = document.getElementById("senha").value;
  const mensagemErro = document.getElementById("mensagemErro");

  fetch("data.json")
    .then(response => response.json())
    .then(usuarios => {
      const usuario = usuarios.find(u => u.email === emailDigitado && u.senha === senhaDigitada);

      if (usuario) {
        localStorage.setItem("usuarioLogado", usuario.nome);
        window.location.href = "home.html";
      } else {
        mensagemErro.textContent = "⚠️ Email ou senha incorretos!";
        mensagemErro.style.color = "white";
      }
    })
    .catch(error => console.log("Erro ao carregar JSON", error));
}

const nomeUsuario = localStorage.getItem("usuarioLogado");

if (nomeUsuario) {
  document.getElementById("titulo").textContent = "Olá, " + nomeUsuario + "!";
} else {
  document.getElementById("titulo").textContent = "Usuário não identificado.";
}

// Função de logout
function logout() {
  localStorage.removeItem("usuarioLogado");
  window.location.href = "index.html";
}

// Função para criar um post
function criarPost() {
  const novoPost = document.getElementById("novoPost").value;

  if (novoPost.trim() === "") {
    alert("Por favor, escreva algo para o post.");
    return;
  }

  // Obter os posts existentes ou criar um array vazio se não houver posts
  const posts = JSON.parse(localStorage.getItem("posts")) || [];

  // Adicionar o novo post
  posts.push({
    usuario: nomeUsuario,
    conteudo: novoPost,
    data: new Date().toLocaleString(),
    likes: 0,
    curtidoPor: [] // Lista de usuários que curtiram o post
  });

  // Salvar os posts no localStorage
  localStorage.setItem("posts", JSON.stringify(posts));

  // Limpar o campo de texto do post
  document.getElementById("novoPost").value = "";

  // Exibir os posts após criar um novo
  exibirPosts();
}

// Função para adicionar um like (curtir ou descurtir)
function adicionarLike(index) {
  const posts = JSON.parse(localStorage.getItem("posts")) || [];

  // Verifica se o usuário já curtiu o post
  const jaCurtiu = posts[index].curtidoPor.includes(nomeUsuario);

  if (jaCurtiu) {
    // Se já curtiu, remove o like (descurte)
    posts[index].curtidoPor = posts[index].curtidoPor.filter(user => user !== nomeUsuario);
    posts[index].likes--; // Decrementa o número de likes
  } else {
    // Se ainda não curtiu, adiciona o like
    posts[index].curtidoPor.push(nomeUsuario);
    posts[index].likes++; // Incrementa o número de likes
  }

  // Salva novamente os posts no localStorage
  localStorage.setItem("posts", JSON.stringify(posts));

  // Atualiza os posts na tela
  exibirPosts();
}


// Função para deletar um post
function deletarPost(index) {
  const posts = JSON.parse(localStorage.getItem("posts")) || [];

  // Remove o post do array
  posts.splice(index, 1);

  // Salva novamente os posts no localStorage
  localStorage.setItem("posts", JSON.stringify(posts));

   exibirPosts(); //Atualiza os posts
}

// Função para exibir os posts
function exibirPosts() {
  const posts = JSON.parse(localStorage.getItem("posts")) || [];
  const postsContainer = document.getElementById("postsContainer");

  postsContainer.innerHTML = ""; // Limpar posts anteriores

  posts.forEach((post, index) => {
    const postElement = document.createElement("div");
    postElement.classList.add("post");

    // Verifica se o usuário logado é o mesmo que criou o post
    const botaoDeletar = nomeUsuario === post.usuario ? 
      `<button onclick="deletarPost(${index})" class="botaoDeletar">Deletar</button>` : '';

    // Verifica se o usuário já curtiu o post
    const curtirTexto = post.curtidoPor.includes(nomeUsuario) ? "Descurtir" : "Curtir";
    
    postElement.innerHTML = `
      <p><strong>${post.usuario}</strong> - ${post.data}</p>
      <p>${post.conteudo}</p>
      <button onclick="adicionarLike(${index})">${curtirTexto}</button>
      <span>Likes: ${post.likes || 0}</span>
      ${botaoDeletar} <!-- Exibe o botão de deletar apenas para o autor do post -->
      <hr>
    `;
    postsContainer.appendChild(postElement);
  });
}

// Chama a função para exibir posts ao carregar a página
window.onload = function() {
  exibirPosts();
};
