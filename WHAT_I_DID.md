### Krok 1

Sprawdzić web.xml jakie mamy zarejestrowane usługi

Usługi:
- greetServlet (backend)
  - implementacja com.zesi.server.GreetingServiceImpl
  - mapping /MyModule/greet
- MyModule.html (frontend)

### Krok 2

Sprawdzić co robi GreetingServiceImpl:
- implementuje GreetingService
- rozszerza RemoteServiceServlet (klasa backendowa gwt)
- posiada metodę greetServer(String input)
- adnotacja @RemoteServiceRelativePath("greet")

### Krok 3

Sprawdzić zawartość MyModule.html:
- `<link type="text/css" rel="stylesheet" href="MyModule.css">` -> odnosi się do pliku css
- `<title>Web Application Starter Project</title>` -> ma tytuł
- `<script type="text/javascript" language="javascript" src="MyModule/MyModule.nocache.js"></script>` -> odnosi się do modułu
- Informuje ze javascript ma byc uruchomiony (angular raczej tego wymaga więc można pominąć)
    ```html
    <noscript>
        <div style="width: 22em; position: absolute; left: 50%; margin-left: -11em; color: red; background-color: white; border: 1px solid red; padding: 4px; font-family: sans-serif">
            Your web browser must have JavaScript enabled
            in order for this application to display correctly.
        </div>
    </noscript>```
- ma zawartość
    ```html
    <h1>Web Application Starter Project</h1>

    <table align="center">
        <tr>
            <td colspan="2" style="font-weight:bold;">Please enter your name:</td>
        </tr>
        <tr>
            <td id="nameFieldContainer"></td>
            <td id="sendButtonContainer"></td>
        </tr>
        <tr>
            <td colspan="2" style="color:red;" id="errorLabelContainer"></td>
        </tr>
    </table>
    ```

### Krok 4

Sprawdzenie zawartości pliku ze stylami:
- ma zawartość
```css
/** Add css rules here for your application. */


/** Example rules used by the template application (remove for your app) */
h1 {
  font-size: 2em;
  font-weight: bold;
  color: #777777;
  margin: 40px 0px 70px;
  text-align: center;
}

.sendButton {
  display: block;
  font-size: 16pt;
}

/** Most GWT widgets already have a style name defined */
.gwt-DialogBox {
  width: 400px;
}

.dialogVPanel {
  margin: 5px;
}

.serverResponseLabelError {
  color: red;
}

/** Set ids using widget.getElement().setId("idOfElement") */
#closeButton {
  margin: 15px 6px 6px;
}

```

### Krok 5

Sprawdzenie zawartości modułu MyModule
- implementuje EntryPoint
- ma ustaloną wiadomość SERVER_ERROR
  ```java
  private static final String SERVER_ERROR = "An error occurred while "
      + "attempting to contact the server. Please check your network "
      + "connection and try again.";
  ```
- ma usługę do komunikacji z backendem
  ```java
  private final GreetingServiceAsync greetingService = GWT.create(GreetingService.class);
  ```
- ma zdefiniowane wiadomości
  ```java
  private final Messages messages = GWT.create(Messages.class);
  ```
