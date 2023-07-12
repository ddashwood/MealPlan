import { AfterViewInit, Component, ElementRef, Input, ViewChild } from '@angular/core';
import { MealPlanDto } from 'src/libs/api-client';
import { Tooltip } from 'bootstrap';

@Component({
  selector: 'meal-plan-entry',
  templateUrl: './meal-plan-entry.component.html',
  styleUrls: ['./meal-plan-entry.component.css']
})
export class MealPlanEntryComponent implements AfterViewInit {
  @Input() entry!: MealPlanDto;
  @ViewChild('entryContainer') container:ElementRef = null!;

  ngAfterViewInit(): void {
    var tooltipTriggerList = [].slice.call(this.container.nativeElement.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function (tooltipTriggerEl) {
      return new Tooltip(tooltipTriggerEl);
    });
  }
}
