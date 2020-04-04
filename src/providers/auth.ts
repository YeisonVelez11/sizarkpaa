import { Platform } from "@ionic/angular";
import { Injectable } from "@angular/core";
import { Storage } from "@ionic/storage";
import { BehaviorSubject, Observable, from, of } from "rxjs";
import { take, map, switchMap } from "rxjs/operators";
import { JwtHelperService } from "@auth0/angular-jwt";
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";
import { AlertController } from "@ionic/angular";

const helper = new JwtHelperService();
const TOKEN_KEY = "_knt";

@Injectable({
  providedIn: "root"
})
export class AuthService {
  public user: Observable<any>;
  //private userData = new BehaviorSubject(null);

  constructor(
    private storage: Storage,
    private http: HttpClient,
    private plt: Platform,
    private router: Router,
    private alertCtrl: AlertController
  ) {
    this.loadStoredToken();
  }

  loadStoredToken() {
    let platformObs = from(this.plt.ready());

    this.user = platformObs.pipe(
      switchMap(() => {
        return from(this.storage.get(TOKEN_KEY));
      }),
      map((token) => {
        if (token) {
          let decode = helper.decodeToken(token);
          /*if (!decode.permiso_ingreso_app) {
            return null;
          }*/
          let expired = helper.isTokenExpired(token);
          if (expired) {
            this.alertCtrl
              .create({
                header: "No estas autorizado",
                message: "Tu sesión expiró",
                buttons: ["Aceptar"]
              })
              .then((alert) => alert.present());
            this.fn_logout();

            return null;
          }
          //this.userData.next(decoded);
          return true;
        } else {
          return null;
        }
      })
    );
  }

  fn_logout() {
    this.storage.clear().then(() => {
      this.router.navigateByUrl("/");
      //this.userData.next(null);
    });
  }
}
