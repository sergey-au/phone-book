package com.pwc.contact;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * Contact repository.
 */
@Repository
public interface BookRepository extends JpaRepository<Book, Long> {

}
