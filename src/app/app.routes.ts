import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { RegisterComponent } from './auth/register/register.component';

export const routes: Routes = [
    { path: '', component: DashboardComponent },
    {path: 'acceso', component: LoginComponent},
    {path: 'registrarse', component: RegisterComponent}
];
