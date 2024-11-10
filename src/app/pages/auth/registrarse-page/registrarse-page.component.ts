import { Component } from '@angular/core';
import { HeaderComponent } from '../../../shared/header/header.component';
import { RegisterComponent } from '../../../auth/register/register.component';

@Component({
  selector: 'app-registrarse-page',
  standalone: true,
  imports: [RegisterComponent],
  templateUrl: './registrarse-page.component.html',
  styleUrl: './registrarse-page.component.css'
})
export class RegistrarsePageComponent {

}
