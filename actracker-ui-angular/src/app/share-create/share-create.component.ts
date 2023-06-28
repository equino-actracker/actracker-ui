import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { Share } from '../share';

@Component({
  selector: 'app-share-create',
  templateUrl: './share-create.component.html',
  styleUrls: ['./share-create.component.css']
})
export class ShareCreateComponent implements OnInit {

  @Input()
  share!: Share;

  @Output()
  onShareAdd: EventEmitter<Share> = new EventEmitter();

  constructor() { }

  ngOnInit(): void {
  }

  createShare() {
    this.onShareAdd.emit(this.share);
  }

}
