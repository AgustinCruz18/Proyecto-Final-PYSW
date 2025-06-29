import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class HorarioService {
  private apiUrl = 'http://localhost:5000/api/horarios';

  constructor(private http: HttpClient) { }

  crearHorario(medico: string, fecha: string, horaInicio: string, horaFin: string) {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post(this.apiUrl, { medico, fecha, horaInicio, horaFin }, { headers });
  }
}
