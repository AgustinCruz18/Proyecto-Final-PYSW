import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { TurnoService } from '../../services/turno.service';
import { FormsModule } from '@angular/forms';
import { SafeHtmlPipe } from '../../safe-html.pipe';

@Component({
  selector: 'app-dashboard-paciente',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    SafeHtmlPipe
  ],
  templateUrl: './dashboard-paciente.component.html',
  styleUrl: './dashboard-paciente.component.css'
})
export class DashboardPacienteComponent implements OnInit {
  idUsuario: string = '';
  mostrarAlerta: boolean = false;
  ficha: any = null;
  especialidades: any[] = [];
  medicos: any[] = [];
  turnos: any[] = [];
  especialidadSeleccionada = '';
  medicoSeleccionado = '';
  medicoSeleccionadoNombre: string = '';
  mensaje = '';
  turnoAReservarId: string = '';
  obraSocialSeleccionada: any = null; // Inicializado a null o un objeto por defecto
  mostrarFormularioReserva: boolean = false;
  pregunta: string = '';
  mensajes: { origen: 'paciente' | 'ia'; texto: string }[] = [];
  showChatPanel: boolean = false;

  // Propiedades para el manejo de precios
  precioBase: number = 5000;
  precioConDescuento: number = 5000;
  turnoParaPagar: any = null; // Para almacenar el objeto turno seleccionado para la confirmación

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private turnoService: TurnoService
  ) { }

  ngOnInit() {
    this.idUsuario = this.route.snapshot.paramMap.get('id') ?? '';
    this.http.get<any>(`http://localhost:5000/api/ficha/${this.idUsuario}`).subscribe({
      next: (ficha) => {
        if (ficha) {
          this.ficha = ficha;
          this.mostrarAlerta = false;
          this.cargarEspecialidades();

          // ✅ SOLUCIÓN 1: Corrige el ngOnInit para seleccionar la primera obra social válida del array
          if (this.ficha.obrasSociales?.length > 0) {
            this.obraSocialSeleccionada = this.ficha.obrasSociales[0];
          } else {
            this.obraSocialSeleccionada = { nombre: 'Particular', numeroSocio: 'N/A' };
          }

          this.actualizarPrecio(); // Calcula el precio inicial al cargar la ficha
        } else {
          this.mostrarAlerta = true;
        }
      },
      error: () => {
        this.mostrarAlerta = true;
      }
    });
  }

  /**
   * Actualiza el precio con descuento basado en la obra social seleccionada.
   */
  actualizarPrecio() {
    const descuento = this.obtenerDescuento(this.obraSocialSeleccionada?.nombre);
    this.precioConDescuento = this.precioBase * (1 - descuento);
  }

  /**
   * Obtiene el porcentaje de descuento para una obra social dada.
   * @param obraSocial Nombre de la obra social.
   * @returns Porcentaje de descuento (ej. 0.3 para 30%).
   */
  obtenerDescuento(obraSocial: string): number {
    switch (obraSocial) {
      case 'OSDE': return 1;
      case 'Swiss Medical': return 0.998;
      case 'IOSFA': return 0.2;
      case 'Otra': return 0.1;
      case 'Particular': return 0; // Sin descuento para "Particular"
      default: return 0;
    }
  }

  /**
   * Carga las especialidades médicas desde el backend.
   */
  cargarEspecialidades() {
    this.http.get<any[]>('http://localhost:5000/api/especialidades').subscribe({
      next: data => this.especialidades = data,
      error: err => console.error('Error cargando especialidades', err)
    });
  }

  /**
   * Carga los médicos filtrados por la especialidad seleccionada.
   */
  cargarMedicos() {
    this.http.get<any[]>('http://localhost:5000/api/medicos').subscribe({
      next: data => {
        this.medicos = data.filter(m => m.especialidad?._id === this.especialidadSeleccionada);
        this.turnos = []; // Limpia los turnos al cambiar de médico
        this.medicoSeleccionadoNombre = ''; // Limpia el nombre del médico seleccionado
      },
      error: err => console.error('Error cargando médicos', err)
    });
  }

  /**
   * Carga los turnos disponibles para el médico seleccionado.
   */
  cargarTurnos() {
    this.turnoService.obtenerTurnosPorMedico(this.medicoSeleccionado).subscribe({
      next: data => {
        this.turnos = data as any[];
        // Encuentra el nombre completo del médico seleccionado para mostrarlo en el formulario de confirmación
        const selectedMedico = this.medicos.find(m => m._id === this.medicoSeleccionado);
        if (selectedMedico) {
          this.medicoSeleccionadoNombre = `${selectedMedico.nombre} ${selectedMedico.apellido}`;
        }
      },
      error: err => console.error('Error al cargar turnos', err)
    });
  }

  /**
   * Prepara el formulario de reserva mostrando los detalles del turno y el precio.
   * @param turno Objeto del turno a reservar.
   */
  prepararReserva(turno: any) {
    this.turnoParaPagar = turno; // Almacena el objeto completo del turno
    this.turnoAReservarId = turno._id; // Almacena solo el ID para la reserva
    this.mostrarFormularioReserva = true; // Muestra el formulario de confirmación
    this.mensaje = ''; // Limpia cualquier mensaje anterior
    this.actualizarPrecio(); // Recalcula el precio al seleccionar un turno
  }

  /**
   * Confirma la reserva y procede con el pago a través de Mercado Pago.
   */
  confirmarReserva() {
    const obraSocialNombre = this.obraSocialSeleccionada?.nombre;

    // Validaciones
    if (!obraSocialNombre) {
      this.mensaje = 'Debe seleccionar una obra social válida.';
      return;
    }

    if (!this.ficha.autorizada && obraSocialNombre !== 'Particular') {
      this.mensaje = 'Tu obra social aún no está autorizada. Podés sacar turno solo como Particular.';
      return;
    }

    if (!this.turnoParaPagar) {
      this.mensaje = 'No se encontró el turno seleccionado para confirmar.';
      return;
    }

    // Datos para el backend de Mercado Pago
    const idTurno = this.turnoParaPagar._id;
    const idMedico = this.medicoSeleccionado;
    const idEspecialidad = this.especialidadSeleccionada;
    const obraSocial = obraSocialNombre || 'Particular'; // Asegura un valor por defecto
    //const email = this.ficha?.email || 'test@email.com'; // Email del pagador, con fallback
    const email = this.ficha?.email || 'paciente@email.com';
    // ✅ Email del usuario comprador de prueba

    console.log("Enviando al backend:", {
      idTurno, idMedico, idEspecialidad, obra_social: obraSocial, payer_email: email, precio: this.precioConDescuento
    });

    if (!idTurno || !idMedico || !idEspecialidad || !obraSocial || !email) {
      this.mensaje = 'Faltan datos para generar el pago.';
      return;
    }

    // Llamada al backend para generar el link de pago de Mercado Pago
    this.http.post<any>('http://localhost:5000/api/mercadopago/pago', {
      idTurno,
      idMedico,
      idEspecialidad,
      obra_social: obraSocial,
      payer_email: email,
      precio: this.precioConDescuento // Pasa el precio calculado al backend
    }).subscribe({
      next: (res) => {
        if (res.init_point) {
          localStorage.setItem('turnoAPagar', JSON.stringify(this.turnoParaPagar));
          window.location.href = res.init_point;
        } else {
          // Si no hay link de pago porque es 100% cubierto
          this.reservarTurnoDirecto();
        }
      },
      error: (err) => {
        console.error(err);
        this.mensaje = 'Error al generar link de pago.';
      }
    });
  }
  reservarTurnoDirecto() {
    this.http.post('http://localhost:5000/api/turnos/reservar', {
      turnoId: this.turnoParaPagar._id,
      pacienteId: this.ficha.userId, // <- usa userId aquí si es necesario
      obraSocial: this.obraSocialSeleccionada
    }).subscribe({
      next: () => {
        this.mensaje = 'Turno reservado automáticamente (sin pago).';
        localStorage.removeItem('turnoAPagar');
        this.mostrarFormularioReserva = false;
      },
      error: () => {
        this.mensaje = 'Error al reservar turno automáticamente.';
      }
    });
  }


  /**
   * Envía la pregunta del paciente al asistente virtual (IA).
   */
  consultarIA() {
    if (!this.pregunta.trim()) return;

    const mensajeUsuario = this.pregunta;
    this.mensajes.push({ origen: 'paciente', texto: mensajeUsuario }); // Agrega el mensaje del usuario
    this.pregunta = ''; // Limpia el input

    this.http.post<any>('https://backend-turnos-1.onrender.com/api/ia', { pregunta: mensajeUsuario }).subscribe({
      next: res => {
        this.mensajes.push({ origen: 'ia', texto: res.respuesta }); // Agrega la respuesta de la IA
      },
      error: () => {
        this.mensajes.push({ origen: 'ia', texto: ' Error al conectar con el asistente.' });
      }
    });
  }

  /**
   * Cancela el proceso de reserva y oculta el formulario.
   */
  cancelarReserva() {
    this.turnoAReservarId = '';
    this.turnoParaPagar = null; // Limpia el turno seleccionado
    this.mostrarFormularioReserva = false; // Oculta el formulario de confirmación
    // Restablece la obra social seleccionada a la primera de la ficha o a 'Particular'
    if (this.ficha?.obrasSociales?.length > 0) {
      this.obraSocialSeleccionada = this.ficha.obrasSociales[0];
    } else {
      this.obraSocialSeleccionada = { nombre: 'Particular', numeroSocio: 'N/A' };
    }
    this.actualizarPrecio(); // Recalcula el precio al cancelar
    this.mensaje = ''; // Limpia cualquier mensaje
  }

  /**
   * Cierra la sesión del usuario.
   */
  logout() {
    localStorage.removeItem('token');
    window.location.href = '/login';
  }

  /**
   * Alterna la visibilidad del panel del chat.
   */
  toggleChatPanel() {
    this.showChatPanel = !this.showChatPanel;
  }
}
