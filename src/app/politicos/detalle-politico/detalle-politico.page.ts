import { Component, OnInit, ViewChild } from "@angular/core";
let aAuxNoticias = [];
import { ServicesProvider } from "../../../providers/services";
import {
  SERVICES,
  BASE_IMG,
  RUTA_POLITICOS
} from "../../../config/webservices";
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: "detalle-politico",
  templateUrl: "detalle-politico.page.html",
  styleUrls: ["detalle-politico.page.scss"]
})
export class DetallePoliticoPage implements OnInit {
  sRutaPoliticos: any = {};

  oNoticia: any = {};
  oUsuario: any;
  numestrellas: any = -1;
  oPolitico: any = {};
  disable_riple = false; //fix, cuando se hace click en los iconos de like siempre aparece un riple, estoy lo evita
  /*oPolitico: any = {
    nombres: "Sebastián Piñera",
    tipo: "Presidente",
    subtipo: null,
    jerarquia: 1,
    partido_politico: "Federación Regionalista Verde Social",
    imagen_politico: "./assets/presidente.jpg",
    imagen_partido_politico: "./assets/partido_politico.png",
    id: 1
  };*/
  constructor(
    private ServicesProvider: ServicesProvider,
    private activatedRoute: ActivatedRoute
  ) {}
  ngOnInit() {
    this.activatedRoute.params.subscribe((params) => {
      //this.oPolitico = params.idpolitico;
      this.oPolitico = JSON.parse(params.queryParams);
      if (this.oPolitico.calificacion_usuario) {
        this.numestrellas =
          parseInt(this.oPolitico.calificacion_usuario[0]) - 1;
      }
      console.log(this.oPolitico);
      this.sRutaPoliticos.politico =
        RUTA_POLITICOS[this.oPolitico.cargo.toLowerCase()];
      this.sRutaPoliticos.partido = RUTA_POLITICOS["partidos"];

      this.ServicesProvider.getStorage("usuario").then((data) => {
        this.oUsuario = data;
        //this.fn_getNoticias({ _id: params.idnoticia });
      });
    });
  }
  fn_SetCalificacion(index: any) {
    this.numestrellas = index;
    console.log(index + 1);

    this.ServicesProvider.preloaderOn();
    this.ServicesProvider.post(SERVICES.POLITICO_CALIFICAR, {
      _id: this.oPolitico._id,
      id_usuario: this.oUsuario._id,
      estrellas: this.numestrellas + 1
    }).then(
      (data: any) => {
        if (data.ok) {
          this.oNoticia = data.data;
          this.fn_getPolitico();
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

  fn_getPolitico() {
    this.ServicesProvider.preloaderOn();
    this.ServicesProvider.post(SERVICES.POLITICO_DETALE, {
      _id: this.oPolitico._id
    }).then(
      (data: any) => {
        if (data.ok) {
          this.oPolitico = data.data;
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
