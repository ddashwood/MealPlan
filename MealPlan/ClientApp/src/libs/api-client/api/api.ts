export * from './identity.service';
import { IdentityService } from './identity.service';
export * from './location.service';
import { LocationService } from './location.service';
export * from './mealPlan.service';
import { MealPlanService } from './mealPlan.service';
export * from './person.service';
import { PersonService } from './person.service';
export const APIS = [IdentityService, LocationService, MealPlanService, PersonService];
