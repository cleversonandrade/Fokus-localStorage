const listaDeTarefas= document.querySelector('.app__section-task-list');

const formularioDeTarefas = document.querySelector('.app__form-add-task');
const btnAlternarTarefa = document.querySelector('.app__button--add-task');
const formLabel = document.querySelector('.app__form-label');
const descricaoTarefaAtiva = document.querySelector('.app__section-active-task-description');
const textarea = document.querySelector('.app__form-textarea');

const btnCancelar = document.querySelector('.app__form-footer__button--cancel');
const btnDeletar = document.querySelector('.app__form-footer__button--delete');
const btnDeletarConcluidas = document.querySelector('#btn-remover-concluidas');
const btnDeletarTodas = document.querySelector('#btn-remover-todas');

const localStorageTarefas = localStorage.getItem('tarefas');
let tarefas = localStorageTarefas ? JSON.parse(localStorageTarefas) : []

const tarefaIconSvg = `
<svg class="app__section-task-icon-status" width="24" height="24" viewBox="0 0 24 24"
    fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="12" fill="#FFF" />
    <path
        d="M9 16.1719L19.5938 5.57812L21 6.98438L9 18.9844L3.42188 13.4062L4.82812 12L9 16.1719Z"
        fill="#01080E" />
</svg>
`

let tarefaSelecionada = null;
let itemTarefaSelecionada = null;
let tarefaEmEdicao = null;
let paragrafoEdicao = null;

const removerTarefas = (somenteConcluidas) => {
    const seletor = somenteConcluidas ? '.app__section-task-list-item-complete' : '.app__section-task-list-item';
    document.querySelectorAll(seletor).forEach((element) => {
        element.remove();
    });

    tarefas = somenteConcluidas ? tarefas.filter(t => !t.concluida) : [];
    updateLocalStorage();
}

const selecionarTarefa = (tarefa, elemento) => {
    if (tarefa.concluida) {
        return
    }

    document.querySelectorAll('.app__section-task-list-item-active').forEach(function (button) {
        button.classList.remove('.app__section-task-list-item-active');
    });

    if (tarefaSelecionada == tarefa) {
        descricaoTarefaAtiva.textContent = null;
        itemTarefaSelecionada  = null;
        tarefaSelecionada = null;
        return;
    }

    tarefaSelecionada = tarefa;
    itemTarefaSelecionada = elemento;
    descricaoTarefaAtiva.textContent = tarefa.descricao;
    elemento.classList.add('app__section-task-list-item-active');
}

const limparFormulario = () => {
    tarefaEmEdicao = null;
    paragrafoEdicao = null;
    textarea.value = '';
    formularioDeTarefas.classList.add('hidden');
}

const selecionaTarefaParaEditar = (tarefa, elemento) => {
    deletarTarefa = tarefa;
    if (tarefaEmEdicao == tarefa) {
        limparFormulario();
        return;
    }

    formLabel.textContent = 'Editando tarefa';
    tarefaEmEdicao = tarefa;
    paragrafoEdicao = elemento;
    textarea.value = tarefa.descricao;
    formularioDeTarefas.classList.remove('hidden');
}

function criarTarefa(tarefa) {
    const li = document.createElement('li');
    li.classList.add('app__section-task-list-item');

    const svgIcon = document.createElement('svg');
    svgIcon.innerHTML = tarefaIconSvg;

    const paragrafo = document.createElement('p');
    paragrafo.classList.add('app__section-task-list-item-description');

    paragrafo.textContent = tarefa.descricao;


    const button = document.createElement('button');

    button.classList.add('app_button-edit');
    const editarIcon = document.createElement('img');
    editarIcon.setAttribute('src', '/imagens/edit.png');

    button.appendChild(editarIcon);

    button.addEventListener('click', (e) => {
        e.stopPropagation();
        selecionaTarefaParaEditar(tarefa, paragrafo);
    });

    li.onclick = () => {
        selecionarTarefa(tarefa, li);
    }

    svgIcon.addEventListener('click', (event) => {
        if (tarefa == tarefaSelecionada) {
            event.stopPropagation(); 
            button.setAttribute('disable', true);
            li.classList.add('app__section-task-list-item-complete');
            tarefaSelecionada.concluida = true;
            updateLocalStorage();
        }
       
    });

    if (tarefa.concluida) {
        button.setAttribute('disable', true);
        li.classList.add('app__section-task-list-item-complete');
    }
 
    li.appendChild(svgIcon);
    li.appendChild(paragrafo);
    li.appendChild(button);
    
    return li
}

tarefas.forEach(tarefa => {
    const tarefaItem = criarTarefa(tarefa);
    listaDeTarefas.appendChild(tarefaItem);
});

btnCancelar.addEventListener('click', () => {
    formularioDeTarefas.classList.add('hidden');
});

btnCancelar.addEventListener('click', limparFormulario);

btnAlternarTarefa.addEventListener('click', () => {
    formLabel.textContent = 'Adicionando tarefa';
    formularioDeTarefas.classList.toggle('hidden');
});

btnDeletar.addEventListener('click', () => {
     if (tarefaSelecionada) {
        const index = tarefas.indexOf(tarefaSelecionada)
        if (index !== -1) {
            tarefas.splice(index, 1);
        }

        itemTarefaSelecionada.remove();
        tarefas.filter(t => t != tarefaSelecionada);
        itemTarefaSelecionada = null;
        tarefaSelecionada = null;
    }

    updateLocalStorage();
    limparFormulario();
});

const updateLocalStorage = () => {
    localStorage.setItem('tarefas', JSON.stringify(tarefas));
}

formularioDeTarefas.addEventListener('submit', (evento) => {
    evento.preventDefault()
    if (tarefaEmEdicao) {
        tarefaEmEdicao.descricao = textarea.value;
        paragrafoEdicao.textContent = textarea.value;
    } else {
    const tarefa = {
        descricao: textarea.value,
        concluida: false,
    }
    tarefas.push(tarefa);
    const itemDeTarefa = criarTarefa(tarefa);
    listaDeTarefas.appendChild(itemDeTarefa);
}

    updateLocalStorage();
    limparFormulario();
});

btnCancelar.addEventListener('click', () => {
    formularioDeTarefas.classList.add('hidden');
}); 

btnDeletarConcluidas.addEventListener('click', () => removerTarefas(true));
btnDeletarTodas.addEventListener('click', () => removerTarefas(false))

document.addEventListener('TarefaFinalizada', function (e) {
    if (tarefaSelecionada) {
        tarefaSelecionada.concluida = true;
        itemTarefaSelecionada.classList.add('app__section-task-list-item-complete');
        itemTarefaSelecionada.querySelector('button').setAttribute('disable', true);
        updateLocalStorage();
    }
});