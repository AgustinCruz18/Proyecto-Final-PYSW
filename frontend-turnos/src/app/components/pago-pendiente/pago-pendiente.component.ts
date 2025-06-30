import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-pago-pendiente',
  standalone: true,
  imports: [CommonModule],
  template: `<p>Tu pago está pendiente. Te avisaremos cuando se confirme.</p>`
})
export class PagoPendienteComponent {}
