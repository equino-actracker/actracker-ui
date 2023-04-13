import { Component, OnInit } from '@angular/core';

import { TagService } from '../tag.service';

import { Tag } from '../tag';

@Component({
  selector: 'app-tag-list',
  templateUrl: './tag-list.component.html',
  styleUrls: ['./tag-list.component.css']
})
export class TagListComponent implements OnInit {

  // TODO add support for next page

  tags: Tag[] = [];

  constructor(
    private tagService: TagService
  ) {}

  ngOnInit(): void {
    this.tagService.searchTags(undefined, undefined, 10, undefined)
      .subscribe(tagsResult => this.tags = tagsResult.tags);
  }

  addTag(): void {
    let newTag: Tag = {}
    this.tags.unshift(newTag)
  }

  deleteTag(tag: Tag): void {
    if(tag.id) {
      this.tagService.deleteTag(tag)
        .subscribe(() => {
          this.tags = this.tags.filter(t => t !== tag)
        })
    } else {
      this.tags = this.tags.filter(t => t !== tag)
    }
  }

}
