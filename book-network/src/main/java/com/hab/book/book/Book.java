package com.hab.book.book;


import com.hab.book.common.BaseEntity;
import com.hab.book.feedback.Feedback;
import com.hab.book.history.BookTransactionHistory;
import com.hab.book.user.User;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

import java.util.List;

@Getter
@Setter
@SuperBuilder
@AllArgsConstructor
@NoArgsConstructor
@Entity
public class Book  extends BaseEntity {

    private String  title;
    private String authorName;
    private String isbn;
    private String synopsis;
    private String bookCover;
    private boolean archived;
    private boolean sharable;

//    @ManyToOne
//    @JoinColumn(name = "owner_id")
//    private User owner;

    @OneToMany(mappedBy = "book")
    private List<Feedback> feedbacks;

    @OneToMany(mappedBy = "book")
    private List<BookTransactionHistory> histories;

    @Transient
    public double getRate(){
       if(feedbacks == null || feedbacks.isEmpty()){
           return 0.0;
       }
      var rate = feedbacks.stream()
               .mapToDouble(Feedback::getNote)
               .average()
               .orElse(0.0);

       double roundedRate = Math.round(rate * 10.0) / 10.0;

       return  roundedRate;
    }

}
