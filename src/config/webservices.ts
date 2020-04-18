//export const URL = "http://192.168.1.56:3000"; // Ruta Yeison
//export const URL = "http://localhost:3000"; // Ruta Yeison
export const URL = "http://3.223.103.92"; // Ruta produccion
export const BASE_IMG = URL + "/uploads/";
export const RUTA_NOTICIAS = URL + "/uploads/noticias/";

//export const BASE_IMG = URL +"./uploads/";

export const RUTA_POLITICOS = {
  alcalde: URL + "/uploads/alcaldes_image/",
  intendente: URL + "/uploads/intendentes_image/",
  partidos: URL + "/uploads/partidos_image/",
  diputado: URL + "/uploads/diputados_image/",
  senador: URL + "/uploads/senadores_image/",
  ministro: URL + "/uploads/ministros_image/",
  presidente: URL + "/uploads/presidente_image/",
};

export const SERVICES = {
  /* LOGIN */
  LOGIN: "/login_app",
  LOGIN_FACEBOOK: "/login_facebook",
  VERIFICAR_EXISTENCIA_CORREO: "/verificar_existencia_correo",
  REGISTRO: "/registro",
  ACTUALIZAr_USUARIO: "/actualizar_usuario_app",
  LISTAR_NOTICIA: "/noticia_listar_likes",
  NOTICIA_DETALLE: "/noticia_detalle",
  LIKES: "/noticia_likes",
  POLITICO_CALIFICAR: "/politico_calificar",
  POLITICO_LISTAR: "/politico_listar_todos",
  POLITICO_DETALE: "/politico_detalle",
};
