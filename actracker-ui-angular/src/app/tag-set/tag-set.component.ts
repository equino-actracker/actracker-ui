import { Component, OnInit, Input } from '@angular/core';

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
  renameMode?: boolean;
  @Input()
  newName?: string;

  constructor(
    private tagSetService: TagSetService
  ) { }

  ngOnInit(): void {
  }

  initRename() {
    this.newName = this.tagSet.name;
    this.renameMode = true;
  }

  rename() {
    this.tagSetService.renameTagSet(this.tagSet, this.newName!)
      .subscribe(updatedTagSet =>
        this.tagSet = updatedTagSet
      );
    this.renameMode = false;
  }

  addNewTag(tag: Tag): void {
    this.tagSetService.addTagToSet(this.tagSet, tag)
      .subscribe(updatedTagSet => {
        this.tagSet = updatedTagSet;
        this.tagSetService.resolveTagDetails([this.tagSet]);
      });
  }

  deleteTag(tag: Tag): void {
    this.tagSetService.removeTagFromSet(this.tagSet, tag)
      .subscribe(updatedTagSet => {
        this.tagSet = updatedTagSet;
        this.tagSetService.resolveTagDetails([this.tagSet]);
      });
  }

}
