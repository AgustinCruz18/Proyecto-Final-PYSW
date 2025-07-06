import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

declare var bootstrap: any;

@Component({
  selector: 'app-datos-personales',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './datos-personales.component.html',
  styleUrl: './datos-personales.component.css'
})
export class DatosPersonalesComponent implements OnInit {
  ficha: any = {};
  userId = '';
  esNuevaFicha = true;

  obraSocialSeleccionada1 = '';
  obraSocialSeleccionada2 = '';
  otraObraSocial1 = '';
  otraObraSocial2 = '';
  numeroSocio1 = '';
  numeroSocio2 = '';
  mostrarSegundaObra = false;
  fechaInvalida: boolean = false;


  obrasSocialesBase = ['OSDE', 'Swiss Medical', 'IOSFA', 'Particular'];
  mensajeModal = '';

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.userId = this.route.snapshot.paramMap.get('id') || '';

    this.http.get<any>(`http://localhost:5000/api/ficha/${this.userId}`).subscribe({
      next: (data) => {
        if (data) {
          this.ficha = data;

          if (this.ficha.fechaNacimiento) {
            this.ficha.fechaNacimiento = this.ficha.fechaNacimiento.split('T')[0];
          }

          if (!this.ficha.obrasSociales) {
            this.ficha.obrasSociales = [{ nombre: '', numeroSocio: '' }];
          }

          while (this.ficha.obrasSociales.length < 2) {
            this.ficha.obrasSociales.push({ nombre: '', numeroSocio: '' });
          }

          const os1 = this.ficha.obrasSociales[0];
          this.numeroSocio1 = os1?.numeroSocio || '';
          if (this.esObraSocialValida(os1?.nombre)) {
            this.obraSocialSeleccionada1 = os1.nombre;
          } else if (os1?.nombre) {
            this.obraSocialSeleccionada1 = 'Otra';
            this.otraObraSocial1 = os1.nombre;
          }

          const os2 = this.ficha.obrasSociales[1];
          this.numeroSocio2 = os2?.numeroSocio || '';
          if (os2?.nombre) {
            this.mostrarSegundaObra = true;
            if (this.esObraSocialValida(os2.nombre)) {
              this.obraSocialSeleccionada2 = os2.nombre;
            } else {
              this.obraSocialSeleccionada2 = 'Otra';
              this.otraObraSocial2 = os2.nombre;
            }
          }

          this.esNuevaFicha = false;
        } else {
          this.inicializarFicha();
        }
      },
      error: () => {
        this.inicializarFicha();
      }
    });
  }

  inicializarFicha(): void {
    this.ficha = {
      userId: this.userId,
      obrasSociales: [{ nombre: '', numeroSocio: '' }, { nombre: '', numeroSocio: '' }]
    };
    this.numeroSocio1 = '';
    this.numeroSocio2 = '';
    this.obraSocialSeleccionada1 = '';
    this.obraSocialSeleccionada2 = '';
    this.otraObraSocial1 = '';
    this.otraObraSocial2 = '';
    this.esNuevaFicha = true;
  }

  esObraSocialValida(nombre: string): boolean {
    return this.obrasSocialesBase.includes(nombre);
  }

  guardar(): void {
    const anioActual = new Date().getFullYear();
  const fechaNacimiento = new Date(this.ficha.fechaNacimiento);

  if (fechaNacimiento.getFullYear() >= anioActual) {
    this.fechaInvalida = true;
    this.mensajeModal = 'La fecha de nacimiento debe ser anterior al año actual.';
    this.mostrarModalConFocoSeguro();
    return;
  } else {
    this.fechaInvalida = false;
  }
    const fichaData = {
      userId: this.userId, // Usamos this.userId que ya viene de la ruta
      nombreCompleto: this.ficha.nombreCompleto,
      edad: this.ficha.edad,
      dni: this.ficha.dni,
      genero: this.ficha.genero,
      fechaNacimiento: this.ficha.fechaNacimiento,
      direccion: this.ficha.direccion,
      telefono: this.ficha.telefono,
      obrasSociales: [] as { nombre: string, numeroSocio: string }[]
    };

    if (this.obraSocialSeleccionada1) {
      fichaData.obrasSociales.push({
        nombre: this.obraSocialSeleccionada1 === 'Otra' ? this.otraObraSocial1 : this.obraSocialSeleccionada1,
        numeroSocio: this.obraSocialSeleccionada1 === 'Particular' ? '' : this.numeroSocio1
      });
    }

    if (this.mostrarSegundaObra && this.obraSocialSeleccionada2) {
      fichaData.obrasSociales.push({
        nombre: this.obraSocialSeleccionada2 === 'Otra' ? this.otraObraSocial2 : this.obraSocialSeleccionada2,
        numeroSocio: this.obraSocialSeleccionada2 === 'Particular' ? '' : this.numeroSocio2
      });
    }

    this.http.post('http://localhost:5000/api/ficha', fichaData).subscribe({
      next: () => {
        this.mensajeModal = this.esNuevaFicha
          ? 'Ficha guardada correctamente.'
          : 'Ficha actualizada correctamente.';
        this.esNuevaFicha = false;
        //this.mostrarModalConFocoSeguro();
        this.mostrarModalConFocoSeguro(true);
      },
      error: (err) => {
        console.error('Error al guardar:', err);
        this.mensajeModal = 'Hubo un problema al guardar los datos.';
        this.mostrarModalConFocoSeguro();
      }
    });
  }

  mostrarModalConFocoSeguro(redirigir: boolean = false): void {
    const modalElement = document.getElementById('confirmModal');
    const submitBtn = document.querySelector('button[type="submit"]') as HTMLElement;

    if (modalElement) {
      const modal = new bootstrap.Modal(modalElement);
      modal.show();
      const cerrarBtn = modalElement.querySelector('.btn[data-bs-dismiss="modal"]') as HTMLButtonElement;
      if (cerrarBtn) {
        cerrarBtn.addEventListener('click', () => {
          cerrarBtn.blur();
        });
      }

      modalElement.addEventListener('hidden.bs.modal', () => {
        setTimeout(() => {
          submitBtn?.focus();
          if (redirigir) {
            this.router.navigate([`/paciente/detalle-paciente/${this.userId}`]); // 👉 Redirigir después de cerrar el modal
          }
        }, 100);
      }, { once: true });
    } else {
      alert(this.mensajeModal);
      if (redirigir) {
        this.router.navigate([`/paciente/detalle-paciente/${this.userId}`]);
      }
    }
  }


  agregarSegundaObraSocial(): void {
    this.mostrarSegundaObra = true;
  }

  eliminarObraSocial(index: number): void {
    if (index === 1) {
      this.obraSocialSeleccionada1 = '';
      this.otraObraSocial1 = '';
      this.numeroSocio1 = '';
      this.ficha.obrasSociales[0] = { nombre: '', numeroSocio: '' };
    } else if (index === 2) {
      this.obraSocialSeleccionada2 = '';
      this.otraObraSocial2 = '';
      this.numeroSocio2 = '';
      this.ficha.obrasSociales[1] = { nombre: '', numeroSocio: '' };
      this.mostrarSegundaObra = false;
    }
  }
}