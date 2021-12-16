import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {AuthService} from "../../services/auth.service";
import {first} from "rxjs/operators";
import {Subject} from "rxjs";

@Component({
  selector: 'app-account-confirmation',
  templateUrl: './account-confirmation.component.html',
  styleUrls: ['./account-confirmation.component.scss']
})
export class AccountConfirmationComponent implements OnInit {

  unsubscribe$: Subject<void> = new Subject<void>();

  confirmationToken: string;
  loading: boolean = true;
  status: boolean;

  constructor(private authService: AuthService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.confirmationToken = params['token'];
      this.confirmUser();
    });
  }

  confirmUser() {
    this.authService.confirmUser(this.confirmationToken).pipe(first())
      .subscribe(data => {
          this.loading = false;
        this.status = true;
      },
      error => {
        this.loading = false; //TODO: reset link on failure?
        this.status = false;
      });
  }
}
