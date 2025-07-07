import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import {
  Component,
  OnInit,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MedicoService } from '../../services/medico.service';
import { HorarioService } from '../../services/horario.service';
import { CalendarIframeComponent } from '../calendar-iframe/calendar-iframe.component';
import { TurnoService } from '../../services/turno.service';
import { ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-dashboard-secretaria',
  standalone: true,
  imports: [CommonModule, FormsModule, CalendarIframeComponent],
  templateUrl: './dashboard-secretaria.component.html',
  styleUrls: ['./dashboard-secretaria.component.css']
})
export class DashboardSecretariaComponent implements OnInit {
  fichas: any[] = [];
  especialidades: any[] = [];
  medico = { nombre: '', apellido: '', especialidad: '' };
  mensajeMedico = '';
  medicos: any[] = [];
  horario = { medico: '', fecha: '', horaInicio: '', horaFin: '' };
  mensajeHorario = '';
  turnos: any[] = [];
  turnoEditando: any = null;
  turnosAgrupadosPorMedico: any[] = [];

  mostrarConfirmacionEliminar: boolean = false;
  turnoIdAEliminar: string | null = null;

  // Nuevas propiedades para la búsqueda de turnos
  especialidadSeleccionada: string = '';
  medicoSeleccionado: string = '';
  medicosFiltrados: any[] = [];
  turnosFiltrados: any[] = [];
  estadoFiltro: string = 'todos';

  @ViewChild('formHorario') formHorarioRef!: NgForm;
  @ViewChild('formMedico') formMedicoRef!: NgForm;

  constructor(
    private http: HttpClient,
    private medicoService: MedicoService,
    private horarioService: HorarioService,
    private turnoService: TurnoService
  ) { }


  ngOnInit(): void {
    this.cargarFichas();
    this.cargarEspecialidades();
    this.cargarMedicos();
    this.cargarTurnos();
  }

  cargarFichas() {
    this.http.get<any[]>('http://localhost:5000/api/ficha/secretaria/todas').subscribe({
      next: (data) => (this.fichas = data),
      error: () => this.mostrarMensaje('Error al cargar las fichas.', 'error'),
    });
  }

  autorizar(fichaId: string) {
    this.http.put(`http://localhost:5000/api/ficha/autorizar/${fichaId}`, {}).subscribe({
      next: () => {
        this.mostrarMensaje('Ficha autorizada correctamente.', 'success');
        this.cargarFichas();
      },
      error: () =>
        this.mostrarMensaje('Error al autorizar la ficha.', 'error'),
    });
  }

  desautorizar(fichaId: string) {
    this.http.put(`http://localhost:5000/api/ficha/desautorizar/${fichaId}`, {}).subscribe({
      next: () => {
        this.mostrarMensaje('Ficha desautorizada correctamente.', 'success');
        this.cargarFichas();
      },
      error: () =>
        this.mostrarMensaje('Error al desautorizar la ficha.', 'error'),
    });
  }

  cargarEspecialidades() {
    this.http.get<any[]>('http://localhost:5000/api/especialidades').subscribe({
      next: (data) => (this.especialidades = data),
      error: () =>
        this.mostrarMensaje('Error al cargar las especialidades.', 'error'),
    });
  }

  registrarMedico() {
    const { nombre, apellido, especialidad } = this.medico;
    if (!nombre || !apellido || !especialidad) return;

    this.medicoService.crearMedico(nombre, apellido, especialidad).subscribe({
      next: () => {
        this.mensajeMedico = 'Médico registrado correctamente.';
        this.medico = { nombre: '', apellido: '', especialidad: '' };
        this.formMedicoRef.resetForm();
        setTimeout(() => this.mensajeMedico = '', 2000);
        this.cargarMedicos();
      },
      error: () => {
        this.mensajeMedico = 'Hubo un error al registrar el médico.';
      },
    });
  }

  cargarMedicos() {
    this.http.get<any[]>('http://localhost:5000/api/medicos').subscribe({
      next: (data) => (this.medicos = data),
      error: () =>
        this.mostrarMensaje('Error al cargar los médicos.', 'error'),
    });
  }

  crearHorarioDisponible() {
    const { medico, fecha, horaInicio, horaFin } = this.horario;
    if (!medico || !fecha || !horaInicio || !horaFin) return;

    // Validación de fecha futura o actual
    const hoy = new Date();
    const fechaIngresada = new Date(fecha);

    // Eliminar la hora para comparar solo fechas
    hoy.setHours(0, 0, 0, 0);
    fechaIngresada.setHours(0, 0, 0, 0);

    if (fechaIngresada < hoy) {
      this.mensajeHorario = 'La fecha no puede ser anterior a hoy.';
      return;
    }

    // Validación de rango horario
    if (horaFin <= horaInicio) {
      this.mensajeHorario = 'La hora de fin debe ser posterior a la hora de inicio.';
      return;
    }

    this.horarioService.crearHorario(medico, fecha, horaInicio, horaFin).subscribe({
      next: (data: any) => {
        this.horario = { medico: '', fecha: '', horaInicio: '', horaFin: '' };

        if (data.turnos) {

          this.turnos = [...this.turnos, ...data.turnos];
        }
        this.formHorarioRef.resetForm(); // primero limpiás el form
        this.mensajeHorario = 'Horario creado correctamente.';
        setTimeout(() => this.mensajeHorario = '', 2000);

      },
      error: () => {
        this.mensajeHorario = 'Hubo un error al crear el horario.';
      },
    });
  }

