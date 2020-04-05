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
  selector: "perfil",
  templateUrl: "./perfil.page.html",
  styleUrls: ["./perfil.page.scss"],
})
export class PerfilPage implements OnInit {
  oFormRegistro: any;
  aRegiones: any = [];
  aComunas: any = [];
  show_contransena: boolean = true;
  oUsuario: any = {};
  mostrar_formulario: boolean = true;
  ngOnInit() {
    //this.ServicesProvider.preloadOn();
    this.ServicesProvider.get("./assets/data/regiones.json").then((data) => {
      this.aRegiones = data;
    });

    this.ServicesProvider.getStorage("usuario").then((data) => {
      this.oUsuario = data;
      console.log(this.oUsuario);
      this.oFormRegistro.get("nombres").setValue(this.oUsuario.nombres);
      this.oFormRegistro.get("region").setValue(this.oUsuario.region);
      this.fn_LoadProvincias(this.oUsuario.region);

      setTimeout(() => {
        this.oFormRegistro.get("comuna").setValue(this.oUsuario.comuna);
      }, 1000);
      this.oFormRegistro.get("correo").setValue(this.oUsuario.correo);
    });
  }

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private ServicesProvider: ServicesProvider
  ) {
    this.oFormRegistro = this.fb.group({
      nombres: [{ value: "", disabled: true }, [Validators.required]],
      region: [null, [Validators.required]],
      comuna: [null, [Validators.required]],
      sigla_region: [null, []],
      correo: [
        { value: "", disabled: true },
        ,
        [Validators.required, Validators.email],
      ],
      contrasena: [null, [Validators.minLength(4)]],
    });
  }
  fn_LoadProvincias(value) {
    this.oFormRegistro.get("comuna").setValue(null);

    this.aComunas = this.aRegiones.filter((region) => {
      if (region.region == value) {
        this.oFormRegistro.get("sigla_region").setValue(region.sigla_region);
        console.log(region.sigla_region);
      }
      return region.region == value;
    });
  }
  //funcion para ingresar un usuario
  fn_submit(formGroup: any) {
    if (formGroup.valid) {
      /*borrar */
      let oObject: any = {};

      oObject = {
        /*nombres: this.oFormRegistro.get("nombres").value,*/
        correo: this.oFormRegistro.get("correo").value,
        region: this.oFormRegistro.get("region").value,
        comuna: this.oFormRegistro.get("comuna").value,
        sigla_region: this.oFormRegistro.get("sigla_region").value,
      };
      if (
        this.oFormRegistro.get("contrasena").valid &&
        this.oFormRegistro.get("contrasena").value
      ) {
        oObject.contrasena = this.oFormRegistro.get("contrasena").value;
      }

      this.ServicesProvider.preloaderOn();
      this.ServicesProvider.post(SERVICES.ACTUALIZAr_USUARIO, oObject).then(
        (data: any) => {
          if (data.ok) {
            this.ServicesProvider.preloaderOff();
            this.ServicesProvider.fn_toast("exito", data.message);
            this.mostrar_formulario = true;
          } else {
            this.ServicesProvider.fn_toast("error", data.err.message);
            this.ServicesProvider.preloaderOff();
          }
        },
        (_fail) => {
          this.ServicesProvider.preloaderOff();
          this.ServicesProvider.fn_popupError();
        }
      );
    } else {
      this.ServicesProvider.validateAllFormFields(formGroup);
    }
  }
  fn_logout() {
    this.ServicesProvider.fn_logout();
  }
}
