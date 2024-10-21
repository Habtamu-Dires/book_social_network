import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { BookRequest, BookResponse } from '../../../../services/models';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { BookService } from '../../../../services/services';

@Component({
  selector: 'app-manage-book',
  standalone: true,
  imports: [CommonModule,FormsModule,RouterLink],
  templateUrl: './manage-book.component.html',
  styleUrl: './manage-book.component.scss'
})
export class ManageBookComponent implements OnInit{
  errorMsg: Array<string> = [];
  selectedBookCover:any;
  selectedPicture:string | undefined;
  bookRequest:BookRequest = {
    authorName: '',
    isbn: '',
    synopsis: '',
    title: ''
  };

  constructor(
    private bookService:BookService,
    private router:Router,
    private activatedRoute:ActivatedRoute
  ){}

  ngOnInit(): void {
    const bookId = this.activatedRoute.snapshot.params['bookId'];
    if(bookId){
      this.bookService.findBookById({
        'book-id': bookId
      }).subscribe({
        next: (book:BookResponse) => {
            this.bookRequest ={
             id: book.id,
             title: book.title as string,
             authorName: book.authorName as string,
             isbn: book.isbn as string,
             synopsis: book.synopsis as string,
             sharable: book.sharable
            }
            if(book.cover){
              this.selectedPicture = 'data:image/jpg;base64,' + book.cover;
            }
        }
      })
    }
  }


  onFileSelected(event:any) {
    this.selectedBookCover = event.target.files[0];
    if(this.selectedBookCover != null){
      const reader = new FileReader();
      reader.onload = () => {
        this.selectedPicture = reader.result as string;
        console.log(this.selectedPicture)
      }
      reader.readAsDataURL(this.selectedBookCover);
    }
  }

  saveBook() {
    this.bookService.saveBook({
      body: this.bookRequest
    }).subscribe({
      next:(bookId:number) =>{
        //if successful let upload book picture
        this.bookService.uploadBookCoverPicture({
          "book-id":bookId,
          body: {
            file : this.selectedBookCover
          }
        }).subscribe({
          next:() =>{
              this.router.navigate(['/books/my-books'])
          }
        })
      },
      error:(err) =>{
        console.log(err);
        this.errorMsg = err.error.validationErrors;
      }
    })
  }


}
