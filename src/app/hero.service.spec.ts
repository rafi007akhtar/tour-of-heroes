import { TestBed } from '@angular/core/testing';
import { HeroService } from './hero.service';
import { MessageService } from './message.service';
import { Hero } from './heroes/hero';
import { HttpErrorResponse } from '@angular/common/http';
import { asyncData } from '../test-helpers';

describe('HeroService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: HeroService = TestBed.get(HeroService);
    expect(service).toBeTruthy();
  });
});

describe('HerService with spies', () => {
  let heroService: HeroService;
  let httpClientSpy: { get: jasmine.Spy };

  beforeEach(() => {
    httpClientSpy = jasmine.createSpyObj('HttpClient', ['get']);
    heroService = new HeroService(new MessageService(), httpClientSpy as any);
  });

  it('should return expected heroes', () => {
    const expectedHeroes: Hero[] = [
      { id: 11, name: 'Dr Nice' },
      { id: 12, name: 'Narco' },
      { id: 13, name: 'Bombasto' },
      { id: 14, name: 'Celeritas' },
      { id: 15, name: 'Magneta' },
      { id: 16, name: 'RubberMan' },
      { id: 17, name: 'Dynama' },
      { id: 18, name: 'Dr IQ' },
      { id: 19, name: 'Magma' },
      { id: 20, name: 'Tornado' }
    ];

    httpClientSpy.get.and.returnValue(asyncData(expectedHeroes));

    heroService.getHeroes().subscribe((heroes) => {
      expect(heroes).toEqual(expectedHeroes, 'expected heroes'), fail;
    });
    expect(httpClientSpy.get.calls.count()).toBe(1, 'one call');
  });

  it('should return an error when server returns 404', () => {
    const errorResponse = new HttpErrorResponse({
      error: 'test 404 error',
      status: 404,
      statusText: 'Not Found'
    });

    httpClientSpy.get.and.returnValue(errorResponse);

    heroService.getHeroes().subscribe(
      heroes => fail('expected an error, but not heroes'),
      error => expect(error.message).toContain('test 404 error')
    );
  });
});
