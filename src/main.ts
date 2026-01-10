import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { AppComponent } from './app/app';
import { routes } from './app/app.routes';
import { appConfig } from '../src/app/app.config';


bootstrapApplication(AppComponent, appConfig)
  .catch(err => console.error(err));
