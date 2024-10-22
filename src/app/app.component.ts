import { Component } from '@angular/core';
import { RouterLink, RouterModule, RouterOutlet } from '@angular/router';
import { HeaderComponent } from './shared/header/header.component';
import { DashboardComponent } from "./pages/dashboard/dashboard.component";
import { FooterComponent } from "./shared/footer/footer.component";
import { LoginComponent } from './auth/login/login.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, HeaderComponent, DashboardComponent, FooterComponent, LoginComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
}
