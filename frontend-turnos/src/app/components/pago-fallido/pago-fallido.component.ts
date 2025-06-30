import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-pago-fallido',
  standalone: true,
  imports: [CommonModule],
  template: `<p>Tu pago fue rechazado o falló. Por favor, intenta nuevamente.</p>`
})
export class PagoFallidoComponent {}
