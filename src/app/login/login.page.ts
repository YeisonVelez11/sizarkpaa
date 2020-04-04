import { Component, OnInit } from "@angular/core";
import {
  Validators,
  FormBuilder,
  FormGroup,
  FormControl
} from "@angular/forms";
import { ServicesProvider } from "../../providers/services";
import { SERVICES } from "../../config/webservices";
import { Router } from "@angular/router";

@Component({
  selector: "app-login",
  templateUrl: "./login.page.html",
  styleUrls: ["./login.page.scss"]
})
export class LoginPage implements OnInit {
  oFormLogin: any;
  show_contransena: boolean = true;
  ngOnInit() {
    //this.ServicesProvider.preloadOn();
  }

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private ServicesProvider: ServicesProvider
  ) {
    this.oFormLogin = this.fb.group({
      correo: [null, [Validators.required, Validators.email]],
      contrasena: [null, [Validators.required]]
    });
  }

  //funcion para ingresar un usuario
  fn_submit(formGroup: any) {
    if (formGroup.valid) {
      let oLogin: any = {
        correo: formGroup.get("correo").value,
        contrasena: formGroup.get("contrasena").value
      };
      this.ServicesProvider.preloaderOn();
      this.ServicesProvider.post(SERVICES.LOGIN, oLogin).then(
        (datos: any) => {
          if (datos.ok) {
            Promise.all([
              this.ServicesProvider.setStorage("_knt", datos.token),
              this.ServicesProvider.setStorage("usuario", datos.usuario)
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
}
