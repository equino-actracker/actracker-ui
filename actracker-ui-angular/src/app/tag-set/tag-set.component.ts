import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { TagSetService } from '../tag-set.service';

import { TagSet } from '../tagSet';
import { Tag } from '../tag';

@Component({
  selector: 'app-tag-set',
  templateUrl: './tag-set.component.html',
  styleUrls: ['./tag-set.component.css']
})
export class TagSetComponent implements OnInit {

  @Input()
  tagSet!: TagSet;
  @Input()
  editMode?: boolean;

  @Output()
  public onTagSetSave: EventEmitter<TagSet> = new EventEmitter();

  constructor(
    private tagSetService: TagSetService
  ) { }

  ngOnInit(): void {
  }

  save() {
    if(!this.tagSet) {
      return;
    }
    this.onTagSetSave.emit(this.tagSet);
    this.editMode = false;
  }

  edit() {
    this.editMode = true;
  }

  addNewTag(tag: Tag): void {
    this.tagSet.tags.unshift(tag);
  }

  deleteTag(tag: Tag): void {
    this.tagSet.tags = this.tagSet.tags.filter(t => t !== tag)
  }

}
