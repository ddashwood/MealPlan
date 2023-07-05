import { Component, Input, OnInit } from '@angular/core';
import { MealPlanDto } from 'src/libs/api-client';
declare var $:any;

@Component({
  selector: 'app-meal-plan-entry',
  templateUrl: './meal-plan-entry.component.html',
  styleUrls: ['./meal-plan-entry.component.css']
})
export class MealPlanEntryComponent implements OnInit {
  @Input() entry!: MealPlanDto;

  ngOnInit(): void {
    $(document).ready(function() {
      $('[data-toggle="tooltip"]').tooltip();
    });
  }
}
