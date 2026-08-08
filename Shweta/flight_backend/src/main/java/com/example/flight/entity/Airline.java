package com.example.flight.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "airlines")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Airline {

    @Id
    @Column(name = "airline_code", length = 3)
    private String airlineCode;

    @Column(name = "name", nullable = false, length = 200)
    private String name;
}