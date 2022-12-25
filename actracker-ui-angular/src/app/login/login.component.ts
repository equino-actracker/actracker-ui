import { Component, OnInit } from '@angular/core';
import { SessionService } from '../session.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  username: string = '';
  password: string = '';

  constructor(
    private sessionService: SessionService
  ) {}

  ngOnInit(): void {
  }

  login(): void {
    this.sessionService.createSession(this.username, this.password);
  }

}
