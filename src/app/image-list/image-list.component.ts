import { Component, HostListener, OnInit } from '@angular/core';
import { ImageService } from '../image.service';

@Component({
  selector: 'app-image-list',
  templateUrl: './image-list.component.html',
  styleUrls: ['./image-list.component.scss'],
})
export class ImageListComponent implements OnInit {
  items: any[] = [];
  page = 1;
  perPage = 50;
  isLoading:boolean=false;
  numberOfClicks = 0;

  constructor(private imageService: ImageService) {}
  ngOnInit(): void {
    this.loadItems();
  }
  @HostListener('window:scroll',['$event'])
  onWindowScroll(event:any){
    
    if(window.innerHeight+window.scrollY>=document.body.offsetHeight&&!this.isLoading){
      console.log(event);
      this.loadItems()
    }
  }
  loadItems() {
    this.isLoading=true;
    this.imageService.getItems(this.page, this.perPage).subscribe((items) => {
      this.items.push(...items.photos)
      console.log(items);
      this.page++
      this.isLoading=false
    });
  }


}
