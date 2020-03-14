import { Component, OnInit, Inject } from '@angular/core';
import { Hero } from './hero';
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
    this.heroService.getHeroes()
        .subscribe(heroes => this.heroes = heroes);
  }

  add(name: string) {
    name = name.trim();
    if (! name) { return; }

    this.heroService.addHero({name} as Hero).subscribe(hero => this.heroes.push(hero));
  }

  delete(hero: Hero) {
    this.heroes = this.heroes.filter((h: Hero) => h != hero)
    this.heroService.deleteHero(hero).subscribe();
  }

}
