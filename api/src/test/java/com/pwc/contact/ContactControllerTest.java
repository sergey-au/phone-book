package com.pwc.contact;

import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.fasterxml.jackson.databind.ObjectMapper;
import java.util.HashSet;
import java.util.Optional;
import lombok.extern.slf4j.Slf4j;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

/**
 * Contact controller integration test.
 */
@SpringBootTest
@AutoConfigureMockMvc
@Slf4j
class ContactControllerTest {

  @Autowired
  private MockMvc mvc;
  @MockBean
  private ContactRepository contactRepository;
  @MockBean
  private BookRepository bookRepository;
  @Autowired
  ObjectMapper objectMapper;


  @Test
  void listBooks_empty() throws Exception {
    mvc.perform(get("/book")
        .contentType(MediaType.APPLICATION_JSON))
        .andExpect(status().isOk())
        .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON))
        .andExpect(content().string("[]"));
    verify(bookRepository, times(1)).findAll();
  }

  @Test
  void addBook() throws Exception {
    Book book = new Book();
    book.setName("Family");
    book.setContacts(new HashSet<>());
    mvc.perform(put("/book")
        .contentType(MediaType.APPLICATION_JSON)
        .content(objectMapper.writeValueAsString(book)))
        .andExpect(status().isOk());
    verify(bookRepository, times(1)).save(book);
  }

  @Test
  void addContact() throws Exception {
    Book book = new Book(1L, "Book1", new HashSet<>());
    Contact contact = new Contact();
    contact.setName("Alex");
    contact.setPhone("0000 444 133");
    Mockito.when(bookRepository.findById(1L)).thenReturn(Optional.of(book));
    mvc.perform(put("/book/1/contact")
        .contentType(MediaType.APPLICATION_JSON)
        .content(objectMapper.writeValueAsString(contact)))
        .andExpect(status().isOk());
    verify(contactRepository, times(1)).save(contact);
    contact.setId(1);
    book.getContacts().add(contact);
    verify(bookRepository, times(1)).save(book);
  }

  @Test
  void deleteContact() throws Exception {
    Book book = new Book(1L, "Book1", new HashSet<>());
    Contact contact = new Contact(1L, "Sergey", "1111 000 333");
    book.getContacts().add(contact);
    Mockito.when(bookRepository.findById(1L)).thenReturn(Optional.of(book));
    Mockito.when(contactRepository.findById(1L)).thenReturn(Optional.of(contact));
    mvc.perform(delete("/book/1/contact/1")).andExpect(status().isOk());
    verify(contactRepository, times(1)).deleteById(contact.getId());
    book.getContacts().remove(contact);
    verify(bookRepository, times(1)).save(book);
  }

  @Test
  void deleteBook() throws Exception {
    mvc.perform(delete("/book/1")).andExpect(status().isOk());
    verify(bookRepository, times(1)).deleteById(1L);
  }

}
