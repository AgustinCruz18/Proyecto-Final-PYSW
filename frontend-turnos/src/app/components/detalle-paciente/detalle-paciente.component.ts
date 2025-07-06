import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-detalle-paciente',
  imports: [CommonModule],
  templateUrl: './detalle-paciente.component.html',
  styleUrl: './detalle-paciente.component.css'
})
export class DetallePacienteComponent {
  ficha: any = {};
  userId = '';
  turnos: any[] = [];
  idUsuario: string = '';

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.userId = this.route.snapshot.paramMap.get('id') || '';
    this.http.get<any>(`http://localhost:5000/api/ficha/${this.userId}`).subscribe({
      next: (data) => {
        this.ficha = data;
      },
      error: (err) => {
        console.error('Error al cargar la ficha:', err);
      }
    });
    this.cargarTurnosPaciente();
  }

  irAModificar(): void {
    this.router.navigate([`/paciente/datos-personales/${this.userId}`]);
  }

  /*cargarTurnosPaciente() {
    this.http.get<any[]>(`http://localhost:5000/api/turnos/paciente/${this.idUsuario}`).subscribe({
      next: (data) => {
        this.turnos = data;
      },
      error: (err) => {
        console.error('Error al cargar los turnos del paciente', err);
      }
    });
  }*/
  cargarTurnosPaciente() {
    this.http.get<any[]>(`http://localhost:5000/api/turnos/paciente/${this.userId}`).subscribe({
      next: (data) => {
        this.turnos = data;
      },
      error: (err) => {
        console.error('Error al cargar los turnos del paciente', err);
      }
    });
  }
} 
