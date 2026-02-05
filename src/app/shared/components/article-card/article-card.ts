import { Component, Input, input } from '@angular/core';
import { ArticleInterface } from '../../../types/article/articleTop.interface';
import { environment } from '../../../../environments/environment'
import { RouterLink } from "@angular/router";
import { FormatTextPipe } from "../../pipes/format-text-pipe";

@Component({
  selector: 'article-card',
  standalone: true,
  templateUrl: './article-card.html',
  styleUrl: './article-card.scss',
  imports: [RouterLink, FormatTextPipe],
})
export class ArticleCard {
  @Input() article!: ArticleInterface;
  protected readonly environment = environment;


  
}
