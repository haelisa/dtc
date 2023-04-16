// @ts-nocheck
import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-helloworld',
  templateUrl: './helloworld.component.html',
  styleUrls: ['./helloworld.component.css']
})
export class HelloworldComponent implements OnInit {

  results!: string;  
  // results: {[index: string]:any} = {}

  constructor(private client: HttpClient) { }

  ngOnInit() {
    this.client.get('http://localhost:3000/').subscribe(data => { 
      this.results = data['hi']; 
      console.log(data)
    })
  }

}