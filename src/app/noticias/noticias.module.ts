import { IonicModule } from "@ionic/angular";
import { RouterModule } from "@angular/router";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { NoticiasPage } from "./noticias.page";
import { SharedModule } from "../components/sharedModule";
import { ellipsis } from "../../pipes/pipe-ellipsis";

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    SharedModule,

    RouterModule.forChild([{ path: "", component: NoticiasPage }])
  ],
  declarations: [NoticiasPage, ellipsis]
})
export class NoticiasPageModule {}
