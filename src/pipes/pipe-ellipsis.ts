import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "ellipsis"
})
//retorna fecha en  yyyy/mm/dd hh:mm:ss a partir de fecha con T
//this.ServicesProvider.remainingDate("2019/05/20 20:00:00") yyyy-mm-dd
//retorna  Miércoles 29 de Mayo de 2019, 20:00
export class ellipsis implements PipeTransform {
  transform(value: string, parametro: any): Object {
    if (value.length <= parametro) {
      return value;
    }
    var str = value;
    str = str.slice(0, parametro + 1) + "...";

    return str;
  }
}
