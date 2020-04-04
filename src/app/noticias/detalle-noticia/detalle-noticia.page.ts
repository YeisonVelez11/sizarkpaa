import { Component, OnInit, ViewChild } from "@angular/core";
import { IonInfiniteScroll } from "@ionic/angular";
let aAuxNoticias = [];
import { ServicesProvider } from "../../../providers/services";
import {
  SERVICES,
  BASE_IMG,
  RUTA_POLITICOS
} from "../../../config/webservices";
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: "detalle-noticia",
  templateUrl: "detalle-noticia.page.html",
  styleUrls: ["detalle-noticia.page.scss"]
})
export class DetalleNoticiaPage implements OnInit {
  sRutaPoliticos: any = RUTA_POLITICOS;

  oNoticia: any = {};
  disable_riple = false; //fix, cuando se hace click en los iconos de like siempre aparece un riple, estoy lo evita
  base_imagen = BASE_IMG;
  oUsuario: any = {};
  constructor(
    private ServicesProvider: ServicesProvider,
    private activatedRoute: ActivatedRoute
  ) {}
  ngOnInit() {
    this.activatedRoute.params.subscribe((params) => {
      //this.oNoticia = params.idnoticia;
      this.oNoticia = JSON.parse(params.queryParams);
      this.ServicesProvider.getStorage("usuario").then((data) => {
        this.oUsuario = data;
        //this.fn_getNoticias({ _id: params.idnoticia });
      });
    });
  }
  fn_callFormatTime(time: any) {
    return this.ServicesProvider.fn_setTime(time);
  }

  //se debe enviar el objeto que tiene los indices like y dislike
  fn_SetLikes(item: any, key: any) {
    this.ServicesProvider.fn_SetLikes(item, key);
    if (item.like == false && item.dislike == false) {
      item.borrar_tipos_like = true;
    } else {
      item.borrar_tipos_like = false;
    }
    this.fn_likes(key, item);
  }

  fn_getNoticias(_id: any) {
    this.ServicesProvider.preloaderOn();
    this.ServicesProvider.post(SERVICES.NOTICIA_DETALLE, _id).then(
      (data: any) => {
        if (data.ok) {
          this.oNoticia = data.data;
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

  fn_likes(key: any, item: any) {
    this.ServicesProvider.preloaderOn();
    this.ServicesProvider.post(SERVICES.LIKES, {
      tipo: key,
      id_usuario: this.oUsuario._id,
      id_noticia: item._id,
      borrar_tipos_like: item.borrar_tipos_like
    }).then(
      (data: any) => {
        if (data.ok) {
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
