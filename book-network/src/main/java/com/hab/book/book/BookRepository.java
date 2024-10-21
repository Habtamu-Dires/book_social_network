package com.hab.book.book;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;

public interface BookRepository extends JpaRepository<Book, Integer>, JpaSpecificationExecutor<Book> {

    @Query("""
            SELECT book FROM Book book
            WHERE book.archived = false 
            AND book.sharable = true 
            AND book.owner.id != :user_id
            """)
    Page<Book> findAllDisplayableBooks(Pageable pageable, Integer user_id);
}
