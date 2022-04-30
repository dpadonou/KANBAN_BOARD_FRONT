import { Injectable } from '@angular/core';
import { first } from 'rxjs';
import { BoardDto } from '../entities/boardDto';
import { Card } from '../entities/card';
import { CardDto } from '../entities/cardDto';
import { FullBoard } from '../entities/full-board';
import { SectionDto } from '../entities/sectionDto';
import { CardService } from '../service/card.service';
@Injectable()
export class Mapper {
  constructor(private cardService: CardService) {}
  boardToBoardDTO(b: BoardDto): FullBoard {
    let board = new FullBoard();
    board.id = b.id;
    board.author = b.author;
    board.title = b.title;
    for (let s of b.sections) {
      let section = new SectionDto();
      section.id = s.id;
      section.name = s.name;
      this.cardService
        .findCardByBoardAndSection(s.id, b.id)
        .pipe(first())
        .subscribe(
          (data) => {
            data.forEach((e: Card) => {
              section.cards.push(e);
            });
          },
          (error) => {
            section.cards = [];
          }
        );
      board.sections.push(section);
    }
    return board;
  }
}
