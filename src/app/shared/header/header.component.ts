import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  isHome = false; // indica si el usuario está en la página de inicio o no

  constructor(private router: Router) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {//se evalúa si la URL actual del router es '/' (es decir, la página de inicio). Si es así, se asigna true a isHome; de lo contrario, se asigna false.
        this.isHome = this.router.url === '/';  //Si es así, se asigna true a isHome
      } 
    });
  }

  /*ngOnInit() {
    return this.router.url === '/' || this.router.url === '';
  }*/
}
