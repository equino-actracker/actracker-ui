import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { Share } from '../share';

@Component({
  selector: 'app-share-list',
  templateUrl: './share-list.component.html',
  styleUrls: ['./share-list.component.css']
})
export class ShareListComponent implements OnInit {

  @Input()
  shares!: Share[];

  @Output()
  onShareAdd: EventEmitter<Share> = new EventEmitter();

  shareToAdd?: Share;

  constructor() { }

  ngOnInit(): void {
  }

  initShareCreate() {
    this.shareToAdd = {granteeName: ''};
  }

  addShare(share: Share) {
    this.onShareAdd.emit(share);
    this.shareToAdd = undefined;
  }

}
