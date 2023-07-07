import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-meal-plan-entry-editor',
  templateUrl: './meal-plan-entry-editor.component.html',
  styleUrls: ['./meal-plan-entry-editor.component.css']
})
export class MealPlanEntryEditorComponent {
  @Output() close = new EventEmitter<null>();

  public onClose() {
    this.close.emit();
  }
}
