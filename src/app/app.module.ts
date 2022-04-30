import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { Page404Component } from './page404/page404.component';
import { UserInfoComponent } from './user-info/user-info.component';
import {
  HttpClient,
  HttpClientModule,
  HTTP_INTERCEPTORS,
} from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AlertComponent } from './alert/alert.component';
import { UserService } from './service/user.service';
import { JwtInterceptor } from './_helpers/jwt-interceptor';
import { ErrorInterceptor } from './_helpers/error-interceptor';
import { AuthGuard } from './_helpers/auth.guard';
import { BoardComponent } from './board/board.component';
import { SectionComponent } from './section/section.component';
const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'home', component: HomeComponent },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard],
  },
  { path: 'forgotPassword', component: ForgotPasswordComponent },
  { path: 'resetPassword', component: ResetPasswordComponent },
  { path: '404', component: Page404Component },
  { path: 'user', component: UserInfoComponent },
  { path: '', component: HomeComponent },
  { path: '**', redirectTo: '/dashboard' },
];
@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    HomeComponent,
    DashboardComponent,
    ResetPasswordComponent,
    ForgotPasswordComponent,
    Page404Component,
    UserInfoComponent,
    AlertComponent,
    BoardComponent,
    SectionComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forRoot(routes),
  ],
  providers: [
    UserService,
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
