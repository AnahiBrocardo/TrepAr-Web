import { Component } from '@angular/core';
import { HeaderComponent } from '../../../shared/header/header.component';
import { LoginComponent } from '../../../auth/login/login.component';

@Component({
  selector: 'app-inicio-sesion-page',
  standalone: true,
  imports: [LoginComponent],
  templateUrl: './inicio-sesion-page.component.html',
  styleUrl: './inicio-sesion-page.component.css'
})
export class InicioSesionPageComponent {

}
