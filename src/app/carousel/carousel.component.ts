import {
  AfterViewInit,
  Component,
  ElementRef,
  QueryList,
  ViewChildren,
} from '@angular/core';
import { ModalService } from '../services/modal.service';

@Component({
  selector: 'app-carousel',
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.scss'],
})
export class CarouselComponent implements AfterViewInit {
  @ViewChildren('slides') slideSelector!: QueryList<ElementRef>;
  counter = 0;
  disablePrev = true;
  disableNext = false;
  photo!: any;
  public slides = [
    {
      photographer: 'Aashish',
      src: 'https://images.pexels.com/photos/16968296/pexels-photo-16968296.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    },
    {
      photographer: 'Aash',
      src: 'https://images.pexels.com/photos/16961243/pexels-photo-16961243.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    },
    {
      photographer: 'hish',
      src: 'https://images.pexels.com/photos/17075261/pexels-photo-17075261.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    },
    {
      photographer: 'shish',
      src: 'https://images.pexels.com/photos/17059189/pexels-photo-17059189.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    },
  ];

  constructor(private modal: ModalService) {}

  ngAfterViewInit(): void {
    this.slideSelector.forEach((slide, index) => {
      if (index != 0) slide.nativeElement.style.display = 'none';
    });
  }

  controls(action: string) {
    if (action === 'prev') {
      this.disablePrev = false;
      this.disableNext = false;
      if (this.counter > 0) {
        this.counter--;
      }
      if (this.counter === 0) {
        this.disablePrev = true;
      }

      this.slideSelector.forEach((slide, index) => {
        slide.nativeElement.style.display = 'none';
        if (index === this.counter) slide.nativeElement.style.display = 'block';
      });
    } else {
      this.disableNext = false;
      this.disablePrev = false;

      if (this.counter < this.slideSelector.length - 1) {
        this.counter++;
      }
      if (this.counter === this.slideSelector.length - 1) {
        this.disableNext = true;
      }

      this.slideSelector.forEach((slide, index) => {
        slide.nativeElement.style.display = 'none';
        if (index === this.counter) slide.nativeElement.style.display = 'block';
      });
    }
  }

  activePhoto(photo: any) {
    this.photo = photo;
    this.modal.isModalOpen.next(true);
  }
}
