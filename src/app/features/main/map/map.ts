import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { title } from '@primeuix/themes/aura/card';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-map',
  imports: [RouterLink],
  templateUrl: './map.html',
  styleUrl: './map.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Map {
  contacts = signal<{ title: string; descr?: string; links: boolean,  }[]>([
    {
      title: 'Адрес',
      descr:
        'Главный офис компании АйтиШторм находится по адресу Пресненская наб., 12, Москва, Россия, 123317.',
        links: false,
    },
    {
      title: 'Телефон',
      descr: '+7 (499) 343-13-34',
      links: false,
    },
    {
      title: 'Электронный адрес',
      descr: 'info@itstorm.com',
      links: false,
    },
    {
      title: 'Мы в социальных сетях',
      links: true,

    },
  ]);
}
