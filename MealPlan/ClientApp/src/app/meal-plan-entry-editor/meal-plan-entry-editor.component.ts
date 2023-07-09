import { Component, Input, Output, EventEmitter, OnInit, OnChanges } from '@angular/core';
import { FormArray, FormBuilder,  FormControl,  FormGroup, Validators } from '@angular/forms';
import { Observable, tap } from 'rxjs';
import { LocationService, PersonService, LocationDto, MealPlanDto, MealPlanLocationDto, PersonDto } from 'src/libs/api-client';

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
  people:PersonDto[] = null!;

  constructor(builder: FormBuilder, private locationService: LocationService, private personService: PersonService) {
    this.formGroup = builder.group({
      locationId: ['', Validators.required],
      people: builder.array([])
    });
  }

  ngOnInit(): void {
    this.locations$ = this.locationService.apiLocationGet();
    this.personService.apiPersonGet().pipe(
      tap({
        next: people => {
          let peopleControls = this.formGroup.controls['people'] as FormArray;
          for (let person of people) {
            peopleControls.push(new FormControl())
          }
        }
      })
    ).subscribe(p => this.people = p);
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
    if (this.people) {
      for (let i = 0; i < this.people.length; i++) {
        let person = this.people[i];
        let control = (this.formGroup.controls['people'] as FormArray).controls[i];
        control.setValue(this.entry.people?.some(p => p.id === person.id));
      }
    }
  }

  public onClose() {
    this.close.emit();
  }

  public onSubmit() {
    console.log('Valid: ', this.formGroup.valid);
    console.log('Saving');
  }

  getPersonControls() : FormArray {
    return this.formGroup.controls['people'] as FormArray;
  }
}
