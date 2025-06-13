const BASE_URL = 'https://reactnd-books-api.udacity.com';
const TOKEN     = 'my-api-key';
const AUTH_HEADER = { Authorization: TOKEN };

export async function getBooks() {
  const res = await fetch(`${BASE_URL}/books`, { headers: AUTH_HEADER });
  if (!res.ok) throw new Error('Error al obtener libros');
  const { books } = await res.json();
  return books || [];
}

export async function searchBooks(query, max = 50) {
  const payload = JSON.stringify({ query, maxResults: max });
  const res = await fetch(`${BASE_URL}/search`, {
    method: 'POST',
    headers: { ...AUTH_HEADER, 'Content-Type': 'application/json' },
    body: payload,
  });
  if (!res.ok) throw new Error('Error en la búsqueda');
  const { books } = await res.json();
  return books || [];
}

export async function getBookById(id) {
  const res = await fetch(`${BASE_URL}/books/${id}`, {
    headers: AUTH_HEADER,
  });
  if (!res.ok) throw new Error('No se encontró el libro');
  const { book } = await res.json();
  return book;
}

export async function updateBookShelf(id, shelf) {
  const res = await fetch(`${BASE_URL}/books/${id}`, {
    method: 'PUT',
    headers: { ...AUTH_HEADER, 'Content-Type': 'application/json' },
    body: JSON.stringify({ shelf }),
  });
  if (!res.ok) throw new Error('Error al actualizar estante');
  await res.json();
  return shelf;
}
