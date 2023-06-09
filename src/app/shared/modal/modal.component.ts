import { Component, ElementRef, Input, OnDestroy, OnInit } from '@angular/core';
import { ModalService } from 'src/app/services/modal.service';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
})
export class ModalComponent implements OnInit, OnDestroy {
  @Input() bgColor!: string;

  constructor(public modal: ModalService, private el: ElementRef) {}
  ngOnInit(): void {
    this.modal.isModalOpen.subscribe((open) => {
      document.body.appendChild(this.el.nativeElement);
    });
  }
  closeModal() {
    this.modal.isModalOpen.next(false);
    document.body.removeChild(this.el.nativeElement);
  }
  ngOnDestroy(): void {
    document.body.removeChild(this.el.nativeElement);
  }
}
