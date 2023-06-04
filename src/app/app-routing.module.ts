import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ImageListComponent } from './image-list/image-list.component';
import { ImageList2Component } from './image-list2/image-list2.component';
import { CarouselComponent } from './carousel/carousel.component';

const routes: Routes = [
 {path:'',component:ImageList2Component},
 {path:'imageList', component:ImageListComponent},
 {path:'carousel', component:CarouselComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
