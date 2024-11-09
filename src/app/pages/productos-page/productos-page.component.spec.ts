import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductosPageComponent } from './productos-page.component';

describe('ProductosPageComponent', () => {
  let component: ProductosPageComponent;
  let fixture: ComponentFixture<ProductosPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductosPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductosPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
