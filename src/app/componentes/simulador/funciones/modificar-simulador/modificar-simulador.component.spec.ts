import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModificarSimuladorComponent } from './modificar-simulador.component';

describe('ModificarSimuladorComponent', () => {
  let component: ModificarSimuladorComponent;
  let fixture: ComponentFixture<ModificarSimuladorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModificarSimuladorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModificarSimuladorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
