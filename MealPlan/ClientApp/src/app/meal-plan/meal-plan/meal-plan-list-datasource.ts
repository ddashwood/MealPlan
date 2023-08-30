import { Injectable } from "@angular/core";
import { MealPlanDto, MealPlanService, MealPlanUpdateDto } from "../../../libs/api-client";
import { BehaviorSubject, Subject, exhaustMap } from "rxjs";
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Injectable()
export class MealPlanListDatasource {
  data$ = new BehaviorSubject<MealPlanDto[]>([]);

  private fetchNextPage$ = new Subject<void>();

  private startDate: Date;
  private endDate: Date;

  constructor(private mealPlanService: MealPlanService) {
    this.startDate = new Date();
    this.endDate = this.addDays(this.startDate, 60);

    // Update `data$` BehaviorSubject whenever fetchNextPage emits.
    // Ignore subsequent fetch events if the current fetch hasn't finished processing. This might be undesired.
    // Change to a `mergeMap` if needed.
    this.fetchNextPage$.pipe(
      exhaustMap(() => {
        let newStartDate = this.addDays(this.endDate, 1);
        this.endDate = this.addDays(this.endDate, 7);

        console.log(`Scrolling from ${newStartDate} to ${this.endDate}`);

        return this.mealPlanService.apiMealPlanGet(this.dateToString(newStartDate), this.dateToString(this.endDate));
      }),
      // My first time using this operator. It's awesome for cleaning up subscriptions on destroy!
      takeUntilDestroyed(),
    ).subscribe(data => this.data$.next([...this.data$.value, ...data]));
  }

  fetchNextPage() {
    this.fetchNextPage$.next();
  }

  refresh() {
    this.mealPlanService.apiMealPlanGet(this.dateToString(this.startDate), this.dateToString(this.endDate))
      .pipe(takeUntilDestroyed())
      .subscribe(data => this.data$.next(data));
  }

  updateItem(entry: MealPlanUpdateDto) {
    let existingIndex = this.data$.getValue().findIndex(e => e.date === entry.date);

    if (existingIndex === -1) {
      // Should probably try to insert at the correct position, but since this ought to
      // never happen, it can stay as it is for now
      this.data$.next([...this.data$.value, entry]);
    } else {
      // Mutation isn't a good idea, but it'll probably work since components aren't using OnPush Change Detection.
      this.data$.value[existingIndex] = entry;
    }
  }

  private addDays(date: Date, days: number) {
    var result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  }

  private dateToString(date: Date): string {
    return date.toISOString().split('T')[0];
  }
}
