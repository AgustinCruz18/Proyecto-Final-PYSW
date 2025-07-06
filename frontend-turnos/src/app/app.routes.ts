import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { DashboardAdminComponent } from './components/dashboard-admin/dashboard-admin.component';
import { DashboardSecretariaComponent } from './components/dashboard-secretaria/dashboard-secretaria.component';
import { DashboardPacienteComponent } from './components/dashboard-paciente/dashboard-paciente.component';
import { RegistroComponent } from './components/registro/registro.component';
import { PortadaComponent } from './components/portada/portada.component';
import { DatosPersonalesComponent } from './components/datos-personales/datos-personales.component';
import { DetallePacienteComponent } from './detalle-paciente/detalle-paciente.component';
import { PagoEstatusComponent } from './components/pago-estatus/pago-estatus.component';


export const routes: Routes = [
    { path: '', redirectTo: 'portada', pathMatch: 'full' },
    { path: 'portada', component: PortadaComponent }, // Ruta por defecto
    { path: 'login', component: LoginComponent },
    { path: 'registro', component: RegistroComponent },
    { path: 'admin', component: DashboardAdminComponent },
    { path: 'secretaria', component: DashboardSecretariaComponent },
    { path: 'paciente/:id', component: DashboardPacienteComponent },
    { path: 'detalle-paciente/:id', component: DetallePacienteComponent },
    { path: 'datos-personales/:id', component: DatosPersonalesComponent },
    { path: 'secretaria', component: DashboardSecretariaComponent },
    { path: '**', redirectTo: 'portada' },
    { path: 'pago/estatus', component: PagoEstatusComponent },

];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }