import { Component, OnInit, Input } from '@angular/core';

import { Tag } from '../tag';

@Component({
  selector: 'app-activity-tags',
  templateUrl: './activity-tags.component.html',
  styleUrls: ['./activity-tags.component.css']
})
export class ActivityTagsComponent implements OnInit {

  @Input()
  tags!: Tag[];

  constructor() { }

  ngOnInit(): void {
  }

}
