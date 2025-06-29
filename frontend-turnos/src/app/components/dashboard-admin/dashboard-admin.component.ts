import { Component } from '@angular/core';
import { UserService } from '../../services/user.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EspecialidadService } from '../../services/especialidad.service';

@Component({
  selector: 'app-dashboard-admin',
  imports: [CommonModule, FormsModule],
  templateUrl: './dashboard-admin.component.html',
  styleUrl: './dashboard-admin.component.css'
})
export class DashboardAdminComponent {
  nombre = '';
  email = '';
  password = '';
  mensaje = '';
  especialidadNombre = '';
  especialidades: any[] = [];
  mensajeEspecialidad = '';

  constructor(
    private userService: UserService,
    private especialidadService: EspecialidadService
  ) { }

  ngOnInit() {
    this.cargarEspecialidades();
  }

  registrar() {
    this.userService.crearSecretaria(this.nombre, this.email, this.password).subscribe({
      next: () => this.mensaje = 'Secretaria registrada correctamente',
      error: err => this.mensaje = err.error.message || 'Error al registrar secretaria'
    });
  }

  cargarEspecialidades() {
    this.especialidadService.getEspecialidades().subscribe({
      next: data => this.especialidades = data as any[],
      error: err => console.error('Error al obtener especialidades', err)
    });
  }

  crearEspecialidad() {
    if (!this.especialidadNombre.trim()) return;

    this.especialidadService.crear(this.especialidadNombre).subscribe({
      next: () => {
        this.mensajeEspecialidad = 'Especialidad registrada correctamente.';
        this.especialidadNombre = '';
        this.cargarEspecialidades();
      },
      error: err => {
        this.mensajeEspecialidad = err.error.message || 'Error al crear especialidad.';
      }
    });
  }

  eliminarEspecialidad(id: string) {
    if (!confirm('¿Estás seguro de eliminar esta especialidad?')) return;

    this.especialidadService.eliminar(id).subscribe({
      next: () => {
        this.cargarEspecialidades();
      },
      error: err => console.error('Error al eliminar especialidad', err)
    });
  }
}