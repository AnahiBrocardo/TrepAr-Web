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
  // se llama al metodo para actualizar las rutas una vez que el idUser esté definido
  if (this.idUser) {
    this.updateRoutes(this.idUser);
  }
  }


  isLeftSidebarCollapsed = input.required<boolean>();
  changeIsLeftSidebarCollapsed = output<boolean>();

  items = [
    {
      routeLink: 'principal/:id',
      icon: 'fal fa-home',
      label: 'Principal',
    },
        {
      routeLink: 'simulador/:id',
      icon: 'fal fa-file',
      label: 'Simulador',
    },
    {
      routeLink: 'settings/:id',
      icon: 'fal fa-cog',
      label: 'Settings',
    },
    {
      routeLink: 'perfil/:id',
      icon: 'fal fa-cog',
      label: 'Perfil',
    },
    
  ];

  

  // Método para actualizar las rutas con el idUser
  updateRoutes(id:string): void {
    this.items[0].routeLink = `principal/${id}`;
    this.items[1].routeLink = `simulador/${id}`;
    this.items[2].routeLink = `settings/${id}`;
    this.items[3].routeLink = `perfil/${id}`;
  }

  toggleCollapse(): void {
    this.changeIsLeftSidebarCollapsed.emit(!this.isLeftSidebarCollapsed());
  }

  closeSidenav(): void {
    this.changeIsLeftSidebarCollapsed.emit(true);
  }

  redirigir(){
    localStorage.removeItem('token'); //se elimina el token del usuario 
    this.router.navigate(['/']).then(() => {//navega a la página de inicio
      window.location.reload();//Refresca la página completamente 
    });
  }
  

}
