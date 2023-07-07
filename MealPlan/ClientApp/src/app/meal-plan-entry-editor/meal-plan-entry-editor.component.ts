import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { MealPlanDto } from 'src/libs/api-client';

@Component({
  selector: 'app-meal-plan-entry-editor',
  templateUrl: './meal-plan-entry-editor.component.html',
  styleUrls: ['./meal-plan-entry-editor.component.css']
})
export class MealPlanEntryEditorComponent implements OnInit {
  @Output() close = new EventEmitter<null>();
  @Input() entry?: MealPlanDto;

  ngOnInit(): void {
    if (!this.entry) {
      this.entry = <MealPlanDto> { };
    }
  }

  public onClose() {
    this.close.emit();
  }
}
