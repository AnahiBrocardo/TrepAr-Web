import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-simulador',
  standalone: true,
  imports: [],
  templateUrl: './simulador.component.html',
  styleUrl: './simulador.component.css'
})
export class SimuladorComponent implements OnInit{
  activated= inject(ActivatedRoute);
  userId: string='';

  ngOnInit(): void {
   this.activated.paramMap.subscribe({
    next:(param)=>{
      const id= param.get('id');
      if(id){
        this.userId=id;
      }
    }
   })
  }


}
