import { Component, Input, Output, EventEmitter, OnInit, OnChanges } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
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

  formGroup: FormGroup;
  
  locations$: Observable<LocationDto[]> = null!;

  constructor(builder: FormBuilder, private locationService: LocationService) {
    this.formGroup = builder.group({
      locationId: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.locations$ = this.locationService.apiLocationGet();
  }

  ngOnChanges(): void {
    // Check we have a suitable model to work with
    if (!this.entry) {
      this.entry = <MealPlanDto> { };
    }
    if (!this.entry.location) {
      this.entry.location = <MealPlanLocationDto> { };
    }
    if (!this.entry.people) {
      this.entry.people = [];
    }

    // Now, set up the form's initial values
    this.formGroup.patchValue({
      locationId: this.entry?.location?.id
    });
  }

  public onClose() {
    this.close.emit();
  }

  public onSubmit() {
    console.log('Valid: ', this.formGroup.valid);
    console.log('Saving');
  }
}
