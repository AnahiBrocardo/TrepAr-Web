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
import { PerfilComunidadComponent } from './pages/principal/perfil-comunidad/perfil-comunidad/perfil-comunidad.component';
import { PreguntasFrecuentesComponent } from './pages/ayuda/preguntas-frecuentes/preguntas-frecuentes.component';
import { ChatInternoComponent } from './pages/chat/chat-interno/chat-interno.component';
import { InicioComponent } from './pages/inicio/inicio/inicio.component';

export const routes: Routes = [
   { path: '', component: LandingPageComponent,canActivate:[logOutGuard]},
    {path: 'acceso', component: InicioSesionPageComponent, canActivate:[logOutGuard]},
    {path: 'registrarse', component: RegistrarsePageComponent,canActivate:[logOutGuard]},
    {
        path: 'dashboard', 
        component: DashboardComponent,
        children: [
            {
            path: '', // Esta ruta se activará por defecto al ingresar al dashboard
            component: InicioComponent, // El componente que quieres que se muestre por defecto
            },
            {
                path: 'comunidad',
                loadComponent:()=>import('./pages/principal/principal.page/principal.component').then(c=> c.PrincipalComponent)
              },
              {
                path: 'comunidad/perfil',
                component: PerfilComunidadComponent
              },
            {path: 'simulador', component: SimuladorComponent},
            {path: 'settings', component: SettingsComponent},
            { path: 'simulador/listar-simulador', component: ListarSimuladorComponent },
            { path: 'agregar-simulador', component: AgregarSimuladorComponent},
            {path: 'perfil', component: PerfilUsuarioComponent},
            {path: 'preguntas-frecuentes', component:PreguntasFrecuentesComponent},
            {path: 'chat', component:ChatInternoComponent},
            {path: 'inicio', loadComponent:()=>import('./pages/inicio/inicio/inicio.component').then(c=> c.InicioComponent)}
        ],
        canActivate:[loginGuard] //si estoy loggeado puedo acceder a esta ruta

    }, 
   
   {path: '**', redirectTo: '', pathMatch: 'full'} //si pone cualquier otra cosa lo redirige a vacio '', osea a la landing
];

