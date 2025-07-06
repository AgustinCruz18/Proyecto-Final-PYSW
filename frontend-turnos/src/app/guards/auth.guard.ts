// src/app/guards/auth.guard.ts
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    const token = localStorage.getItem('token');

    if (!token) {
      this.router.navigate(['/login']);
      return false;
    }

    // Opcional: validar rol
    const rolesPermitidos = route.data['roles'] as string[] | undefined;
    if (rolesPermitidos) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        if (!rolesPermitidos.includes(payload.rol)) {
          this.router.navigate(['/login']); // O una ruta "no autorizado"
          return false;
        }
      } catch {
        this.router.navigate(['/login']);
        return false;
      }
    }

    return true;
  }
}
