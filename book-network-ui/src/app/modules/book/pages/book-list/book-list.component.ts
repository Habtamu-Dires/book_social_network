import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BookService } from '../../../../services/services';
import { BookResponse, PageResponseBookResponse } from '../../../../services/models';
import { CommonModule } from '@angular/common';
import { BookCardComponent } from "../../components/book-card/book-card.component";
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-book-list',
  standalone: true,
  imports: [CommonModule, BookCardComponent],
  templateUrl: './book-list.component.html',
  styleUrl: './book-list.component.scss'
})
export class BookListComponent implements OnInit{

  bookResponse:PageResponseBookResponse = {};
  page:number = 0;
  size:number = 3;
  pages:any = [];

  constructor(
    private router:Router,
    private bookService:BookService,
    private toastrService:ToastrService
  ){}

  ngOnInit(): void {
    this.findAllBooks();
  }

  findAllBooks(){
    this.bookService.findAllBooks({
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
        this.toastrService.success('Book successfully added to your list','Done!')
      },
      error:(err) => {
        this.toastrService.error(err.error.error, 'Oops')
      }
    })
  }

  //pagination methods
  goToFirstPage(){
    this.page = 0;
    this.findAllBooks();
  }

  goToPreviousPage(){
    this.page--;
    this.findAllBooks();
  }

  gotToPage(page:number){
    this.page = page;
    this.findAllBooks();
  }

  goToNextPage(){
    this.page++;
    this.findAllBooks();
  }

  goToLastPage(){
    this.page = this.bookResponse.totalPages as number - 1;
    this.findAllBooks();
  }

  get isLastPage():boolean{
    return this.page == this.bookResponse.totalPages as number - 1;
  }
    
}
