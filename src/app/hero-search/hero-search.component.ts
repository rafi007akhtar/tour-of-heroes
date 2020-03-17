import { Component, OnInit } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { Hero } from '../heroes/hero';
import { HeroService } from '../hero.service';

@Component({
  selector: 'app-hero-search',
  templateUrl: './hero-search.component.html',
  styleUrls: ['./hero-search.component.css']
})
export class HeroSearchComponent implements OnInit {

  constructor(private heroService: HeroService) { }

  heroes$: Observable<Hero[]>;
  private searchTerms = new Subject<string>();

  search(term: string): void {
    this.searchTerms.next(term);
  }

  ngOnInit() {
    this.heroes$ = this.searchTerms.pipe(
      // wait for 0.3s before considering next user keystroke
      debounceTime(300),

      // ignore new term if it is same as the old term
      distinctUntilChanged(),

      // perform a new search every time the search term changes
      switchMap((term: string) => this.heroService.searchHero(term))
    );
  }

}
