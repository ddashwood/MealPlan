import { outputAst } from '@angular/compiler';
import { Component, Input, Output, EventEmitter, OnInit, OnChanges } from '@angular/core';
import { FormArray, FormBuilder,  FormControl,  FormGroup, Validators } from '@angular/forms';
import { Observable, tap } from 'rxjs';
import { LocationService, PersonService, LocationDto, MealPlanDto, MealPlanLocationDto, PersonDto, MealPlanUpdateDto } from 'src/libs/api-client';

@Component({
  selector: 'meal-plan-entry-editor',
  templateUrl: './meal-plan-entry-editor.component.html',
  styleUrls: ['./meal-plan-entry-editor.component.css']
})
export class MealPlanEntryEditorComponent implements OnInit, OnChanges {
  @Output() close = new EventEmitter<null>();
  @Output() save = new EventEmitter<MealPlanUpdateDto>();
  @Input() entry?: MealPlanDto;

  formGroup: FormGroup;
  
  locations$: Observable<LocationDto[]> = null!;
  people:PersonDto[] = null!;

  constructor(builder: FormBuilder, private locationService: LocationService, private personService: PersonService) {
    this.formGroup = builder.group({
      locationId: ['', Validators.required],
      description: '',
      delivery: false,
      otherPeople: '',
      notes: '',
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
      locationId: this.entry?.location?.id,
      description: this.entry?.mealDescription,
      delivery: this.entry?.delivery,
      otherPeople: this.entry?.otherPeople,
      notes: this.entry?.notes
    });
    if (this.people) {
      for (let i = 0; i < this.people.length; i++) {
        let person = this.people[i];
        let control = (this.formGroup.controls['people'] as FormArray).controls[i];
        let value = this.entry.isNew ? 
              this.people[i].isDefault :
              this.entry.people?.some(p => p.id === person.id);
        control.setValue(value);
      }
    }
  }

  public onClose() {
    this.close.emit();
  }

  public onSubmit() {
    if (!this.formGroup.valid) {
      return;
    }

    var dto = <MealPlanUpdateDto> {
      date: this.entry?.date,
      mealDescription: this.formGroup.value["description"],
      locationId: this.formGroup.value["locationId"],
      delivery: this.formGroup.value["delivery"],
      otherPeople: this.formGroup.value["otherPeople"],
      notes: this.formGroup.value["notes"],
      peopleIds: []
    };
    if(this.people) {
      for (let i = 0; i < this.people.length; i++) {
        if (this.getPersonControls().value[i]) {
          dto.peopleIds?.push(this.people[i].id ?? "");
        }
      }
    }
    this.save.emit(dto);
    this.close.emit();
  }

  getPersonControls() : FormArray {
    return this.formGroup.controls['people'] as FormArray;
  }
}
