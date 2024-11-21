import { Perfil } from './Interfaces/perfil.interface';
import { Component } from '@angular/core';
import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { SimuladorComponent } from './pages/simulador/simulador.component';
import { SettingsComponent } from './pages/settings/settings.component';
import { LandingPageComponent } from './pages/landing-page/landing-page.component';
import { InicioSesionPageComponent } from './pages/auth/inicio-sesion-page/inicio-sesion-page.component';
import { RegistrarsePageComponent } from './pages/auth/registrarse-page/registrarse-page.component';

import { loginGuard } from './guards/auth.guards';
import { logOutGuard } from './guards/auth.guards.logOut';
import { AgregarSimuladorComponent } from './componentes/simulador/funciones/agregar-simulador/agregar-simulador.component';
import { ListarSimuladorComponent } from './componentes/simulador/funciones/listar-simulador/listar-simulador.component';
import { PerfilUsuarioComponent } from './pages/perfil/perfil-usuario/perfil-usuario.component';
import { PrincipalComponent } from './pages/principal/principal.page/principal.component';



export const routes: Routes = [
   { path: '', component: LandingPageComponent,canActivate:[logOutGuard]},
    {path: 'acceso', component: InicioSesionPageComponent, canActivate:[logOutGuard]},
    {path: 'registrarse', component: RegistrarsePageComponent,canActivate:[logOutGuard]},
    {
        path: 'dashboard/:id', 
        component: DashboardComponent,
        children: [
            {path: 'principal/:id', component: PrincipalComponent, canActivate:[loginGuard]},
            {path: 'simulador/:id', component: SimuladorComponent,canActivate:[loginGuard] },
            {path: 'settings/:id', component: SettingsComponent,canActivate:[loginGuard]},
            { path: 'simulador/listar-simulador/:id', component: ListarSimuladorComponent, canActivate:[loginGuard] },
            { path: 'agregar-simulador/:id', component: AgregarSimuladorComponent,canActivate:[loginGuard] },
            {path: 'perfil/:id', component: PerfilUsuarioComponent,canActivate:[loginGuard]},
        ],
        canActivate:[loginGuard] //si estoy loggeado puedo acceder a esta ruta

    }, 
   {path: '**', redirectTo: '', pathMatch: 'full'} //si pone cualquier otra cosa lo redirige a vacio '', osea a la landing
];

