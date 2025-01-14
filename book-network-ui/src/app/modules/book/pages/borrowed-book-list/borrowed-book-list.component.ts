import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { BookResponse, BorrowedBookResponse, FeedbackRequest, PageResponseBookResponse, PageResponseBorrowedBookResponse } from '../../../../services/models';
import { BookService, FeedbackService } from '../../../../services/services';
import { FormsModule } from '@angular/forms';
import { RatingComponent } from "../../components/rating/rating.component";
import { RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-borrowed-book-list',
  standalone: true,
  imports: [RouterLink,CommonModule, FormsModule, RatingComponent],
  templateUrl: './borrowed-book-list.component.html',
  styleUrl: './borrowed-book-list.component.scss'
})
export class BorrowedBookListComponent implements OnInit{
  page:number = 0;
  size:number = 3;
  borrowedBooks:PageResponseBorrowedBookResponse = {}
  selectedBook: BorrowedBookResponse | undefined;
  pages:any = []
  feedbackRequest:FeedbackRequest = { bookId: 0, comment: ''}



  constructor(
    private bookService:BookService,
    private feedbackService:FeedbackService,
    private toastrService: ToastrService
  ){}


  ngOnInit(): void {
    this.findAllBorrowedBooks();
  }

  findAllBorrowedBooks(){
    this.bookService.findAllBorrowedBooks({
      page: this.page,
      size: this.size
    }).subscribe({
      next:(res:PageResponseBookResponse) =>{
        this.borrowedBooks = res;
        this.pages = Array(res.totalPages).fill(0).map((x,i)=> i);
      }
    })
  }

  returnBorrowedBook(book:any){
    this.selectedBook = book; 
    this.feedbackRequest.bookId = book.id;
  }

  //
  returnBook(withFeedBack:boolean){
    
    this.bookService.returnBorrowedBook({
      "book-id": this.selectedBook?.id as number
    }).subscribe({
      next: ()=> {
        this.toastrService.success('Book successfully returned', 'Done!');
        console.log("success");
        if(withFeedBack){
          this.giveFeedback();
        }        
        this.selectedBook = undefined;
        this.findAllBorrowedBooks();
      }
    })
  }

  giveFeedback(){
    this.feedbackService.saveFeedback({
      body: this.feedbackRequest
    }).subscribe({
      next:()=> {
      }
    })
  }

  goToFirstPage(){
    this.page = 0;
    this.findAllBorrowedBooks();
  }

  goToPreviousPage(){
    this.page--;
    this.findAllBorrowedBooks();
  }

  gotToPage(page:number){
    this.page = page;
    this.findAllBorrowedBooks();
  }

  goToNextPage(){
    this.page++;
    this.findAllBorrowedBooks();
  }

  goToLastPage(){
    this.page = this.borrowedBooks.totalPages as number - 1;
    this.findAllBorrowedBooks();
  }

  get isLastPage():boolean{
    return this.page == this.borrowedBooks.totalPages as number - 1;
  }

}
