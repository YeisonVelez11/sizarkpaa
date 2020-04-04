import { IonicModule } from "@ionic/angular";
import { RouterModule } from "@angular/router";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { PoliticosPage } from "./politicos.page";
import { SharedModule } from "../components/sharedModule";
@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    SharedModule,
    RouterModule.forChild([{ path: "", component: PoliticosPage }])
  ],
  declarations: [PoliticosPage]
})
export class PoliticosPageModule {}
