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
      routeLink: 'principal',
      icon: 'fal fa-home',
      label: 'Principal',
    },
        {
      routeLink: 'simulador/:id',
      icon: 'fal fa-file',
      label: 'Simulador',
    },
    {
      routeLink: `producto/:id`,
      icon: 'fal fa-box-open',
      label: 'Producto',
    },
    {
      routeLink: 'settings/:id',
      icon: 'fal fa-cog',
      label: 'Settings',
    },
  ];

  

  // Método para actualizar las rutas con el idUser
  updateRoutes(id:string): void {
    console.log('en funcion update');
    this.items[2].routeLink = `producto/${id}`; // Rutas dependientes de idUser
    this.items[1].routeLink = `simulador/${id}`;
    this.items[3].routeLink = `settings/${id}`;
  }

  toggleCollapse(): void {
    this.changeIsLeftSidebarCollapsed.emit(!this.isLeftSidebarCollapsed());
  }

  closeSidenav(): void {
    this.changeIsLeftSidebarCollapsed.emit(true);
  }
  redirigir(){
    this.router.navigate(['/']); //se redirige
  }
  

}
