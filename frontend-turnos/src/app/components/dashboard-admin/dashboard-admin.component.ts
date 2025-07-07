import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { EspecialidadService } from '../../services/especialidad.service';

@Component({
  selector: 'app-dashboard-admin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dashboard-admin.component.html',
  styleUrls: ['./dashboard-admin.component.css']
})
export class DashboardAdminComponent implements OnInit {
  secretaria = {
    nombre: '',
    email: '',
    password: ''
  };
  gerente = {
    nombre: '',
    email: '',
    password: ''
  };
  listaSecretarias: any[] = [];
  listaGerentes: any[] = [];
  usuarioEditando: any = null;
  mensajeSecretaria = '';
  mensajeGerente = '';
  mensajeUsuarios = '';
  especialidadNombre = '';
  especialidades: any[] = [];
  mensajeEspecialidad = '';
  idUsuarioAEliminar: string | null = null;
  idEspecialidadAEliminar: string | null = null;


  constructor(
    private userService: UserService,
    private especialidadService: EspecialidadService
  ) { }

  ngOnInit() {
    this.cargarEspecialidades();
    this.cargarTodosLosUsuarios();
  }

  cargarTodosLosUsuarios() {
    this.userService.getUsuarios('secretaria').subscribe({
      next: data => this.listaSecretarias = data as any[],
      error: err => console.error('Error al obtener secretarias', err)
    });
    this.userService.getUsuarios('gerente').subscribe({
      next: data => this.listaGerentes = data as any[],
      error: err => console.error('Error al obtener gerentes', err)
    });
  }

  registrarSecretaria(form: NgForm) {
    if (form.invalid) {
      return;
    }
    this.userService.crearSecretaria(this.secretaria.nombre, this.secretaria.email, this.secretaria.password).subscribe({
      next: () => {
        this.mensajeSecretaria = 'Secretaria registrada correctamente';
        form.resetForm();
        this.secretaria = { nombre: '', email: '', password: '' };
        this.cargarTodosLosUsuarios();
        setTimeout(() => this.mensajeSecretaria = '', 3000);
      },
      error: err => {
        this.mensajeSecretaria = err.error.message || 'Error al registrar secretaria';
        setTimeout(() => this.mensajeSecretaria = '', 3000);
      }
    });
  }

  registrarGerente(form: NgForm) {
    if (form.invalid) {
      return;
    }
    this.userService.crearGerente(this.gerente.nombre, this.gerente.email, this.gerente.password).subscribe({
      next: () => {
        this.mensajeGerente = 'Gerente registrado correctamente';
        form.resetForm();
        this.gerente = { nombre: '', email: '', password: '' };
        this.cargarTodosLosUsuarios();
        setTimeout(() => this.mensajeGerente = '', 3000);
      },
      error: err => {
        this.mensajeGerente = err.error.message || 'Error al registrar gerente';
        setTimeout(() => this.mensajeGerente = '', 3000);
      }
    });
  }

  editarUsuario(usuario: any) {
    this.usuarioEditando = { ...usuario };
  }

  guardarCambiosUsuario() {
    if (!this.usuarioEditando) return;

    const { _id, nombre, email } = this.usuarioEditando;
    this.userService.actualizarUsuario(_id, { nombre, email }).subscribe({
      next: () => {
        this.mensajeUsuarios = 'Usuario actualizado correctamente.';
        this.cargarTodosLosUsuarios();
        this.cancelarEdicion();
        setTimeout(() => this.mensajeUsuarios = '', 3000);
      },
      error: err => {
        this.mensajeUsuarios = err.error.message || 'Error al actualizar usuario';
        setTimeout(() => this.mensajeUsuarios = '', 3000);
      }
    });
  }

  confirmarEliminarUsuario(id: string) {
    this.idUsuarioAEliminar = id;
    this.idEspecialidadAEliminar = null;
    const modalElement = document.getElementById('confirmarEliminarModal');
    if (modalElement) {
      modalElement.classList.add('show', 'd-block');
      modalElement.setAttribute('aria-modal', 'true');
      modalElement.style.display = 'block';
    }
  }

  confirmarEliminarEspecialidad(id: string) {
    this.idEspecialidadAEliminar = id;
    this.idUsuarioAEliminar = null;
    const modalElement = document.getElementById('confirmarEliminarModal');
    if (modalElement) {
      modalElement.classList.add('show', 'd-block');
      modalElement.setAttribute('aria-modal', 'true');
      modalElement.style.display = 'block';
    }
  }

  cancelarEliminacionConfirmada() {
    this.idUsuarioAEliminar = null;
    this.idEspecialidadAEliminar = null;
    const modalElement = document.getElementById('confirmarEliminarModal');
    if (modalElement) {
      modalElement.classList.remove('show', 'd-block');
      modalElement.setAttribute('aria-modal', 'false');
      modalElement.style.display = 'none';
    }
  }

  ejecutarEliminacion() {
    if (this.idUsuarioAEliminar) {
      this.userService.eliminarUsuario(this.idUsuarioAEliminar).subscribe({
        next: () => {
          this.mensajeUsuarios = 'Usuario eliminado correctamente.';
          this.cargarTodosLosUsuarios();
          this.cancelarEliminacionConfirmada();
          setTimeout(() => this.mensajeUsuarios = '', 3000);
        },
        error: err => {
          this.mensajeUsuarios = err.error.message || 'Error al eliminar usuario';
          this.cancelarEliminacionConfirmada();
          setTimeout(() => this.mensajeUsuarios = '', 3000);
        }
      });
    } else if (this.idEspecialidadAEliminar) {
      this.especialidadService.eliminar(this.idEspecialidadAEliminar).subscribe({
        next: () => {
          this.mensajeEspecialidad = 'Especialidad eliminada correctamente.';
          this.cargarEspecialidades();
          this.cancelarEliminacionConfirmada();
          setTimeout(() => this.mensajeEspecialidad = '', 3000);
        },
        error: err => {
          this.mensajeEspecialidad = err.error.message || 'Error al eliminar especialidad.';
          this.cancelarEliminacionConfirmada();
          setTimeout(() => this.mensajeEspecialidad = '', 3000);
        }
      });
    }
  }


  cancelarEdicion() {
    this.usuarioEditando = null;
  }

  cargarEspecialidades() {
    this.especialidadService.getEspecialidades().subscribe({
      next: data => this.especialidades = data as any[],
      error: err => console.error('Error al obtener especialidades', err)
    });
  }

  crearEspecialidad(form: NgForm) {
    if (form.invalid || !this.especialidadNombre.trim()) {
      return;
    }

    this.especialidadService.crear(this.especialidadNombre).subscribe({
      next: () => {
        this.mensajeEspecialidad = 'Especialidad registrada correctamente.';
        this.especialidadNombre = '';
        form.resetForm();
        this.cargarEspecialidades();
        setTimeout(() => this.mensajeEspecialidad = '', 3000);
      },
      error: err => {
        this.mensajeEspecialidad = err.error.message || 'Error al crear especialidad.';
        setTimeout(() => this.mensajeEspecialidad = '', 3000);
      }
    });
  }
}