- ma zdefiniowane zachowanie strony
  ```java
  public void onModuleLoad() {
    final Button sendButton = new Button( messages.sendButton() );
    final TextBox nameField = new TextBox();
    nameField.setText( messages.nameField() );
    final Label errorLabel = new Label();

    // We can add style names to widgets
    sendButton.addStyleName("sendButton");

    // Add the nameField and sendButton to the RootPanel
    // Use RootPanel.get() to get the entire body element
    RootPanel.get("nameFieldContainer").add(nameField);
    RootPanel.get("sendButtonContainer").add(sendButton);
    RootPanel.get("errorLabelContainer").add(errorLabel);

    // Focus the cursor on the name field when the app loads
    nameField.setFocus(true);
    nameField.selectAll();

    // Create the popup dialog box
    final DialogBox dialogBox = new DialogBox();
    dialogBox.setText("Remote Procedure Call");
    dialogBox.setAnimationEnabled(true);
    final Button closeButton = new Button("Close");
    // We can set the id of a widget by accessing its Element
    closeButton.getElement().setId("closeButton");
    final Label textToServerLabel = new Label();
    final HTML serverResponseLabel = new HTML();
    VerticalPanel dialogVPanel = new VerticalPanel();
    dialogVPanel.addStyleName("dialogVPanel");
    dialogVPanel.add(new HTML("<b>Sending name to the server:</b>"));
    dialogVPanel.add(textToServerLabel);
    dialogVPanel.add(new HTML("<br><b>Server replies:</b>"));
    dialogVPanel.add(serverResponseLabel);
    dialogVPanel.setHorizontalAlignment(VerticalPanel.ALIGN_RIGHT);
    dialogVPanel.add(closeButton);
    dialogBox.setWidget(dialogVPanel);

    // Add a handler to close the DialogBox
    closeButton.addClickHandler(new ClickHandler() {
      public void onClick(ClickEvent event) {
        dialogBox.hide();
        sendButton.setEnabled(true);
        sendButton.setFocus(true);
      }
    });

    // Create a handler for the sendButton and nameField
    class MyHandler implements ClickHandler, KeyUpHandler {
      /**
       * Fired when the user clicks on the sendButton.
       */
      public void onClick(ClickEvent event) {
        sendNameToServer();
      }

      /**
       * Fired when the user types in the nameField.
       */
      public void onKeyUp(KeyUpEvent event) {
        if (event.getNativeKeyCode() == KeyCodes.KEY_ENTER) {
          sendNameToServer();
        }
      }

      /**
       * Send the name from the nameField to the server and wait for a response.
       */
      private void sendNameToServer() {
        // First, we validate the input.
        errorLabel.setText("");
        String textToServer = nameField.getText();
        if (!FieldVerifier.isValidName(textToServer)) {
          errorLabel.setText("Please enter at least four characters");
          return;
        }

        // Then, we send the input to the server.
        sendButton.setEnabled(false);
        textToServerLabel.setText(textToServer);
        serverResponseLabel.setText("");
        greetingService.greetServer(textToServer, new AsyncCallback<String>() {
          public void onFailure(Throwable caught) {
            // Show the RPC error message to the user
            dialogBox.setText("Remote Procedure Call - Failure");
            serverResponseLabel.addStyleName("serverResponseLabelError");
            serverResponseLabel.setHTML(SERVER_ERROR);
            dialogBox.center();
            closeButton.setFocus(true);
          }

          public void onSuccess(String result) {
            dialogBox.setText("Remote Procedure Call");
            serverResponseLabel.removeStyleName("serverResponseLabelError");
            serverResponseLabel.setHTML(result);
            dialogBox.center();
            closeButton.setFocus(true);
          }
        });
      }
    }

    // Add a handler to send the name to the server
    MyHandler handler = new MyHandler();
    sendButton.addClickHandler(handler);
    nameField.addKeyUpHandler(handler);
  }
  ```

### Krok 6

Sprawdzenie zdefiniowanych wiadomości

- zawiera zawartość oczekiwaną pola nameField
  ```java
  @DefaultMessage("Enter your name")
  String nameField();
  ```
- zawiera zawartość oczekiwaną pola sendButton
  ```java
  @DefaultMessage("Send")
  String sendButton();
  ```

### Krok 7

Sprawdzenie konfiguracji modułu MyModule w pliku MyModule.gwt.xml

- zawiera entrypoint aplikacji
  ```xml
  <!-- Specify the app entry point class.                         -->
  <entry-point class='com.zesi.client.MyModule' />
  ```
- zawiera odnośnik do stylów gwt
  ```xml
  <!-- Inherit the default GWT style sheet.  You can change       -->
  <!-- the theme of your GWT application by uncommenting          -->
  <!-- any one of the following lines.                            -->
  <inherits name='com.google.gwt.user.theme.standard.Standard' />
  <!-- <inherits name='com.google.gwt.user.theme.chrome.Chrome'/> -->
  <!-- <inherits name='com.google.gwt.user.theme.dark.Dark'/>     -->
  ```

### Krok 8

Nasza konfiguracja:
```bash
node -v
v21.5.0

nvm -v
0.39.7

npm -v
10.2.4

# Dodatkowo wymagany angular-cli!!
```

Stworzenie aplikacji w framework'u Angular
```bash
ng new zesi-angular-proj
# Wybieramy CSS do styli
```

Upewniamy się że aplikacja działa
```bash
ng serve

# Ukazać powinna się nam aplikacja pod adresem localhost:4200
```

### Krok 9

Stworzenie serwisu który powinien wykonywać żądania do aplikacji backendowej. W naszej sytuacji bez aplikacji backendowej będziemy zwracać wartości bezpośrednio z serwisu, aczkolwiek pokażemy jak można wykonywać zapytania do backendu.

```bash
ng generate service greetingsService
```

Uzupełnić greetings-service.service.ts:
```typescript
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
```

# Krok 10

Przygotowujemy konfiguracje projektu

Tworzymy komponent za pomocą komendy
```bash
ng generate component my-module
```

