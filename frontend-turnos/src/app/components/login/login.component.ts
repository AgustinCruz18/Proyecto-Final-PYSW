import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email = '';
  password = '';
  mensajeError: string = '';

  constructor(private auth: AuthService, private http: HttpClient, private router: Router) { }

  loginWithGoogle() {
    this.auth.loginWithGoogle();
  }

  onSubmit() {
    this.mensajeError = ''; // Limpiar mensaje anterior

    this.http
      .post<any>('http://localhost:5000/api/auth/login', {
        email: this.email,
        password: this.password,
      })
      .subscribe({
        next: (res) => {
          this.auth.setToken(res.token);

          setTimeout(() => {
            const rol = this.auth.getRoleFromToken();
            const id = this.auth.getUserIdFromToken();

            if (rol === 'administrador') this.router.navigate(['/admin']);
            else if (rol === 'secretaria') this.router.navigate(['/secretaria']);
            else if (rol === 'gerente') this.router.navigate(['/gerente']);
            else if (rol === 'paciente' && id)
              this.router.navigate(['/paciente', id]);
            else this.router.navigate(['/portada']);
          }, 100);
        },
        error: (err) => {
          console.error('Error al iniciar sesión:', err); // Para depuración
          this.mensajeError =
            'Credenciales inválidas. Por favor, verifica tu correo y contraseña.';
        }
      });
  }
}