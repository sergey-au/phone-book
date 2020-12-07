package com.pwc.contact;

import java.util.List;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

/**
 * Contacts REST controller.
 */
@AllArgsConstructor
@RestController
@Slf4j
public class ContactController {

  private final BookRepository bookRepository;
  private final ContactRepository contactRepository;

  /**
   * Lists all the books with contacts.
   *
   * @return the list of books.
   */
  @GetMapping("/book")
  public List<Book> listBooks() {
    try {
      return bookRepository.findAll();
    } catch (Throwable throwable) {
      log.error("Failed to list books", throwable);
      throw new ResponseStatusException(HttpStatus.NO_CONTENT, "No books");
    }
  }

  /**
   * Deletes books with specified identifier.
   *
   * @param id the book identifier to delete.
   */
  @DeleteMapping("/book/{id}")
  public void deleteBook(@PathVariable Long id) {
    log.debug("deleteBook {}", id);
    try {
      bookRepository.deleteById(id);
    } catch (Throwable throwable) {
      log.error("Failed to delete book with id: " + id, throwable);
      throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Book not found");
    }
  }

  /**
   * Adds book.
   *
   * @param newBook the new book to add.
   * @return new saved book.
   */
  @PutMapping("/book")
  @ResponseBody
  public Book addBook(@RequestBody Book newBook) {
    log.debug("addBook {}", newBook);
    try {
      return bookRepository.save(newBook);
    } catch (Throwable throwable) {
      log.error("Failed to create new book: " + newBook, throwable);
      throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Could not add book");
    }
  }

  /**
   * Adds new contact to specified book.
   *
   * @param bookId the book identifier.
   * @param contact the new contact.
   * @return the new contact.
   */
  @PutMapping("/book/{id}/contact")
  @ResponseBody
  public Contact addContact(@PathVariable(name = "id") Long bookId, @RequestBody Contact contact) {
    log.debug("addContact bookId:{} contact:{}", bookId, contact);
    try {
      Contact saveContact = contactRepository.save(contact);
      Book book = bookRepository.findById(bookId).orElseThrow();
      book.getContacts().add(saveContact);
      bookRepository.save(book);
      return saveContact;
    } catch (Throwable throwable) {
      log.error("Failed to add contact bookId: " + bookId + " contact: " + contact, throwable);
      throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Book not found");
    }
  }

  /**
   * Delete contact from specified book with specified identifier.
   *
   * @param bookId the book identifier.
   * @param contactId the contact identifier.
   */
  @DeleteMapping("/book/{bookId}/contact/{contactId}")
  public void deleteContact(@PathVariable Long bookId, @PathVariable Long contactId) {
    log.debug("deleteContact bookId:{} contactId:{}", bookId, contactId);
    try {
      Book book = bookRepository.findById(bookId).orElseThrow();
      boolean res = book.getContacts().removeIf(c -> c.getId() == contactId);
      if (!res) {
        throw new Exception("Contact not found");
      }
      bookRepository.save(book);
      contactRepository.deleteById(contactId);
    } catch (Throwable throwable) {
      log.error("Failed to remove contact bookId: " + bookId + " contactId: " + contactId,
          throwable);
      throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Failed to remove contact");
    }
  }

}
