import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  QueryList,
  ViewChildren,
} from '@angular/core';
import { ImageService } from '../image.service';

@Component({
  selector: 'app-image-list2',
  templateUrl: './image-list2.component.html',
  styleUrls: ['./image-list2.component.scss'],
})
export class ImageList2Component implements OnInit, AfterViewInit {
  @ViewChildren('lastItem') lastItem!: QueryList<ElementRef>;

  items: any[] = [];
  page = 1;
  perPage = 25;
  isLoading: boolean = false;
  observer!:IntersectionObserver
  constructor(private imageService: ImageService) {}

  ngOnInit(): void {
    this.loadItems();
    // this.intersectionObserver()
  }
  ngAfterViewInit(): void {
    // this.lastItem.changes.subscribe(d=>{
    //   console.log(d);
      
    //   if(d.last){
    //     this.observer.observe(d.last.nativeElement)
    //   }
    // })
  }

  // intersectionObserver() {
  //   let options = {
  //     root: null,
  //     rootMargin: '0px',
  //     threshold: 1.0,
  //   };
  //   this.observer = new IntersectionObserver((entries) => {
  //     if (entries[0].isIntersecting) {
  //       console.log('scroll more');
  //       this.loadItems()
  //     }
  //   }, options);
  // }


  loadItems() {
    this.isLoading = true;
    this.imageService.getItems(this.page, this.perPage).subscribe((items) => {
      this.items.push(...items.photos);
      console.log(items);
      this.page++;
      this.isLoading = false;
    });
  }
}
