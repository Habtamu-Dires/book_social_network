import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class TokenService {


  set token(token: string){
    localStorage.setItem('token', token);
  }

  get token(){
    return localStorage.getItem('token') as string;
  }

  private isTokenValid(){
    const token = this.token;
    if(!token){
      return false;
    }
    //decode the token
    const jwtHelper = new JwtHelperService();
    //chec expire date
    const isTokenExpired  = jwtHelper.isTokenExpired(token);
    if(isTokenExpired){
      localStorage.clear();
      return false
    }
    return true;
  }

  isTokenNotValide() {
    return !this.isTokenValid();
  }

  removeToken(){
    localStorage.removeItem('token')
  }


}
