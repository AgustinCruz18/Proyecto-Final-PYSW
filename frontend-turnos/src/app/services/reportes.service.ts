import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ReportesService {
  private apiUrl = 'http://localhost:5000/api/reportes';

  constructor(private http: HttpClient) { }

  obtenerEstadisticas() {
    const token = localStorage.getItem('token') || '';
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get(`${this.apiUrl}/estadisticas`, { headers });
  }

  obtenerTurnosPorMedico() {
  const token = localStorage.getItem('token') || '';
  const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
  return this.http.get('http://localhost:5000/api/reportes/turnos-por-medico', { headers });
}

}
