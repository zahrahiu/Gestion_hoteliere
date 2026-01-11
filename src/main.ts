import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { AppComponent } from './app/app';
import { routes } from './app/app.routes';
import { appConfig } from '../src/app/app.config';
import { provideHttpClient, withFetch } from '@angular/common/http';

<<<<<<< HEAD
bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
  
    provideHttpClient(withFetch())
  
  ]
});
=======
>>>>>>> 7192bdbd97131bf0388ed5c0664688f0d8850870

bootstrapApplication(AppComponent, appConfig)
  .catch(err => console.error(err));
