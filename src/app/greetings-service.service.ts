import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GreetingsServiceService {

  serverErrorMessage = "An error occurred while "
  + "attempting to contact the server. Please check your network "
  + "connection and try again."

  constructor() { }

  public greet(input: string): Observable<string> {
    console.log(input)
    if (!this.isValidName(input)) {
      return throwError(this.serverErrorMessage)
    }

    return of(`Hello, ${input}!`)
  }

  private isValidName(name: string): boolean {
    if (name === null) {
      return false
    }
    return name.length > 3
  }
}