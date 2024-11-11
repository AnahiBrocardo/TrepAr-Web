import { Component } from '@angular/core';
import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { PrincipalComponent } from './pages/principal/principal.component';
import { ProductoComponent } from './pages/Producto/producto/producto.component';
import { SimuladorComponent } from './pages/simulador/simulador.component';
import { SettingsComponent } from './pages/settings/settings.component';
import { LandingPageComponent } from './pages/landing-page/landing-page.component';
import { InicioSesionPageComponent } from './pages/auth/inicio-sesion-page/inicio-sesion-page.component';
import { RegistrarsePageComponent } from './pages/auth/registrarse-page/registrarse-page.component';
import { loginGuard, logoutGuard } from './guard/auth.guard';

export const routes: Routes = [
   { path: '', component: LandingPageComponent, canActivate: [logoutGuard]},
    {path: 'acceso', component: InicioSesionPageComponent, canActivate: [logoutGuard]},
    {path: 'registrarse', component: RegistrarsePageComponent, canActivate: [logoutGuard]},
    {
        path: 'dashboard/:id', 
        component: DashboardComponent,
        children: [
            {path: 'principal', component: PrincipalComponent, canActivate: [loginGuard]},
            {path: 'producto/:id', component: ProductoComponent, canActivate: [loginGuard]},
            {path: 'simulador/:id', component: SimuladorComponent, canActivate: [loginGuard]},
            {path: 'settings/:id', component: SettingsComponent, canActivate: [loginGuard]}
        ],
        canActivate: [loginGuard]
    }, 
   {path: '**', redirectTo: '', pathMatch: 'full'} //si pone cualquier otra cosa lo redirige a vacio '', osea a la landing
];

