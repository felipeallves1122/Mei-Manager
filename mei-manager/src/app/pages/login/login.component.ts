import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  standalone: false
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  loginForm: FormGroup;
  errorMsg = '';

  constructor() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;
      this.authService.login(email, password).subscribe({
        next: () => {
          this.router.navigate(['/']);
        },
        error: () => {
          this.errorMsg = 'E-mail ou senha inválidos. (Se não tiver conta, clique em Registrar)';
        }
      });
    }
  }

  onRegister() {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;
      this.authService.register(email, password).subscribe({
        next: () => {
          this.onSubmit(); // Logar logo após registrar
        },
        error: (err) => {
          console.error(err);
          if (err.status === 0) {
            this.errorMsg = 'Erro de conexão com o servidor. O backend está rodando?';
          } else {
            this.errorMsg = 'Erro no servidor: ' + (err.error?.message || err.message);
          }
        }
      });
    }
  }
}
