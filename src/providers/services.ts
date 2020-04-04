import { Injectable } from "@angular/core";
import {
  HttpClientModule,
  HttpRequest,
  HttpHeaders,
  HttpParams,
  HttpClient
} from "@angular/common/http";
import { Router } from "@angular/router";

import { SERVICES, URL } from "../config/webservices";
import { GlobalProvider } from "./globalvariable";
import { LoadingController } from "@ionic/angular";
import * as moment from "moment";
moment.locale("es");

//import { Router } from '@angular/router';
import {
  Validators,
  FormGroup,
  FormControl,
  FormBuilder
} from "@angular/forms";
//import { ServicesProvider } from '../../providers/services';
import { ToastController } from "@ionic/angular";
import { Storage } from "@ionic/storage";

//import {  MenuController } from '@ionic/angular';

@Injectable()
export class ServicesProvider {
  protected url = URL;
  preload: any;
  isLoading: boolean = false;
  constructor(
    private loadingController: LoadingController,
    private httpClient: HttpClient,
    private toastController: ToastController,
    private storage: Storage,
    public global: GlobalProvider,
    private router: Router
  ) {}

  /*

  /*  post(url: string, params: any) {
    return this.http.post(URL + SERVICES.SEND, params);
  }*/
  get(url: string) {
    return new Promise((resolve, reject) => {
      const headers = new HttpHeaders({
        "Content-Type": "application/x-www-form-urlencoded"
      });
      this.httpClient.get(url, { headers: headers }).subscribe(
        (response) => {
          try {
            //response = response.json();
            resolve(response);
          } catch (error) {
            // console.log("[api-274]", response);
            reject(response);
          }
        },
        (fail) => {
          try {
            fail = fail.json();
          } catch (error) {
            // console.log("[api-108]", fail);
          }
          reject(fail);
        }
      );
    });
  }

  public async post(inUrl: string, query?: any): Promise<any> {
    var _knt = await this.getStorage("_knt");

    return new Promise((resolve, reject) => {
      const body = new HttpParams(query);
      let jsonHeaders: any = {
        "Content-Type": "application/x-www-form-urlencoded"
      };
      if (_knt) {
        jsonHeaders.token = _knt;
      }
      const headers = new HttpHeaders(jsonHeaders);
      if (_knt) {
        headers.append("token", _knt);
      }

      let httpParams = new HttpParams();
      Object.keys(query).forEach(function(key) {
        httpParams = httpParams.set(key, query[key]);
      });
      this.httpClient
        .post(this.url + inUrl, httpParams.toString(), { headers: headers })
        .subscribe(
          (response) => {
            try {
              //response = response.json();
              resolve(response);
            } catch (error) {
              // console.log("[api-274]", response);
              reject(response);
            }
          },
          (fail) => {
            try {
              fail = fail.json();
            } catch (error) {
              // console.log("[api-108]", fail);
            }
            reject(fail);
          }
        );
    });
  }

  async fn_toast(tipo: string, texto: string, duration?: any) {
    let duracion = 3000;
    if (duration) {
      duracion = duration;
    }
    tipo = tipo.toLowerCase();
    let tipocss = "";
    let header = "";
    if (tipo == "exito" || tipo == "éxito") {
      tipocss = "success";
      header = "Éxito";
    } else if (tipo == "error") {
      tipocss = "danger";
      header = "Error!";
    }
    if (tipo == "warning" || tipo == "advertencia") {
      tipocss = "warning";
      header = "Advertencia";
    }
    const toast = await this.toastController.create({
      message: texto,
      position: "top",
      header: header,
      color: tipocss,
      duration: duracion
    });
    toast.present();
  }

  fn_popupError() {
    this.fn_toast(
      "error",
      "Ha ocurrido un problema, Revisa tu conexión a internet o intentalo luego"
    );
  }
  fn_logout() {
    this.storage.clear().then((data) => {
      console.log(data);
      this.router.navigateByUrl("/");
      //this.userData.next(null);
    });
  }
  fn_setTime(time: any) {
    return moment(time).fromNow();
  }

