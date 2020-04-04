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
  selector: "registro",
  templateUrl: "./registro.page.html",
  styleUrls: ["./registro.page.scss"]
})
export class RegistroPage implements OnInit {
  oFormRegistro: any;
  aRegiones: any = [];
  aComunas: any = [];
  show_contransena: boolean = true;

  ngOnInit() {
    //this.ServicesProvider.preloadOn();
    this.ServicesProvider.get("./assets/data/regiones.json").then((data) => {
      this.aRegiones = data;
    });
  }

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private ServicesProvider: ServicesProvider
  ) {
    this.oFormRegistro = this.fb.group({
      nombres: [null, [Validators.required, Validators.minLength(3)]],
      region: [null, [Validators.required]],
      comuna: [null, [Validators.required]],
      correo: [null, [Validators.required, Validators.email]],
      contrasena: [null, [Validators.required, Validators.minLength(5)]]
    });
    this.oFormRegistro.controls.comuna.disable();
  }
  fn_LoadProvincias(value) {
    this.oFormRegistro.get("comuna").setValue(null);
    this.oFormRegistro.controls.comuna.enable();
    this.aComunas = this.aRegiones.filter((region) => region.region == value);
    console.log(this.aComunas);
  }
  //funcion para ingresar un usuario
  fn_submit(formGroup: any) {
    if (formGroup.valid) {
      let oUsuario = {
        nombres: this.oFormRegistro.get("nombres").value,
        region: this.oFormRegistro.get("region").value,
        comuna: this.oFormRegistro.get("comuna").value,
        correo: this.oFormRegistro.get("correo").value,
        contrasena: this.oFormRegistro.get("contrasena").value
      };
      this.ServicesProvider.preloaderOn();
      this.ServicesProvider.post(SERVICES.REGISTRO, oUsuario).then(
        (datos: any) => {
          this.ServicesProvider.fn_validarRespuestaBack(datos).then(
            //si es ok
            (data: any) => {
              this.ServicesProvider.preloaderOff();
              this.ServicesProvider.fn_toast("exito", data.message);

              Promise.all([
                this.ServicesProvider.setStorage("_knt", data.token),
                this.ServicesProvider.setStorage("usuario", oUsuario)
              ]).then((data) => {
                this.router.navigate(["/login"]);
              });
              //si no es ok
            },
            (data: any) => {
              this.ServicesProvider.preloaderOff();
              this.ServicesProvider.fn_toast("error", data.message);
            }
          );
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
