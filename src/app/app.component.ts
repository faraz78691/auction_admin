import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'auction-admin';
  isLoginPage: boolean = false;
  constructor(private router: Router) {}

  ngOnInit(): void {
    // Listen to router events to check the current route
    this.router.events.subscribe(() => {
      // Check if the current URL is '/login'
      this.isLoginPage = this.router.url === '/log-in';
    });
  }
}
