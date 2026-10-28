// Fecha de hoy en hora local como 'AAAA-MM-DD'. Con ?debug=1&dias=N se adelanta N días
// para probar el objetivo diario y la racha sin esperar (plan de 000, §9).

export function diasDeDesplazamiento() {
  const params = new URLSearchParams(globalThis.location?.search ?? '');
  if (params.get('debug') !== '1') return 0;
  const n = Number.parseInt(params.get('dias') ?? '0', 10);
  return Number.isFinite(n) ? n : 0;
}

export function hoy(ahora = new Date()) {
  const d = new Date(ahora);
  d.setDate(d.getDate() + diasDeDesplazamiento());
  const mes = String(d.getMonth() + 1).padStart(2, '0');
  const dia = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}-${mes}-${dia}`;
}
