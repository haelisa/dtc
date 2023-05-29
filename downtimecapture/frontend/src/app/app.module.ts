import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

//Componenten
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HelloworldComponent } from './helloworld/helloworld/helloworld.component';
import { PagenotfoundComponent } from './pagenotfound/pagenotfound.component';
import { LandingpageComponent } from './landingpage/landingpage.component';
import { ShowimgComponent } from './showimg/showimg.component';
import { FormsModule } from '@angular/forms';
import { ModalComponent } from './landingpage/modalsuccess/modal.component';
import { EditImageComponent } from './landingpage/edit-image-modal/edit-image.component';
import { ScanNewQRCodeComponent } from './scan-new-qrcode/scan-new-qrcode.component';
import { CanceldtmComponent } from './canceldtm/canceldtm.component';

//Popup
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatDialogModule } from '@angular/material/dialog';

//Edit Image & Compress
// import { ImageDrawingModule  } from 'ngx-image-drawing';
import { NgxImageCompressService } from 'ngx-image-compress';

//QR-Code Scanner
import { ZXingScannerModule } from '@zxing/ngx-scanner';


@NgModule({
  declarations: [
    AppComponent,
    HelloworldComponent,
    PagenotfoundComponent,
    LandingpageComponent,
    ShowimgComponent,
    ModalComponent,
    EditImageComponent,
    ScanNewQRCodeComponent,
    CanceldtmComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    BrowserAnimationsModule,
    MatDialogModule,
    // ImageDrawingModule,
    ZXingScannerModule
  ],
  providers: [NgxImageCompressService],
  bootstrap: [AppComponent]
})
export class AppModule { }
