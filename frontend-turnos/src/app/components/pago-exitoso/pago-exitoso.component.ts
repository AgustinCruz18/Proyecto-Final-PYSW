import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-pago-exitoso',
  template: `<p>{{ message }}</p>`
})
export class PagoExitosoComponent implements OnInit {
  message = 'Procesando tu pago...';

  constructor(private route: ActivatedRoute, private http: HttpClient) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const status = params['collection_status'] || params['status'];
      if (status === 'approved') {
        this.message = '¡Pago aprobado! Reservando turno...';

        const turnoString = localStorage.getItem('turnoAPagar');
        if (!turnoString) {
          this.message = 'No se encontró información del turno.';
          return;
        }

        const turno = JSON.parse(turnoString);

        this.http.post('http://localhost:5000/api/turnos/reservar', {
          turnoId: turno._id,
          pacienteId: turno.paciente?._id,
          obraSocial: turno.paciente?.obraSocial
        }).subscribe({
          next: () => {
            this.message = '¡Pago aprobado y turno reservado con éxito!';
            localStorage.removeItem('turnoAPagar');
          },
          error: () => {
            this.message = 'Pago aprobado, pero hubo un error al reservar el turno.';
          }
        });

      } else {
        this.message = 'El pago no fue aprobado.';
      }
    });
  }
}
