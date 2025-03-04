package com.example.portfolio.controller;

import com.example.portfolio.model.ContactForm;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
// import org.springframework.mail.SimpleMailMessage;
// import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/api/contact")
public class ContactController {

    // @Autowired
    // private JavaMailSender mailSender;

    // @PostMapping
    // public ResponseEntity<String> sendMessage(@RequestBody ContactForm form) {
    //     try {
    //         SimpleMailMessage message = new SimpleMailMessage();
    //         message.setTo("pranav.chand@yahoo.com"); // your receiving email
    //         message.setSubject("New Contact Message from " + form.getName());
    //         message.setText("Email: " + form.getEmail() + "\n\nMessage:\n" + form.getMessage());
            
    //         // Send email
    //         mailSender.send(message);
    //         return new ResponseEntity<>("Message sent", HttpStatus.OK);
    //     } catch (Exception e) {
    //         e.printStackTrace(); // This will print the error to your console
    //         return new ResponseEntity<>("Error sending message: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
    //     }
    // }
    

    
}
