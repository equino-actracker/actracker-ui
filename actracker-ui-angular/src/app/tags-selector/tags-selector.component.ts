import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Observable, Subject } from 'rxjs'
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators'

import { TagService } from '../tag.service';

import { Tag } from '../tag';
import { TagsResult } from '../tagsResult'

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

  searchTerm: string = '';
  showMatchingTags: boolean = false;

  @Output()
  public onTagDelete: EventEmitter<Tag> = new EventEmitter();
  @Output()
  public onTagAdd: EventEmitter<Tag> = new EventEmitter();

  availableTags?: Tag[];  // TODO get rid of
  matchingTags: Tag[] = [];
  tagSearchResult$!: Observable<TagsResult>;
  private searchTerms = new Subject<string>();

  constructor(
    private tagService: TagService
  ) { }

  ngOnInit(): void {
      this.tagService.getTags().subscribe(tagsResult => {
        this.availableTags = tagsResult.tags;
        this.tags.forEach(tag => {tag.name=this.resolveName(tag)});
      });
      this.tagSearchResult$ = this.searchTerms
        .pipe(
          debounceTime(500),
//           distinctUntilChanged(),
          switchMap((term: string) => this.tagService.searchTags(term, undefined, 5, this.tags))
        );
      this.tagSearchResult$.subscribe(
        searchResult => {
          if(this.showMatchingTags) {
            let tagIds = this.tags.map(tag => tag.id);
            this.matchingTags = searchResult.tags.filter(tag => !tagIds.includes(tag.id));
          }
        }
      );
  }

  resolveName(tag: Tag): string {
    let matchingTag: Tag | undefined = this.availableTags?.find(availableTag => availableTag.id === tag.id);
    let name: string | undefined = matchingTag ? matchingTag.name : tag.id;
    return name ? name : '';
  }

  searchTags() {
    this.showMatchingTags = true;
    this.searchTerms.next(this.searchTerm);
  }

  cancelSearch() {
    this.showMatchingTags = false;
    this.matchingTags = [];
    this.searchTerm = '';
  }

  addTag(tag: Tag) {
    this.onTagAdd.emit(tag);
  }

  deleteTag(tag: Tag) {
    this.onTagDelete.emit(tag);
  }

  tryAddTag() {
    let exactlyMatchingTag: Tag | undefined = this.matchingTags.find(tag => tag.name == this.searchTerm)
    if(exactlyMatchingTag) {
      this.addTag(exactlyMatchingTag);
      this.cancelSearch();
      this.searchTags();
    }
  }
}
