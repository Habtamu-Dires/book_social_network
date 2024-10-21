package com.hab.book.book;

import com.hab.book.common.PageResponse;
import com.hab.book.exception.OperationNotPermittedException;
import com.hab.book.file.FileStorageService;
import com.hab.book.history.BookTransactionHistory;
import com.hab.book.history.BookTransactionHistoryRepository;
import com.hab.book.user.User;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Objects;

import static com.hab.book.book.BookSpecification.withOwnerId;

@Service
@RequiredArgsConstructor
public class BookService {

    private final BookRepository bookRepository;
    private final BookMapper bookMapper;
    private final BookTransactionHistoryRepository transactionHistoryRepository;
    private final FileStorageService fileStorageService;

    public Integer save(BookRequest request, Authentication connectedUser) {
        User user = ((User) connectedUser.getPrincipal());
        Book book = bookMapper.toBook(request);
        book.setOwner(user);
        return bookRepository.save(book).getId();
    }

    public BookResponse findById(Integer bookId) {
      return   bookRepository.findById(bookId)
              .map(bookMapper::toBookResponse)
              .orElseThrow(() -> new EntityNotFoundException(String.format(
                      "The book with id :: %s not found ", bookId
              )));

    }

    public PageResponse<BookResponse> findAllBooks(
            int page, int size, Authentication connectedUser)
    {
        User user = ((User) connectedUser.getPrincipal());
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdDate").descending());
        Page<Book> books = bookRepository.findAllDisplayableBooks(pageable, user.getId());

        List<BookResponse> bookResponses = books.stream()
                .map(bookMapper::toBookResponse)
                .toList();

        return PageResponse.<BookResponse>builder()
                .content(bookResponses)
                .number(books.getNumber())
                .size(books.getSize())
                .totalElements(books.getTotalElements())
                .totalPages(books.getTotalPages())
                .first(books.isFirst())
                .last(books.isLast())
                .build();
    }

    public PageResponse<BookResponse> findAllBooksByOwner(
            int page, int size, Authentication connectedUser) {
        User user = ((User) connectedUser.getPrincipal());
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdDate").descending());
        Page<Book> books = bookRepository.findAll(withOwnerId(user.getId()),pageable);

        List<BookResponse> bookResponses = books.stream()
                .map(bookMapper::toBookResponse)
                .toList();

        return PageResponse.<BookResponse>builder()
                .content(bookResponses)
                .number(books.getNumber())
                .size(books.getSize())
                .totalElements(books.getTotalElements())
                .totalPages(books.getTotalPages())
                .first(books.isFirst())
                .last(books.isLast())
                .build();
    }

    public PageResponse<BorrowedBookResponse> findAllBorrowedBooks(
            int page, int size, Authentication connectedUser) {
        User user = ((User) connectedUser.getPrincipal());
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdDate").descending());
        Page<BookTransactionHistory> allBorrowedBooks = transactionHistoryRepository
                .findAllBorrowedBooks(pageable,user.getId());

        List<BorrowedBookResponse> borrowedBookResponses = allBorrowedBooks.stream()
                .map(bookMapper::toBorrowedBookResponse)
                .toList();

        return  PageResponse.<BorrowedBookResponse>builder()
                .content(borrowedBookResponses)
                .number(allBorrowedBooks.getNumber())
                .size(allBorrowedBooks.getSize())
                .totalElements(allBorrowedBooks.getTotalElements())
                .totalPages(allBorrowedBooks.getTotalPages())
                .first(allBorrowedBooks.isFirst())
                .last(allBorrowedBooks.isLast())
                .build();
    }

    public PageResponse<BorrowedBookResponse> findAllReturnedBooks(int page, int size, Authentication connectedUser) {
        User user = ((User) connectedUser.getPrincipal());
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdDate").descending());
        Page<BookTransactionHistory> allBorrowedBooks = transactionHistoryRepository
                .findAllReturnedBooks(pageable,user.getId());

        List<BorrowedBookResponse> borrowedBookResponses = allBorrowedBooks.stream()
                .map(bookMapper::toBorrowedBookResponse)
                .toList();

        return  PageResponse.<BorrowedBookResponse>builder()
                .content(borrowedBookResponses)
                .number(allBorrowedBooks.getNumber())
                .size(allBorrowedBooks.getSize())
                .totalElements(allBorrowedBooks.getTotalElements())
                .totalPages(allBorrowedBooks.getTotalPages())
                .first(allBorrowedBooks.isFirst())
                .last(allBorrowedBooks.isLast())
                .build();
    }

