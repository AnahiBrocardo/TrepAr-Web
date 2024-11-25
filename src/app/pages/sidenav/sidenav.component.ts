import { CommonModule } from '@angular/common';
import { Component, inject, Input, input, OnInit, output } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-sidenav',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './sidenav.component.html',
  styleUrl: './sidenav.component.css'
})
export class SidenavComponent implements OnInit{
  @Input()  //recibo el id del dashboard
  idUser: string ='';
  router= inject(Router);
  
  ngOnInit(): void {
  }


  isLeftSidebarCollapsed = input.required<boolean>();
  changeIsLeftSidebarCollapsed = output<boolean>();

  items = [
    {
      routeLink: 'inicio',
      icon: 'fal fa-house',
      label: 'Inicio',
    },
    {
      routeLink: 'comunidad',
      icon: 'fal fa-user-group',
      label: 'Comunidad',
    },
        {
      routeLink: 'simulador',
      icon: 'fal fa-file',
      label: 'Simulador',
    },
    {
      routeLink: 'settings',
      icon: 'fal fa-cog',
      label: 'Configuracion',
    },
    {
      routeLink: 'perfil',
      icon: 'fal fa-user',
      label: 'Perfil',
    },
    {
      routeLink: 'chat',
      icon: 'fal fa-comments',
      label: 'Chat',
    },
    {
      routeLink: 'preguntas-frecuentes',
      icon: 'fal fa-circle-question',
      label: 'Ayuda',
    }
  ];


  toggleCollapse(): void {
    this.changeIsLeftSidebarCollapsed.emit(!this.isLeftSidebarCollapsed());
  }

  closeSidenav(): void {
    this.changeIsLeftSidebarCollapsed.emit(true);
  }

  redirigir(){
    localStorage.removeItem('userId'); //se elimina el token del idusuario 
    localStorage.removeItem('token'); //se elimina el token del usuario 
    this.router.navigate(['/']).then(() => {//navega a la página de inicio
      window.location.reload();//Refresca la página completamente 
    });
  }
  

}
