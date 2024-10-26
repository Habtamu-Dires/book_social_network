package com.hab.book.history;

import com.hab.book.book.Book;
import com.hab.book.common.BaseEntity;
import com.hab.book.user.User;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

@Getter
@Setter
@SuperBuilder
@AllArgsConstructor
@NoArgsConstructor
@Entity
public class BookTransactionHistory extends BaseEntity {

//    @ManyToOne
//    @JoinColumn(name = "user_id")
//    private User user;

    @Column(name = "user_id")
    private String userId;

    @ManyToOne
    @JoinColumn(name = "book_id")
    private Book book;
    private boolean returned;
    private boolean returnApproved;

}
