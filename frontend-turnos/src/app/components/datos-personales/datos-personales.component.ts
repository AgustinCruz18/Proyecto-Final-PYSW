import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
@Component({
  selector: 'app-datos-personales',
  imports: [CommonModule, FormsModule],
  templateUrl: './datos-personales.component.html',
  styleUrl: './datos-personales.component.css'
})
export class DatosPersonalesComponent implements OnInit {
  ficha: any = {};
  userId = '';
  esNuevaFicha = true;

  constructor(private auth: AuthService, private http: HttpClient, private route: ActivatedRoute, private router: Router) { }

  ngOnInit() {
    this.userId = this.route.snapshot.paramMap.get('id') || '';

    this.http.get<any>(`http://localhost:5000/api/ficha/${this.userId}`).subscribe({
      next: (data) => {
        if (data) {
          if (data.fechaNacimiento) {
            data.fechaNacimiento = data.fechaNacimiento.split('T')[0]; // Formatea la fecha a YYYY-MM-DD
          }
          this.ficha = data;
          this.esNuevaFicha = false;
        } else {
          this.ficha = { userId: this.userId };
          this.esNuevaFicha = true;
        }
      },
      error: () => {
        this.ficha = { userId: this.userId };
        this.esNuevaFicha = true;
      }
    });
  }

  guardar() {
    this.http.post('http://localhost:5000/api/ficha', this.ficha).subscribe({
      next: () => {
        alert(this.esNuevaFicha ? 'Ficha guardada.' : 'Ficha actualizada.');
        this.esNuevaFicha = false;

        // Redirige al usuario:
        this.router.navigate(['/paciente', this.userId]);
      },
      error: (err) => {
        console.error('Error al guardar:', err);
        alert('Hubo un problema al guardar los datos.');
      }
    });
  }
}
