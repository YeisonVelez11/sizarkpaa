import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { IonicModule } from "@ionic/angular";

import { PerfilPageRoutingModule } from "./perfil-routing.module";

import { PerfilPage } from "./perfil.page";
import { SharedModule } from "../components/sharedModule";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    PerfilPageRoutingModule,
    SharedModule
  ],
  declarations: [PerfilPage]
})
export class PerfilPageModule {}
