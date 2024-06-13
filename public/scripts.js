let currentPage = 1;
const rowsPerPage = 10;
let totalBooks = 0;

document.addEventListener("DOMContentLoaded", function() {
    fetchTotalBooks().then(() => loadPage(currentPage));

    document.getElementById('primeira_pagina').addEventListener('click', () => goToPage(1));
    document.getElementById('pagina_anterior').addEventListener('click', () => goToPage(currentPage - 1));
    document.getElementById('proxima_pagina').addEventListener('click', () => goToPage(currentPage + 1));
    document.getElementById('ultima_pagina').addEventListener('click', () => goToPage(Math.ceil(totalBooks / rowsPerPage)));
});

async function fetchTotalBooks() {
    try {
        const response = await fetch(`http://localhost:3000/len`);
        const len = await response.json();
        totalBooks = len;
        updateTotalBooksInfo();
        createPageButtons();
        updateNavigationButtons();
    } catch (error) {
        console.error("Erro ao buscar o total de livros:", error);
    }
}

async function loadPage(page) {
    try {
        const response = await fetch(`http://localhost:3000/livros/${page}`);
        const books = await response.json();
        renderBooks(books);
        createPageButtons();
        updateNavigationButtons();
    } catch (error) {
        console.error("Erro ao carregar os livros:", error);
    }
}

function updateTotalBooksInfo() {
    document.getElementById('total-books').innerText = `Exibindo de ${(currentPage - 1) * rowsPerPage + 1} até ${Math.min(currentPage * rowsPerPage, totalBooks)} de ${totalBooks} livros`;
}

function renderBooks(books) {
    const table = document.getElementById('book-table');
    table.innerHTML = '';

    books.forEach(book => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${book.titulo}</td>
            <td>${book.autor}</td>
            <td>${book.isbn}</td>
            <td>${book.paginas}</td>
            <td>${book.ano}</td>
            <td>R$${book.valor}</td>
        `;
        table.appendChild(row);
    });
}

function createPageButtons() {
    const pageButtonsContainer = document.getElementById('botoes_paginas');
    pageButtonsContainer.innerHTML = '';

    const totalPages = Math.ceil(totalBooks / rowsPerPage);
    const startPage = Math.max(currentPage - 3, 1);
    const endPage = Math.min(currentPage + 3, totalPages);

    for (let i = startPage; i <= endPage; i++) {
        const button = document.createElement('button');
        button.innerText = i;
        button.classList.add('page-button', i === currentPage ? 'active' : null);
        button.addEventListener('click', () => goToPage(i));
        pageButtonsContainer.appendChild(button);
    }
}

function updateNavigationButtons() {
    const totalPages = Math.ceil(totalBooks / rowsPerPage);
    const firstPageButton = document.getElementById('primeira_pagina');
    const prevPageButton = document.getElementById('pagina_anterior');
    const nextPageButton = document.getElementById('proxima_pagina');
    const lastPageButton = document.getElementById('ultima_pagina');

    firstPageButton.disabled = currentPage === 1;
    prevPageButton.disabled = currentPage === 1;
    nextPageButton.disabled = currentPage === totalPages;
    lastPageButton.disabled = currentPage === totalPages;
}

function goToPage(page) {
    if (page >= 1 && page <= Math.ceil(totalBooks / rowsPerPage)) {
        currentPage = page;
        loadPage(currentPage);
    }
}
