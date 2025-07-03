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
  mensaje = '';
  turnoAReservarId: string = '';
  obraSocialSeleccionada: any = null;
  mostrarFormularioReserva: boolean = false;
  pregunta: string = '';
  mensajes: { origen: 'paciente' | 'ia'; texto: string }[] = [];
  showChatPanel: boolean = false;

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
        } else {
          this.mostrarAlerta = true;
        }
      },
      error: () => {
        this.mostrarAlerta = true;
      }
    });
  }

  cargarEspecialidades() {
    this.http.get<any[]>('http://localhost:5000/api/especialidades').subscribe({
      next: data => this.especialidades = data,
      error: err => console.error('Error cargando especialidades', err)
    });
  }

  cargarMedicos() {
    this.http.get<any[]>('http://localhost:5000/api/medicos').subscribe({
      next: data => {
        this.medicos = data.filter(m => m.especialidad?._id === this.especialidadSeleccionada);
        this.turnos = [];
      },
      error: err => console.error('Error cargando médicos', err)
    });
  }

  cargarTurnos() {
    this.turnoService.obtenerTurnosPorMedico(this.medicoSeleccionado).subscribe({
      next: data => this.turnos = data as any[],
      error: err => console.error('Error al cargar turnos', err)
    });
  }

  reservar(turnoId: string) {
    this.turnoAReservarId = turnoId;
    this.mostrarFormularioReserva = true;
    this.mensaje = '';
  }

  confirmarReserva() {
  if (!this.obraSocialSeleccionada || !this.obraSocialSeleccionada.nombre) {
    this.mensaje = 'Debe seleccionar una obra social válida.';
    return;
  }

  if (!this.ficha.autorizada && this.obraSocialSeleccionada.nombre !== 'Particular') {
    this.mensaje = 'Tu obra social aún no está autorizada. Podés sacar turno solo como Particular.';
    return;
  }

  
  const turno = this.turnos.find(t => t._id === this.turnoAReservarId);
  if (!turno) {
    this.mensaje = 'No se encontró el turno seleccionado.';
    return;
  }

  
  this.pagarTurno(turno);

}

    pagarTurno(turno: any) {
  const idTurno = turno._id;
  const idMedico = this.medicoSeleccionado;
  const idEspecialidad = this.especialidadSeleccionada;
  const obraSocial = this.ficha?.obraSocial?.nombre || 'Particular';
  const email = this.ficha?.email || 'test@email.com';

  console.log("Enviando al backend:", {
    idTurno, idMedico, idEspecialidad, obra_social: obraSocial, payer_email: email
  });

  if (!idTurno || !idMedico || !idEspecialidad || !obraSocial || !email) {
    alert('Faltan datos para generar el pago.');
    return;
  }

  this.http.post<any>('http://localhost:5000/api/mercadopago/pago', {
    idTurno,
    idMedico,
    idEspecialidad,
    obra_social: obraSocial,
    payer_email: email
  }).subscribe({
    next: (res) => {
      if (res.init_point) {
        localStorage.setItem('turnoAPagar', JSON.stringify(turno));
        window.location.href = res.init_point;
      } else {
        alert('No se pudo generar el link de pago.');
      }
    },
    error: (err) => {
      console.error(err);
      alert('Error al generar link de pago.');
    }
  });
}


  consultarIA() {
    if (!this.pregunta.trim()) return;

    const mensajeUsuario = this.pregunta;
    this.mensajes.push({ origen: 'paciente', texto: mensajeUsuario });
    this.pregunta = '';

    this.http.post<any>('http://localhost:5000/api/ia', { pregunta: mensajeUsuario }).subscribe({
      next: res => {
        this.mensajes.push({ origen: 'ia', texto: res.respuesta });
      },
      error: () => {
        this.mensajes.push({ origen: 'ia', texto: ' Error al conectar con el asistente.' });
      }
    });
  }

  cancelarReserva() {
    this.turnoAReservarId = '';
    this.mostrarFormularioReserva = false;
    this.obraSocialSeleccionada = null;
  }

  logout() {
    localStorage.removeItem('token');
    window.location.href = '/login';
  }
  toggleChatPanel() {
    this.showChatPanel = !this.showChatPanel;
  }
}