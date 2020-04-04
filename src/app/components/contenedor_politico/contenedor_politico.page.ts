import { Component, OnInit, Input } from "@angular/core";
import { Router } from "@angular/router";
import { RUTA_POLITICOS } from "../../../config/webservices";

@Component({
  selector: "contenedor_politico",
  templateUrl: "./contenedor_politico.page.html",
  styleUrls: ["./contenedor_politico.page.scss"]
})
export class ContenedorPoliticoPage implements OnInit {
  @Input() aPolitico: any;
  @Input() sTipo: any;
  @Input() tipoMinus: any;
  @Input() iMostrarCantidadPoliticos: any;
  @Input() quitar_border_bottom: any;
  sRutaPoliticos: any = {};

  constructor(private router: Router) {}
  ngOnInit() {
    this.sRutaPoliticos.politico = RUTA_POLITICOS[this.tipoMinus];
    this.sRutaPoliticos.partido = RUTA_POLITICOS["partidos"];
  }

  fn_PoliticoDetail(item: any) {
    this.router.navigate([
      "/tabs/politicos/detallepolitico/" + item._id,
      {
        queryParams: JSON.stringify(item)
      }
    ]); /*{
      queryParams: item
    });*/
  }
}