  validateAllFormFields(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach((field) => {
      const control: any = formGroup.get(field);

      if (control.controls) {
        control.controls.forEach((element) => {
          if (element instanceof FormControl) {
            element.markAsTouched({ onlySelf: true });
          } else if (element instanceof FormGroup) {
            this.validateAllFormFields(element);
          }
        });
      }

      if (control instanceof FormControl) {
        control.markAsTouched({ onlySelf: true });
      } else if (control instanceof FormGroup) {
        this.validateAllFormFields(control);
      }
    });
  }

  async preloaderOff() {
    if (this.isLoading) {
      this.isLoading = false;
      return await this.loadingController.dismiss();
    }
    return null;
  }
  async preloaderOn(mensaje?: string) {
    if (!mensaje) {
      mensaje = "Espere por favor...";
    }
    this.isLoading = true;
    return await this.loadingController
      .create({
        duration: 0,
        message: mensaje,
        translucent: true
      })
      .then((a) => {
        a.present().then(() => {
          if (!this.isLoading) {
            a.dismiss();
          }
        });
      });
  }

  getStorage(key: string) {
    return this.storage.get(key);
  }
  setStorage(key: string, value: any) {
    this.storage.set(key, value);
  }
  removeStorage(key: string) {
    this.storage.remove(key);
  }

  fn_validarRespuestaBack(data: any) {
    return new Promise((resolve, reject) => {
      if (data.ok) {
        resolve(data);
      } else {
        let aErrors = data.err.errors;
        let sErrors;
        if (aErrors) {
          let keysErrors = Object.keys(aErrors);
          console.log(aErrors);
          keysErrors.forEach((elemento) => {
            sErrors += aErrors[elemento].message + "\n";
          });
        } else {
          sErrors = data.err.message;
        }
        this.fn_toast("error", sErrors);
        reject(data);
      }
    });
  }

  //example: 4344  => 4,344.00
  /*fn_formatCurrency(n: any) {
    n = parseInt(n);
    let currency = n.toFixed(2).replace(/./g, function(c, i, a) {
      return i > 0 && c !== "." && (a.length - i) % 3 === 0 ? "," + c : c;
    });
    return currency == "NaN" ? "0" : currency;
  }*/

  fn_formatCurrency(e: any, separador: string = ".", decimais: number = 2) {
    //cuando escribo asegura la forma .00
    //let a: any = e.target.value.split("");
    if (e) {
      e = e.toString();
      let a: any = e.split("");

      let ns: string = "";
      a.forEach((c: any) => {
        if (!isNaN(c)) ns = ns + c;
      });
      ns = parseInt(ns).toString();
      if (ns.length < decimais + 1) {
        ns = "0".repeat(decimais + 1) + ns;
        ns = ns.slice((decimais + 1) * -1);
      }
      let ans = ns.split("");
      let r = "";
      for (let i = 0; i < ans.length; i++)
        if (i == ans.length - decimais) r = r + separador + ans[i];
        else r = r + ans[i];
      //e.value = r;
      return r;
    } else {
      return "";
    }
  }

  //example: 4,344.00 => 4344

  fn_resetFormatCurrency(n: any) {
    n = n.toString();
    if (n) {
      let mystring = n.replace(/[,]/g, "");
      mystring = mystring.replace(".00", "");
      return mystring;
    }
  }
  //elimina un valorq ue no sea numerico
  //ejemplo:    fn_remove_alfaespacial_char(event:any, this.oformulario, "monto")
  fn_remove_alfaespacial_char(event: any, form: any, key) {
    //si es diferente a un numero
    if (isNaN(parseInt(event.detail.data))) {
      if (form.get(key).value) {
        setTimeout(() => {
          form.get(key).setValue(form.get(key).value.slice(0, -1));
        });
      } else {
        //cuando el valor del formulario es la primera letra siempre será null
        //
        setTimeout(() => {
          event.target.value = "";
        });
      }
      return false;
    } else {
      return true;
    }
  }

  fn_SetLikes(item: any, key: any) {
    if (key == "like") {
      item.like = !item.like;
      if (item.like) {
        item.dislike = false;
      }
    } else {
      item.dislike = !item.dislike;
      if (item.dislike) {
        item.like = false;
      }
    }

    return item;
  }

  /*
 this.articleService.postArticle(article).subscribe(res => {
	  let artcl: Article = res.body;
	  console.log(artcl.title);
	  console.log(res.headers.get('Content-Type'));
	},
	err => {
	  console.log(err);
	}
 );
*/
}
