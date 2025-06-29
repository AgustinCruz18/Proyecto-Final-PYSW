import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class MedicoService {
  private apiUrl = 'http://localhost:5000/api/medicos';

  constructor(private http: HttpClient) { }

  crearMedico(nombre: string, apellido: string, especialidad: string) {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post(this.apiUrl, { nombre, apellido, especialidad }, { headers });
  }

  obtenerMedicos() {
    return this.http.get(this.apiUrl);
  }
}
