import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css']
})
export class RegistroComponent {
  nombre = '';
  email = '';
  password = '';

  showMessage: boolean = false;
  messageText: string = '';
  messageType: 'success' | 'danger' = 'success';

  constructor(private http: HttpClient, private router: Router) { }

  onSubmit() {
    this.http.post('http://localhost:5000/api/auth/register', {
      nombre: this.nombre,
      email: this.email,
      password: this.password
    }).subscribe({
      next: () => {
        this.displayToastMessage('Registro exitoso. ¡Ahora puedes iniciar sesión!', 'success');
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 2000);
      },
      error: err => {
        const errorMessage = 'Error en el registro: ' + (err.error?.message || 'Error desconocido');
        this.displayToastMessage(errorMessage, 'danger');
      }
    });
  }

  displayToastMessage(message: string, type: 'success' | 'danger') {
    this.messageText = message;
    this.messageType = type;
    this.showMessage = true;

    setTimeout(() => {
      this.showMessage = false;
      this.messageText = '';
    }, 3000);
  }
}
