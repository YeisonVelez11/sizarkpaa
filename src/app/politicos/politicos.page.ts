import { Component, OnInit } from "@angular/core";
import { ServicesProvider } from "../../providers/services";
import { SERVICES, BASE_IMG, RUTA_POLITICOS } from "../../config/webservices";
@Component({
  selector: "app-politicos",
  templateUrl: "politicos.page.html",
  styleUrls: ["politicos.page.scss"],
})
export class PoliticosPage implements OnInit {
  oUsuario: any = {};
  aPoliticos: any = {};
  sRutaPoliticos: any = {};
  mostrar_todos: any = false;
  constructor(private ServicesProvider: ServicesProvider) {}
  ngOnInit() {}
  //ionViewDidEnter
  ionViewDidEnter() {
    this.ServicesProvider.getStorage("usuario").then((data) => {
      this.oUsuario = data;
      this.fn_getPoliticos();
    });
  }

  fn_getPoliticos() {
    this.ServicesProvider.preloaderOn();
    this.ServicesProvider.post(SERVICES.POLITICO_LISTAR, {
      comuna: this.oUsuario.comuna,
      region: this.oUsuario.region,
      id_usuario: this.oUsuario._id,
      sigla_region: this.oUsuario.sigla_region,
      mostrar_todos: this.mostrar_todos ? "mostrar_todos" : "ninguno",
    }).then(
      (data: any) => {
        if (data.ok) {
          let auxPolitico = data.data;
          auxPolitico.forEach((element, i) => {
            this.aPoliticos[Object.keys(element)[0]] =
              element[Object.keys(element)[0]];
          });
          auxPolitico = null;
        } else {
          this.ServicesProvider.fn_toast("error", data.err.message);
        }
        this.ServicesProvider.preloaderOff();
      },
      (error) => {
        // console.log(error);
        this.ServicesProvider.preloaderOff();
      }
    );
  }
}
