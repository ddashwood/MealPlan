/**
 * Meal Plan - Security Microservice
 * No description provided (generated by Openapi Generator https://github.com/openapitools/openapi-generator)
 *
 * The version of the OpenAPI document: v1
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */


export interface MealPlanUpdateDto { 
    date?: string;
    mealDescription?: string | null;
    locationId?: string;
    peopleIds?: Array<string> | null;
}