  mostrarMensaje(mensaje: string, tipo: 'success' | 'error') {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${tipo} position-fixed top-0 end-0 m-3 fade show`;
    alertDiv.innerHTML = `
      <div class="d-flex justify-content-between align-items-center">
        <span>${mensaje}</span>
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
      </div>
    `;
    document.body.appendChild(alertDiv);

    setTimeout(() => {
      alertDiv.classList.remove('show');
      setTimeout(() => alertDiv.remove(), 150);
    }, 3000);
  }
  limpiarMensaje() {
    this.mensajeHorario = '';
  }

  cargarTurnos() {
    this.turnoService.getTodos().subscribe({
      next: (data) => {
        this.turnos = data;

        // Agrupar por médico
        const agrupado: { [key: string]: any[] } = {};
        data.forEach((turno: any) => {
          const medicoNombre = turno.medico ? `${turno.medico.nombre} ${turno.medico.apellido}` : 'Sin médico';
          if (!agrupado[medicoNombre]) agrupado[medicoNombre] = [];
          agrupado[medicoNombre].push(turno);
        });

        this.turnosAgrupadosPorMedico = Object.entries(agrupado).map(([medico, turnos]) => ({
          medico,
          turnos
        }));
      },
      error: () => this.mostrarMensaje('Error al cargar los turnos.', 'error')
    });
  }


  eliminarTurno(id: string) {
    this.turnoIdAEliminar = id;
    this.mostrarConfirmacionEliminar = true;
  }

  confirmarEliminarTurno() {
    if (this.turnoIdAEliminar) {
      this.turnoService.eliminarTurno(this.turnoIdAEliminar).subscribe({
        next: () => {
          this.mostrarMensaje('Turno eliminado con éxito.', 'success');
          this.cargarTurnos();
          this.buscarTurnosPorMedico(); // Actualizar la tabla de búsqueda también
        },
        error: (err) => {
          this.mostrarMensaje('Error al eliminar el turno.', 'error');
          console.error('Error al eliminar turno:', err);
        },
        complete: () => {
          this.cancelarEliminar();
        }
      });
    } else {
      this.cancelarEliminar();
    }
  }

  cancelarEliminar() {
    this.mostrarConfirmacionEliminar = false;
    this.turnoIdAEliminar = null;
  }

  editarTurno(turno: any) {
    this.turnoEditando = { ...turno };

    // Formatea la fecha para el input type="date"
    if (this.turnoEditando.fecha) {
      let dateObj: Date;

      if (this.turnoEditando.fecha instanceof Date) {
        dateObj = this.turnoEditando.fecha;
      }
      else if (typeof this.turnoEditando.fecha === 'string') {
        dateObj = new Date(this.turnoEditando.fecha);
      } else {
        return;
      }

      if (!isNaN(dateObj.getTime())) {
        const year = dateObj.getFullYear();
        const month = (dateObj.getMonth() + 1).toString().padStart(2, '0');
        const day = dateObj.getDate().toString().padStart(2, '0');
        this.turnoEditando.fecha = `${year}-${month}-${day}`;
      } else {
        console.warn('Fecha inválida recibida para turnoEditando:', this.turnoEditando.fecha);
        this.turnoEditando.fecha = '';
      }
    }
  }

  guardarCambiosTurno() {
    if (this.turnoEditando && this.turnoEditando.fecha) {
      if (this.turnoEditando.fecha instanceof Date) {
        const fecha = this.turnoEditando.fecha;
        this.turnoEditando.fecha = fecha.toISOString().split('T')[0];
      }
    }

    this.turnoService.actualizarTurno(this.turnoEditando._id, this.turnoEditando).subscribe({
      next: () => {
        this.turnoEditando = null;
        this.cargarTurnos();
        this.buscarTurnosPorMedico(); // Actualizar la tabla de búsqueda también
        this.mostrarMensaje('Turno actualizado con éxito.', 'success');
      },
      error: (err) => {
        if (err.status === 400 && err.error?.message) {
          this.mostrarMensaje(err.error.message, 'error');
        } else {
          this.mostrarMensaje('Error al actualizar el turno.', 'error');
        }
      }
    });

  }

  cancelarEdicion() {
    this.turnoEditando = null;
  }

  // Nuevas funciones para la búsqueda de turnos
  filtrarMedicos() {
    this.medicosFiltrados = this.medicos.filter(m =>
      m.especialidad?._id === this.especialidadSeleccionada || m.especialidad === this.especialidadSeleccionada
    );
    this.medicoSeleccionado = ''; // Resetear médico seleccionado al cambiar especialidad
    this.turnosFiltrados = []; // Limpiar turnos filtrados
  }

  buscarTurnosPorMedico() {
    if (!this.medicoSeleccionado) {
      this.turnosFiltrados = [];
      return;
    }

    this.turnoService.getTodos().subscribe({
      next: (data: any[]) => {
        this.turnosFiltrados = data.filter(t => {
          const coincideMedico = t.medico?._id === this.medicoSeleccionado || t.medico === this.medicoSeleccionado;
          const coincideEstado = this.estadoFiltro === 'todos' || t.estado === this.estadoFiltro;
          return coincideMedico && coincideEstado;
        });
      },
      error: () => this.mostrarMensaje('Error al buscar turnos del médico.', 'error')
    });
  }

  limpiarBusqueda() {
    this.especialidadSeleccionada = '';
    this.medicoSeleccionado = '';
    this.medicosFiltrados = [];
    this.turnosFiltrados = [];
    this.estadoFiltro = 'todos';
  }
}