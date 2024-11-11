import { Component, OnInit } from '@angular/core';
import { ListarSimuladorComponent } from '../../componentes/simulador/funciones/listar-simulador/listar-simulador.component';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-simulador',
  standalone: true,
  imports: [ListarSimuladorComponent],
  templateUrl: './simulador.component.html',
  styleUrl: './simulador.component.css'
})
export class SimuladorComponent implements OnInit{
  idUser: string = ''; 
  constructor(private route: ActivatedRoute, private router: Router) {} 
  
  ngOnInit(): void { // Obtener el idUser del parámetro de ruta 
    this.idUser = this.route.snapshot.paramMap.get('id') || '';}
  
   // Método para navegar a ListarSimuladorComponent 
   navigateToListarSimulador(): void { 
    if (this.idUser) { this.router.navigate([`/listar-simulador/${this.idUser}`]); } } 
}
