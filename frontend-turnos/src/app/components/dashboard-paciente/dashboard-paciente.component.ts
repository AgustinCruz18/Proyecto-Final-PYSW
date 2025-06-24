import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';

@Component({
  selector: 'app-dashboard-paciente',
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard-paciente.component.html',
  styleUrl: './dashboard-paciente.component.css'
})
export class DashboardPacienteComponent implements OnInit {
  idUsuario: string = '';
  mostrarAlerta: boolean = false;
  ficha: any = null; // ✅ guardamos la ficha aquí

  constructor(private route: ActivatedRoute, private http: HttpClient) { }

  ngOnInit() {
    this.idUsuario = this.route.snapshot.paramMap.get('id') ?? '';
    console.log('ID del paciente:', this.idUsuario);

    this.http.get<any>(`http://localhost:5000/api/ficha/${this.idUsuario}`).subscribe({
      next: (ficha) => {
        if (ficha) {
          this.ficha = ficha;         // ✅ guardamos la ficha
          this.mostrarAlerta = false; // ✅ no mostrar alerta
        } else {
          this.mostrarAlerta = true;
        }
      },
      error: () => {
        this.mostrarAlerta = true;
      }
    });
  }

  logout() {
    localStorage.removeItem('token');
    window.location.href = '/login';
  }
}
