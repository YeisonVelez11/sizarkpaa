import { Component, OnInit } from "@angular/core";
import {
  Validators,
  FormBuilder,
  FormGroup,
  FormControl,
} from "@angular/forms";
import * as moment from "moment";
moment.locale("es");
import { ServicesProvider } from "../../providers/services";
import { SERVICES } from "../../config/webservices";
import { Router } from "@angular/router";
import { Facebook, FacebookLoginResponse } from "@ionic-native/facebook/ngx";

var env;
@Component({
  selector: "app-login",
  templateUrl: "./login.page.html",
  styleUrls: ["./login.page.scss"],
})
export class LoginPage implements OnInit {
  sFechaMax: String;
  oFormLogin: any;
  oFormRegistro: any;
  aRegiones: any = [];
  aComunas: any = [];
  screen_modal: boolean = false;
  show_contransena: boolean = false;
  ngOnInit() {
    //this.ServicesProvider.preloadOn();
    this.ServicesProvider.get("./assets/data/regiones.json").then((data) => {
      this.aRegiones = data;
    });
    this.sFechaMax = moment().subtract(12, "years").format("YYYY-MM-DD");
  }

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private ServicesProvider: ServicesProvider,
    private facebook: Facebook
  ) {
    this.oFormLogin = this.fb.group({
      correo: [null, [Validators.required, Validators.email]],
      contrasena: [null, [Validators.required]],
    });
    this.oFormRegistro = this.fb.group({
      nombres: [null, []],
      region: [null, [Validators.required]],
      comuna: [null, [Validators.required]],
      correo: [null, []],
      sigla_region: [null, []],
      genero: [null, [Validators.required]],
      fecha_nacimiento: [null, [Validators.required]],
    });
    this.oFormRegistro.controls.comuna.disable();
    env = this;
  }
  ionViewDidEnter() {
    this.oFormLogin.reset();
    this.show_contransena = false;
  }
  fn_LoadProvincias(value) {
    this.oFormRegistro.get("comuna").setValue(null);
    this.oFormRegistro.controls.comuna.enable();
    this.aComunas = this.aRegiones.filter((region) => {
      if (region.region == value) {
        this.oFormRegistro.get("sigla_region").setValue(region.sigla_region);
      }

      return region.region == value;
    });
  }

  //funcion para ingresar un usuario
  fn_submit(formGroup: any) {
    if (formGroup.valid) {
      let oLogin: any = {
        correo: formGroup.get("correo").value,
        contrasena: formGroup.get("contrasena").value,
      };
      this.ServicesProvider.preloaderOn();
      this.ServicesProvider.post(SERVICES.LOGIN, oLogin).then(
        (datos: any) => {
          if (datos.ok) {
            Promise.all([
              this.ServicesProvider.setStorage("_knt", datos.token),
              this.ServicesProvider.setStorage("usuario", datos.usuario),
            ]).then((data) => {
              this.router.navigate(["/tabs/noticias"]);
            });
          } else {
            this.ServicesProvider.fn_toast("error", datos.err.message);
          }

          this.ServicesProvider.preloaderOff();
        },
        (_fail) => {
          this.ServicesProvider.fn_popupError();
          this.ServicesProvider.preloaderOff();
        }
      );
    } else {
      this.ServicesProvider.validateAllFormFields(formGroup);
    }
  }

  fn_loginFacebook() {
    this.facebook
      .login(["public_profile", "email", "user_gender", "user_birthday"])
      .then((response: FacebookLoginResponse) => {
        let userId = response.authResponse.userID;
        let fbToken = response.authResponse.accessToken;
        let params = new Array<string>();

        //Getting name and gender properties
        this.facebook
          .api("/me?fields=id,email,name,gender,birthday", params)
          .then(function (user) {
            user.picture =
              "https://graph.facebook.com/" + userId + "/picture?type=large";
            //male birthday

            env.ServicesProvider.post(SERVICES.VERIFICAR_EXISTENCIA_CORREO, {
              correo: user.email,
            }).then(
              (datos: any) => {
                if (datos.ok) {
                  if (datos.existe == true) {
                    Promise.all([
                      env.ServicesProvider.setStorage("_knt", datos.token),
                      env.ServicesProvider.setStorage("usuario", datos.usuario),
                    ]).then((data) => {
                      env.router.navigate(["/tabs/noticias"]);
                    });
                  } else {
                    console.log(user);
                    env.oFormRegistro.get("nombres").setValue(user.name);
                    env.oFormRegistro.get("correo").setValue(user.email);
                    /*if (user.gender) {
                      env.oFormRegistro.get("genero").setValue(user.gender);
                    }
                    if (user.birthday) {
                      env.oFormRegistro.get("birthday").setValue(user.birthday);
                    }*/
                    env.screen_modal = true;
                  }
                } else {
                  env.ServicesProvider.fn_toast("error", datos.err.message);
                }

                env.ServicesProvider.preloaderOff();
              },
              (_fail) => {
                env.ServicesProvider.fn_popupError();
                env.ServicesProvider.preloaderOff();
              }
            );
          });
      })
      .catch((e) => {
        env.ServicesProvider.fn_toast(
          "error",
          "Ha ocurrido un problema al realizar la autenticación con facebook"
        );
      });
  }
  fn_submitFacebook(formGroup: any) {
    if (formGroup.valid) {
      let oUsuario = {
        nombres: this.oFormRegistro.get("nombres").value,
        region: this.oFormRegistro.get("region").value,
        comuna: this.oFormRegistro.get("comuna").value,
        correo: this.oFormRegistro.get("correo").value.toLowerCase().trim(),
        sigla_region: this.oFormRegistro.get("sigla_region").value,
        facebook: true,
        genero: this.oFormRegistro.get("genero").value,
        fecha_nacimiento: this.oFormRegistro.get("fecha_nacimiento").value,
      };
      this.ServicesProvider.preloaderOn();
      this.ServicesProvider.post(SERVICES.LOGIN_FACEBOOK, oUsuario).then(
        (datos: any) => {
          if (datos.ok) {
            Promise.all([
              this.ServicesProvider.setStorage("_knt", datos.token),
              this.ServicesProvider.setStorage("usuario", datos.usuario),
            ]).then((data) => {
              this.screen_modal = false;

              this.router.navigate(["/tabs/noticias"]);
            });
          } else {
            this.ServicesProvider.fn_toast("error", datos.err.message);
            this.screen_modal = false;
          }

          this.ServicesProvider.preloaderOff();
        },
        (_fail) => {
          this.ServicesProvider.fn_popupError();
          this.ServicesProvider.preloaderOff();
        }
      );
    } else {
      this.ServicesProvider.validateAllFormFields(formGroup);
    }
  }
}