    public Integer updateSharableStatus(Integer bookId, Authentication connectedUser) {
        Book book = bookRepository.findById(bookId)
                .orElseThrow(() -> new EntityNotFoundException(String.format(
                        "No book found with id %d", bookId
                )));
        User user = ((User)connectedUser.getPrincipal());
        if(!Objects.equals(book.getOwner().getId(), user.getId())){
            //throw exception
            throw new OperationNotPermittedException("User can not update book sharable status");
        }
        book.setSharable(!book.isSharable());

        bookRepository.save(book);
        return bookId;
    }

    public Integer updateArchivedStatus(Integer bookId, Authentication connectedUser) {
        Book book = bookRepository.findById(bookId)
                .orElseThrow(() -> new EntityNotFoundException(String.format(
                        "No book found with id %d", bookId
                )));
        User user = ((User)connectedUser.getPrincipal());
        if(!Objects.equals(book.getOwner().getId(), user.getId())){
            //throw exception
            throw new OperationNotPermittedException("User can not update book sharable status");
        }
        book.setArchived(!book.isArchived());

        bookRepository.save(book);
        return bookId;
    }

    public Integer borrowBook(Integer bookId, Authentication connectedUser) {
        Book book = bookRepository.findById(bookId)
                .orElseThrow(() -> new EntityNotFoundException(String.format(
                        "Book with id %d not found ", bookId
                )) );
        if(book.isArchived() || !book.isSharable()){
            throw new OperationNotPermittedException("The requested book can not be borrowed");
        }
        User user = ((User)connectedUser.getPrincipal());

        if(Objects.equals(book.getOwner().getId(), user.getId())){
            throw new OperationNotPermittedException("You can not borrow your own book");
        }
        final boolean isAlreadyBorrowed = transactionHistoryRepository
                .isAlreadyBorrowedByUser(bookId, user.getId());

        if(isAlreadyBorrowed){
            throw new OperationNotPermittedException("The requested book is already borrowed");
        }

        //let's borrow it
       BookTransactionHistory bookTransactionHistory = BookTransactionHistory.builder()
                       .user(user)
                       .book(book)
                       .returned(false)
                       .returnApproved(false)
                       .build();

       return transactionHistoryRepository.save(bookTransactionHistory).getId();
    }

    public Integer returnBorrowedBook(Integer bookId, Authentication connectedUser) {
        Book book = bookRepository.findById(bookId)
                .orElseThrow(() -> new EntityNotFoundException(String.format(
                        "Book with id %d not found ", bookId
                )) );

        if(book.isArchived() || !book.isSharable()){
            throw new OperationNotPermittedException("The requested book can not be returned");
        }
        User user = ((User)connectedUser.getPrincipal());

        if(Objects.equals(book.getOwner().getId(), user.getId())){
            throw new OperationNotPermittedException("You can not borrow / return your own book");
        }
        System.out.println("the book id " + bookId + " and user id " + user.getId());
        BookTransactionHistory bookTransactionHistory = transactionHistoryRepository
                .findByBookIdAndUserId(bookId,user.getId())
                .orElseThrow(() -> new OperationNotPermittedException(
                        "You didn't borrow this book"));

        bookTransactionHistory.setReturned(true);
        return transactionHistoryRepository.save(bookTransactionHistory).getId();
    }

    public Integer approveReturnBorrowedBook(Integer bookId, Authentication connectedUser) {
        Book book = bookRepository.findById(bookId)
                .orElseThrow(() -> new EntityNotFoundException(String.format(
                        "Book with id %d not found ", bookId
                )) );

        if(book.isArchived() || !book.isSharable()){
            throw new OperationNotPermittedException("The requested book can not be returned");
        }
        User user = ((User)connectedUser.getPrincipal());

        if(!Objects.equals(book.getOwner().getId(), user.getId())){
            throw new OperationNotPermittedException("You did not own the book");
        }

        BookTransactionHistory bookTransactionHistory = transactionHistoryRepository
                .findByBookIdAndOwnerId(bookId,user.getId())
                .orElseThrow(() -> new OperationNotPermittedException(
                        "The book yet to be returned / not being borrowed"));

        bookTransactionHistory.setReturnApproved(true);

        return transactionHistoryRepository.save(bookTransactionHistory).getId();

    }

    public void uploadBookCoverPicture(MultipartFile file, Integer bookId, Authentication connectedUser) {
        Book book = bookRepository.findById(bookId)
                .orElseThrow(() -> new EntityNotFoundException("No book found with id :: " + bookId));

        User user = ((User)connectedUser.getPrincipal());
        var bookCover = fileStorageService.saveFile(file,user.getId());
        book.setBookCover(bookCover);

        bookRepository.save(book);
    }
}
