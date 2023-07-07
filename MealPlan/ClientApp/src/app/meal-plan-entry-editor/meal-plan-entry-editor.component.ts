import { Component, Input, Output, EventEmitter, OnInit, OnChanges } from '@angular/core';
import { Observable } from 'rxjs';
import { LocationDto, LocationService, MealPlanDto, MealPlanLocationDto } from 'src/libs/api-client';

@Component({
  selector: 'app-meal-plan-entry-editor',
  templateUrl: './meal-plan-entry-editor.component.html',
  styleUrls: ['./meal-plan-entry-editor.component.css']
})
export class MealPlanEntryEditorComponent implements OnInit, OnChanges {
  @Output() close = new EventEmitter<null>();
  @Input() entry?: MealPlanDto;
  
  locations$: Observable<LocationDto[]> = null!;

  constructor(private locationService: LocationService) {
  }

  ngOnInit(): void {
    this.locations$ = this.locationService.apiLocationGet();
  }

  ngOnChanges(): void {
    if (!this.entry) {
      this.entry = <MealPlanDto> { };
    }
    if (!this.entry.location) {
      this.entry.location = <MealPlanLocationDto> { };
    }
    if (!this.entry.people) {
      this.entry.people = [];
    }      
  }

  public onClose() {
    this.close.emit();
  }
}
