import { Component } from '@angular/core';
import { UserService } from '../../services/user.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

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

  constructor(private userService: UserService) { }

  registrar() {
    this.userService.crearSecretaria(this.nombre, this.email, this.password).subscribe({
      next: () => this.mensaje = 'Secretaria registrada correctamente',
      error: err => this.mensaje = err.error.message || 'Error al registrar secretaria'
    });
  }
}
