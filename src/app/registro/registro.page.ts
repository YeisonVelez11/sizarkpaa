import { Component, OnInit } from "@angular/core";
import {
  Validators,
  FormBuilder,
  FormGroup,
  FormControl,
} from "@angular/forms";
import { ServicesProvider } from "../../providers/services";
import { SERVICES } from "../../config/webservices";
import { Router } from "@angular/router";

@Component({
  selector: "registro",
  templateUrl: "./registro.page.html",
  styleUrls: ["./registro.page.scss"],
})
export class RegistroPage implements OnInit {
  oFormRegistro: any;
  aRegiones: any = [];
  aComunas: any = [];
  screen_modal: boolean = false;

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
      sigla_region: [null, []],
      contrasena: [null, [Validators.required, Validators.minLength(5)]],
    });
    this.oFormRegistro.controls.comuna.disable();
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
      let oUsuario = {
        nombres: this.oFormRegistro.get("nombres").value,
        region: this.oFormRegistro.get("region").value,
        comuna: this.oFormRegistro.get("comuna").value,
        correo: this.oFormRegistro.get("correo").value.toLowerCase().trim(),
        contrasena: this.oFormRegistro.get("contrasena").value,
        sigla_region: this.oFormRegistro.get("sigla_region").value,
        facebook: false,
      };
      this.ServicesProvider.preloaderOn();
      this.ServicesProvider.post(SERVICES.REGISTRO, oUsuario).then(
        (data: any) => {
          //si es ok

          if (data.ok) {
            this.ServicesProvider.fn_toast("exito", data.message);
            this.router.navigate(["/login"]);
          } else {
            this.ServicesProvider.fn_toast("error", data.err.message);
          }
          this.ServicesProvider.preloaderOff();
          //si no es ok
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
