import { Component } from '@angular/core';
import { GreetingsServiceService } from '../greetings-service.service';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-my-module',
  templateUrl: './my-module.component.html',
  styleUrl: './my-module.component.css'
})
export class MyModuleComponent {
  inputError: string = ""
  name = new FormControl('')
  formEnabled = true
  serverResponse = ""
  dialogTitle = ""
  dialogEnabled = false
  isServerResponseError = false
  focusOn = "send"

  constructor(private greetingsService: GreetingsServiceService) {}

  public closeDialog() {
    this.dialogEnabled = false
    this.dialogTitle = ""
    this.serverResponse = ""
    this.formEnabled = true
    this.name.enable()
    this.focusOn = "send"
  }

  public sendNameToServer(): void {
    // run on enter in input
    this.inputError = ""
    const formName = this.name.value
    if (!this.isValidName(formName)) {
      this.inputError = "Please enter at least four characters"
      return
    }

    this.formEnabled = false
    this.name.disable()
    this.dialogEnabled = true
    this.greetingsService.greet(formName!).subscribe({
      next: (value) => {
        this.dialogTitle = "Backend call - Success"
        this.isServerResponseError = false
        // center on dialog
        this.focusOn = "close"
        this.serverResponse = value
      },
      error: (value) => {
        this.dialogTitle = "Backend call - Failure"
        this.isServerResponseError = true
        // center on dialog
        this.focusOn = "close"
        this.serverResponse = value
      }
    })
  }

  private isValidName(name: string | null): boolean {
    if (name === null) {
      return false
    }
    return name.length > 3
  }
}
