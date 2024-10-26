import { Component, OnInit } from '@angular/core';
import { AuthenticationRequest, AuthenticationResponse } from '../../services/models';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthenticationService } from '../../services/services';
import { TokenService } from '../../services/token/token.service';
import { KeycloakService } from '../../services/keycloak/keycloak.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit{

  constructor(
    private keycloakService:KeycloakService
  ){}

  async ngOnInit():Promise<void> {
    // await this.keycloakService.init();
    // await this.keycloakService.login();
  }

  logout(){
    this.keycloakService.logout();
  }


  // authRequest:AuthenticationRequest = {email: '', password: ''};
  // errorMsg: Array<String> = []

  // login(){
  //   this.errorMsg = [];
  //   this.authService.authenticate({
  //     body:this.authRequest
  //   }).subscribe({
  //     next:(res:AuthenticationResponse) =>{
  //       this.tokenService.token = res.token as string; 
  //       console.log("token: ", res.token)
  //       this.router.navigate(['books'])
  //     },
  //     error:(err => {
  //       if(err.error.validationErrors){
  //         this.errorMsg = err.error.validationErrors; 
  //       } else {
  //         this.errorMsg.push(err.error.error)
  //       }
  //     })
  //   })
  // }

  // register(){
  //     this.router.navigate(['register'])
  // }

}
