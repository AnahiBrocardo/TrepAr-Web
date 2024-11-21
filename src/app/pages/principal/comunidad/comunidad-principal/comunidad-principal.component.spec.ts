import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComunidadPrincipalComponent } from './comunidad-principal.component';

describe('ComunidadPrincipalComponent', () => {
  let component: ComunidadPrincipalComponent;
  let fixture: ComponentFixture<ComunidadPrincipalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComunidadPrincipalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ComunidadPrincipalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
