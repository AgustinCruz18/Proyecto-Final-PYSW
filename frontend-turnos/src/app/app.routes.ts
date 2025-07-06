import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { DashboardAdminComponent } from './components/dashboard-admin/dashboard-admin.component';
import { DashboardSecretariaComponent } from './components/dashboard-secretaria/dashboard-secretaria.component';
import { DashboardPacienteComponent } from './components/dashboard-paciente/dashboard-paciente.component';
import { RegistroComponent } from './components/registro/registro.component';
import { PortadaComponent } from './components/portada/portada.component';
import { DatosPersonalesComponent } from './components/datos-personales/datos-personales.component';
import { DetallePacienteComponent } from './components/detalle-paciente/detalle-paciente.component';
import { PagoEstatusComponent } from './components/pago-estatus/pago-estatus.component';
import { AuthGuard } from './guards/auth.guard';
import { DashboardGerenteComponent } from './components/dashboard-gerente/dashboard-gerente.component';

export const routes: Routes = [

    { path: '', redirectTo: 'portada', pathMatch: 'full' },
    { path: 'portada', component: PortadaComponent }, // Ruta por defecto
    { path: 'login', component: LoginComponent },
    { path: 'registro', component: RegistroComponent },
    {
        path: 'admin',
        component: DashboardAdminComponent,
        canActivate: [AuthGuard],
        data: { roles: ['administrador'] }
    },
    {
        path: 'secretaria',
        component: DashboardSecretariaComponent,
        canActivate: [AuthGuard],
        data: { roles: ['secretaria'] }
    },
    {
        path: 'paciente/:id',
        component: DashboardPacienteComponent,
        canActivate: [AuthGuard],
        data: { roles: ['paciente'] }
    },
    {
        path: 'paciente/detalle-paciente/:id',
        component: DetallePacienteComponent,
        canActivate: [AuthGuard],
        data: { roles: ['paciente'] }
    },
    {
        path: 'paciente/datos-personales/:id',
        component: DatosPersonalesComponent,
        canActivate: [AuthGuard],
        data: { roles: ['paciente'] }
    },
    {
        path: 'secretaria',
        component: DashboardSecretariaComponent,
        canActivate: [AuthGuard],
        data: { roles: ['secretaria'] }
    },
    {
        path: 'pago/estatus',
        component: PagoEstatusComponent,
        canActivate: [AuthGuard],
        data: { roles: ['paciente'] }
    },
    {
        path: 'gerente',
        component: DashboardGerenteComponent,
        canActivate: [AuthGuard],
        data: { roles: ['gerente'] }
    },
    { path: '**', redirectTo: 'portada' },


];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }