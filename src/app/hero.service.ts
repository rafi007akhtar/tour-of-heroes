import { Injectable } from '@angular/core';
import { Hero } from './heroes/hero';
import { HEROES } from './mock-heroes';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { MessageService } from './message.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class HeroService {

  constructor (
    private messageService: MessageService,
    private http: HttpClient
  ) { }

  private heroesUrl = "api/heroes";
  httpOptions = {
    headers: new HttpHeaders({'Content-Type': 'application/json'})
  }

  getHeroes(): Observable<Hero[]> {
    // TODO: send the message _after_ fetching the heroes
    this.messageService.add('HeroService: fetched heroes');
    return (this.http.get(this.heroesUrl) as Observable<Hero[]>).pipe(
      tap(_ => this.log('fetched heroes')),
      catchError(this.handleError<Hero[]>("getHeroes", []))
    );
  }

  getHero(id: number): Observable<Hero> {
    const url = `${this.heroesUrl}/${id}`;
    this.messageService.add(`HeroService: fetched hero id=${id}`);
    // return of(HEROES.find(hero => hero.id === id));
    return (this.http.get(url) as Observable<Hero>).pipe(
      tap(_ => this.log(`fetched hero id=${id}`)),
      catchError(this.handleError<Hero>(`getHero id=${id}`))
    );
  }

  /**
   * Log a HeroService message with the MessageService
   * @param message - [string] the message to log
   */
  private log(message: string): void {
    this.messageService.add(`HeroService: ${message}`);
  }

  /**
   * Handle HTTP operation that failed, and let the app continue.
   * @param operation - [string] name of the operation that failed
   * @param result - [T] optional value to return as the Observable result
   * @returns - [T]
   */
  private handleError<T>(operation: string ="operation", result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      this.log(`${operation} failed: ${error.message}`);
      return of(result as T);
    }
  }

  /**
   * Add a new hero to the list of heroes
   * @param hero - [Hero] the hero to be added
   */
  addHero(hero: Hero): Observable<Hero> {
    return this.http.post<Hero>(this.heroesUrl, hero, this.httpOptions).pipe(
      tap((newHero: Hero) => this.log(`added new hero with id = ${newHero.id}`)),
      catchError(this.handleError<Hero>("addHero"))
    );
  }

  /**
   * Search for a hero through its substring
   * @param term - [string] the term to search for
   */
  searchHero(term: string): Observable<Hero[]> {
    if (! term) { return of([]); }

    let url = `${this.heroesUrl}/?name=${term}`;
    return this.http.get<Hero[]>(url, this.httpOptions).pipe(
      tap((heroes: Hero[]) => {
        heroes.length
          ? this.log(`found heroes matching ${term}`)
          : this.log(`no heroes found matching ${term}`);
      }),
      catchError(this.handleError<Hero[]>("searchHero", []))
    );
  }

  /**
   * Update a hero to a new name
   * @param hero - [Hero] the hero to be updated
   */
  updateHero(hero: Hero): Observable<any> {
    return this.http.put(this.heroesUrl, hero, this.httpOptions).pipe(
      tap(_ => this.log(`updated hero id=${hero.id}`)),
      catchError(this.handleError<any>("update hero"))
    );
  }

  /**
   * Delete a hero, identified by either its id or the hero itself
   * @param hero - [Hero|number] the hero or its id to be deleted
   */
  deleteHero(hero: Hero | number): Observable<Hero> {
    let id = typeof hero == "number" ? hero : hero.id;
    let url = `${this.heroesUrl}/${id}`;

    return this.http.delete<Hero>(url, this.httpOptions)
    .pipe(
      tap(_ => this.log(`deleted hero with id=${id}`)),
      catchError(this.handleError<Hero>("deleteHero"))
    );
  }
}
