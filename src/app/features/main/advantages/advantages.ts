import { Component } from '@angular/core';
import { AdvantagesInterface } from '../../../types/main/adavntages.interface';

@Component({
  selector: 'app-advantages',
  imports: [],
  templateUrl: './advantages.html',
  styleUrl: './advantages.scss',
})
export class Advantages {
  advantagesArray: AdvantagesInterface[] = [
    {
      BoldText: 'Мастерски вовлекаем аудиториюв процесс.',
      normalText:
        'Мы увеличиваем процент вовлечённости за короткий промежуток времени.',
    },
    {
      BoldText: 'Разрабатываем бомбическую визуальную концепцию.',
      normalText:
        'Наши специалисты знают как создать уникальный образ вашего проекта.',
    },
    {
      BoldText: 'Создаём мощные воронки с помощью текстов. ',
      normalText:
        'Наши копирайтеры создают не только вкусные текста, но и классные воронки.',
    },
    {
      BoldText: 'Помогаем продавать больше. ',
      normalText:
        'Мы не только помогаем разработать стратегию по продажам, но также корректируем её под нужды заказчика.',
    },
  ];
}
