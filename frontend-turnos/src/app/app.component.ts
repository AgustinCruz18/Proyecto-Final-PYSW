import { Component, OnInit, computed } from '@angular/core';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { AuthService } from './services/auth.service';
import { HeaderComponent } from './components/header/header.component';
import { CommonModule } from '@angular/common';
import { FooterComponent } from './components/footer/footer.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, HeaderComponent, FooterComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'frontend-turnos';
  currentUrl = '';

  constructor(
    private route: ActivatedRoute,
    private auth: AuthService,
    private router: Router
  ) { }


  ngOnInit() {
    this.router.events.subscribe(() => {
      this.currentUrl = this.router.url;
    });

    this.route.queryParams.subscribe(params => {
      const token = params['token'];
      if (token) {
        this.auth.setToken(token);
        const rol = this.auth.getRoleFromToken();
        const id = this.auth.getUserIdFromToken(); // <-- importante

        if (rol === 'administrador') {
          this.router.navigate(['/admin']);
        } else if (rol === 'secretaria') {
          this.router.navigate(['/secretaria']);
        } else if (rol === 'paciente') {
          this.router.navigate([`/paciente/${id}`]);
        }
      }
    });
  }

  /*showHeader(): boolean {
    const sinHeader = ['/login', '/registro'];
    return !sinHeader.includes(this.currentUrl) && !!this.auth.getToken();
  }*/
  showHeader(): boolean {
    const sinHeader = ['/login', '/registro', '/portada'];

    // Detecta bien si alguna de las rutas coincide, incluso si hay parámetros
    return !sinHeader.some(ruta => this.currentUrl.startsWith(ruta)) && !!this.auth.getToken();
  }

  showFooter(): boolean {
    const sinFooter = ['/login', '/registro', '/portada'];
    return !sinFooter.some(ruta => this.currentUrl.startsWith(ruta)) && !!this.auth.getToken();
  }
}