import { Component, OnInit, Inject } from '@angular/core';
import { Hero } from './hero';
// import { HEROES } from '../mock-heroes';
import { HeroService } from '../hero.service';

@Component({
  selector: 'app-heroes',
  templateUrl: './heroes.component.html',
  styleUrls: ['./heroes.component.css'],
})
export class HeroesComponent implements OnInit {

  hero: Hero = {id: 1, name: 'Windstorm'};
  heroes: Hero[];

  constructor(private heroService: HeroService) { }

  ngOnInit() {
    this.getHeroes();
  }

  getHeroes(): void {
    // this.heroes = this.heroService.getHeroes();  // uncomment when not using observable
    this.heroService.getHeroes()
        .subscribe(heroes => this.heroes = heroes);
  }

}
