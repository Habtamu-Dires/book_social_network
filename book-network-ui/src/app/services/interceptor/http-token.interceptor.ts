import { HttpHeaders, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { TokenService } from '../token/token.service';
import { KeycloakService } from '../keycloak/keycloak.service';

export const httpTokenInterceptor: HttpInterceptorFn = (req, next) => {
  const keycloakService = inject(KeycloakService);

  const token = keycloakService.keycloak?.token;


  if(token){
    const clonedReq = req.clone({
      headers:new HttpHeaders({
        Authorization: `Bearer ${token}`
      })
    });

    return next(clonedReq);
  } else{
    console.log("Token not available");
  }

  return next(req);
};
