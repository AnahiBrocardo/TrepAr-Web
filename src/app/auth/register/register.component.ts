import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
 // Se definen las categorías como un array de strings
 categorias: string[] = [
  'Tecnología',
  'Salud y bienestar',
  'Manualidades',
  'Construccion',
  'Moda'
];
}
