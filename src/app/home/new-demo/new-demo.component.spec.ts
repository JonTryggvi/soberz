import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewDemoComponent } from './new-demo.component';

describe('NewDemoComponent', () => {
  let component: NewDemoComponent;
  let fixture: ComponentFixture<NewDemoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewDemoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewDemoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
