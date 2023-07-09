import { Component, Input, Output, EventEmitter, OnInit, OnChanges } from '@angular/core';
import { FormBuilder,  FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { LocationService, PersonService, LocationDto, MealPlanDto, MealPlanLocationDto, PersonDto } from 'src/libs/api-client';

@Component({
  selector: 'app-meal-plan-entry-editor',
  templateUrl: './meal-plan-entry-editor.component.html',
  styleUrls: ['./meal-plan-entry-editor.component.css']
})
export class MealPlanEntryEditorComponent implements OnInit, OnChanges {
  @Output() close = new EventEmitter<null>();
  @Input() entry?: MealPlanDto;

  formGroup: FormGroup = null!;
  
  locations$: Observable<LocationDto[]> = null!;
  people$: Observable<PersonDto[]> = null!;

  constructor(private builder: FormBuilder, private locationService: LocationService, private personService: PersonService) {
  }

  ngOnInit(): void {
    this.locations$ = this.locationService.apiLocationGet();
    this.people$ = this.personService.apiPersonGet();

    this.formGroup = this.builder.group({
      locationId: ['', Validators.required]
    });    
  }

  ngOnChanges(): void {
    this.resetForm();
  }

  resetForm(): void {
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
