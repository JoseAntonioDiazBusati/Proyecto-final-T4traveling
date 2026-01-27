import 'zone.js';
import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';

const redirect = sessionStorage.getItem('redirect');
if (redirect) {
  sessionStorage.removeItem('redirect');
  history.replaceState(null, '', redirect);
}

bootstrapApplication(App, appConfig)
  .catch((err) => console.error(err));
