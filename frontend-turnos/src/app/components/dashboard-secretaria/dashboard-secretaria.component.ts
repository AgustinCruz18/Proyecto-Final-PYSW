import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-dashboard-secretaria',
  imports: [CommonModule, FormsModule],
  templateUrl: './dashboard-secretaria.component.html',
  styleUrl: './dashboard-secretaria.component.css'
})
export class DashboardSecretariaComponent implements OnInit {
  fichas: any[] = [];

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.cargarFichas();
  }

  cargarFichas() {
    this.http.get<any[]>('http://localhost:5000/api/ficha/secretaria/todas').subscribe({
      next: data => this.fichas = data,
      error: err => console.error('Error cargando fichas', err)
    });
  }

  autorizar(fichaId: string) {
    this.http.put(`http://localhost:5000/api/ficha/autorizar/${fichaId}`, {}).subscribe({
      next: () => {
        alert('Ficha autorizada correctamente.');
        this.cargarFichas(); // Recargar lista
      },
      error: err => console.error('Error al autorizar ficha', err)
    });
  }
  desautorizar(fichaId: string) {
    this.http.put(`http://localhost:5000/api/ficha/desautorizar/${fichaId}`, {}).subscribe({
      next: () => {
        alert('Ficha desautorizada correctamente.');
        this.cargarFichas();
      },
      error: err => console.error('Error al desautorizar ficha', err)
    });
  }
}