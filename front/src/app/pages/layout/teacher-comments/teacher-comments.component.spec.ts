import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeacherCommentsComponent } from './teacher-comments.component';

describe('TeacherCommentsComponent', () => {
  let component: TeacherCommentsComponent;
  let fixture: ComponentFixture<TeacherCommentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TeacherCommentsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TeacherCommentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
