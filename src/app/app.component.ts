

import { filter } from 'rxjs/operators';
import { Component, OnInit } from '@angular/core';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { HeaderComponent } from './shared/header/header.component';
import { FooterComponent } from "./shared/footer/footer.component";
import { LoginComponent } from './auth/login/login.component';
import { CommonModule } from '@angular/common';
import { LandingPageComponent } from "./pages/landing-page/landing-page.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterModule, HeaderComponent, FooterComponent, CommonModule, LoginComponent, LandingPageComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit{
  isDashboard = false;

  constructor(private router: Router) {}

  ngOnInit(): void {
    // Escucha cambios de ruta
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        // Verifica si la URL actual es el dashboard
        this.isDashboard = event.urlAfterRedirects.startsWith('/dashboard');
      }
    });
  }
}