Modyfikujemy komponent:
```typescript
import { Component } from '@angular/core';

@Component({
  selector: 'app-my-module',
  templateUrl: './my-module.component.html',
  styleUrl: './my-module.component.css'
})
export class MyModuleComponent {

}

```

Uzupełniamy app.component.ts:
```typescript
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'zesi-angular-proj'
  constructor() {}
}
```

Modyfikujemy app.component.html:
```html
<div class="container">
  <router-outlet></router-outlet>
</div>
```

Usuwamy pliki:
- app.routes.ts
- app.config.server.ts
- main.server.ts
- server.ts

Tworzymy plik app.module.ts w folderze src/app:
```typescript
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { CommonModule } from '@angular/common';
import { MyModuleComponent } from './my-module/my-module.component';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', component: MyModuleComponent },
];

@NgModule({
  declarations: [
    AppComponent,
    MyModuleComponent
  ],
  imports: [
    RouterModule.forRoot(routes),
    BrowserModule,
    FormsModule,
    HttpClientModule,
    CommonModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
```

Modyfikujemy main.ts:
```typescript
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));
```

Modyfikujemy angular.json:
```json
{
  "$schema": "./node_modules/@angular/cli/lib/config/schema.json",
  "version": 1,
  "newProjectRoot": "projects",
  "projects": {
    "zesi-angular-proj": {
      "projectType": "application",
      "schematics": {},
      "root": "",
      "sourceRoot": "src",
      "prefix": "app",
      "architect": {
        "build": {
          "builder": "@angular-devkit/build-angular:browser",
          "options": {
            "outputPath": "dist/zesi-angular-proj",
            "index": "src/index.html",
            "main": "src/main.ts",
            "polyfills": "src/polyfills.ts",
            "tsConfig": "tsconfig.app.json",
            "assets": [
              "src/favicon.ico",
              "src/assets"
            ],
            "styles": [
              "src/styles.css"
            ],
            "scripts": []
          },
          "configurations": {
            "production": {
              "budgets": [
                {
                  "type": "initial",
                  "maximumWarning": "500kb",
                  "maximumError": "1mb"
                },
                {
                  "type": "anyComponentStyle",
                  "maximumWarning": "2kb",
                  "maximumError": "4kb"
                }
              ],
              "fileReplacements": [
                {
                  "replace": "src/environments/environment.ts",
                  "with": "src/environments/environment.prod.ts"
                }
              ],
              "outputHashing": "all"
            },
            "development": {
              "buildOptimizer": false,
              "optimization": false,
              "vendorChunk": true,
              "extractLicenses": false,
              "sourceMap": true,
              "namedChunks": true
            }
          },
          "defaultConfiguration": "production"
        },
        "serve": {
          "builder": "@angular-devkit/build-angular:dev-server",
          "configurations": {
            "production": {
              "buildTarget": "zesi-angular-proj:build:production"
            },
            "development": {
              "buildTarget": "zesi-angular-proj:build:development"
            }
          },
          "defaultConfiguration": "development"
        },
        "extract-i18n": {
          "builder": "@angular-devkit/build-angular:extract-i18n",
          "options": {
            "buildTarget": "zesi-angular-proj:build"
          }
        },
        "test": {
          "builder": "@angular-devkit/build-angular:karma",
          "options": {
            "main": "src/test.ts",
            "polyfills": "src/polyfills.ts",
            "tsConfig": "tsconfig.spec.json",
            "karmaConfig": "karma.conf.js",
            "assets": [
              "src/favicon.ico",
              "src/assets"
            ],
            "styles": [
              "src/styles.css"
            ],
            "scripts": []
          }
        }
      }
    }
  }
}

```

Modyfikujemy tsconfig.app.json:
```json
/* To learn more about this file see: https://angular.io/config/tsconfig. */
{
  "extends": "./tsconfig.json",
  "compilerOptions": {
    "outDir": "./out-tsc/app",
    "types": []
  },
  "files": [
    "src/main.ts",
    "src/polyfills.ts"
  ],
  "include": [
    "src/**/*.d.ts"
  ]
}
```

