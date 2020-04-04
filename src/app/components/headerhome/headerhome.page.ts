import { Component, OnInit, Input } from "@angular/core";
import { Router } from "@angular/router";

@Component({
  selector: "headerhome",
  templateUrl: "./headerhome.page.html",
  styleUrls: ["./headerhome.page.scss"]
})
export class HeaderhomePage implements OnInit {
  ngOnInit() {}
  @Input() titulo: string; //titulo del ion-toolbar
  @Input() backbutton: boolean; //en true se desplaza para dejar un espacio al backbutton

  /*poner esto en el componente en que se llame
  <ion-buttons slot="start" class="back-button">
  <ion-back-button defaultHref></ion-back-button>
</ion-buttons>
  
  */

  constructor(private router: Router) {}

  fn_navigate(route) {
    this.router.navigate([route]);
  }
}
