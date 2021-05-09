import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router} from '@angular/router';
import { Observable } from 'rxjs';
import {AuthService} from '../services/auth.service';
import {map, tap} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class FacebookGuard implements CanActivate {

  constructor(
    private router: Router,
    private afAuth: AngularFireAuth,
    private authService: AuthService
  ) {
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.authService.userData
      .pipe(
        map(user => user !== null),
        tap(value => {
          if (!value) {
            this.router.navigateByUrl('/login').then();
            return value;
          } else {
            return value;
          }
        })
      );
  }
}
