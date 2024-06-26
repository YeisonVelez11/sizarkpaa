import { NgModule } from "@angular/core";
import { PreloadAllModules, RouterModule, Routes } from "@angular/router";
import { AuthGuard } from "../guards/auth.guard";
const routes: Routes = [
  /*{
    path: "",
    redirectTo: "tabs",
    pathMatch: "full"
  },*/
  {
    path: "",
    redirectTo: "login",
    pathMatch: "full",
    canActivate: [AuthGuard]
  },

  {
    path: "login",
    loadChildren: () =>
      import("./login/login.module").then((m) => m.LoginPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: "registro",
    loadChildren: () =>
      import("./registro/registro.module").then((m) => m.RegistroPageModule)
  },
  {
    path: "perfil",
    loadChildren: () =>
      import("./perfil/perfil.module").then((m) => m.PerfilPageModule),
    canActivate: [AuthGuard]
  },

  {
    path: "",
    loadChildren: () =>
      import("./tabs/tabs.module").then((m) => m.TabsPageModule),
    canActivate: [AuthGuard]
  }

  /*

  {
    path: "",
    loadChildren: () =>
      import("./tabs/tabs.module").then((m) => m.TabsPageModule)
  },

  {
    path: "login",
    loadChildren: () =>
      import("./login/login.module").then((m) => m.LoginPageModule)
  },
  {
    path: "tabs",
    loadChildren: () =>
      import("./tabs/tabs.module").then((m) => m.TabsPageModule)
  }

  */

  /*
  {
    path: "",
    loadChildren: () =>
      import("./tabs/tabs.module").then((m) => m.TabsPageModule)
  },*/
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
