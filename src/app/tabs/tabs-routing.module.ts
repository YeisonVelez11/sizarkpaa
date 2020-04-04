import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { TabsPage } from "./tabs.page";

const routes: Routes = [
  {
    path: "tabs",
    component: TabsPage,
    children: [
      {
        path: "noticias",
        children: [
          {
            path: "",
            loadChildren: () =>
              import("../noticias/noticias.module").then(
                (m) => m.NoticiasPageModule
              )
          },

          {
            path: "detallenoticia/:idnoticia",
            loadChildren: () =>
              import("../noticias/detalle-noticia/detalle-noticia.module").then(
                (m) => m.DetalleNoticiaPageModule
              )
          }
        ]
      },
      {
        path: "politicos",
        children: [
          {
            path: "",
            loadChildren: () =>
              import("../politicos/politicos.module").then(
                (m) => m.PoliticosPageModule
              )
          },

          {
            path: "detallepolitico/:idpolitico",
            loadChildren: () =>
              import(
                "../politicos/detalle-politico/detalle-politico.module"
              ).then((m) => m.DetallePoliticoPageModule)
          }
        ]
      },
      {
        path: "leyes",
        children: [
          {
            path: "",
            loadChildren: () =>
              import("../leyes/leyes.module").then((m) => m.LeyesPageModule)
          }
        ]
      },
      {
        path: "",
        redirectTo: "/tabs/noticias",
        pathMatch: "full"
      }
    ]
  },
  {
    path: "",
    redirectTo: "/tabs/noticias",
    pathMatch: "full"
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TabsPageRoutingModule {}
