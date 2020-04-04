import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { IonicModule } from "@ionic/angular";

import { HeaderhomePage } from "../components/headerhome/headerhome.page";
import { ContenedorPoliticoPage } from "./contenedor_politico/contenedor_politico.page";

@NgModule({
  declarations: [HeaderhomePage, ContenedorPoliticoPage],
  exports: [HeaderhomePage, ContenedorPoliticoPage],
  imports: [CommonModule, IonicModule, FormsModule]
})
export class SharedModule {}
