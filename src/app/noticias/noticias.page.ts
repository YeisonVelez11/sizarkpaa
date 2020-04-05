import { Component, OnInit, ViewChild } from "@angular/core";
let aAuxNoticias = [];
import { ServicesProvider } from "../../providers/services";
import { SERVICES, BASE_IMG } from "../../config/webservices";
import { Router } from "@angular/router";
@Component({
  selector: "app-noticias",
  templateUrl: "noticias.page.html",
  styleUrls: ["noticias.page.scss"],
})
export class NoticiasPage implements OnInit {
  @ViewChild("infinite", { static: true }) infinite: any;
  aNoticias: any[] = [];
  skip: any = 0;
  limite: any = 10;
  disable_riple = false; //fix, cuando se hace click en los iconos de like siempre aparece un riple, estoy lo evita
  oUsuario: any;
  constructor(
    private ServicesProvider: ServicesProvider,
    private router: Router
  ) {}

  ionViewDidEnter() {
    this.ServicesProvider.getStorage("usuario").then((data) => {
      this.oUsuario = data;
      this.skip = 0;
      this.aNoticias = [];
      this.infinite.disabled = false;
      this.fn_getNoticias();
    });
  }

  ngOnInit() {}
  fn_NoticiaDetail(item: any) {
    this.router.navigate([
      "/tabs/noticias/detallenoticia/" + item._id,
      {
        queryParams: JSON.stringify(item),
      },
    ]); /*{
      queryParams: item
    });*/
  }
  fn_Search(value: any) {
    //aAuxNoticias=this.aNoticias.slice(0);
    this.aNoticias = aAuxNoticias.slice(0);
    this.aNoticias = this.aNoticias.filter(
      (noticia) =>
        noticia.titulo.toLowerCase().search(value.toLowerCase()) != -1 ||
        noticia.cuerpo_noticia.toLowerCase().search(value.toLowerCase()) != -1
    );
  }

  fn_callFormatTime(time: any) {
    return this.ServicesProvider.fn_setTime(time);
  }

  //se debe enviar el objeto que tiene los indices like y dislike
  fn_SetLikes(item: any, key: any, event: any) {
    this.disable_riple = false; //fix
    event.stopPropagation();
    this.ServicesProvider.fn_SetLikes(item, key);
    if (item.like == false && item.dislike == false) {
      item.borrar_tipos_like = true;
    } else {
      item.borrar_tipos_like = false;
    }
    this.fn_likes(key, item);
  }

  fn_getNoticias(event?: any) {
    let paginacion = `?desde=${this.skip}&limite=${this.limite}`;
    this.ServicesProvider.preloaderOn();
    this.ServicesProvider.post(SERVICES.LISTAR_NOTICIA + paginacion, {
      _id: this.oUsuario._id,
    }).then(
      (data: any) => {
        if (data.ok) {
          if (event) {
            event.target.disabled = true;
            event.target.disabled = false;
          }
          if (data.data.length == 0) {
            if (event) {
              event.target.complete();
              event.target.disabled = true;
            }
          } else {
            this.aNoticias.push(...data.data);
            aAuxNoticias = this.aNoticias;
          }
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
    this.skip = this.skip + 10;
  }

  fn_likes(key: any, item: any) {
    this.ServicesProvider.preloaderOn();
    this.ServicesProvider.post(SERVICES.LIKES, {
      tipo: key,
      id_usuario: this.oUsuario._id,
      id_noticia: item._id,
      borrar_tipos_like: item.borrar_tipos_like,
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
