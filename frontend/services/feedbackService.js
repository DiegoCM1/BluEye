// app/services/feedbackService.js

// URL base de tu API en Railway
const API_BASE = 'https://metaquetzal-production.up.railway.app';

/**
 * Envía un nuevo feedback al backend.
 * @param {{ rating: number, message: string, email?: string }} feedback
 * @returns {Promise<number>} El ID creado en la base de datos
 */
export async function submitFeedback({ rating, message, email }) {
  const response = await fetch(`${API_BASE}/feedback`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ rating, message, email }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.error || 'Error al enviar feedback');
  }

  const { id } = await response.json();
  return id;
}
