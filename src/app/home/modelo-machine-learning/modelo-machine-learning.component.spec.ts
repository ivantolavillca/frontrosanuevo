import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModeloMachineLearningComponent } from './modelo-machine-learning.component';

describe('ModeloMachineLearningComponent', () => {
  let component: ModeloMachineLearningComponent;
  let fixture: ComponentFixture<ModeloMachineLearningComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModeloMachineLearningComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ModeloMachineLearningComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