Dodajemy plik polyfills.ts:
```typescript
/**
 * This file includes polyfills needed by Angular and is loaded before the app.
 * You can add your own extra polyfills to this file.
 *
 * This file is divided into 2 sections:
 *   1. Browser polyfills. These are applied before loading ZoneJS and are sorted by browsers.
 *   2. Application imports. Files imported after ZoneJS that should be loaded before your main
 *      file.
 *
 * The current setup is for so-called "evergreen" browsers; the last versions of browsers that
 * automatically update themselves. This includes Safari >= 10, Chrome >= 55 (including Opera),
 * Edge >= 13 on the desktop, and iOS 10 and Chrome on mobile.
 *
 * Learn more in https://angular.io/guide/browser-support
 */

/***************************************************************************************************
 * BROWSER POLYFILLS
 */

/**
 * IE11 requires the following for NgClass support on SVG elements
 */
// import 'classlist.js';  // Run `npm install --save classlist.js`.

/**
 * Web Animations `@angular/platform-browser/animations`
 * Only required if AnimationBuilder is used within the application and using IE/Edge or Safari.
 * Standard animation support in Angular DOES NOT require any polyfills (as of Angular 6.0).
 */
// import 'web-animations-js';  // Run `npm install --save web-animations-js`.

/**
 * By default, zone.js will patch all possible macroTask and DomEvents
 * user can disable parts of macroTask/DomEvents patch by setting following flags
 * because those flags need to be set before `zone.js` being loaded, and webpack
 * will put import in the top of bundle, so user need to create a separate file
 * in this directory (for example: zone-flags.ts), and put the following flags
 * into that file, and then add the following code before importing zone.js.
 * import './zone-flags';
 *
 * The flags allowed in zone-flags.ts are listed here.
 *
 * The following flags will work for all browsers.
 *
 * (window as any).__Zone_disable_requestAnimationFrame = true; // disable patch requestAnimationFrame
 * (window as any).__Zone_disable_on_property = true; // disable patch onProperty such as onclick
 * (window as any).__zone_symbol__UNPATCHED_EVENTS = ['scroll', 'mousemove']; // disable patch specified eventNames
 *
 *  in IE/Edge developer tools, the addEventListener will also be wrapped by zone.js
 *  with the following flag, it will bypass `zone.js` patch for IE/Edge
 *
 *  (window as any).__Zone_enable_cross_context_check = true;
 *
 */

/***************************************************************************************************
 * Zone JS is required by default for Angular itself.
 */
import 'zone.js';  // Included with Angular CLI.


/***************************************************************************************************
 * APPLICATION IMPORTS
 */
```

# Krok 11

Tworzymy szblon html i style dla komponentu MyModule

Modyfikujemy my-module.component.html:
```html
<h1>Web Application Starter Project</h1>

<table align="center">
    <tr>
        <td colspan="2" style="font-weight:bold;">Please enter your name:</td>
    </tr>
    <tr>
        <td id="nameFieldContainer"></td>
        <td id="sendButtonContainer"></td>
    </tr>
    <tr>
        <td colspan="2" style="color:red;" id="errorLabelContainer"></td>
    </tr>
</table>
```

Uzupełniamy my-module.component.css:
```css
/** Add css rules here for your application. */


/** Example rules used by the template application (remove for your app) */
h1 {
  font-size: 2em;
  font-weight: bold;
  color: #777777;
  margin: 40px 0px 70px;
  text-align: center;
}

.sendButton {
  display: block;
  font-size: 16pt;
}

/** Most GWT widgets already have a style name defined */
.gwt-DialogBox {
  width: 400px;
}

.dialogVPanel {
  margin: 5px;
}

.serverResponseLabelError {
  color: red;
}

/** Set ids using widget.getElement().setId("idOfElement") */
#closeButton {
  margin: 15px 6px 6px;
}

```

Następnie dodajemy funkcjonalności do komponentu zgodne z zachowaniem zdefiniowanym w module MyModule.

my-module.component.html
```html
<h1>Web Application Starter Project</h1>

<table align="center">
    <tr>
        <td colspan="2" style="font-weight:bold;">Please enter your name:</td>
    </tr>
    <tr>
        <td>
            <input id="name" [autofocus]="focusOn === 'send'" type="text" placeholder="Enter your name" [formControl]="name"/>
        </td>
        <td>
            <button [disabled]="!formEnabled" class="sendButton" (click)="sendNameToServer()">Send</button>
        </td>
    </tr>
    <tr>
        <td colspan="2" style="color:red;">
            <label *ngIf="inputError !== ''">{{inputError}}</label>
        </td>
    </tr>
</table>
<div align="center" class="dialogVPanel" id="dialog" [hidden]="!dialogEnabled">
    <b>Sending name to the server: {{name.value}}</b>
    <p id="dialogTitle">{{dialogTitle}}</p>
    <br><b>Server replies:</b>
    <p [ngClass]="{'serverResponseLabelError': isServerResponseError}" id="dialogContent">{{serverResponse}}</p>
    <button [autofocus]="focusOn === 'close'" id="closeButton" (click)="closeDialog()">Close</button>
</div>

```

my-module.component.ts
```typescript
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

```

TODO: Testy

