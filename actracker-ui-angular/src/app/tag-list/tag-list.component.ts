import { Component, OnInit } from '@angular/core';

import { TagService } from '../tag.service';

import { Tag } from '../tag';

@Component({
  selector: 'app-tag-list',
  templateUrl: './tag-list.component.html',
  styleUrls: ['./tag-list.component.css']
})
export class TagListComponent implements OnInit {

  nextPageId?: string = undefined;
  tags: Tag[] = [];

  addedTags: Tag[] = [];

  constructor(
    private tagService: TagService
  ) {}

  ngOnInit(): void {
    this.fetchNextPage();
  }

  fetchNextPage(): void {
    let pageId = this.nextPageId;
    this.nextPageId = undefined;
    this.tagService.searchTags(undefined, pageId, 10, this.addedTags)
          .subscribe(tagsResult => {
            this.tags = this.tags.concat(tagsResult.tags);
            this.nextPageId = tagsResult.nextPageId;
          });
  }

  addTag(): void {
    let newTag: Tag = {};
    this.tags.unshift(newTag);
    this.addedTags.unshift(newTag);
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
