import { Component, OnInit } from '@angular/core';
import { BookCardComponent } from "../../components/book-card/book-card.component";
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { BookService } from '../../../../services/services';
import { BookResponse, PageResponseBookResponse } from '../../../../services/models';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-my-books',
  standalone: true,
  imports: [BookCardComponent, CommonModule,RouterLink,RouterOutlet],
  templateUrl: './my-books.component.html',
  styleUrl: './my-books.component.scss'
})
export class MyBooksComponent implements OnInit{

  bookResponse:PageResponseBookResponse = {};
  page:number = 0;
  size:number = 3;
  pages:any = [];

  constructor(
    private router:Router,
    private bookService:BookService
  ){}

  ngOnInit(): void {
    this.findAllAllBooks();
  }

  findAllAllBooks(){
    this.bookService.findAllBooksByOwner({
      page: this.page, 
      size: this.size
    }).subscribe({
      next:(res:PageResponseBookResponse) =>{
          this.bookResponse = res;
          this.pages = Array(res.totalPages).fill(0).map((x,i)=> i);
      },
      error:(err) => {

      }
    })
  };

  borrowBook(book:BookResponse) {
    this.bookService.borrowBook({
      "book-id": book.id as number
    }).subscribe({
      next:(res) =>{
        
      },
      error:(err) => {
       
      }
    })
  }

  //pagination methods
  goToFirstPage(){
    this.page = 0;
    this.findAllAllBooks();
  }

  goToPreviousPage(){
    this.page--;
    this.findAllAllBooks();
  }

  gotToPage(page:number){
    this.page = page;
    this.findAllAllBooks();
  }

  goToNextPage(){
    this.page++;
    this.findAllAllBooks();
  }

  goToLastPage(){
    this.page = this.bookResponse.totalPages as number - 1;
    this.findAllAllBooks();
  }

  get isLastPage():boolean{
    return this.page == this.bookResponse.totalPages as number - 1;
  }

  archiveBook(book:BookResponse){
    this.bookService.updateArchivedStatus({
      'book-id': book.id as number
    }).subscribe({
      next: () =>{
        book.archived = !book.archived;
      }
    })
  }

  editBook(book:BookResponse){
    this.router.navigate(['books', 'manage', book.id])
  }

  shareBook(book:BookResponse){
    this.bookService.updateSharableStatus({
      "book-id": book.id as number
    }).subscribe({
      next: () =>{
        book.sharable = !book.sharable;
      }
    })
  }
}
