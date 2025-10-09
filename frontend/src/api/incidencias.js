// /frontend/src/api/incidencias.js
import client from './client';

export const reportarIncidencia = (data) =>
  client.post('/inventory/incidencia', data).then(r => r.data);
