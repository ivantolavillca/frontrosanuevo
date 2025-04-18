import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DatosPersonasComponent } from './datos-personas.component';

describe('DatosPersonasComponent', () => {
  let component: DatosPersonasComponent;
  let fixture: ComponentFixture<DatosPersonasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DatosPersonasComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DatosPersonasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
