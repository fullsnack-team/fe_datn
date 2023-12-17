import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import Swal from "sweetalert2";
import {AuthService} from "../../../../../../service/auth/auth.service";
import {LocalStorageService} from "../../../../../../service/localStorage/localStorage.service";

@Component({
  selector: 'app-login-by-staff',
  templateUrl: './login-by-staff.component.html',
  styleUrls: ['./login-by-staff.component.scss']
})
export class LoginByStaffComponent implements OnInit {

  simpleItems: any = [];
  loginForm = new FormGroup({
    domain_name: new FormControl('tenant1', Validators.required),
  });

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService,
    private localStorageService: LocalStorageService
  ) {
  }

  returnUrl: any;

  ngOnInit(): void {
  }

  onLoggedin(e: Event) {
    e.preventDefault();
  }

  ngAfterViewInit(): void {
  }

  onSubmit() {
    const submitBtn = document.querySelector('#submitBtn');
    if (this.loginForm.valid) {
      if (submitBtn) {
        submitBtn.setAttribute('disabled', 'disabled');
      }
      const domain_name = this.loginForm.value.domain_name;
      this.router.navigate([`auth/login/by-staff/${domain_name}`]);
    } else {
      if (submitBtn) {
        submitBtn.removeAttribute('disabled');
      }
      alert('Không để trống');
    }
  }

}
