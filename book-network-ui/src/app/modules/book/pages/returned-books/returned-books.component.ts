import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { BookResponse, PageResponseBorrowedBookResponse } from '../../../../services/models';
import { BookService } from '../../../../services/services';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-returned-books',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './returned-books.component.html',
  styleUrl: './returned-books.component.scss'
})
export class ReturnedBooksComponent implements OnInit{
  page:number = 0;
  size:number = 3;
  pages:Array<number> = []
  returnedBooks:PageResponseBorrowedBookResponse= {}

  constructor(
    private bookService:BookService,
    private toastrService: ToastrService
  ){}

  ngOnInit(): void {
    this.findAllReturnedBooks();
  }


  findAllReturnedBooks(){
    this.bookService.findAllReturnedBooks({
      page: this.page,
      size: this.size
    }).subscribe({
      next: (res) => {
        this.returnedBooks = res;
      },
      error:(err) => {
        console.log(err)
      }
    })
  }

  approveBookReturn(book:BookResponse){
      this.bookService.approveReturnBorrowedBook({
        'book-id': book.id as number
      }).subscribe({
        next: () => {
          this.toastrService.success('Return approved successfully', 'Done!')
          this.findAllReturnedBooks();
        },
        error:(err) => {
          this.toastrService.error(err.error.error, 'Oops');
        }
      })
  }

  // pagination
  goToFirstPage(){
    this.page = 0;
    this.findAllReturnedBooks();
  }

  goToPreviousPage(){
    this.page--;
    this.findAllReturnedBooks();
  }

  gotToPage(page:number){
    this.page = page;
    this.findAllReturnedBooks();
  }

  goToNextPage(){
    this.page++;
    this.findAllReturnedBooks();
  }

  goToLastPage(){
    this.page = this.returnedBooks.totalPages as number - 1;
    this.findAllReturnedBooks();
  }

  get isLastPage():boolean{
    return this.page == this.returnedBooks.totalPages as number - 1;
  }
}
