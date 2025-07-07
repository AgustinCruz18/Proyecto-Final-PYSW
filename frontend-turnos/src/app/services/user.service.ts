import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs'; // Asegúrate de importar Observable

@Injectable({ providedIn: 'root' })
export class UserService {
  private apiUrl = 'http://localhost:5000/api/auth';

  constructor(private http: HttpClient) { }

  crearSecretaria(nombre: string, email: string, password: string): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post(`${this.apiUrl}/crear-secretaria`, { nombre, email, password }, { headers });
  }

  crearGerente(nombre: string, email: string, password: string): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post(`${this.apiUrl}/crear-gerente`, { nombre, email, password }, { headers });
  }
  /* Obtiene una lista de usuarios según el rol especificado.
   El rol de los usuarios a obtener ('secretaria' o 'gerente').
   */
  getUsuarios(rol: 'secretaria' | 'gerente'): Observable<any[]> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<any[]>(`${this.apiUrl}/usuarios/${rol}`, { headers });
  }

  /*Actualiza los datos de un usuario específico.
    El ID del usuario a actualizar.
    Los nuevos datos del usuario (nombre, email).
   */
  actualizarUsuario(id: string, data: { nombre: string, email: string }): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.put(`${this.apiUrl}/usuarios/${id}`, data, { headers });
  }

  /*Elimina un usuario por su ID.
   El ID del usuario a eliminar.
   */
  eliminarUsuario(id: string): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.delete(`${this.apiUrl}/usuarios/${id}`, { headers });
  }
}