import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { TagService } from '../tag.service';

import { Tag } from '../tag';

@Component({
  selector: 'app-tags-selector',
  templateUrl: './tags-selector.component.html',
  styleUrls: ['./tags-selector.component.css']
})
export class TagsSelectorComponent implements OnInit {

  @Input()
  tags!: Tag[];
  @Input()
  editMode?: boolean;

  @Output()
  public onTagDelete: EventEmitter<Tag> = new EventEmitter();
  @Output()
  public onTagAdd: EventEmitter<Tag> = new EventEmitter();

  availableTags?: Tag[];
  matchingTags: Tag[] = [];

  constructor(
    private tagService: TagService
  ) { }

  ngOnInit(): void {
      this.tagService.getTags().subscribe(tagsResult => {
        this.availableTags = tagsResult.tags;
        this.tags.forEach(tag => {tag.name=this.resolveName(tag)});
      });
  }

  resolveName(tag: Tag): string {
    let matchingTag: Tag | undefined = this.availableTags?.find(availableTag => availableTag.id === tag.id);
    let name: string | undefined = matchingTag ? matchingTag.name : tag.id;
    return name ? name : '';
  }

  searchTags() {
    if(!this.availableTags) {
      [];
    } else {
      let tagIds = this.tags.map(t => t.id);
      this.matchingTags = this.availableTags.filter(t => !tagIds.includes(t.id));
    }
  }

  clearSearchResults() {
    this.matchingTags = [];
  }
//
//   addTag(tag: Tag) {
//     this.tags.unshift(tag);
//     this.searchTags();
//   }
//
//   tryAddTag() {
//     if(this.matchingTags.length == 1) {
//       this.addTag(this.matchingTags[0])
//     }
//   }
//
//   deleteTag(tag: Tag): void {
//     this.tags = this.tags.filter(t => t !== tag)
//   }

  addTag(tag: Tag) {
    this.onTagAdd.emit(tag);
  }

  deleteTag(tag: Tag) {
    this.onTagDelete.emit(tag);
  }
}
