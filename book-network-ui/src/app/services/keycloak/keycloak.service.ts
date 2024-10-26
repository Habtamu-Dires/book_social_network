import { Injectable, OnInit } from '@angular/core';
import Keycloak from 'keycloak-js';
import { UserProfile } from './user-profile';

@Injectable({
  providedIn: 'root'
})
export class KeycloakService {

  private _KeyCloak: Keycloak | undefined;
  private _profile: UserProfile | undefined;


  get keycloak(){
    if(!this._KeyCloak){
      this._KeyCloak = new Keycloak({
        url:'http://localhost:9090',
        realm:'book-social-network',
        clientId:'bsn'
      })
    }
    return this._KeyCloak;
  } 

  get profile():UserProfile | undefined{
    return this._profile;
  }

  constructor() { }


  async init(){
    console.log('Authenticating the user .... ');
    const authenticated = await this.keycloak?.init({
         onLoad:'login-required'
    });

    if(authenticated){
      console.log('user authenticated');
      this._profile = (await this.keycloak?.loadUserProfile()) as UserProfile;
      this._profile.token = this.keycloak?.token;
    }
  }

  login(){
    return this.keycloak?.login();
  }

  logout(){
    return this.keycloak?.logout({
      redirectUri: 'http://localhost:4200'
    });
  }
}
