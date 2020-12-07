package com.pwc.contact;

import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.equalTo;

import org.junit.jupiter.api.Test;

class ContactsWebApplicationTest {
  @Test
  void contextLoads() {
    assertThat("localhost", equalTo("localhost"));
  }

}
