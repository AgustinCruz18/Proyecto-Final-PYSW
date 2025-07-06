import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  private auth = inject(AuthService);
  private router = inject(Router);

  user() {
    const token = this.auth.getToken();
    if (!token) return null;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return {
        nombre: payload.nombre || '',
        email: payload.email || '',
        rol: payload.rol,
        id: payload.id
      };
    } catch {
      return null;
    }
  }
  irAPortada() {
    const id = this.user()?.id;
    if (id && this.user()?.rol === 'paciente') {
      this.router.navigate([`/paciente/${id}`]);
    } else {
      this.router.navigate(['/portada']);
    }
  }

  irADatosPersonales() {
    const id = this.user()?.id;
    if (id) {
      this.router.navigate([`/paciente/detalle-paciente/${id}`]);
    }
  }

  logout() {
    this.auth.logout();
  }
}
