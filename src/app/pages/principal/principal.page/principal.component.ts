
import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ComunidadPrincipalComponent } from '../comunidad/comunidad-principal/comunidad-principal.component';

@Component({
  selector: 'app-principal',
  standalone: true,
  imports: [ComunidadPrincipalComponent, RouterModule],
  templateUrl: './principal.component.html',
  styleUrl: './principal.component.css'
})
export class PrincipalComponent implements OnInit{
 userId?:string;
 activated= inject(ActivatedRoute);

  ngOnInit(): void {
    this.userId = localStorage.getItem('userId') || '';
  }


  

}
