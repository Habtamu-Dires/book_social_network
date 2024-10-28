import { Component, OnInit } from '@angular/core';
import { TokenService } from '../../../../services/token/token.service';
import { Router } from '@angular/router';
import { RouterLink, RouterOutlet } from '@angular/router';
import { KeycloakService } from '../../../../services/keycloak/keycloak.service';
import  SockJS from 'sockjs-client';
import  Stomp from 'stompjs';
import { Notification } from './notification';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [RouterLink,RouterOutlet, CommonModule],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss'
})
export class MenuComponent implements OnInit{

  private _username:string | undefined;
  socketClient: any = null;
  private notificationSubscription:any;
  unreadNotificationCount = 0;
  notifications:Array<Notification> = []



  constructor(
    private keycloakService: KeycloakService,
    private toastrService: ToastrService
  ){}

  ngOnInit(): void {
      this.navigationHanlder();

      if(this.keycloakService.keycloak.tokenParsed?.sub){
        var ws = new SockJS('http://localhost:8088/api/v1/ws');
        this.socketClient = Stomp.over(ws);
        this.socketClient.connect(
          {'Authorization:': `Bearer ${this.keycloakService.keycloak.token}`},
          ()=>{  
            this.notificationSubscription = this.socketClient.subscribe(
            `/user/${this.keycloakService.keycloak.tokenParsed?.sub}/notifications`,
            (message:any)=>{ 
              const notification: Notification = JSON.parse(message.body)
              if(notification){
                this.notifications.unshift(notification);
                switch(notification.status){
                  case 'BORROWED':
                    this.toastrService.info(notification.message, notification.bookTitle);
                    break;
                  case 'RETURNED':
                    this.toastrService.warning(notification.message, notification.bookTitle);
                    break;
                  case 'RETURN_APPROVED':
                    this.toastrService.success(notification.message, notification.bookTitle);
                    break;
                }
                this.unreadNotificationCount++;
              }
            }
          )
          })
      }
  }

  private navigationHanlder(){
    const linkColor = document.querySelectorAll('.nav-link');
      linkColor.forEach(link => {
        // if (window.location.href.endsWith(link.getAttribute('href') || '')) {
        //   link.classList.add('active');
        // }
        link.addEventListener('click', () => {
          linkColor.forEach(l => l.classList.remove('active'));
          link.classList.add('active');
        });
      });
  }

  get username(){
    return this.keycloakService.keycloak.profile?.firstName;
  }

  logout() {
    this.keycloakService.logout();
  }

  
}
