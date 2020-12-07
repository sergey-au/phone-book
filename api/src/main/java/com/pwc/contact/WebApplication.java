package com.pwc.contact;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * Contacts Web Application.
 */
@SpringBootApplication
public class WebApplication {

  /**
   * Starts Spring boot application.
   *
   * @param args the command line arguments.
   */
  public static void main(String[] args) {
    SpringApplication.run(WebApplication.class, args);
  }

}
