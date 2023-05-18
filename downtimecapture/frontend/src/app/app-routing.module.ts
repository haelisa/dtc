import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PagenotfoundComponent } from './pagenotfound/pagenotfound.component';
import { LandingpageComponent } from './landingpage/landingpage.component';
import { ShowimgComponent } from './showimg/showimg.component';
import { HelloworldComponent } from './helloworld/helloworld/helloworld.component';
import { ScanNewQRCodeComponent } from './scan-new-qrcode/scan-new-qrcode.component';

const routes: Routes = [ 

  { path: ':equipmentno/:eventid/:timestamp/:name/:surname', component: LandingpageComponent },
  { path: 'scan', component: ScanNewQRCodeComponent },
  // { path: ':equipmentno/:eventid/:timestamp/:name/:surname/img/show/:imgid', component: ShowimgComponent },
  { path: '', component: HelloworldComponent },
  { path: '**', component: PagenotfoundComponent }];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
