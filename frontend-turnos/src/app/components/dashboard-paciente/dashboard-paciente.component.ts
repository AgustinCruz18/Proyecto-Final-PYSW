import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-dashboard-paciente',
  imports: [CommonModule],
  templateUrl: './dashboard-paciente.component.html',
  styleUrl: './dashboard-paciente.component.css'
})
export class DashboardPacienteComponent {
  idUsuario: string = '';

  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    this.idUsuario = this.route.snapshot.paramMap.get('id') ?? '';
    console.log('ID del paciente:', this.idUsuario);
    // Aquí podrías hacer una llamada al backend usando ese ID
  }
}
