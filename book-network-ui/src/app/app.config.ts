import { APP_INITIALIZER, ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptors } from '@angular/common/http';

import { routes } from './app.routes';
import { httpTokenInterceptor } from './services/interceptor/http-token.interceptor';
import { KeycloakService } from './services/keycloak/keycloak.service';
import { provideToastr } from 'ngx-toastr';
import { provideAnimations } from '@angular/platform-browser/animations';

export function kcFactory(kcService:KeycloakService) {
  return () => kcService.init();
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }), 
    provideRouter(routes),
    provideHttpClient(
      withInterceptors([httpTokenInterceptor])
    ),
    provideAnimations(),
    provideToastr({
      progressBar:true, 
      closeButton: true,
      newestOnTop: true,
      tapToDismiss: true,
      positionClass: 'toast-top-center',
      timeOut: 8000
    }),
    {
      provide: APP_INITIALIZER,
      deps: [KeycloakService],
      useFactory: kcFactory,
      multi: true 
    },
    {
      provide: HTTP_INTERCEPTORS, 
      useValue: httpTokenInterceptor,
      multi: true 
    }
  ],
};


