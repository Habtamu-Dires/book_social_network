import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '../../services/services';
import { CommonModule } from '@angular/common';
import { CodeInputModule } from 'angular-code-input';

@Component({
  selector: 'app-activate-account',
  standalone: true,
  imports: [CommonModule,CodeInputModule],
  templateUrl: './activate-account.component.html',
  styleUrl: './activate-account.component.scss'
})
export class ActivateAccountComponent {

  message:string = '';
  isOkay:boolean = false;
  submitted:boolean = false;

  constructor(
    private router:Router,
    private authService:AuthenticationService
  ){}

  onCodeCompleted(token:string){
    this.confirmAccount(token);
  }

  private confirmAccount(token:string){
    this.authService.confirm({
      token
    }).subscribe({
      next:() => {
          this.message = `Your account has been sucessfully activated \n 
                            Now you can proceed to login`;
          this.submitted = true;
          this.isOkay = true;
      },
      error:(err) => {
        this.message = 'Token expired or Invalid';
        this.submitted = true;
      }
    })
  }

  redirectToLogin() {
    this.router.navigate(['login']);
  }
}
