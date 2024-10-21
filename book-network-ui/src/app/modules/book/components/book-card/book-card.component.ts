import { Component, EventEmitter, Input, Output } from '@angular/core';
import { BookResponse } from '../../../../services/models';
import { CommonModule } from '@angular/common';
import { RatingComponent } from '../rating/rating.component';

@Component({
  selector: 'app-book-card',
  standalone: true,
  imports: [CommonModule,RatingComponent],
  templateUrl: './book-card.component.html',
  styleUrl: './book-card.component.scss'
})
export class BookCardComponent {

  private _book: BookResponse = {};
  private _bookCover:string | undefined;
  private _manage:boolean = false;

  @Input()
  set book(book:BookResponse){
    this._book = book;
  }

  get book():BookResponse{
    return this._book;
  }

  get bookCover(){
    if(this._book.cover){
      return 'data:image/jpg;base64,' + this._book.cover;
    }
    return 'https://fastly.picsum.photos/id/503/200/200.jpg?hmac=genECHjox9165KfYsOiMMCmN-zGqh9u-lnhqcFinsrU';
  }

  @Input()
  set manage(value:boolean){
    this._manage = value;
  }

  get manage(){
    return this._manage;
  }

  @Output() private share: EventEmitter<BookResponse> = new EventEmitter<BookResponse>();
  @Output() private archive: EventEmitter<BookResponse> = new EventEmitter<BookResponse>();
  @Output() private addToWatingList: EventEmitter<BookResponse> = new EventEmitter<BookResponse>();
  @Output() private borrow: EventEmitter<BookResponse> = new EventEmitter<BookResponse>();
  @Output() private edit: EventEmitter<BookResponse> = new EventEmitter<BookResponse>();
  @Output() private details: EventEmitter<BookResponse> = new EventEmitter<BookResponse>();


  //methods
  onShowDetails(){
    this.details.emit(this._book);
  }

  onBorrow(){
    this.borrow.emit(this._book);

  }

  onAddToWaitingList(){
    this.addToWatingList.emit(this._book);
  }

  onEdit(){
    this.edit.emit(this._book);
  }

  onShare(){
    this.share.emit(this._book);
  }

  onArchive(){
    this.archive.emit(this._book);
  }

}
