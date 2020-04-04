import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router } from "@angular/router";
import { Observable } from "rxjs";
import { take, map } from "rxjs/operators";
import { AlertController } from "@ionic/angular";
import { AuthService } from "../providers/auth";

@Injectable({
  providedIn: "root"
})
export class AuthGuard implements CanActivate {
  constructor(
    private router: Router,
    private auth: AuthService,
    private alertCtrl: AlertController
  ) {}

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean> {
    return this.auth.user.pipe(
      take(1),
      map((user) => {
        //console.log(user);
        if (!user) {
          if (route["_routerState"]["url"] != "/login") {
            this.router.navigateByUrl("/");
            return false;
          } else {
            return true;
          }
        } else {
          if (route["_routerState"]["url"] == "/login") {
            this.router.navigateByUrl("/tabs/noticias");
          }

          return true;
        }
      })
    );
  }
}
