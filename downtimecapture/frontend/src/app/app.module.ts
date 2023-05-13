import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HelloworldComponent } from './helloworld/helloworld/helloworld.component';
import { PagenotfoundComponent } from './pagenotfound/pagenotfound.component';
import { LandingpageComponent } from './landingpage/landingpage.component';
import { ShowimgComponent } from './showimg/showimg.component';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    AppComponent,
    HelloworldComponent,
    PagenotfoundComponent,
    LandingpageComponent,
    ShowimgComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
