import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-producto',
  standalone: true,
  imports: [],
  templateUrl: './producto.component.html',
  styleUrl: './producto.component.css'
})
export class ProductoComponent implements OnInit{
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
